import fs from "fs";

export function unlinkIfExists(filePath: string) {
    try {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log("Removed temp file:", filePath);
        }
    } catch (err) {
        console.warn("Failed to remove temp file:", filePath, err);
    }
}
