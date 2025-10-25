import axios from "axios";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export async function summarizeTranscript(transcript: string): Promise<string> {
    if (!GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY not set in environment variables.");
    }

    const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

    const data = {
        contents: [
            {
                parts: [
                    {
                        text: `You are an expert AI meeting assistant.
Your task is to read the entire transcript of a meeting and produce a detailed, structured, and easy-to-read summary.

Please include the following sections:

1️ Executive Summary:
   - Provide a concise overview (5-7 sentences) capturing main topics and conclusions.

2️ Key Discussion Points:
   - List main points discussed, with context if necessary.
   - Include important arguments, suggestions, or observations.

3️ Decisions Made:
   - Clearly list all decisions reached.
   - Include who agreed or any important notes.

4️ Action Items:
   - List all tasks or follow-ups assigned.
   - Mention the owner of each task and any deadlines if present.

5️ Optional Insights / Notes:
   - Include additional context or implications to help someone understand the outcome and next steps.

Transcript:
${transcript}`
                    }
                ]
            }
        ]
    };

    // Define Gemini API response type
    interface GeminiCandidate {
        content?: {
            parts?: { text?: string }[];
        };
    }
    interface GeminiApiResponse {
        candidates?: GeminiCandidate[];
    }

    try {
        const resp = await axios.post<GeminiApiResponse>(url, data, {
            headers: {
                "Content-Type": "application/json",
                "X-goog-api-key": GEMINI_API_KEY
            },
            timeout: 120000
        });

        if (!resp.data?.candidates?.length) {
            console.error("Gemini API returned no candidates:", resp.data);
            throw new Error("No summary returned from Gemini API");
        }

        const summary = resp.data.candidates[0]?.content?.parts?.[0]?.text;
        if (!summary) {
            console.error("Gemini API returned empty summary:", resp.data);
            throw new Error("No summary returned from Gemini API");
        }

        return summary;

    } catch (err: any) {
        console.error("Error calling Gemini API:", err.response?.data || err.message);
        throw new Error("Failed to generate summary from Gemini API");
    }
}
