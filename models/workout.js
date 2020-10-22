const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const WorkoutSchema = new Schema({
    day: {
        type: Date,
        default: Date.now,
        required: true
    },
    exercises: {
        type: Array,
        required: true
    }

});

const Workout = mongoose.model("Workout", WorkoutSchema);

module.exports = Workout;