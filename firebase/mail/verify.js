const express = require("express");
const router = new express.Router();
const userSchema = require("../../model");
const pass = require("./pass")

router.get("/verify/email/address/:token", async (req, res) => {
  const { token } = req.params;
  console.log(token);
  const user = await userSchema.findOne({ token }).exec();
  if (token !== user.token) return res.send({ error: "Invalid token!" });
  try {
    await userSchema.findByIdAndUpdate({ _id: user._id }, { isVerifyEmail: true });
    return res.send({ success: "Token verified succesfully!" });
  } catch (error) {
    return res.send({ error: "Token has expired!" });
  }
});

router.use(pass);

module.exports = router;