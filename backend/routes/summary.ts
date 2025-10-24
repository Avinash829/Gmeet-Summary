import express from "express";
import { summarizeTranscript } from "../services/summarize";

const router = express.Router();

router.post("/summary", async (req, res) => {
    try {
        const { text } = req.body;
        if (!text) {
            return res.status(400).json({ error: "Transcript text is required" });
        }

        const summary = await summarizeTranscript(text);
        return res.json({ summary });
    } catch (err: any) {
        console.error("Error generating summary:", err);
        res.status(500).json({ error: "Failed to generate summary" });
    }
});

export default router;
