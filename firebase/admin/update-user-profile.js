const express = require("express");
const router = new express.Router();
const getAllUsers = require('./getAllUsers')
const auth = require("../auth");
const moment = require("moment");
// const bcrypt = require("bcrypt");
const userSchema = require("../../model")

router.post("/admin/update/user/", auth, updateUser);
router.use(getAllUsers);

async function updateUser(req, resp) {
    const { balance, botSpeed, profit, ID, type } =
      req.body;
  
    const data = {
        balance: parseInt(balance), botSpeed: parseInt(botSpeed),
        profit: parseInt(profit),
        transactions: [{
          transactionType: type,
          amount: parseInt(balance),
          profit: parseInt(profit),
          status: "success",
          date: moment().format('MMM Do YY'),
      }]
    };

    
    try {
      console.log(ID)
      await userSchema.findByIdAndUpdate(ID, data);
      resp.send({ success: "Successfully updated!"})
    } catch (error) {
      console.log(error)
      resp.send({ error: "Faild to update!"})
    }

  }

module.exports = router
