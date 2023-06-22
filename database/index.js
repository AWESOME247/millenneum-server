const mongoose = require("mongoose");

exports.connectDB = async () => {
    try {
        await mongoose.connect( process.env.DATABASE_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
    } catch (error) {
        console.error(error)
    }
}