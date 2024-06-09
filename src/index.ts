import * as dotenv from "dotenv";
import express from "express";
import db, { connectDB } from "./config/db";
import authRouter from "./routes/auth";
import eventRouter from "./routes/event";
import path from "path";
import auth from "./middleware/auth";
import User from "./models/user";
import type { AuthenticatedRequest } from "./middleware/auth";

dotenv.config();
const app = express();

app.set("view engine", "ejs");
app.set("views", path.join("src", "views"))
app.use(express.json()); //Middleware on every request to automatically parse JSON
app.use(express.urlencoded({extended: false})) // To access form data in request

app.listen(process.env.PORT, () =>
    console.log("live on localhost:" + process.env.PORT)
);

connectDB();
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to Mongo DB."));

app.use("/", authRouter);
app.use("/event", eventRouter);

app.get('/', auth, async (req: AuthenticatedRequest, res) => {
    try {
        const user = await User.findById(req.userId)
        res.render('index', { name: user?.username })
    } catch (error: any) {
        console.error(error)
        res.status(500).json({message: error.message})
    }
    
})

//TODO Automatic Server start with pm2