require('dotenv').config()

const express = require('express');
const app = express();
const db = require("./db")

app.use(express.json()) //Middleware on every request to automatically parse JSON

app.listen(
    process.env.PORT, () => console.log("live on localhost:" + process.env.PORT)
)

const eventRouter = require('./routes/event')
app.use('/event', eventRouter)
