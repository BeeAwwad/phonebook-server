const mongoose = require("mongoose");

// Check if the password is provided as a command-line argument
if (process.argv.length < 3) {
  console.log("Please provide a password as an argument: node mongo.js <password>");
  process.exit(1);
}

// Get the password from the command-line argument
const password = process.argv[2];
const dbURL = `mongodb+srv://awwad:${password}@cluster0.4w4rnnc.mongodb.net/?retryWrites=true&w=majority`;

mongoose
  .connect(dbURL)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB:", error.message);
  });

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

const Contact = mongoose.model("Contact", contactSchema);

// Check if only the password is provided
if (process.argv.length === 3) {
  // Fetch all contacts from the database and print them
  Contact.find({}).then((result) => {
    result.forEach((contact) => {
      console.log(contact);
    });
    mongoose.connection.close();
  });
}else if (process.argv.length === 4) {
    console.log("Please provide your name and number");
} else if (process.argv.length === 5) {
  // If all three arguments (password, name, and number) are provided,
  // add a new contact to the database
  const contactName = process.argv[3];
  const contactNumber = process.argv[4];

  const newContact = new Contact({
    name: contactName,
    number: contactNumber,
  });

  newContact
    .save()
    .then(() => {
      console.log(`Added ${contactName} with number ${contactNumber} to the phonebook`);
      mongoose.connection.close();
    })
    .catch((error) => {
      console.log("Error saving contact:", error.message);
      mongoose.connection.close();
    });
} else {
  console.log("Invalid number of arguments");
  mongoose.connection.close();
}