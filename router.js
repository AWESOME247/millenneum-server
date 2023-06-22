const express = require("express");
const router = new express.Router();
// const retrive = require('./firebase/bet/retrive-bet');
const auth = require("./firebase/auth");
const { getUserProfile } = require("./firebase/admin/user-id");


router.get('/', (req, res) => {
    res.send("Hello")
    //console.log(new Date(Date.now() + 7200000));
})


router.get('/logout', auth, async (req, res) => {
    return res.clearCookie('userCookie', {
        sameSite: "None",
        secure: true,
        path: '/'
    }) && res.send({success: "Logout successful!"});
})

const adminAuth = require("./admin-auth")

router.get('/admin/user/profile/:id', auth, adminAuth, (req, res) => {

    const userID = req.params.id;

    getUserProfile(userID, (data) => {
        res.render("profile", {
            user: data
        })
    })

    // return {data}
})

module.exports = router;