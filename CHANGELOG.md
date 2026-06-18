# 📑 SongVibe Master Changelog

Welcome to the Master Changelog for **SongVibe Ultimate Pro**. This document provides a high-level overview of version history. For granular details, please see:
- [Features Log](CHANGELOG-FEATURES.md)
- [Bug Fixes Log](CHANGELOG-BUGS.md)

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
