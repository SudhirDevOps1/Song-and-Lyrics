# 🐛 Bugs Fixed (v5 Ultimate Pro)

This document tracks all the critical bugs that were identified and successfully resolved during the Ultimate Pro updates.

## 1. 🐛 YouTube Embed Silently Failing
**Issue:** If a user attempted to load a video restricted from embedding by copyright owners (like T-Series), the YouTube IFrame API silently failed without throwing a Javascript error. The app would appear frozen ("song hi nahi play ho raha hain").
**Fix:** Added an `onError` listener (`onYtError`) to the IFrame API instantiation to specifically catch error codes 101 and 150. Now displays a clear, localized Toast message alerting the user to use a different link.

## 2. 🐛 Karaoke Typewriter Delay Desync
**Issue:** When changing the `.a-typewriter` logic to animate word-by-word, using `animation-delay` did not work because the `.c` elements animate via CSS `transition`, not `@keyframes`.
**Fix:** Switched inline CSS from `animation-delay` to `transition-delay: ${wi * 0.15}s`, ensuring perfectly synchronized Spotify-style typing over the track.

## 3. 🐛 Vertical Position & Alignment Override
**Issue:** Because `.lyrics-scroll` was wrapped in a Flexbox container with `padding: 50vh 0` (for auto-scroll centering), clicking manual `Vertical Position (Top/Bottom)` or `Alignment (Left/Right)` did not properly align the lyrics to the edges.
**Fix:** Added explicit logic in `app.js` to modify `.lyrics-scroll.style.alignItems` and dynamically recalculate `padding` (e.g. `10vh 0 50vh 0` for Top) when the user clicks the pill buttons.

## 4. 🐛 Local Storage Syncing Collision
**Issue:** If a user reloaded the page before explicitly clicking "Reload JSON", the app would load old state variables from `localStorage` but fail to sync with the new string-based `lyrics` arrays added to `songs.json`.
**Fix:** Hardened the Regex parser in `loadJSON()` so it seamlessly evaluates both string arrays and pre-parsed objects, ensuring smooth backward compatibility.

## 5. 🐛 Missing Keyframes for Advanced Animations
**Issue:** When adding 22 new cinematic animations via `app.js`, the corresponding `@keyframes` were initially absent in `style.css`, causing the lyrics to stay permanently blurry/invisible.
**Fix:** Generated and mapped 22 customized `@keyframes` (e.g., `fadeUpIn`, `glitch`, `kenBurns`) and integrated them into `style.css`.
