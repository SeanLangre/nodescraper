
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
  extra(res, scraper)
});

async function extra(res, scraper) {
  let result = await scraper.onlyOne()
  res.json({ message: result });
}

// set port, listen for requests
app.listen(3000, () => {
  console.log("Server is running on port 3000.");
});