const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");
require("dotenv/config"); // import 'dotenv/config'
const postgres = require("postgres"); // import postgres from 'postgres'

app.use(cors({ origin: "*" }));
app.use(express.json());

// const workoutServer = [];

// check cors
// check post (req.body, express.json())
// check get query (req.query)
const sql = postgres(process.env.PG_CONNECTION_STRING);

async function getWorkout() {
  const result = await sql`select * from fitness_app`;

  // const wo = {
  //   id: '943273713',
  //   workout_name: 'push',
  //   sets: '3',
  //   reps: '12',
  //   weight: '120'
  //   editing: true,
  //   weekday_index: '0'
  // }
  return result.map((wo) => ({
    id: Number(wo.id),
    workout_name: wo.workout_name,
    sets: Number(wo.sets),
    reps: Number(wo.reps),
    weight: Number(wo.weight),
    editing: wo.editing,
    weekdayIndex: Number(wo.weekday_index),
  }));

  //return result.map()
}
//  {
//     id: '943273713',
//     workout_name: 'push',
//     sets: '3',
//     reps: '12',
//     weight: '120'
//     name: 'push',
//     weekday_index: 0,
//   },

//   {
//     id: 943273713,
//     workout_name: 'push',
//     sets: 3,
//     reps: 12,
//     weight: 120
//     name: 'push',
//     weekdayIndex: 0,
//   },

// (async () => {
//   console.log(await getWorkout()); // [{name: pushups}, {name: push}, {name: back}]
// })();

app.get("/list", async (req, res) => {
  res.send(await getWorkout());
});

async function insertWorkout(id, n, s, r, w, e) {
  await sql`insert into fitness_app (id, workout_name, sets, reps, weight, editing) values (${id}, ${n}, ${s}, ${r}, ${w}, ${e})`;
}

app.post("/add", (req, res) => {
  insertWorkout(
    req.body.id,
    req.body.workout_name,
    req.body.sets,
    req.body.reps,
    req.body.weight,
    req.body.editing,
  );
  // console.log(workoutServer, "Server");
  res.send("Post Successfully Sent");
});

async function updateWorkout(
  id,
  name,
  sets,
  reps,
  weight,
  editing,
  weekdayIndex,
) {
  // throw new Error("hello");
  await sql`
    update fitness_app 
    set id = ${id},
        workout_name = ${name},
        sets = ${sets},
        reps = ${reps},
        weight = ${weight},
        editing = ${editing}, 
        weekday_index = ${weekdayIndex} 
    where id = ${id}`;
}

app.post("/update", (req, res) => {
  // console.log(req.body);
  //TODO: Update by ID, update array and supabase.
  //Delete by ID

  // const index = workoutServer.findIndex((i) => i.id === req.body.id);
  // workoutServer.splice(index, 1, {
  //   name: req.body.name,
  //   sets: req.body.sets,
  //   reps: req.body.reps,
  //   weight: req.body.weight,
  // });
  console.log(req.body);
  updateWorkout(
    req.body.id,
    req.body.workout_name,
    req.body.sets,
    req.body.reps,
    req.body.weight,
    req.body.editing,
    req.body.weekday_index,
  );
  res.send({ success: "ok" });
});

async function deleteWorkout(id) {
  await sql`delete from fitness_app where id = ${id}`;
}

app.post("/delete", (req, res) => {
  // const index = workoutServer.findIndex(
  //   (workout) => workout.id === req.body.id,
  // );
  // workoutServer.splice(index, 1);
  deleteWorkout(req.body.id);
  res.send({ success: "ok" });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});

// const f = (x) => {return x+1}
// console.log(f(1)) // ?
