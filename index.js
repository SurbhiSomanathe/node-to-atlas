// const { response } = require('express');
// const express = require('express')
import  express from "express";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config()

console.log(process.env.MONGO_URL);

const app = express();

const PORT = 4000;

// const MONGO_URL = "mongodb://localhost";
// const MONGO_URL = "mongodb://127.0.0.1"; //  nodejs - 16+

const MONGO_URL = process.env.MONGO_URL;

async function createConnection() {
  const client = new MongoClient(MONGO_URL);
  await client.connect();
  console.log("Mongo is connected ✌😊");
  return client; 
}

const client = await createConnection();

app.use(express.json());

app.get('/', function (request, response) {
  response.send('Hello, 🌍 🥰 ');
});

  app.get("/movies", async function (request, response){

    if(request.query.rating){
      request.query.rating =+request.query.rating;
    }
    console.log(request.query);
    const movies = await client
    .db("movieslist")
    .collection("movies")
    .find(request.query)
    .toArray(); 
    response.send(movies);
  });


  app.get("/movies/:id", async function (request, response) {


    
    const { id } = request.params;
    console.log (request.params, id);
    // const movie = movies.find ((mv) => mv.id ===id);
    // console.log(movie);

    const movie = await client
    .db("movieslist")
    .collection("movies")
    .findOne({ id: id });


    movie 
    ? response.send(movie )
    :response.status(404 ).send({msg : "movies not found"});
  });


  app.post("/movies", async function (request, response){
const data = request.body;

const result = await client
    .db("movieslist")
    .collection("movies")
    .insertMany(data);


console.log(result);

    response.send(data);
  });

  app.delete("/movies/:id", async function (request, response) {

    const { id } = request.params;
    console.log (request.params, id);
    // const movie = movies.find ((mv) => mv.id ===id);
    // console.log(movie);

    const result = await client
    .db("movieslist")
    .collection("movies")
    .deleteOne({ id: id });


    result.deletedCount > 0
    ? response.send({ msg: "movie successfully deleted" })
    :response.status( 404 ).send({ msg : "movie not found" });
  });




app.listen(PORT, () => console.log(`App is started in ${PORT}`));
