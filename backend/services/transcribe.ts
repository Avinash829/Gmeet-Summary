import fs from "fs";
import { AssemblyAI, TranscribeParams } from "assemblyai";

// Initialize AssemblyAI client
const client = new AssemblyAI({
    apiKey: process.env.ASSEMBLYAI_API_KEY || "",
});

console.log("ASSEMBLYAI_API_KEY:", process.env.ASSEMBLYAI_API_KEY);


/**
 * Transcribe an audio file using AssemblyAI
 * @param filePath Path to audio file
 * @returns Transcribed text
 */
export async function transcribeWithAssemblyAI(filePath: string): Promise<string> {
    if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`);
    }

    try {
        const params: TranscribeParams = {
            audio: fs.createReadStream(filePath),
            speech_model: "universal",
        };

        // Send transcription request
        const transcript = await client.transcripts.transcribe(params);

        // Poll until transcription completes
        let completedTranscript = transcript;
        while (completedTranscript.status === "queued" || completedTranscript.status === "processing") {
            await new Promise((r) => setTimeout(r, 3000)); // 3s delay
            completedTranscript = await client.transcripts.get(transcript.id);
        }

        if (completedTranscript.status === "completed") {
            return completedTranscript.text || "";
        } else {
            throw new Error(completedTranscript.error || "Transcription failed");
        }
    } catch (err: any) {
        console.error("AssemblyAI transcription failed:", err);
        throw new Error(err.message || "Failed to transcribe via AssemblyAI");
    }
}
