const userSchema = require("../../model");
const moment = require("moment");

const startCopy = async (balance, buy, sell, stock, amount, res) => {
  const isCopying = await userSchema.find({});
  isCopying.forEach(async (copy) => {
    // const fil = copy.copyTrade.filter((data) => data.copying === true);
    if(balance < 1000) amount = 0; 
    const data = await userSchema.findByIdAndUpdate(copy.copyTrade.id, {
      balance: balance - amount,
      $push: {
        transactions: {
          transactionType: sell ? sell + " " + stock : buy + " " + stock,
          amount,
          withdraw: 0,
          status: "Copy Trading",
          date: moment().format("MMM Do YY"),
        },
      },
    })
    if(data) return res.send({ success: data.fullname + " is copying your trade"})
  });
};

exports.copyNow = async ({ body: { name, id }}, res) => {
  try {
    const data = await userSchema.findByIdAndUpdate(id, {
      copyTrade: {
        name,
        id,
        copying: true
      }
    })
    if(data){
      res.send({ success: "You are now copying " + name + " trade"})
    }
  } catch (error) {
    console.log(error);
  }
}

exports.stopCopyNow = async ({ body: { name, id }}, res) => {
  try {
    const data = await userSchema.findByIdAndUpdate(id, {
      copyTrade: {
        name: "stop",
        id,
        copying: false
      }
    })
    if(data){
      res.send({ success: "You stop copying " + name + " trade"})
    }
  } catch (error) {
    console.log(error);
  }
}

exports.stocks = async (
  { body: { id, balance, buy, sell, stock, amount, time } },
  res
) => {
  try {
    const isAdmin = await userSchema.findById(id).exec()
    if (isAdmin.isAdmin) return startCopy(balance, buy, sell, stock, amount, res);
    await userSchema.findByIdAndUpdate(id, {
      balance: balance - amount,
      $push: {
        transactions: {
          transactionType: sell ? sell + " " + stock : buy + " " + stock,
          amount,
          withdraw: 0,
          status: "success",
          date: moment().format("MMM Do YY"),
        },
      },
    });
    const data = await userSchema.findByIdAndUpdate(id, {
      $push: { buyStock: { buy, sell, stock, amount, id: time } },
    });
    if (data)
      return res.send({
        data,
      });
  } catch (error) {
    console.log(error);
    return res.send({
      error: "An error occured while placing your trade!",
    });
  }
};

exports.cancel = async (
  { body: { id, amount, stk, pid, balance, stock } },
  res
) => {
  try {
    await userSchema.findByIdAndUpdate(id, {
      balance: parseInt(balance) + parseInt(stk),
      $push: {
        transactions: {
          transactionType: "Close " + stock,
          amount,
          withdraw: 0,
          status: "success",
          date: moment().format("MMM Do YY"),
        },
      },
    });
    const data = await userSchema.findByIdAndUpdate(id, {
      $pull: { buyStock: { id: pid } },
    });
    if (data)
      return res.send({
        success: "Trade of has been cancelled",
      });
  } catch (error) {
    console.log(error);
    return res.send({
      error: "An error occured while closing your trade!",
    });
  }
};
