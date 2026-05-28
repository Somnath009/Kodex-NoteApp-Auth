import dotenv from "dotenv";
import mongoose from "mongoose";
import { dot } from "node:test/reporters";

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.log("Error connecting to MongoDB:", error);
    }
};

export default connectDB;