const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");
require("dotenv/config"); // import 'dotenv/config'
const postgres = require("postgres"); // import postgres from 'postgres'

app.use(cors({ origin: "*" }));
app.use(express.json());

const workoutServer = [];

// check cors
// check post (req.body, express.json())
// check get query (req.query)

app.get("/list", (req, res) => {
  res.send(workoutServer);
});

const sql = postgres(process.env.PG_CONNECTION_STRING);

async function insertWorkout(id, n, s, r, w) {
  await sql`insert into fitness_app (id, workout_name, sets, reps, weight) values (${id}, ${n}, ${s}, ${r}, ${w})`;
}

app.post("/add", (req, res) => {
  workoutServer.push({
    id: req.body.id,
    name: req.body.name,
    sets: req.body.sets,
    reps: req.body.reps,
    weight: req.body.weight,
  });
  insertWorkout(
    req.body.id,
    req.body.name,
    req.body.sets,
    req.body.reps,
    req.body.weight,
  );
  console.log(workoutServer, "Server");
  res.send("Post Successfully Sent");
});

async function updateWorkout(id, name, sets, reps, weight) {
  await sql`update fitness_app set id = ${id}, workout_name = ${name}, sets = ${sets}, reps = ${reps}, weight = ${weight} where id = ${id}`;
}

app.post("/update", (req, res) => {
  // console.log(req.body);
  //TODO: Update by ID, update array and supabase.
  //Delete by ID
  //Mr Array, 8 kyu
  const index = workoutServer.findIndex((i) => i.id === req.body.id);
  workoutServer.splice(index, 1, {
    name: req.body.name,
    sets: req.body.sets,
    reps: req.body.reps,
    weight: req.body.weight,
  });
  updateWorkout(
    req.body.id,
    req.body.name,
    req.body.sets,
    req.body.reps,
    req.body.weight,
  );
  res.send({ success: "ok", data: workoutServer });
});

async function deleteWorkout() {
  await sql`delete from fitness_app where workout_name = 'pushups'`;
}

app.post("/delete", (req, res) => {
  const index = workoutServer.findIndex(
    (workout) => workout.id === req.body.id,
  );
  workoutServer.splice(index, 1);
  res.send({ success: "ok", data: workoutServer });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});

// const f = (x) => {return x+1}
// console.log(f(1)) // ?
