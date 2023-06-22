const express = require("express");
const router = new express.Router();
const auth = require("../auth");
const copy = require("./copy-trade");
// const bcrypt = require("bcrypt");
const userSchema = require("../../model")

router.use(copy)
router.get("/admin/get-all-users/", auth, getAllUsers);

async function getAllUsers(req, resp) {
    const users = await userSchema.find({});
    resp.send(users)
}

module.exports = router