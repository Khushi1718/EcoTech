// only login and signup page :
//const mongoose = require("mongoose");

// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URI);
//     console.log("MongoDB connected");
//   } catch (error) {
//     console.error(error);
//     process.exit(1);
//   }
// };

// module.exports = connectDB;

const mongoose = require("mongoose");

// Function to connect backend with MongoDB
const connectDB = async () => {
  try {

    // Connect to MongoDB using connection string from .env
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

  } catch (error) {

    // If connection fails, print error
    console.error(error);

    // Stop server if database connection fails
    process.exit(1);
  }
};

module.exports = connectDB;
