const express = require("express");
require("dotenv").config();
const compression = require("compression");
const cookieParser = require("cookie-parser");
const profile = require("./firebase/profile");
const signup = require("./firebase/signup");
const user = require("./firebase/user");
const signin = require("./firebase/signin");
const security = require("./firebase/security");
const changeIMG = require("./firebase/update-img");
const admin = require("./firebase/admin/user-id");
const paypal = require("./firebase/PayPal");
const route = require("./router");
const mongoose = require("mongoose");
const { connectDB } = require("./database");
const router = express();
const cors = require('cors');
const PORT = process.env.PORT || 8080

connectDB();

mongoose.connection.once("open", () => {
  console.log("DB Connected!");
});

router.use(cookieParser());

router.use(cors({
  origin: ['http://127.0.0.1:5500', 'https://dashboard.millenniumexchange.org'], // replace with the origin of your web page
  credentials: true,
}));

router.use(express.json());
router.use(compression());
router.use(express.urlencoded({ extended: false }));

router.use(profile);
router.use(route);
router.use(signup);
router.use(signin);
router.use(paypal);
router.use(user);
router.use(security);
router.use(changeIMG.router);
router.use(admin.router);

router.listen(PORT, console.log('Server on port 8080'))
