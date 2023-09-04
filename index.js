const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

app.use(express.json());
app.use(morgan("tiny"));
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.static("dist"));

morgan.token("object", function (req, res) {
  return JSON.stringify(req.body);
});

const format =
  ":method :url :status :res[content-length] - :response-time ms :object";

app.use(morgan(format));

// Mongoose definitions
const password = process.env.PASSWORD;
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

app.get("/api/persons", (request, response) => {
  Contact.find({}).then((persons) => {
    response.json(persons)
    mongoose.connection.close();
  });
});

app.get("/info", (request, response) => {
  const numberOfEntries = persons.length;
  const currentTime = new Date().toString();

  const info = `
  <p>Request received at: ${currentTime}</p>
  <p>Phonebook has info for ${numberOfEntries} people</p>
`;

  response.send(info);
});

const setId = () => {
  const generateId = () => {
    return Math.floor(Math.random() * 100) + 1;
  };

  let id = generateId();

  const existingId = persons.some((person) => person.id === id);

  while (existingId) {
    id = generateId();

    existingId = persons.some((person) => person.id === id);
  }

  return id;
};

app.post("/api/persons/:name/:number", (request, response) => {
  const reqBody = request.body;
  console.log("🚀 ~ file: index.js:76 ~ app.post ~ reqBody:", reqBody);

  const newPerson = request.params.name;

  const newNumber = request.params.number;

  const checkPersonAndNumber = () =>
    persons.some(
      (person) => person.name === newPerson && person.number === newNumber
    );

  const checkPerson = () => persons.some((person) => person.name === newPerson);

  const checkNumber = () =>
    persons.some((person) => person.number === newNumber);

  if (!newPerson || !newNumber) {
    return response.status(400).json({ error: "Name and Number missing" });
  } else if (checkPersonAndNumber()) {
    return response
      .status(400)
      .json({ error: "Name and Number already exists" });
  } else if (checkPerson()) {
    return response.status(400).json({ error: "Name already exists" });
  } else if (checkNumber()) {
    return response.status(400).json({ error: "Number already exists" });
  }

  const newId = setId();

  const person = { id: newId, name: newPerson, number: newNumber };

  persons.push(person);

  response.status(201).json(person);
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);

  const personIndex = persons.findIndex((person) => person.id === id);

  if (personIndex !== -1) {
    persons.splice(personIndex, 1);
  } else {
    response.status(404).end();
  }
});

app.put("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const updatedPerson = request.body;
  console.log(
    "🚀 ~ file: index.js:132 ~ app.put ~ updatedPerson:",
    updatedPerson
  );

  const personIndex = persons.findIndex((person) => person.id === id);

  if (personIndex !== -1) {
    persons[personIndex] = {
      ...persons[personIndex],
      name: updatedPerson.name,
      number: updatedPerson.number,
    };
    response.json(persons[personIndex]);
  } else {
    response.status(404).end();
  }
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Persons server running on port ${PORT}`);
});
