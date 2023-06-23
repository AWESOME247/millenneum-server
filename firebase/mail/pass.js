const express = require("express");
const router = new express.Router();
const userSchema = require("../../model");
// const postmark = require("postmark");
// const client = new postmark.ServerClient(process.env.POSTMARK);
const mail = require("../mail/pass-tem");
const bcrypt = require("bcrypt");
const sender = require("./mail")

router.get("/reset/password/:token/:pwd", async (req, res) => {
  const { token, pwd } = req.params;
  try {
    const password = await bcrypt.hash(pwd, 8);
    await userSchema.findOneAndUpdate({ token }, { password: password });
    return res.send({ success: "Password updated succesfully!" });
  } catch (error) {
    console.log(error);
    return res.send({ error: "Password not updated!" });
  }
});

router.get("/password/email/reset/:email", async (req, res) => {
  const { email } = req.params;
  const user = await userSchema.findOne({ email }).exec();
  if (!user) return res.send({ error: "No such user!" });
  console.log(user);
  try {
    // client.sendEmail({
    //   From: "Remiinvestment Password Reset <support@ucmb.online>",
    //   To: user.email,
    //   Subject: "Account Passord Reset!",
    //   HtmlBody: mail(
    //     `https://remiinvestment.com/password/reset/${user.token}`,
    //     user.fullname
    //   ),
    // });
    sender(
      "Millennium Exchange Password Reset",
      user.email,
      "Account Passord Reset!",
      mail(
        `https://millenniumexchange.org/password/reset/${user.token}`,
        user.fullname
      )
    ).catch(console.error);
    return res.send({ success: "Password sent to your email succesfully!" });
  } catch (error) {
    return res.send({ error: "No such user!" });
  }
});

module.exports = router;
