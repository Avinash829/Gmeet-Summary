import path from "path";
import dotenv from "dotenv";


dotenv.config({ path: path.resolve(process.cwd(), ".env") });


import express from "express";
import mongoose from "mongoose";
import cors from "cors"; 
import uploadRoutes from "./routes/upload";
import summaryRoutes from "./routes/summary";
import downloadRoutes from "./routes/download";


const app = express();

app.use(
    cors({
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

app.options("*", cors());

app.use(express.json({ limit: "200mb" }));
app.use(express.urlencoded({ extended: true }));

const MONGODB_URI = process.env.MONGODB_URI || "";
if (!MONGODB_URI) {
    console.error("Missing MONGODB_URI in .env");
    process.exit(1);
} else {
    console.log(" MONGODB connection string found.");
}

mongoose
    .connect(MONGODB_URI)
    .then(() => console.log("Connected to MongoDB Atlas"))
    .catch((err) => {
        console.error("MongoDB connection error:", err);
        process.exit(1);
    });

app.use("/api", uploadRoutes);
app.use("/api", summaryRoutes);
app.use("/api", downloadRoutes);

app.get("/", (req, res) => {
    res.send("AI Meeting Summarizer API is running 🚀");
});


app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error("Unhandled Error:", err);
    res.status(500).json({ error: err.message || "Internal Server Error" });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
