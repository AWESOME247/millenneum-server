const userSchema = require("../../model");
const cloudinary = require("cloudinary");
const multer = require("multer");
const express = require("express");
const router = new express.Router();
const fs = require("fs");
const path = require("path");
const auth = require("../auth");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

let ID;

function getC(req, res, next) {
  ID = req.cookies.userCookie;
  next();
}

const DIR = "profile/ids/";
let extension;

const storage = multer.diskStorage({
  destination: (req, res, next) => {
    next(null, path.join(__dirname, "../../" + DIR));
  },
  filename: (req, file, next) => {
    const ext = file.mimetype.split("/")[1];
    next(null, `${ID.ID}-${Date.now()}.${ext}`);
  },
  onError: function (err, next) {
    console.log("error", err);
    next(null);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10000000 },
});

async function imgUpload(req, res) {
  const { email, fullname, dateOfBirth, mediaAcc, homeAddress, marital, city, sex, idFront, idBack } =
    req.body;
    console.log(email, fullname, dateOfBirth, mediaAcc, homeAddress, marital, city, sex, idFront, idBack);
  try {
    await userSchema.findByIdAndUpdate(ID.ID, {
      extension,
      email,
      fullname,
      dateOfBirth,
      mediaAcc,
      homeAddress,
      marital,
      sex,
      city,
      idBack,
      idFront
    });
    return res.send({success: "Verification Successful!"})
  } catch (error) {
    console.log(error);
  }  
}

router.post(
  "/users/verifyAccount",
  auth,
  getC,
  imgUpload
);

router.post(
  "/user/verification/update",
  async ({ body: { id, level, verify } }, res) => {
    const data = await userSchema
      .findByIdAndUpdate(id, {
        isVerify: verify === "Accept Verification" ? true : false,
        level: parseInt(level.slice(-1)),
      })
      .exec();
    if (data) {
      res.send({ success: "Update successful" });
    }
  }
);

exports.router = router;
