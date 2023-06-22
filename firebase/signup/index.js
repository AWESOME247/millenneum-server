const express = require("express");
const router = new express.Router();
const referral = require("referral-code-generator");
const jwt = require("jsonwebtoken");
const ref = referral.alphaNumeric("lowercase", 3, 2);
const sender = require("../mail/mail");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const userSchema = require("../../model");
const moment = require("moment");
// const postmark = require("postmark");
// const client = new postmark.ServerClient(process.env.POSTMARK);
const mail = require("../mail/template");
const verify = require("../mail/verify");
const randomToken = require("random-token").create(
  "abcdefghijklmnopqrstuvwxzyABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
);
// const NodeCache = require("node-cache");
// const myCache = new NodeCache({ stdTTL: 180000 });
const getToken = randomToken(24);

router.post("/signup", validiate);

async function validiate(req, resp) {
  const {
    username,
    email,
    phone,
    fullName,
    password,
    country, refCode
  } = req.body;

  const ID = uuidv4();
  const trimedEmail = email.trim();
  try {
    const usrn = await userSchema.findOne({ username }).exec();
    const data = await userSchema.findOne({ email: trimedEmail }).exec();

    if (usrn) {
      return resp.send({ error: "Username already in use!" });
    }

    if (data) {
      return resp.send({ error: "Email already in use!" });
    }

    const hashPassword = await bcrypt.hash(password, 8);

    const token = jwt.sign(
      {
        user_id: ID,
        trimedEmail,
      },
      process.env.TOKEN,
      { expiresIn: "1h" }
    );

    await signup(
      username,
      trimedEmail,
      fullName,
      hashPassword,
      phone,
      country,
      token,
      resp,
      refCode
    );
  } catch (error) {
    console.log(error);
    resp.send({ error: "Turn on your internet connection!" });
  }
}

const signup = async (
  username,
  email,
  fullName,
  password,
  phone,
  country,
  token,
  resp,
  refCode
) => {
  if (refCode) {
    const reff = await userSchema.findOne({ username: refCode }).exec();
    if(!reff) return resp.send({ error: "Invalid referral code!"});
    if(reff) {
      await userSchema.findByIdAndUpdate(reff._id, {
        referred: reff.referred + 1,
        balance: reff.balance + 10,
        $push: {
          transactions: {
            transactionType: "referral",
            name: fullName,
            amount: 10,
            withdraw: 0,
            status: "success",
            date: moment().format("MMM Do YY"),
          }
        }
      })
    }
  }

  try {
    const result = await userSchema.create({
      ref: ref,
      email: email.toLowerCase(),
      fullname: fullName,
      password: password,
      balance: 0.0,
      profit: 0.0,
      level: 1,
      isAdmin: false,
      phone,
      country,
      referred: 0,
      isVerify: false,
      isCopyTrade: false,
      isVerifyEmail: false,
      token: getToken,
      referredBy: refCode ? refCode : 'No body',
      username,
      transactions: [
        {
          transactionType: "Creation",
          amount: 0,
          withdraw: 0,
          status: "success",
          date: moment().format("MMM Do YY"),
        },
      ],
    });

    // await client.sendEmail({
    //   From: "Remiinvestment Registration <support@ucmb.online>",
    //   To: email,
    //   Subject: "Email Account Verification!",
    //   HtmlBody: mail(`https://dashboard.remiinvestment.com/verified-account/${getToken}`, fullName),
    // });

    
    const userCookie = {
      ID: result._id,
      email,
      token,
      // user: userData.users
    };
    
    resp.cookie("userCookie", userCookie, {
      maxAge: 3600000,
      secure: process.env.NODE_ENV === "production",
      httpOnly: process.env.NODE_ENV === "production",
      overwrite: true,
    });
    await sender(
      "Mlifeinvestment Registration",
      email,
      "Email Account Verification!",
      mail(
        `https://dashboard.mlifeinvestmenthub.com/verified-account/${getToken}`,
        fullName
      )
    ).then(() => resp.send({ success: "Signup Successful!", token, id: result._id }))
    .catch(console.error);
  } catch (error) {
    console.log(error);
  }
};

router.use(verify);

module.exports = router;
