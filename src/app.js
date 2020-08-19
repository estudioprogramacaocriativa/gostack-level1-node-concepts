const express = require("express");
const cors = require("cors");

const { v4: uuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  const { title } = request.query;

  const results = title ? 
    repositories.filter(repository => repository.title.includes(title)) : 
    repositories;

  if(title && results.length <= 0)
    return response.status(404).json({
      data: {
        message: 'We cannot match any result to your search!'
      }
    })

  return response.json(results);
});

app.post("/repositories", (request, response) => {
  const {
    title,
    url,
    techs
  } = request.body;
  
  const repository = { 
    id: uuid(), 
    title, 
    url, 
    techs, 
    likes: 0 
  };

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if(repositoryIndex < 0)
    return response.status(400)
    .json({
      data: {
        message: 'We cannot find the specified repository!'
      }
    })
  
  const repository = repositories[repositoryIndex];

  repository.title = title;
  repository.url = url;
  repository.techs = techs;

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if(repositoryIndex < 0)
    return response.status(400)
    .json({
      data: {
        message: 'We cannot find the specified repository!'
      }
    })

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if(repositoryIndex < 0)
    return response.status(400)
    .json({
      data: {
        message: 'We cannot find the specified repository!'
      }
    })

  const repository = repositories[repositoryIndex];

  repository.likes++;

  return response.json(repository);
});

module.exports = app;
