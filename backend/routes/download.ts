import express from "express";
import PDFDocument from "pdfkit";
import Meeting from "../models/Meeting";
import path from "path";

const router = express.Router();

router.get("/download/:id", async (req, res) => {
    try {
        const { id } = req.params;

        // Find meeting by ID
        const meeting = await Meeting.findById(id);
        if (!meeting) return res.status(404).json({ error: "Meeting not found" });

        if (!meeting.transcript && !meeting.summary) {
            return res.status(400).json({ error: "Meeting has no transcript or summary to generate PDF." });
        }

        // Setup PDF document
        const doc = new PDFDocument({ margin: 50 });
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
            "Content-Disposition",
            `attachment; filename="${path.basename(meeting.originalFileName, path.extname(meeting.originalFileName))}-summary.pdf"`
        );

        doc.pipe(res);

        // PDF content
        doc.fontSize(18).text("Meeting Summary Report", { align: "center" });
        doc.moveDown();
        doc.fontSize(12).text(`File: ${meeting.originalFileName}`);
        doc.moveDown();

        doc.fontSize(14).text("Summary", { underline: true });
        doc.moveDown(0.5);
        doc.fontSize(12).text(meeting.summary || "No summary available.");
        doc.moveDown(1.5);

        doc.fontSize(14).text("Full Transcript", { underline: true });
        doc.moveDown(0.5);
        doc.fontSize(10).text(meeting.transcript || "No transcript available.", { align: "justify" });

        doc.end();

    } catch (err: any) {
        console.error("Error generating PDF:", err);
        return res.status(500).json({ error: "Failed to generate PDF" });
    }
});

export default router;
