import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function convertToWav(inputPath: string, outputPath: string) {
    const cmd = `ffmpeg -i "${inputPath}" -ar 16000 -ac 1 -c:a pcm_s16le "${outputPath}" -y`;
    await execAsync(cmd);
}
