# 📑 SongVibe Master Changelog

Welcome to the Master Changelog for **SongVibe Ultimate Pro**. This document provides a high-level overview of version history. For granular details, please see:
- [Features Log](CHANGELOG-FEATURES.md)
- [Bug Fixes Log](CHANGELOG-BUGS.md)

---

## [v9.0.0] - Immersive Sync & Smart Sorting Upgrade
**Major Audio & Layout Overhaul**
- **Scroll Freeze Fixed:** Removed conflicting CSS `scroll-behavior: smooth` and synchronized custom JS smooth scrolling to prevent stuttering/freezing on lyric click/play.
- **Smart Playlist Auto-Sort:** Integrates background YouTube video health check. Active/working links dynamically rise to the top of the sidebar.
- **Sidebar Status Badges:** Added green (working) and red (blocked) indicators next to each song card.
- **Immersive Timing Spacing:** Increased spacing (gap to `28px`) and line-height (`1.5`) to eliminate lyric line overlaps.
- **Dynamic Vertical Position Scroll:** Active lyrics scroll safely above player controls at `Bottom` position (58% down) to prevent timeline overlay cut-offs.
- **Real-Time Offset Control & Volume:** Added physical buttons (`-0.5s`, `+0.5s`) and a volume slider directly onto the Player Controls bar.
- **Audio-Reactive Particle System:** GPU-accelerated canvas background particles now expand, speed up, and glow to the music beat.

---

## [v8.0.0] - Professional Studio Upgrade
**Native Export & Device Hardware Mockups**
- **Native Video Export:** Integrated native recording using HTML5 MediaRecorder.
- **Smart Cropping Engine:** Automatically crops screen capture output to the selected mockup container (9:16 or 4:3) with zero black bars or UI overlays.
- **Physical Device Frame Mockups:** Added real-size smartphone frames (Mobile 9:16) and wide bezels (Tablet 4:3) with CSS volume/power buttons.
- **3-Sec Recording Countdown:** professional animated countdown overlay when starting tab recording.
- **60FPS GPU Acceleration:** Upgraded timeline engine to 60Hz requestAnimationFrame display sync loop.

---

## [v7.0.0] - Mobile Mockup & LRCLib
**Auto-fetch & Custom Spectrum**
- **Auto-Fetch (LRCLib):** Dynamic sync lyrics search and import by Title & Artist.
- **Spectrum Visualizer Modes:** Added Apple (Curve), DJ (Segmented), Retro, Radial, and Immersive spectrum modes.
- **Duet Highlighting:** Lyrics wrapped in parentheses `(like this)` automatically highlight in pink.
- **Drag-to-Scrub Timeline:** Smooth progress bar scrubbing with instant playback seek.

---

## [v6.0.0] - Heart Wave & Sync Engine
**Major Fixes & Visual Upgrades**
- **Heart Wave Loader:** Integrated a beautiful F(x) mathematical Heart Wave animated SVG loader that displays while YouTube videos buffer or load.
- **Micro-second Sync Precision:** Lowered the global lyric polling interval from 150ms to 50ms for absolutely flawless real-time karaoke highlight synchronization.
- **Autoplay Engine Rewrite:** Completely eliminated YouTube Iframe API state-locking bugs on song transitions by injecting a 250ms asynchronous `setTimeout` queue.
- **Start-up Autoplay Fix:** Replaced `loadVideoById` with `cueVideoById` during app initialization to prevent strict browsers from blocking autoplay and permanently bricking the player state.
- **New Hindi Hits Added:** Synced, formatted, and added three new classic songs ("Jeene Laga Hoon", "Tu Agar Meri", and "Khairiyat") into the native database!

---

## [v5.0.0] - Ultimate Pro Upgrade
**Major Overhaul & Enhancements**
- **Dual Language Engine:** Integrated regex-based language detection (`/[\u0900-\u097F]/`) to dynamically apply distinct premium fonts (`Yatra One` for Hindi, `Poppins` for English) on a line-by-line basis.
- **Cinematic Text Animations:** Added an entire suite of 22 modern `@keyframes` including Glitch, Ken Burns, Fade Up In, Pop In, Neon Flash, and Jello.
- **Spotify Typewriter:** Reworked the Typewriter algorithm to render word-by-word via sequenced `transition-delay` inline variables, effectively creating a karaoke-like effect perfectly synced to the music.
- **Original Glow Restored:** Brought back the beloved original `glow` animation from older builds and set it as the default animation.
- **Premium Moving Gradients:** Transformed static backgrounds into animated radial gradients. Added Midnight Mesh, Deep Ocean, Sunset, Rose Gold, Vaporwave, and Spotify Green.
- **Smart Alignment Flexbox:** Solved long-standing UI layout bugs where manual Top/Bottom/Left/Right alignments conflicted with the Auto-Center mode by dynamically altering Flexbox padding and `alignItems` through JavaScript.
- **YouTube Error Catcher:** Added `onError` event handling to the YouTube IFrame API to catch copyright block codes (101/150) and notify users immediately.

---

## [v4.0.0] - Pro Production Build
**Features**
- **Reel Recording:** Added HTML5 `MediaRecorder` support for natively capturing video output in the browser.
- **Custom Uploads:** Users can now upload their own `.mp4`/`.webm` or `.jpg`/`.png` backgrounds for absolute creative freedom.
- **9:16 Aspect Ratio Lock:** Added a toggle to enforce mobile aspect ratios for desktop monitors, ensuring perfect recordings for Instagram and YouTube Shorts.
- **Hybrid Player Engine:** Integrated an invisible HTML5 Audio instance alongside the YouTube API. Both use the unified progress slider and play buttons.
- **Pill UI:** Replaced all `<select>` inputs with `.pill-row` multi-state buttons for an elegant premium feel.
- **Built-in Guide:** Added a step-by-step modal guide detailing how to use Gemini to rip and sync lyrics directly from YouTube.

---
*Maintained by the SongVibe Development Team.*
