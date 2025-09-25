const mongoose = require("mongoose");
// const MONGO_URL="mongodb://127.0.0.1:27017/ExploreInn";
const MONGO_URL=process.env.ATLASDB_URL;

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URL);
        console.log("✅ MongoDB connected");
    } catch (err) {
        console.error("❌ MongoDB connection error:", err);
        process.exit(1); // exit if DB connection fails
    }
};

module.exports = connectDB;

