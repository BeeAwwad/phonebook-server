const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();
const Contact = require("./models/contact");

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

app.get("/api/persons", (request, response) => {
  Contact.find({}).then((persons) => {
    response.json(persons);
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

app.post("/api/persons", express.json(), (request, response) => {
  const { name, number } = request.body;

  if (!name || !number) {//checks if name and number are missing
    return response.status(400).json({ error: "Name and Number missing" });
  }

  const newContact = new Contact({ name: name, number: number });

  newContact
    .save()
    .then((savedContact) => {
      console.log(
        `Added ${name} with number ${number} to the phonebook`
      );
      response.status(201).json(savedContact);//return saved contact
    })
    .catch((error) => {
      console.log("Error saving contact:", error.message);
      response.status(500).json({ error: "server error" });
    });
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
  Contact.findById(id).then((contact) => {
    response.json(contact);
  });
});

const PORT = process.env.PORT;
console.log("🚀 ~ file: index.js:150 ~ PORT:", PORT);

app.listen(PORT, () => {
  console.log(`Persons server running on port ${PORT}`);
});