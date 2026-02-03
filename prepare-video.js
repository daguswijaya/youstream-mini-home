const readline = require("readline");
const { spawn } = require("child_process");
const path = require("path");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const ask = (q) => new Promise((res) => rl.question(q, res));

(async () => {
  try {
    const input = await ask("Input video file: ");
    const output = await ask("Output file (leave empty for auto name): ");

    rl.close();

    const outputFile =
      output && output.trim()
        ? output
        : path.join(
            path.dirname(input),
            `${path.parse(input).name}_yt_ready.mp4`,
          );

    const args = [
      "-y",
      "-i",
      input,

      // ===== VIDEO =====
      "-c:v",
      "libx264",
      "-profile:v",
      "high",
      "-level",
      "4.2",
      "-pix_fmt",
      "yuv420p",
      "-r",
      "30",
      "-g",
      "60",
      "-keyint_min",
      "60",
      "-sc_threshold",
      "0",
      "-bf",
      "2",

      // CBR-ish (stable for streaming)
      "-b:v",
      "4500k",
      "-maxrate",
      "4500k",
      "-bufsize",
      "9000k",

      // ===== AUDIO =====
      "-c:a",
      "aac",
      "-b:a",
      "160k",
      "-ac",
      "2",
      "-ar",
      "44100",

      // ===== CONTAINER =====
      "-movflags",
      "+faststart",

      outputFile,
    ];

    console.log("\nEncoding video for YouTube...\n");

    const ffmpeg = spawn("ffmpeg", args, { stdio: "inherit" });

    ffmpeg.on("close", (code) => {
      if (code === 0) {
        console.log("\n✅ Encoding complete!");
        console.log("Ready for stream-copy to YouTube.");
        console.log("Output:", outputFile);
      } else {
        console.log("\n❌ Encoding failed with code:", code);
      }
    });
  } catch (err) {
    console.error("Error:", err);
    rl.close();
  }
})();
