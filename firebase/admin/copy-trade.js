const express = require("express");
const router = new express.Router();
const cloudinary = require("cloudinary");
const auth = require("../auth");
const fs = require("fs");
const multer = require("multer");
const path = require("path");
const userSchema = require("../../model");

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
    next(null, `copy-trader-${ID.ID}-${Date.now()}.${ext}`);
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

const copy = async (req, res) => {
  const { id, name, rate, profit, being } = req.body;
  console.log(id, name, rate, profit, being);
  try {
    const data = await userSchema.findByIdAndUpdate(id, {
      $push: {
        copyTraders: {
          name,
          being,
          winRate: rate,
          profit: profit,
          isCoping: false,
          img: {
            data: fs.readFileSync(
              path.join(
                __dirname,
                "../../" + DIR + req.files.copyProfile[0].filename
              )
            ),
            contentType:
              "image/" +
              path.extname(req.files.copyProfile[0].filename).replace(".", ""),
          },
        },
      },
    });
    if (data)
      return res.send({
        success: "Your copy trader has been created succesfully!",
      });
  } catch (error) {
    console.log(error);
    return res.send({
      error: "An error occured while creating copy trader!",
    });
  }
};

router.post(
  "/admin/create/copy",
  auth,
  getC,
  upload.fields([
    {
      name: "copyProfile",
      maxCount: 1,
    },
  ]),
  copy
);

router.get("/user/get-all-copy-treders", async (req, res) => {
  const data = await userSchema.findById("6384db7977397670ad017b95").exec();
  res.send(data.copyTraders);
});

module.exports = router;
