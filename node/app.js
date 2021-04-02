const fs = require('fs');
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");

const { isValidUser } = require("./sanity");
const { getTimeStore, encodeDatedTimeSlots } = require("./timestore");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get("/api/today", (req, res) => {
    res.send({
        today: today(),
    });
});

let timeStore;

getTimeStore().then(ts => {
    timeStore = ts;
})

app.get("/api/availability", (req, res) => {
    res.json(encodeDatedTimeSlots(timeStore.unbooked()));
})

app.get("/api/booked", (req, res) => {
    const { user } = req.query;
    if (!isValidUser(user)) {
        return res.status(400).end();
    }
    res.send(timeStore.booked(user));
})

app.post("/api/book", (req, res) => {
    const { user, advisor, time: rawTime } = req.query;
    if (!isValidUser(user)) {
        return res.status(400).end();
    }
    const slot = timeStore.book(user, Number(advisor), rawTime);
    if (!slot) {
        return res.status(400).end();
    }
    res.send(timeStore.booked(user));
})

app.post("/api/cancel", (req, res) => {
    const { user, advisor, time: rawTime } = req.query;
    if (!isValidUser(user)) {
        return res.status(400).end();
    }
    const slot = timeStore.cancel(user, Number(advisor), rawTime);
    if (!slot) {
        return res.status(400).end();
    }
    res.send(timeStore.booked(user));
})

function today() {
    return new Date().toLocaleDateString();
}

app.today = today;
module.exports = app;