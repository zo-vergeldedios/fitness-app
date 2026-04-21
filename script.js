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
  })
  .catch(function (error) {
    if (error) {
      confirmationMessage = "Server Not Connected!";
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

let days = [
  {
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: [],
  },
];

let workouts = [];
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
        workouts.map((_, i) => showWorkout(i)),
      ),
      element(
        "div",
        {
          id: "message-container",
          style:
            confirmationMessage == "Server Not Connected!"
              ? "color: red;"
              : "color: white",
        },
        [confirmationMessage],
      ),
      // element("h2", {}, ["Save Workout Plan"]),
      // element("label", { for: "workout", id: "workoutplan-label" }, [
      //   "Pick a day to save this workout:",
      // ]),
      // element("select", { name: "workout", id: "select-button" }, [
      //   "Choose a day (Mon - Sun)",
      //   element("option", { value: "Monday" }, ["Monday"]),
      //   element("option", { value: "Tuesday" }, ["Tuesday"]),
      //   element("option", { value: "Wednesday" }, ["Wednesday"]),
      //   element("option", { value: "Thursday" }, ["Thursday"]),
      //   element("option", { value: "Friday" }, ["Friday"]),
      //   element("option", { value: "Saturday" }, ["Saturday"]),
      //   element("option", { value: "Sunday" }, ["Sunday"]),
      // ]),
      // element("button", { onclick: savePlan, id: "saveworkout-button" }, [
      //   "Save Workout Plan",
      // ]),
    ],
  );

  ul.replaceChildren(root);
}

// function savePlan() {
//   //push all of the current workout to days array.
//   //once saved the workouts will be rendered on the frontend.
// }

function addWorkout() {
  const id = Math.floor(Math.random() * 1000000000);
  const workoutName = document.querySelector("#workout-input").value;
  const sets = document.querySelector("#sets-input").value;
  const reps = document.querySelector("#reps-input").value;
  const weight = document.querySelector("#weights-input").value;

  const workout = {
    id,
    workout_name: workoutName,
    sets, // sets: sets,
    reps,
    weight,
  };

  if (id && workoutName && sets && reps && weight) {
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
      setTimeout(clearMessage, 3000);
      setTimeout(render, 3500);
      console.log(data);
    })
    .catch(function (error) {
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

function saveWorkout(index) {
  // console.log(String(document.querySelector(`#workout${index}`).value));
  let name = document.querySelector(`#name${index}`).value;
  let sets = document.querySelector(`#sets${index}`).value;
  let reps = document.querySelector(`#reps${index}`).value;
  let weight = document.querySelector(`#weight${index}`).value;
  const { id } = workouts[index];
  workouts.splice(index, 1, {
    id: id,
    workout_name: name,
    sets: sets,
    reps: reps,
    weight: weight,
  });

  console.log({ index }, "check index");
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
    }),
  })
    .then((res) => {
      return res.json;
    })
    .then((data) => {
      confirmationMessage = "Workout Updated!";
      render();
      setTimeout(clearMessage, 3000);
      setTimeout(render, 3500);

      console.log(data);
    })
    .catch(function (error) {
      console.log(error);
    });

  // showSaveMessage = true;
  render();
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
      setTimeout(clearMessage, 3000);
      setTimeout(render, 3500);
      console.log(data);
    })
    .catch(function (error) {
      console.log(error);
    });

  render();
  console.log(workouts);
}

//New features:
// TODO
//Show an error messsage when the server is not online. (show up in red). - DONE
//Error, save, delete and update message should be in one element. - DONE
//Link it to server. - DONE
//Link it to supabase.
//edit workout, - DONE
//save button, - DONE - created an if statement so it doesn't save when one of the fields are empty.

//Save button for a designated day for each workout, (Mon - Sun) -> transfer to a day, this will transfer all of the current workout to a table and the table's title is the chosen day.
//Edit button on the day will overwrite the current workouts placed on the workout array to help us edit the workouts.

render();
