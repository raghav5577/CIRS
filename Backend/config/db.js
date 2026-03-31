const mongoose = require('mongoose');


const connectDB = async () => {
    try {
        const MONGO_URL = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@campusbuddy.c2brprc.mongodb.net/${process.env.MONGO_DBNAME}?appName=campusbuddy`
        const conn = await mongoose.connect(MONGO_URL);
        console.log(`MongoDB connected successfully`)
    } catch (error) {
        console.log(`Error: ${error.message}`);
        process.exit(1);
    }
}

module.exports = connectDB