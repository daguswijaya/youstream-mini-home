const readline = require("readline");
const { spawn } = require("child_process");
const figlet = require("figlet");

console.log("\n\n");

figlet.text("YuTools", { font: "Isometric2" }, (err, data) => {
  if (!err) console.log(data);

  console.log("\nYuTools V1.1");
  console.log("Lightweight Youtube streaming tools\n");

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const ask = (q) => new Promise((res) => rl.question(q, res));

  (async () => {
    const streamKey = await ask("Enter stream key: ");
    const videoFile = await ask("Enter video file location: ");
    const durationStr = await ask("Enter streaming duration in minutes: ");

    const minutes = parseInt(durationStr, 10);
    if (isNaN(minutes)) {
      console.log("Invalid duration.");
      rl.close();
      return;
    }

    rl.close();

    const args = [
      "-re",
      "-stream_loop",
      "-1",
      "-i",
      videoFile,
      "-c",
      "copy",
      "-t",
      `${minutes}:00`,
      "-f",
      "flv",
      "-flvflags",
      "no_duration_filesize",
      `rtmp://a.rtmp.youtube.com/live2/${streamKey}`,
    ];

    console.log("Starting video stream (no re-encoding)...");

    const ffmpeg = spawn("ffmpeg", args, { stdio: "inherit" });

    ffmpeg.on("exit", (code) => {
      console.log(`FFmpeg exited with code ${code}`);
    });
  })();
});
