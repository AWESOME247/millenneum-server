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
    next(null, `avarta-${ID.ID}.${ext}`);
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

function imgUpload(req, res) {
  console.log(req.files);
  userSchema.findByIdAndUpdate(
    ID.ID,
    {
      $set: {
        avatar: {
          data: fs.readFileSync(
            path.join(__dirname, "../../" + DIR + req.files.avarta[0].filename)
          ),
          contentType:
            "image/" + path.extname(req.files.avarta[0].filename).replace(".", ""),
        }
      },
    },
    (err, data) => {
      if (err) {
        console.log(err);
        return res.send({ error: "Changing avarta faild!" });
      }
      if (data) {
        console.log(data);
        res.send(data)
      }
    }
  );
}

exports.router = router.post(
  "/users/avarta",
  auth,
  getC,
  upload.fields([
    {
      name: "avarta",
      maxCount: 1,
    }
  ]),
  imgUpload
);
