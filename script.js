console.log("Workout List");
let confirmationMessage = "";
const url = "http://localhost:3000/list";
// console.log(fetch(url));
const response = fetch(url)
  .then((res) => res.json())
  .then((data) => {
    workout = data;
    render();
    console.log(data, "data from /list");
  })
  .catch(function (error) {
    if (error) {
      confirmationMessage = "Server Not Connected!";
      document.getElementById("message-container").style.fontSize = "50px";
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

// let workout = { workoutName: [], sets: [], reps: [], weights: [] };
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

let workout = [];
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
        workout.map((_, i) => showWorkout(i)),
      ),
      element(
        "div",
        {
          id: "message-container",
          // style: confirmationMessage ? "" : "display: none;",
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

function savePlan() {}

function addWorkout() {
  const workoutName = document.querySelector("#workout-input").value;
  const sets = document.querySelector("#sets-input").value;
  const reps = document.querySelector("#reps-input").value;
  const weights = document.querySelector("#weights-input").value;

  if (workoutName && sets && reps && weights) {
    workout.push({
      name: workoutName,
      sets: sets,
      reps: reps,
      weight: weights,
    });
  }

  fetch("http://localhost:3000/add", {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: workoutName,
      sets: sets,
      reps: reps,
      weight: weights,
    }),
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
      { className: "li-info", id: `name${index}`, value: workout[index].name },
      [],
    ),
    element(
      "input",
      { className: "li-info", id: `sets${index}`, value: workout[index].sets },
      [],
    ),
    element(
      "input",
      { className: "li-info", id: `reps${index}`, value: workout[index].reps },
      [],
    ),
    element(
      "input",
      {
        className: "li-info",
        id: `weight${index}`,
        value: workout[index].weight,
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
  workout.splice(index, 1, {
    name: name,
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
      name: name,
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
  console.log(workout);
}

function deleteWorkout(index) {
  workout.splice(index, 1);

  // console.log({ index }, "check index");
  fetch("http://localhost:3000/delete", {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      index: index,
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
  console.log(workout);
}

//New features:
// TODO
//Show an error messsage when the server is not online. (show up in red).
//Error, save, delete and update message should be in one element.
//Link it to server. - DONE
//Link it to supabase.
//edit workout, - DONE
//save button, - DONE - created an if statement so it doesn't save when one of the fields are empty.

//Save button for a designated day for each workout, (Mon - Sun) -> transfer to a day, this will transfer all of the current workout to a table and the table's title is the chosen day.
//Edit button on the day will overwrite the current workouts placed on the workout array to help us edit the workouts.

render();
