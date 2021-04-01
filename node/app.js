const fs = require('fs');
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get("/today", (req, res) => {
    res.send({
        today: today(),
        user: 654321,
    });
});

// Dumb cached relay for availability data from thinkful
var availabilityCache = null;

app.get("/availability", (req, res) => {
    if (availabilityCache) {
        res.json(availabilityCache);
    } else {
        fetch('https://www.thinkful.com/api/advisors/availability').then(res => res.json()).then(data => {
            availabilityCache = data;
            res.send(data);
        });
    }
})

const FULL_NAME_PATTERN = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/;

app.get("/booked/:user", (req, res) => {
    const { user } = req.params;
    if (!FULL_NAME_PATTERN.test(user)) {
        return res.status(400).end();
    }
    res.send([
        {
            time: "2019-04-04T11:00:00-04:00",
            advisor: 372955,
            user: "Don",
        }
    ]);
})

function today() {
    return new Date().toLocaleDateString();
}

app.today = today;
module.exports = app;