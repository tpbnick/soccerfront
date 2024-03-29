const express = require("express");
const app = express();
const path = require("path");
require("dotenv").config();
const favicon = require("serve-favicon");
const fetch = require("node-fetch");
const {cpuUsage} = require("process");

app.use(favicon(path.join(__dirname, "public", "images", "favicon.ico")));
app.use(express.static("public"));
app.use(express.json());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", function (req, res) {
    res.render("home", {apikey: process.env.APIKEY});
});

app.get("/league-tables", function (req, res) {
    res.render("league-tables", {apikey: process.env.APIKEY});
});

app.get("/login", function (req, res) {
    res.render("login");
});

app.get("/register", function (req, res) {
    res.render("register");
});

app.post("/fetch_fixtures", async function (req, res) {
    const result = await fetch(
        `https://v3.football.api-sports.io/fixtures?date=${req.body.the_date}&timezone=America/New_York`,
        {
            method: "GET",
            headers: {
                "X-RapidAPI-Key": process.env.APIKEY,
            },
        }
    );

    const data = await result.json();

    res.json(data);
});

app.post("/fetch_leagues", async function (req, res) {
    const result = await fetch(
        `https://v3.football.api-sports.io/leagues?country=${req.body.the_country}&season=${+req.body.the_yyyy}`,
        {
            method: "GET",
            headers: {
                "X-RapidAPI-Key": process.env.APIKEY,
            },
        }
    );

    const data = await result.json();

    res.json(data);
});


app.post("/fetch_league_table", async function (req, res) {
    const result = await fetch(
        `https://v3.football.api-sports.io/standings?league=${req.body.the_league_id_ex}&season=${req.body.the_season}`,
        {
            method: "GET",
            headers: {
                "X-RapidAPI-Key": process.env.APIKEY,
            },
        }
    );

    const data = await result.json();

    res.json(data);
});

app.listen(8080, () => {
    console.log("Serving on port 8080");
});
