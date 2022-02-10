
import express from "express";
import bodyParser from "body-parser";
import { Scraper } from './src/scraper.js';

const app = express();

// parse requests of content-type: application/json
app.use(bodyParser.json());

// parse requests of content-type: application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to my web server!" });
});

// simple route
app.get("/extra", (req, res) => {
  let scraper = new Scraper()
  extra(req, res, scraper)
});

async function extra(req, res, scraper) {
  let result = await scraper.onlyOne()
  res.json(result);

  // for (const iterator of result) {
  //   // res.send(iterator)
  //   req.body += iterator
  // }

  // result.forEach(element => {
  //   res.send(element)
  // });
  //res.send(result)
  console.log("-DONE-");
}

// set port, listen for requests
app.listen(3000, () => {
  console.log("Server is running on port 3000.");
});