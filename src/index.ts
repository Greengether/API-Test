import * as dotenv from 'dotenv'
import express from 'express';
import db, {connectDB} from './db'
import authRouter from './routes/auth'
import eventRouter from './routes/event';

dotenv.config()
const app = express();
app.use(express.json()) //Middleware on every request to automatically parse JSON

app.listen(
    process.env.PORT, () => console.log("live on localhost:" + process.env.PORT)
)

connectDB()
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to Mongo DB."));


app.use('/', authRouter)
app.use('/event', eventRouter)


//TODO Automatic Server start with pm2