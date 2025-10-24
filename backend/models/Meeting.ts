import { Schema, model } from "mongoose";


const MeetingSchema = new Schema({
originalFileName: { type: String, required: true },
filePath: { type: String, required: true },
transcript: { type: String, required: true },
summary: { type: String, required: true },
durationSeconds: { type: Number },
createdAt: { type: Date, default: Date.now }
});


export default model("Meeting", MeetingSchema);