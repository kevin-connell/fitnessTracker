// get all workout data from back-end
let a = new Date("2020-10-24T03:31:44.778Z");
let b = new Date();
console.log(a);
console.log(b);

if (a.toString().substring(4, 15) == b.toString().substring(4, 15)) {
  console.log("they are the same");
};

const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];

let newWeek = [];

for (let i = 0; i < 7; i++) {
  if (i == 0) {
    newWeek.push(new Date().getDay())
  }else{
    if (newWeek[0] == 0) {
      newWeek.unshift(6)
    }else{
      newWeek.unshift((newWeek[0] - 1))
    };
  };
};

for (let i = 0; i < 7; i++) {
  newWeek[i] = daysOfWeek[newWeek[i]]
};

fetch("/api/workouts/range")
  .then(response => {
    return response.json();
  })
  .then(data => {
    console.log(data);
    populateChart(data);
  });


// API.getWorkoutsInRange()

function generatePalette() {
  const arr = [
    "#003f5c",
    "#2f4b7c",
    "#665191",
    "#a05195",
    "#d45087",
    "#f95d6a",
    "#ff7c43",
    "ffa600",
    "#003f5c",
    "#2f4b7c",
    "#665191",
    "#a05195",
    "#d45087",
    "#f95d6a",
    "#ff7c43",
    "ffa600"
  ]

  return arr;
}
function populateChart(data) {
  let dayDurations = dayDuration(data)[0];
  console.log(dayDurations)
  let dayReps = dayDuration(data)[1];
  console.log(dayReps)
  let pounds = calculateTotalWeight(data);
  let workouts = workoutNames(data)[0];
  let wDurations = (workoutNames(data)[1]);
  let weightN = weightNames(data)[0];
  let weightReps = weightNames(data)[1];
  const colors = generatePalette();

  let line = document.querySelector("#canvas").getContext("2d");
  let bar = document.querySelector("#canvas2").getContext("2d");
  let pie = document.querySelector("#canvas3").getContext("2d");
  let pie2 = document.querySelector("#canvas4").getContext("2d");

  let lineChart = new Chart(line, {
    type: "line",
    data: {

      labels: newWeek,
      datasets: [
        {
          label: "Workout Duration In Minutes",
          backgroundColor: "red",
          borderColor: "red",
          data: dayDurations,
          fill: false
        }
      ]
    },
    options: {
      responsive: true,
      title: {
        display: true
      },
      scales: {
        xAxes: [
          {
            display: true,
            scaleLabel: {
              display: true
            }
          }
        ],
        yAxes: [
          {
            display: true,
            scaleLabel: {
              display: true
            }
          }
        ]
      }
    }
  });

  let barChart = new Chart(bar, {
    type: "bar",
    data: {
      labels: newWeek,
      datasets: [
        {
          label: "Rep Count",
          data: dayReps,
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(153, 102, 255, 0.2)",
            "rgba(255, 159, 64, 0.2)"
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)"
          ],
          borderWidth: 1
        }
      ]
    },
    options: {
      title: {
        display: true,
        text: "Daily Rep Count"
      },
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true
            }
          }
        ]
      }
    }
  });

  let pieChart = new Chart(pie, {
    type: "pie",
    data: {
      labels: workouts,
      datasets: [
        {
          label: "Excercises Performed",
          backgroundColor: colors,
          data: wDurations
        }
      ]
    },
    options: {
      title: {
        display: true,
        text: "Excercises Performed"
      }
    }
  });

  let donutChart = new Chart(pie2, {
    type: "doughnut",
    data: {
      labels: weightN,
      datasets: [
        {
          label: "Excercises by REPS",
          backgroundColor: colors,
          data: weightReps
        }
      ]
    },
    options: {
      title: {
        display: true,
        text: "Excercises by REPS"
      }
    }
  });
}

function dayDuration(data) {
  let durations = [];
  let repCounts = [];

  data.forEach(workout => {
    let dayTotal = 0
    let dayReps = 0

    workout.exercises.forEach(exercise => {
      dayTotal += exercise.duration;
      if (exercise.reps) {
        dayReps += (exercise.sets * exercise.reps)
      }
    });
    durations.push(dayTotal);
    repCounts.push(dayReps);
  });

  return [durations, repCounts];
}

function calculateTotalWeight(data) {
  let total = [];

  data.forEach(workout => {
    workout.exercises.forEach(exercise => {
      total.push(exercise.weight);
    });
  });

  return total;
}

function workoutNames(data) {
  let workouts = [];
  let theirDurations = [];

  data.forEach(workout => {
    workout.exercises.forEach(exercise => {
      if (exercise.name){
        if (!workouts.includes(exercise.name)){
          workouts.push(exercise.name);
          theirDurations.push(exercise.duration)
        }else{
          theirDurations[workouts.indexOf(exercise.name)] += exercise.duration
        }
      }
    });
  });

  return [workouts , theirDurations];
}

function weightNames(data) {
  let workouts = [];
  let repCount = [];

  data.forEach(workout => {
    workout.exercises.forEach(exercise => {
      if (exercise.type == "resistance"){
        if (!workouts.includes(exercise.name)){
          workouts.push(exercise.name);
          repCount.push(exercise.sets * exercise.reps);
        }else {
          repCount[workouts.indexOf(exercise.name)] += (exercise.sets * exercise.reps)
        }
      }
    });
  });

  return [workouts, repCount];
}
