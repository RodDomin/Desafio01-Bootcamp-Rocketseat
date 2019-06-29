const express = require("express");
const server = express();

let projects = [];
let numbeOfReq = 0;

function verifyRequestData(req, res, next) {
  if (!req.body.id || !req.body.title) {
    return res.status(400).json({ error: "Está faltando dados" });
  }

  next();
}

function verifyProjectExists(req, res, next) {
  // const project = projects.find(p => p.id == req.params.id);

  for (let i = 0; i < projects.length; i++) {
    if (projects[i].id == req.params.id) {
      req.position = i;
      return next();
    }
  }

  return res.status(400).send({ error: "project not found" });
}

server.use(express.json());

server.use((req, res, next) => {
  numbeOfReq++;
  console.log(numbeOfReq);
  next();
});

server.get("/", (req, res) => {
  res.send("ok");
});

server.post("/projects", verifyRequestData, (req, res) => {
  const { id, title } = req.body;

  projects.push({ id, title, tasks: [] });

  return res.json({ message: "" });
});

server.get("/projects", (req, res) => {
  return res.json(projects);
});

server.put("/projects/:id", verifyProjectExists, (req, res) => {
  const { id } = req.params;

  if (!req.body.title) {
    return res.status(400).json({ error: "title not found" });
  }

  projects[req.position].title = req.body.title;

  return res.send(projects[req.position]);
});

server.delete("/projects/:id", verifyProjectExists, (req, res) => {
  console.log(req.position);

  projects.splice(req.position, 1);
  res.json(projects);
});

server.post("/projects/:id/tasks", verifyProjectExists, (req, res) => {
  const { task } = req.body;

  if (!task)
    return res.status(400).json({ error: "escreva a tarefa a ser inserida" });

  projects[req.position].tasks.push(task);

  res.json(projects);
});

server.listen(3000);
