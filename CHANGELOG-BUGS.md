# 🛠️ Bugs Fixed (v4 & v5 Upgrade)

This document highlights the major bugs and layout issues resolved in the SongVibe application overhaul.

## 1. 🐛 JSON "Live Fetch" Sync Bug
**The Problem**: The app was previously bypassing the `songs.json` file if it found *any* existing data in the browser's `localStorage`. This meant that if the developer edited lyrics in the JSON file directly, users wouldn't see the updates without clearing their site data.
**The Fix**: Rewrote the `loadJSON` logic. Now, on every load, the app fetches `songs.json` and intelligently merges it with `localStorage`. If a song already exists in the cache but its lyrics or metadata changed in the JSON file, the app updates the cached version automatically.

## 2. 🐛 Editor Textarea Overlapping UI (Layout Crash)
**The Problem**: The Lyrics Editor `<textarea>` was using `flex: 1` inside a container without strict bounds. When filled with long text, it pushed elements outside the screen and physically overlapped the "Animation Style" and "Lyrics Font" buttons, making them unclickable.
**The Fix**: Removed the inline `flex` styles. Assigned a strict `height: 180px` and `resize: vertical` to the textarea. Wrapped the flex layout properly in CSS to ensure the editor column handles scrolling gracefully without overlapping its siblings.

## 3. 🐛 Malformed SVG Error Injection
**The Problem**: If a YouTube thumbnail or local image failed to load, the `onerror` fallback string attempted to inject a raw SVG (`ICO.music`). The double-quotes within the SVG conflicted with the `onerror` attribute, breaking the HTML structure and rendering raw `'">` text alongside a massive broken icon across the screen.
**The Fix**: Escaped the JS string interpolation properly and replaced the raw SVG injection with a simple, safe text emoji fallback (`🎵`) within a correctly encapsulated `<div>`.

## 4. 🐛 General UI Bleed & Responsiveness
**The Problem**: The central lyrics display box bled out of its container on smaller screens.
**The Fix**: Applied strict `min-height: 0` limiters on the grid containers and proper `overflow-y: auto` to ensure scrollbars appear inside the containers rather than pushing the entire layout off-screen.

## 5. 🐛 Typewriter Animation Wrapping
**The Problem**: The previous typewriter animation split text by character (`c`). If a long word reached the end of the line mid-animation, it would break the word in half.
**The Fix**: Changed the JS parser to split text by spaces (`w`), wrapping entire words in `<span>` tags. The animation now flows smoothly and respects standard word-wrapping rules.
