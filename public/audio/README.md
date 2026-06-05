# Background music — drop-in instructions

The invitation can play one looping background track. The audio player
(`src/components/Audio.astro`) is already wired up. It stays **hidden** until a
valid audio file exists here, so nothing breaks while this folder is empty.

## To enable music

1. Obtain the track **legally** (see legal note below).
2. Drop the file(s) into this folder using these exact names:
   - `song.mp3`  ← required (broad browser support)
   - `song.ogg`  ← optional, improves Safari/iOS reliability
3. That's it. The floating music toggle will appear and the track will start
   when the visitor taps **"Buka Undangan"**.

To change the filename, edit the `src` prop where `<Audio />` is used in
`src/components/Invitation.astro`.

## Recommended: let the optimizer do it (lightweight + seamless loop)

Drop your raw track as `public/audio/song-src.<ext>` (mp3/wav/m4a/…), then:

```bash
brew install ffmpeg        # one-time, if not installed
npm run audio:optimize     # or: npm run audio:optimize -- path/to/track.wav
```

This writes `song.mp3` + `song.ogg` — **mono, ~96 kbps, loudness-normalized,
with start/end silence trimmed** so the loop is gapless and the file stays
small (typically a few hundred kB for a short loop). Commit both outputs.

Manual encoding target if you prefer: MP3 ~96–128 kbps, mono, trimmed.

### Playback behaviour

The track is `preload="auto"` (buffered ahead of time) and starts **the instant
the visitor taps "Buka Undangan"** — browsers forbid autoplay-with-sound before a
user gesture, so opening the invitation is the earliest legal moment. A floating
toggle lets them pause/resume; the choice is remembered.

## ⚠️ Legal note — do NOT commit copyrighted audio

This site is public, so playing music = "communication to the public" and
copyright applies. Only use audio that is one of:

- a **free-distribution dharma recording** (法布施 / 免費結緣) from the temple
  or a Buddhist foundation that permits non-commercial reproduction, or
- **Creative Commons / CC0 / royalty-free** (license allows website use), or
- a track you have a **license or written permission** to use.

Do **not** rip audio from YouTube — it violates YouTube's Terms of Service
regardless of the song's copyright status.

Note: the audio file **must be committed to git** for Vercel to serve it in
production — so only ever commit a track you've legally cleared.
