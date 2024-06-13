require("dotenv").config();

module.exports = {
  // The MongoDB connection URI
  uri: process.env.MONGO_URI,

  // Optional MongoDB options
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // Add any other options here
  },
};
