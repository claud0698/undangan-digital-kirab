/**
 * Optimize a background-music track into a lightweight, web-ready loop.
 *
 * Usage:
 *   node scripts/optimize-audio.mjs [input]
 *   npm run audio:optimize -- path/to/track.wav
 *
 * If no input is given, it looks for public/audio/song-src.* (any extension).
 * Outputs public/audio/song.mp3 (+ song.ogg) — mono, ~96 kbps, loudness-
 * normalized, with leading/trailing silence trimmed for a seamless loop.
 *
 * Requires ffmpeg:  brew install ffmpeg
 */
import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, statSync } from "node:fs";
import { join, resolve } from "node:path";

const AUDIO_DIR = resolve("public/audio");
const OUT_MP3 = join(AUDIO_DIR, "song.mp3");
const OUT_OGG = join(AUDIO_DIR, "song.ogg");

function haveFfmpeg() {
  try { execFileSync("ffmpeg", ["-version"], { stdio: "ignore" }); return true; }
  catch { return false; }
}

function findInput() {
  const arg = process.argv[2];
  if (arg) {
    if (!existsSync(arg)) fail(`Input file not found: ${arg}`);
    return resolve(arg);
  }
  const match = readdirSync(AUDIO_DIR).find((f) => /^song-src\.[a-z0-9]+$/i.test(f));
  if (!match) {
    fail(
      "No input given and no public/audio/song-src.* found.\n" +
      "  • Drop your raw track at public/audio/song-src.mp3 (or .wav/.m4a/...), or\n" +
      "  • pass a path:  npm run audio:optimize -- path/to/track.wav",
    );
  }
  return join(AUDIO_DIR, match);
}

function fail(msg) {
  console.error("\n✗ " + msg + "\n");
  process.exit(1);
}

function kb(p) { return (statSync(p).size / 1024).toFixed(0) + " kB"; }

if (!haveFfmpeg()) {
  fail("ffmpeg is not installed.\n  Install it with:  brew install ffmpeg\n  Then re-run:      npm run audio:optimize");
}

const input = findInput();
// Output bitrate — override with BITRATE env (e.g. BITRATE=56k). Keep at or
// below the source bitrate; re-encoding upward only wastes bytes.
const BITRATE = process.env.BITRATE || "64k";
// Trim silence at both ends (reverse trick), downmix to mono, normalize loudness.
const trim =
  "silenceremove=start_periods=1:start_silence=0.05:start_threshold=-50dB," +
  "areverse," +
  "silenceremove=start_periods=1:start_silence=0.05:start_threshold=-50dB," +
  "areverse,loudnorm=I=-16:TP=-1.5:LRA=11";

console.log(`\n▶ Optimizing ${input}`);

execFileSync("ffmpeg", [
  "-y", "-i", input,
  "-ac", "1", "-ar", "44100", "-b:a", BITRATE, "-af", trim,
  OUT_MP3,
], { stdio: "inherit" });

// OGG is a nice-to-have; some ffmpeg builds lack libvorbis. Don't fail on it —
// MP3 alone already covers every modern browser, including iOS/Safari.
let oggOk = false;
try {
  execFileSync("ffmpeg", [
    "-y", "-i", input,
    "-ac", "1", "-ar", "44100", "-c:a", "libvorbis", "-q:a", "2", "-af", trim,
    OUT_OGG,
  ], { stdio: "inherit" });
  oggOk = true;
} catch {
  console.warn("\n⚠ Skipped song.ogg (this ffmpeg build has no libvorbis). MP3 is enough.");
}

console.log(`\n✓ Wrote:`);
console.log(`   ${OUT_MP3}  (${kb(OUT_MP3)})`);
if (oggOk) console.log(`   ${OUT_OGG}  (${kb(OUT_OGG)})`);
console.log(`\nCommit the output(s) so Vercel serves them, then the player goes live.\n`);
