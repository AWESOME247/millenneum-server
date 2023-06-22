const userSchema = require("../model");

module.exports = async function ( req, res, next ) {
    const { ID } = req.cookies.userCookie;

    try {
        const { isAdmin } = await userSchema.findById(ID);

        if(!isAdmin) return res.redirect("/dashboard");

        next()
    } catch (error) {
        console.log(error)
    }
}