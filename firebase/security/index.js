const express = require("express");
const router = new express.Router();
const auth = require("../auth");
const bcrypt = require("bcrypt");
const axios = require("axios");
const userSchema = require("../../model")

router.post('/user/security', auth, security)

async function security(req, res) {
    const { confirmPassword, password, oldPassword } = req.body;
    // console.log(confirmPassword, password, oldPassword);
    const { id } = req.headers;

    if(password.lenght < 8){
        return res.send({ error: "Password must be at least 8 characters long!" })
    }

    if (confirmPassword !== password) {
        return res.send({ error: "Password does not match!" })
    }

    try {
        // console.log('pppp', password);
        const data = await userSchema.findById( id );
        
        const compare = await bcrypt.compare(oldPassword, data.password);

        if(!compare) return res.send({ error: "Password is Incorrect!" });

        const hashPassword = await bcrypt.hash(password, 8)

        userSchema.findByIdAndUpdate(data._id, { password: hashPassword }, (err, data) => {
            if (err) console.log(err);
            else console.log(data);
        })

        res.send({ success: "Password updated successfully!"}) 
    } catch (error) {
        res.send({ error: "Password update not successful!" })
        console.log(error);
    }
}

module.exports = router
