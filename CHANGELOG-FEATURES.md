# 🌟 Features Added (v6 Heart Wave)

## 1. 🫀 Heart Wave Mathematical Loader
- Integrated a purely mathematical SVG animation loader based on the formula `f(x) = |x|^(2/3) + 0.9√(3.3 - x²) sin(6.4πx)`.
- Features 102 individual dynamic SVG particles spinning seamlessly via `requestAnimationFrame`.
- Displays as a gorgeous, blurred overlay above the lyrics visualizer specifically when the YouTube API is buffering or transitioning between tracks.

## 2. 🎵 Native Track Expansion
- Formatted, translated, and color-coded three massive new classic tracks native to the `songs.json` repository:
    - **Tu Agar Meri**
    - **Khairiyat**
    - **Jeene Laga Hoon**

---

# 🌟 Features Added (v5 Ultimate Pro)

This document highlights all the new professional features added to the SongVibe application during the Ultimate Pro overhaul.

## 1. 🌐 Dual Language Font Engine
- Automatically detects Hindi (Devanagari) characters vs English characters inside the lyrics using Regex `/[\u0900-\u097F]/`.
- Applies dual distinct premium Google Fonts dynamically (`Yatra One` for Hindi, `Poppins` for English) for a seamless multilingual aesthetic.

## 2. 🎞️ 22 Cinematic Animations
- Overhauled the animation engine in `style.css` to include 22 cinematic transitions.
- Options include: Typewriter, Fade Up In, Slide In, Pop In, Blur Drop, Glitch, Neon Flash, Wave, Ken Burns, Pan Right, Jello, and the classic Glow Pulse.

## 3. ⌨️ Spotify-Style Karaoke Typing
- Converted the old character-by-character effect into a modern word-by-word animation.
- Syncs rhythmically with the music cadence using dynamic `transition-delay` inline variables, rendering perfectly like Spotify's live lyrics.

## 4. 🎨 Premium Animated Themes
- Replaced flat backgrounds with moving radial gradients.
- Included 5 new premium aesthetics: Midnight Mesh, Sunset Vibes, Deep Ocean, Vaporwave, Rose Gold, Neon Dark.
- Restored the classic vibrant "Spotify Green" as an option.

## 5. 🎯 Smart Auto-Scroll (Focus Mode)
- Advanced Flexbox logic ensures the active singing line is **always** dynamically centered.
- Improved padding calculations for manual Alignment (Left/Center/Right) and Vertical Position (Top/Middle/Bottom) to override centering when required.

## 6. 🚫 YouTube Embed Block Detector
- Added robust error handling using the `onError` event from the YouTube IFrame API.
- Automatically detects error code 101/150 (Video restricted by owner, e.g. T-Series) and alerts the user to use an alternative Lyrical video link.

## 7. 🎬 In-Browser Reel Recording (Export to Video)
- Added a `Record Reel` button inside the Reel Overlay.
- Integrated the HTML5 `MediaRecorder` API with `navigator.mediaDevices.getDisplayMedia` to capture the screen directly in the browser.
- Automatically saves and downloads a `.webm` file locally when recording stops.

## 8. 🖼️ Custom Background Upload
- Added support for uploading local custom backgrounds for Reel Mode.
- Accepts both `Image` (jpeg, png) and `Video` (mp4, webm) formats.
- Automatically loops and mutes video backgrounds for seamless aesthetic reels.

## 9. 🎵 Hybrid Audio Support (Local + YouTube)
- Complete support for uploading Local Audio (`.mp3` or `.wav`).
- Seamlessly integrated an HTML5 `<audio>` player alongside the hidden YouTube Iframe API.
- Unified play/pause controls and progress bar seeking for both sources.

## 10. 💊 Premium UI Elements
- Replaced all ugly native HTML `<select>` dropdowns with customized `.pill-row` buttons.
- Fully dynamic interaction; clicking a pill visually updates the active state and instantly applies the effect to the App state.

## 11. 📱 Responsive Smart Playlist
- Added dynamic `clamp()` calculation to the playlist container so it seamlessly adapts from 200px (mobile) to 35vh (desktop).
- Implemented a robust global sidebar scroll to ensure the playlist never collapses on small screens while keeping all controls accessible.

## 12. ⚡ Architectural Reliability & Visualizer
- Overhauled YouTube's asynchronous IFrame loading sequence with a `fallbackTimer` to eliminate race conditions.
- Upgraded the Audio Wave visualizer to bypass expensive DOM reads (`classList.contains`) in favor of direct Global State reads (`S.playing`), significantly boosting frame rates and unlocking the intelligent audio wave spikes.
