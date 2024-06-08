import * as dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();

export async function connectDB() {
    try {
        const connectionString = process.env.MONGODB_URI;
        if (!connectionString)
            throw new Error("Mongo DB connection string missing.");

        await mongoose.connect(connectionString);
    } catch (error: any) {
        console.error(error?.message)
        process.exit(1)
    }
}

export default mongoose.connection;
