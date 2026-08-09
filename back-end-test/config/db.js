// eswar321
// db.js
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log('dfkjadslkjfkldjf ' + process.env.MONGO_URI)
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // Mongoose 6+ doesn't require additional options
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
    process.exit(1); // Exit the process if connection fails
  }
};

module.exports = connectDB;