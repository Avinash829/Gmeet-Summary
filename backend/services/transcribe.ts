import fs from "fs";
import { AssemblyAI, TranscribeParams } from "assemblyai";

const client = new AssemblyAI({
    apiKey: process.env.ASSEMBLYAI_API_KEY || "",
});

// console.log("ASSEMBLYAI_API_KEY:", process.env.ASSEMBLYAI_API_KEY);



export async function transcribeWithAssemblyAI(filePath: string): Promise<string> {
    if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`);
    }

    try {
        const params: TranscribeParams = {
            audio: fs.createReadStream(filePath),
            speech_model: "universal",
        };

        const transcript = await client.transcripts.transcribe(params);

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
