import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { convertToWav } from "../services/ffmpeg";
import { transcribeWithAssemblyAI } from "../services/transcribe";
import { summarizeTranscript } from "../services/summarize";
import { unlinkIfExists } from "../utils/temp";
import Meeting from "../models/Meeting";

const router = express.Router();

// Upload dir
const UPLOAD_DIR = "uploads";
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// Multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOAD_DIR),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

router.post("/upload", upload.single("file"), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: "No file uploaded" });

        const filePath = req.file.path;
        const ext = path.extname(req.file.originalname).toLowerCase();
        const isVideo = [".mp4", ".mov", ".avi", ".mkv"].includes(ext);
        const audioPath = isVideo ? `${filePath}.wav` : filePath;

        // Convert video → audio
        if (isVideo) {
            try { await convertToWav(filePath, audioPath); } 
            catch (err) {
                unlinkIfExists(filePath);
                return res.status(500).json({ error: "Failed to convert video to audio" });
            }
        }

        // Transcribe audio
        const transcript = await transcribeWithAssemblyAI(audioPath);

        // Generate AI summary
        let summary = "";
        try { summary = await summarizeTranscript(transcript); } 
        catch (err) { summary = "AI summarization failed"; }

        // Save to DB
        const meeting = new Meeting({
            originalFileName: req.file.originalname,
            filePath,
            transcript,
            summary
        });
        await meeting.save();

        // Cleanup
        if (isVideo) unlinkIfExists(audioPath);
        unlinkIfExists(filePath);

        // Send both transcript + summary
        return res.json({ transcript, summary, meetingId: meeting._id });

    } catch (err: any) {
        console.error("Upload error:", err);
        return res.status(500).json({ error: "Server error" });
    }
});

export default router;
