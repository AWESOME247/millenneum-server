const express = require("express");
const router = new express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userSchema = require("../../model")

router.post("/signin", validiate)

async function validiate(req, resp) {

    const { email, password } = req.body;

    console.log(email, password)

    try {
        const trimedEmail = email.trim()

        const data = await userSchema.findOne({ email: trimedEmail }).exec();

        if(!data) {
            return resp.send({ error: 'Incorrect email or password!'})
        }

        const hashPassword = data.password;

        try {
            const compared = await bcrypt.compare(password, hashPassword);
            if (compared) {
                try {
                    const token = jwt.sign(
                        {
                            user_id: data._id, email
                        },
                        process.env.TOKEN,
                        { expiresIn: '1h' }
                    );

                    const userCookie = {
                        ID: data._id, email, token
                    }

                    // res.set("Authorization", `Barear ${token}`);
                    // cache.set('userCre', userData)

                    const asd = resp.cookie("userCookie", userCookie, {
                        secure: process.env.NODE_ENV === "production",
                        maxAge: 3600000,
                        httpOnly: process.env.NODE_ENV === "production",
                        signin: process.env.NODE_ENV === "production",
                        overwrite: true
                    });
                    if (data.isAdmin)
                        return resp.send({ isAdmin: "Signin successful", token, id: data._id  });
                    return resp.send({ success: "Signin successful", token, id: data._id });
                } catch (error) {
                    console.log(error);
                }
            } else {
                return resp.send({ error: "Incorrect username or password!" });
            }
        } catch (error) {
            resp.send({ error: "Incorrect username or password!" });
            console.log(error);
        }

    } catch (error) {
        resp.send({ error: "Incorrect username or password!" });
        console.log(error);
    }
}

module.exports = router
