const express = require("express");

const app = express();
const port = 3000;
const cors = require("cors");

app.use(cors({ origin: "*" }));
app.use(express.json());

const workoutServer = [];

// check cors
// check post (req.body, express.json())
// check get query (req.query)

app.get("/list", (req, res) => {
  res.send(workoutServer);
});

app.post("/add", (req, res) => {
  workoutServer.push({
    name: req.body.name,
    sets: req.body.sets,
    reps: req.body.reps,
    weight: req.body.weight,
  });

  console.log(workoutServer, "Server");
  res.send("Post Successfully Sent");
});

app.post("/update", (req, res) => {
  console.log(req.body);
  workoutServer.splice(req.body.index, 1, {
    name: req.body.name,
    sets: req.body.sets,
    reps: req.body.reps,
    weight: req.body.weight,
  });
  res.send({ success: "ok", data: workoutServer });
});

app.post("/delete", (req, res) => {
  workoutServer.splice(req.body.index, 1);
  res.send({ success: "ok", data: workoutServer });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});
