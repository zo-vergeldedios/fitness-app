//const { x, y } = require('z'); // import { x, y } from 'z'
console.log("Workout List");

let confirmationMessage = "";
const url = "http://localhost:3000/list";
// console.log(fetch(url));
const response = fetch(url)
  .then((res) => res.json())
  .then((data) => {
    workouts = data;

    render();
    console.log(data, "data from /list");
    console.log(workouts, "workout from /list");
  })
  .catch(function (error) {
    if (error) {
      confirmationMessage = "Server not Connected!";
      // document.getElementById("message-container").style.color = "red";
      // confirmationMessage.fontcolor("red");
      render();
      setTimeout(clearMessage, 5000);
      setTimeout(render, 5500);
    }
    console.log(error);
  });

function element(elementType, properties, children) {
  const el = document.createElement(elementType);
  // console.log(children);

  for (const prop in properties) {
    el[prop] = properties[prop];
  }

  for (let child of children) {
    if (typeof child === "string") {
      child = new Text(child);
    }
    // console.log(child);
    el.appendChild(child);
  }
  return el;
}

let workouts = [];

// let displayedWorkouts = [];

const weekdays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
let weekdayIndex = 0;

function render() {
  const ul = document.querySelector("#container");
  const root = element(
    "div", // elementType
    { id: "container" }, // properties
    [
      element("h1", {}, ["Workout Split"]),
      element("h3", {}, ["Workout Name:"]),
      element("input", { id: "workout-input" }, []),
      element("div", { id: "inputDiv" }, [
        element("h3", {}, ["Sets:"]),
        element("input", { id: "sets-input" }, []),
        element("h3", {}, ["Reps:"]),
        element("input", { id: "reps-input" }, []),
        element("h3", {}, ["Weights:"]),
        element("input", { id: "weights-input" }, []),
      ]),

      element("button", { onclick: addWorkout, id: "addWorkout-button" }, [
        "Add Workout",
      ]),
      element(
        "ul",
        { id: "workout-container" },
        workouts.filter((wo) => wo.editing).map((_, i) => showWorkout(i)),
      ),
      element(
        "div",
        {
          //x<13  ? "Child" : x<20 ? "Teenage" : x<30 ? "Twenties" : "Old people";
          id: "message-container",
          style: confirmationMessage.includes("not")
            ? "color: red;"
            : "color: white",
        },
        [confirmationMessage],
      ),
      element("h2", {}, ["Save Workout Plan"]),
      element("label", { for: "workout", id: "workoutplan-label" }, [
        "Pick a day to save this workout:",
      ]),
      element("select", { name: "workout", id: "select-button" }, [
        "Choose a day (Mon - Sun)",
        element("option", { value: "Monday" }, ["Monday"]),
        element("option", { value: "Tuesday" }, ["Tuesday"]),
        element("option", { value: "Wednesday" }, ["Wednesday"]),
        element("option", { value: "Thursday" }, ["Thursday"]),
        element("option", { value: "Friday" }, ["Friday"]),
        element("option", { value: "Saturday" }, ["Saturday"]),
        element("option", { value: "Sunday" }, ["Sunday"]),
      ]),
      element(
        "button",
        {
          onclick: () => {
            workouts.filter((wo) => wo.editing).map((_, i) => updateWorkout(i));
          },
          id: "saveworkout-button",
        },
        ["Save Workout Plan"],
      ),
      element("h1", { id: "day-heading" }, [
        "Day of Week: " + weekdays[weekdayIndex],
      ]),
      element("div", { id: "div-day-title" }, [
        element(
          "button",
          {
            id: "left-button",
            onclick: () => {
              // wdi = 6
              if (weekdayIndex > 0) {
                weekdayIndex--;
              } else weekdayIndex = 6;
              render();
            },
          },
          ["Previous Day"],
        ),

        element(
          "button",
          {
            id: "right-button",
            onclick: () => {
              // wdi = 6
              //weekdayIndex++;
              // if (weekdayIndex === 7) weekdayIndex = 0;
              weekdayIndex = (weekdayIndex + 1) % 7;

              render();
            },
          },
          ["Next Day"],
        ),
      ]),
      //element("h1", { id: "day-heading" }, ["Monday"]),
      //Create an arrow that can make you choose a day
      //Create function that takes value and returns Mon, Tues, Wed, Thurs, Fri, Sat or Sunday
      //Each day would show the program for the day
      element("div", { id: "workout-heading" }, [
        element("span", { class: "workout-title" }, ["Workout"]),
        element("span", { class: "workout-title" }, ["Sets"]),
        element("span", { class: "workout-title" }, ["Reps"]),
        element("span", { class: "workout-title" }, ["Weights"]),
      ]),
      element(
        "ul",
        { id: "workoutplan-container" },
        workouts
          //                wo.weekday_index
          .filter((wo) => wo.weekdayIndex === weekdayIndex)
          .map((wo) => showProgram(wo)),
      ),
      element(
        "button",
        {
          className: "edit-button",
          onclick: () => {
            workouts
              .filter((wo) => wo.weekdayIndex === weekdayIndex)
              .map((wo) => editProgram(wo));
          },
        },
        ["Edit Program"],
      ),
    ],
  );

  ul.replaceChildren(root);
}

// TODO
//Include index on supabase
//Include updateWorkout, in the onclick with savePlan
//Fix bugs from adding workout to workout program
//weekdayIndex should be added to supabase too
//Fix edit program

function updateWorkout(index) {
  // console.log(String(document.querySelector(`#workout${index}`).value));

  let name = document.querySelector(`#name${index}`).value;
  let sets = document.querySelector(`#sets${index}`).value;
  let reps = document.querySelector(`#reps${index}`).value;
  let weight = document.querySelector(`#weight${index}`).value;
  let editing = false;
  const { id } = workouts[index];

  workouts[index].editing = false;
  workouts[index].weekdayIndex = weekdayIndex;

  fetch("http://localhost:3000/update", {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: id,
      workout_name: name,
      sets: sets,
      reps: reps,
      weight: weight,
      index: index,
      editing: editing,
      weekday_index: weekdayIndex,
    }),
  })
    .then((res) => {
      return res.json;
    })
    .then((data) => {
      confirmationMessage = "Workout Updated!";
      render();
      setTimeout(clearMessage, 1500);
      setTimeout(render, 2000);
    })
    .catch(function (error) {
      if (error) {
        confirmationMessage = "Workout not updated!";
        render();
        setTimeout(clearMessage, 5000);
        setTimeout(render, 5500);
      }
      console.log(error);
    });
}

function showProgram(wo) {
  let program = element("div", { className: "workout-div" }, [
    element("div", { className: "workout-program" }, [
      element("span", { className: "workout-title" }, [`${wo.workout_name}`]),
      element("span", { className: "workout-title" }, [`${wo.sets}`]),
      element("span", { className: "workout-title" }, [`${wo.reps}`]),
      element("span", { className: "workout-title" }, [`${wo.weight}`]),
    ]),
  ]);

  // console.log(workout);
  return program;
}

//TODO
function editProgram(wo) {
  wo.editing = true;
  console.log(wo, "edit program");
  render();

  fetch("http://localhost:3000/update", {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: wo.id,
      workout_name: wo.workout_name,
      sets: wo.sets,
      reps: wo.reps,
      weight: wo.weight,
      index: wo.index,
      editing: true,
      weekday_index: wo.weekdayIndex,
    }),
  })
    .then((res) => {
      return res.json;
    })
    .then((data) => {
      confirmationMessage = "Edit Workout!";
      render();
      setTimeout(clearMessage, 1500);
      setTimeout(render, 2000);

      console.log(data);
    })
    .catch(function (error) {
      if (error) {
        confirmationMessage = "Cannot edit Workout!";
        render();
        setTimeout(clearMessage, 5000);
        setTimeout(render, 5500);
      }
      console.log(error);
    });
}

function addWorkout() {
  const id = Math.floor(Math.random() * 1000000000);
  const workoutName = document.querySelector("#workout-input").value;
  const sets = document.querySelector("#sets-input").value;
  const reps = document.querySelector("#reps-input").value;
  const weight = document.querySelector("#weights-input").value;
  let editing = true;

  const workout = {
    id,
    workout_name: workoutName,
    sets, // sets: sets,
    reps,
    weight,
    editing,
  };

  if (id && workoutName && sets && reps && weight && editing) {
    workouts.push(workout);
  }

  fetch("http://localhost:3000/add", {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(workout),
  })
    .then((res) => {
      return res.json;
    })
    .then((data) => {
      confirmationMessage = "Workout Saved!";
      render();
      setTimeout(clearMessage, 1500);
      setTimeout(render, 2000);
      console.log(data);
    })
    .catch(function (error) {
      if (error) {
        confirmationMessage = "Workout not added!";
        // document.getElementById("message-container").style.color = "red";
        // confirmationMessage.fontcolor("red");
        render();
        setTimeout(clearMessage, 5000);
        setTimeout(render, 5500);
      }
      console.log(error);
    });

  render();
}

function showWorkout(index) {
  // console.log(workout);
  return element("li", { className: "workout-list", id: `workout${index}` }, [
    element(
      "input",
      {
        className: "li-info",
        id: `name${index}`,
        value: workouts[index].workout_name,
      },
      [],
    ),
    element(
      "input",
      { className: "li-info", id: `sets${index}`, value: workouts[index].sets },
      [],
    ),
    element(
      "input",
      { className: "li-info", id: `reps${index}`, value: workouts[index].reps },
      [],
    ),
    element(
      "input",
      {
        className: "li-info",
        id: `weight${index}`,
        value: workouts[index].weight,
      },
      [],
    ),
    element(
      "button",
      { onclick: () => saveWorkout(index), className: "saveButton" },
      ["Save"],
    ),
    element(
      "button",
      { onclick: () => deleteWorkout(index), className: "deleteButton" },
      ["x"],
    ),
  ]);
}

function clearMessage() {
  confirmationMessage = "";
}
//TO DO - From edit program and then Save workout - It doesn't automatically render when I update it.
function saveWorkout(index) {
  // console.log(String(document.querySelector(`#workout${index}`).value));
  let name = document.querySelector(`#name${index}`).value;
  let sets = document.querySelector(`#sets${index}`).value;
  let reps = document.querySelector(`#reps${index}`).value;
  let weight = document.querySelector(`#weight${index}`).value;
  // let editingFalse = false;

  const { id } = workouts[index];
  workouts[index].weekdayIndex = weekdayIndex;

  workouts.splice(index, 1, {
    id: id,
    workout_name: name,
    sets: sets,
    reps: reps,
    weight: weight,
    editing: false,
    weekdayIndex: weekdayIndex,
  });
  console.log(workouts, "");
  // (() => {
  //   workouts.filter((wo) => wo.editing).map((_, i) => updateWorkout(i));
  // })();

  render();

  // showProgram(workouts);
  fetch("http://localhost:3000/update", {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: id,
      workout_name: name,
      sets: sets,
      reps: reps,
      weight: weight,
      index: index,
      editing: false,
      weekday_index: weekdayIndex,
    }),
  })
    .then((res) => {
      return res.json;
    })
    .then((data) => {
      confirmationMessage = "Workout Updated!";
      render();
      setTimeout(clearMessage, 1500);
      setTimeout(render, 2000);

      console.log(data);
    })
    .catch(function (error) {
      if (error) {
        confirmationMessage = "Workout not updated!";
        render();
        setTimeout(clearMessage, 5000);
        setTimeout(render, 5500);
      }
      console.log(error);
    });

  // showSaveMessage = true;
  // document.querySelector("#savemessage-container").style = "";
  // console.log(document.querySelector("#savemessage-container").style);
  console.log(workouts);
}

function deleteWorkout(index) {
  const { id } = workouts[index];
  workouts.splice(index, 1);

  // console.log({ index }, "check index");
  fetch("http://localhost:3000/delete", {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id,
    }),
  })
    .then((res) => {
      return res.json;
    })
    .then((data) => {
      confirmationMessage = "Workout Deleted!";
      render();
      setTimeout(clearMessage, 1500);
      setTimeout(render, 2000);
    })
    .catch(function (error) {
      if (error) {
        confirmationMessage = "Workout not deleted!";
        render();
        setTimeout(clearMessage, 5000);
        setTimeout(render, 5500);
      }
      console.log(error);
    });

  render();
}

//New features:
// TODO
//Show an error messsage when the server is not online. (show up in red). - DONE
//Error, save, delete and update message should be in one element. - DONE
//Link it to server. - DONE
//Link it to supabase. - DONE
//edit workout, - DONE
//save button, - DONE - created an if statement so it doesn't save when one of the fields are empty.

//Save button for a designated day for each workout, (Mon - Sun) -> transfer to a day, this will transfer all of the current workout to a table and the table's title is the chosen day.
//Edit button on the day will overwrite the current workouts placed on the workout array to help us edit the workouts.

render();
