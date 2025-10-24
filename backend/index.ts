import path from "path";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import uploadRoutes from "./routes/upload";
import summaryRoutes from "./routes/summary";
import downloadRoutes from "./routes/download";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const app = express();

// CORS setup
app.use(
    cors({
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

app.options("*", cors());

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
app.use("/api/summary", summaryRoutes);
app.use("/api/download", downloadRoutes);

// Base route
app.get("/", (req, res) => {
    res.send("AI Meeting Summarizer API is running 🚀");
});

// Catch-all route for unknown paths (important for SPA or Render)
app.get("*", (req, res) => {
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
