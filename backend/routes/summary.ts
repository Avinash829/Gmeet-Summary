import express from "express";
import Meeting from "../models/Meeting";
import { summarizeTranscript } from "../services/summarize";

const router = express.Router();


router.post("/summary", async (req, res) => {
    try {
        const { id } = req.body;
        if (!id) return res.status(400).json({ error: "Meeting ID is required" });

        const meeting = await Meeting.findById(id);
        if (!meeting) return res.status(404).json({ error: "Meeting not found" });

        const newSummary = await summarizeTranscript(meeting.transcript);

        meeting.summary = newSummary;
        await meeting.save();

        return res.json({
            message: "Summary regenerated successfully",
            summary: newSummary,
        });
    } catch (err: any) {
        console.error("Error regenerating summary:", err);
        return res.status(500).json({ error: "Failed to generate summary" });
    }
});

export default router;
