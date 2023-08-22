const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");

app.use(express.json());
app.use(morgan("tiny"));
app.use(cors({
  origin: "*",
}));

morgan.token("object", function (req, res) {
  return JSON.stringify(req.body);
})

const format = ":method :url :status :res[content-length] - :response-time ms :object";

app.use(morgan(format));

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];


app.get("/api/persons", (request, response) => {
  response.json(persons);
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
  console.log("🚀 ~ file: index.js:76 ~ app.post ~ reqBody:", reqBody)
  
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
