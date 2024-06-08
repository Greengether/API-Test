import * as dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();

const connectionString = process.env.MONGODB_URI;
if (!connectionString) throw new Error("Mongo DB connection string missing.");

mongoose.connect(connectionString);
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to Mongo DB."));

export default db