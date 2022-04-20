const mongoose = require("mongoose");

const connectDB = () => {
  mongoose
    .connect(process.env.MONGO_URI)
    .then((conn) => {
      console.log("MongoDB Connected at" + conn.connection.host);
    })
    .catch((error) => console.error(error));
};

module.exports = connectDB;
