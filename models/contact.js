const mongoose = require("mongoose");
require("dotenv").config({ path: "../.env" });

// import Mongo DB url from env file
const dbURL = process.env.MONGODB_URI

// Connect to the mongodb database
mongoose
  .connect(dbURL)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB:", error.message);
  });
// defining a contact scheme
const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  number: {
    type: Number,
    required: true,
  },
});

// changes _id to id
contactSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Contact", contactSchema);