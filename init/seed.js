const mongoose = require("mongoose");
const connectDB = require("../config/db"); // Connect to MongoDB
const Listing = require("../models/listing");
const initData = require("./data"); // dummy data array

async function seedData() {
    await connectDB(); // Must connect here as well!

    try {
        await Listing.deleteMany({});
        await Listing.insertMany(initData.data);
        console.log("✅ Data inserted.");
    } catch (err) {
        console.error("❌ Error:", err);
    } finally {
        mongoose.connection.close();
    }
}

seedData();
