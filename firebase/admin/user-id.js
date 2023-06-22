const express = require("express");
const router = new express.Router();
const auth = require("../auth");
const update = require("./update-user-profile")
// const bcrypt = require("bcrypt");
const userSchema = require("../../model")

router.post("/admin/user/id", auth, findUser);
// router.get("/admin/user/profile/:id", auth, getUserProfile);

router.use(update)

async function findUser(req, res){
    const { user } = req.body;

    // console.log(user);

    const users = await userSchema.find({})

    const foundUser = find(user, users)
    if(foundUser)
        return res.send(foundUser)
    if(!foundUser)
        return res.send({error: "No Such User!"})
}

function find(userN, data){
    const findUsers = data.find(user => userN === user._id || userN === user.email || userN === user.fullname || userN === user.ref);
    // console.log(findUsers);
    return findUsers;
}

async function getUserProfile(ID, clb) {
    // const ID = req.params.id;
    const user = await userSchema.findById( ID );
    clb(user);
    console.log(user)
}

module.exports = {router, getUserProfile}