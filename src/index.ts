import * as dotenv from 'dotenv'
dotenv.config()

import express from 'express';
const app = express();
import db from './db'

app.use(express.json()) //Middleware on every request to automatically parse JSON

app.listen(
    process.env.PORT, () => console.log("live on localhost:" + process.env.PORT)
)

import eventRouter from './routes/event';
app.use('/event', eventRouter)
