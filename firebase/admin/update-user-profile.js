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
    const { balance, botSpeed, profit, ID, type, investmentPlans, totalDeposit, plans, bonus } =
      req.body;
  
    const data = {
        balance: parseInt(balance), botSpeed: parseInt(botSpeed),
        profit: parseInt(profit),
        investmentPlans: investmentPlans ? investmentPlans : 0,
        totalDeposit: totalDeposit ? totalDeposit : 0,
        plans: plans ? plans : 0,
        bonus: bonus ? bonus : 0,
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
