import * as dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();

const connectionString = process.env.MONGODB_URI;
if (!connectionString) throw new Error("Mongo DB connection string missing.");

mongoose.connect(connectionString);
const db = mongoose.connection;

export default db