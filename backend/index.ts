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

const allowedOrigins = [
    "http://localhost:3000",
    "https://gmeet-summary.vercel.app"
];

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));


// Body parsers
app.use(express.json({ limit: "200mb" }));
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || "";
if (!MONGODB_URI) {
    console.error("Missing MONGODB_URI in .env");
    process.exit(1);
} else {
    console.log("✅ MONGODB connection string found.");
}

mongoose
    .connect(MONGODB_URI)
    .then(() => console.log("✅ Connected to MongoDB Atlas"))
    .catch((err) => {
        console.error("❌ MongoDB connection error:", err);
        process.exit(1);
    });

// API routes
app.use("/api/upload", uploadRoutes);
app.use("/api", summaryRoutes);
app.use("/api", downloadRoutes);

// Base route for health check
app.get("/", (req, res) => {
    res.send("AI Meeting Summarizer API is running 🚀");
});

// Catch-all for unknown routes (all HTTP methods)
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error("Unhandled Error:", err);
    res.status(500).json({ error: err.message || "Internal Server Error" });
});

// Listen on Render's assigned port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
