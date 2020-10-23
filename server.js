const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const logger = require("morgan");
const db = require("./models");

const app = express();

app.use(logger("dev"));
app.use(express.urlencoded({extended:true}));
app.use(express.json());

const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/workout", { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });

app.use(express.static("public"));

// API ROUTES

// GET /api/workouts
app.get("/api/workouts", function (req, res) {
  db.Workout.find({}, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      res.json(data);
    };
  });
});
// POST /api/workouts
app.post("/api/workouts", function (req, res) {
  console.log(req.body);
  db.Workout.create(req.body, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      res.json(data);
    };
  });
});
// PUT /api/workouts/:id
app.put("/api/workouts/:id", function (req, res) {
  console.log(req.body);
  db.Workout.findByIdAndUpdate(req.params.id, {$push: {exercises: req.body}}, {new: true, runValidators: true}, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      res.json(data);
    };
  });
});
// Get /api/workouts/range LIMIT 7
app.get("/api/workouts/range", function (req, res) {
  db.Workout.find({}).sort({ day:-1 }).limit( 7, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      res.json(data);
    };
  });
});

// HTML ROUTES 

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "public/index.html"))
});

app.get("/exercise", function (req, res) {
  res.sendFile(path.join(__dirname, "public/exercise.html"))
});

app.get("/stats", function (req, res) {
  res.sendFile(path.join(__dirname, "public/stats.html"))
});

app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`)
})

