const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const logger = require("morgan");

const app = express();

app.use(logger("dev"));

const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/dbFitness", { useNewUrlParser: true , useUnifiedTopology: true, useCreateIndex: true});

app.use(express.static("public"));

// API ROUTES

// POST /api/workouts
// PUT /api/workouts/:id
// Get /api/workouts/range LIMIT 7

// HTML ROUTES 

app.get("/", (req, res) =>{
  res.sendFile(path.join(__dirname, "public/index.html"))
});

app.get("/exercise", (req, res) =>{
  res.sendFile(path.join(__dirname, "public/exercise.html"))
});

app.get("/stats", (req, res) =>{
  res.sendFile(path.join(__dirname, "public/stats.html"))
});

app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`)
})

