import express from "express";
import PDFDocument from "pdfkit";
import Meeting from "../models/Meeting";
import path from "path";

const router = express.Router();

/**
 * GET /download/:id
 * Generates and streams a PDF containing the transcript and summary for a given meeting.
 */
router.get("/download/:id", async (req, res) => {
    try {
        const { id } = req.params;

        // Retrieve meeting data
        const meeting = await Meeting.findById(id);
        if (!meeting) return res.status(404).json({ error: "Meeting not found" });

        // Create a new PDF document
        const doc = new PDFDocument({
            margin: 50,
            info: {
                Title: `Meeting Summary - ${meeting.originalFileName}`,
                Author: "AI Meeting Summarizer",
            },
        });

        // Set headers for browser download
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
            "Content-Disposition",
            `attachment; filename="${path.basename(meeting.originalFileName, path.extname(meeting.originalFileName))}-summary.pdf"`
        );

        // Pipe document to response
        doc.pipe(res);

        // Title
        doc.fontSize(18).text("Meeting Summary Report", { align: "center" });
        doc.moveDown();

        // File name
        doc.fontSize(12).text(`File: ${meeting.originalFileName}`);
        doc.moveDown();

        // Summary section
        doc.fontSize(14).text("Summary", { underline: true });
        doc.moveDown(0.5);
        doc.fontSize(12).text(meeting.summary || "No summary available.");
        doc.moveDown(1.5);

        // Transcript section
        doc.fontSize(14).text("Full Transcript", { underline: true });
        doc.moveDown(0.5);
        doc.fontSize(10).text(meeting.transcript || "No transcript available.", {
            align: "justify",
        });

        // Finalize PDF
        doc.end();
    } catch (err: any) {
        console.error("Error generating PDF:", err);
        return res.status(500).json({ error: "Failed to generate PDF" });
    }
});

export default router;
