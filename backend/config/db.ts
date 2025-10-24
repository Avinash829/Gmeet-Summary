import mongoose from "mongoose";
import { MONGODB_URI } from "./env";


export async function connectDB() {
if (!MONGODB_URI) throw new Error("MONGODB_URI not set in env");
await mongoose.connect(MONGODB_URI);
console.log("Connected to MongoDB");
}