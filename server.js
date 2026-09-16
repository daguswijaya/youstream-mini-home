require("dotenv").config();

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
    const streamKey = process.env.STREAM_KEY || (await ask("Enter your YouTube stream key: "));
    const videoFile = process.env.VIDEO_FILE || (await ask("Enter path to video file: "));
    const hoursStr = process.env.DURATION || (await ask("Enter streaming duration (hours): "));

    const hours = parseInt(hoursStr, 10);
    if (isNaN(hours) || hours <= 0) {
      console.log("Invalid duration.");
      rl.close();
      return;
    }

    rl.close();

    const duration = `${hours}:00:00`;

    const args = [
      "-re",
      "-stream_loop",
      "-1",
      "-i",
      videoFile,
      "-c",
      "copy",
      "-t",
      duration,
      "-f",
      "flv",
      "-flvflags",
      "no_duration_filesize",
      `rtmp://a.rtmp.youtube.com/live2/${streamKey}`,
    ];

    console.log(`Starting video stream for ${hours} hour(s)...`);

    const ffmpeg = spawn("ffmpeg", args, { stdio: "inherit" });

    ffmpeg.on("exit", (code) => {
      console.log(`FFmpeg exited with code ${code}`);
    });
  })();
});
