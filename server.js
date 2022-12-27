// Packages
const express = require("express");
const app = express()
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require('uuid');
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// Get Requests
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "public/notes.html"));
})

app.get("/api/notes", async (req, res) => {
  const data = await fs.promises.readFile("./db/db.json");
  res.json(JSON.parse(data));
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
})


// Post Requests
app.post("/api/notes", async (req, res) => {
  let newNote = req.body;
  newNote.id = uuidv4();
  const data = await fs.promises.readFile("./db/db.json");
  const notes = JSON.parse(data);
  notes.push(newNote);
  await fs.promises.writeFile("./db/db.json", JSON.stringify(notes));
  res.status(200).end();
});

// Delete Requests
app.delete("/api/notes/:id", async (req, res) => {
  const data = await fs.promises.readFile("./db/db.json");
  const newArray = JSON.parse(data).filter((note) => note.id != req.params.id);
  await fs.promises.writeFile("./db/db.json", JSON.stringify(newArray));
  res.status(200).end();
});

// Starting Server
app.listen(PORT, () => console.log(`Now listening to port ${PORT}!`));