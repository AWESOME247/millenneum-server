const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  fullname: {
    type: String,
    required: true,
  },

  username: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
  },

  token: String,

  withStat: {
    type: String,
    default: "None",
  },

  isVerifyEmail: Boolean,

  password: {
    type: String,
    required: true,
  },

  isCopyTrade: Boolean,

  image: {
    data: Buffer,
    contentType: String,
  },

  referred: {
    type: Number,
    default: 0,
  },

  level: {
    type: Number,
    default: 1,
  },

  profit: {
    type: Number,
    default: 0.0,
  },

  balance: {
    type: Number,
    default: 0.0,
  },

  investmentPlans: {
    type: Number,
    default: 0,
  },

  totalDeposit: {
    type: Number,
    default: 0,
  },

  plans: {
    type: Number,
    default: 0,
  },

  bonus: {
    type: Number,
    default: 0.0,
  },

  ref: {
    type: String,
    required: true,
  },

  transactions: Array,

  refBonus: String,

  withdrawOTP: String,

  walletName: String,

  isAdmin: Boolean,
  plan: String,

  phone: String,

  social: String,

  buyStock: Array,

  country: String,

  withdrawAmount: String,

  withdrawMethod: String,

  city: String,

  sex: String,

  isVerify: Boolean,

  dateOfBirth: String,

  homeAddress: String,

  marital: String,

  idFront: String,

  idBack: String,

  mediaAcc: String,

  passport: {
    data: Buffer,
    contentType: String
  },
  idCard: {
    data: Buffer,
    contentType: String
  },

  bankName: String,
  accountNumber: String,
  accountName: String,
  swiftcode: String,
  btcAddress: String,
  ethAddress: String,
  ltcAddress: String,

  extension: {
    type: String,
    default:
      "https://res.cloudinary.com/omoye/image/upload/v1659965539/T_is7vc1.png",
  },

  avatar: String,

  copyTrade: {
    name: String,
    id: String,
    copying: Boolean,
  },

  copyTraders: Array,
});

module.exports = mongoose.model("User", userSchema);
