import dotenv from "dotenv";
import path from "path";


dotenv.config({ path: path.resolve(process.cwd(), "./.env") });


export const PORT = process.env.PORT || 3000;
export const MONGODB_URI = process.env.MONGODB_URI || "";
export const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "";
export const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || "gpt-oss-20b";
export const UPLOAD_DIR = process.env.UPLOAD_DIR || "./uploads";
export const FFMPEG_PATH = process.env.FFMPEG_PATH || undefined;
export const ASSEMBLYAI_API_KEY = process.env.ASSEMBLYAI_API_KEY || "";
export const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";