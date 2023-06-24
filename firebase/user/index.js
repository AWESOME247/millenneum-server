const express = require("express");
const router = new express.Router();
const auth = require("../auth");
const widthdraw = require("../widthdraw");
const userSchema = require("../../model");
const { stocks, cancel, copyNow, stopCopyNow } = require("../stocks");
const avarta = require("../update-img/avatar");
const moment = require("moment");
const mail = require("../mail/stat.template");
const OTPmail = require("../mail/otp");
const bcrypt = require("bcrypt");
// const postmark = require("postmark");
// const client = new postmark.ServerClient(process.env.POSTMARK);
const sender = require("../mail/mail");

router.get("/user", auth, validiate);
router.post("/user/delete", auth, deleteUser);
router.post("/user/plan", auth, plan);
router.get("/user/confirm/my/password", auth, passConfirm);
router.post("/user/withdrawal", auth, widthdraw);
router.post("/user/buy-stock", auth, stocks);
router.post("/user/copy-trader-trade", auth, copyNow);
router.post("/user/stop-copy-trade", auth, stopCopyNow);
router.post("/user/cancel-stock", auth, cancel);
router.get("/user/transaction/status/:id/:type", auth, trans);
router.use(avarta.router);

async function validiate(req, resp) {
  const { id } = req.headers;
  console.log(id);
  // console.log();
  try {
    const user = await userSchema.findById(id);
    resp.send(user);
  } catch (error) {
    console.log(error);
    resp.send({ err: error + " Try catch" });
  }
}

async function deleteUser(req, res) {
  console.log(req.body.id);
  try {
    const data = await userSchema.findByIdAndDelete(req.body.id).exec();
    if (data) return res.send({ success: "User deleted successfuly!" });
  } catch (error) {
    console.log(error);
    return res.send({ success: "User not deleted!" });
  }
}

async function trans(req, res) {
  const id = req.params.id;
  const type = req.params.type;
  try {
    const usr = await userSchema.findById(id).exec();
    await userSchema.findByIdAndUpdate(id, {
      withdrawAmount: type === "Decline" ? "" : usr.withdrawAmount,
      withdrawMethod: type === "Decline" ? "" : usr.withdrawMethood,
      withStat: type,
      transactions: {
        $push: {
          transactionType: type,
          amount: usr.withdrawAmount,
          profit: 0,
          status: type,
          date: moment().format("MMM Do YY"),
        },
      },
    });
    // await client.sendEmail({
    //   From: type === "Accept" ? "Approved": "Declined" + " withdrawal <support@ucmb.online>",
    //   To: usr.email,
    //   Subject: "Withdrawal Request!",
    //   HtmlBody: mail(usr.fullname, type === "Accept" ? "green": "red", type === "Accept" ? "Approved": "Declined" ),
    // });
    sender(
      type === "Accept" ? "Approved" : "Declined" + " withdrawal",
      usr.email,
      "Withdrawal Request!",
      mail(
        usr.fullname,
        type === "Accept" ? "green" : "red",
        type === "Accept" ? "Approved" : "Declined"
      )
    ).catch(console.error);
    return res.send({ success: "Updated Successfully!" });
  } catch (error) {
    console.log(error);
    res.send({ err: error + " Try catch" });
  }
}

async function passConfirm(req, res) {
  const { id, password, otp } = req.headers;
  console.log(id, password, otp);
  const user = await userSchema
    .findByIdAndUpdate(id, {
      withdrawOTP: otp,
    })
    .exec();
  const compare = await bcrypt.compare(password, user.password);
  if (!compare) return res.send({ error: "Incorrect password!" });
  sender(
    "Withdrawal OTP",
    user.email,
    "Withdrawal OTP Request!",
    OTPmail(user.fullname, otp)
  )
    .then(() => {
      return res.send({
        success: "Authenticated Successfully",
      });
    })
    .catch(console.error);
}

async function plan(req, res) {
  const { id } = req.headers;
  const { amount, plan } = req.body;
  try {
    const user = await userSchema.findById(id).exec();
    if (user.balance < amount)
      return res.send({ error: "Insufficient Funds!" });
    const data = userSchema.findByIdAndUpdate(user._id, {
      plan,
      $push: {
        transactions: {
          amount,
          transactionType: 'subcription',
          date: moment().format("MMM Do YY"),
          status: 'success'
        }
      }
    });
    if(data) {
      return res.send({ success: 'Transaction successfull'})
    }
  } catch (error) {
    console.log(error);
  }
}

module.exports = router;
