# 🐛 Bugs Fixed

## v9.1 Bugs Fixed

### 1. 🐛 Discarded Song Metadata on Fetch/Merge
- **Issue:** When the application loaded song databases from `songs.json`, it would build the internal song object by omitting `film` and `details` fields, which prevented movie details from displaying.
- **Fix:** Corrected `loadJSON` and `addSong` mapping functions to capture, preserve, and render `film` and `details` metadata on the main layout.

### 2. 🐛 Device Mockup Glow Compatibility
- **Issue:** Setting `--current-lyric-glow` as a HEX8 string (e.g. `#ff444473`) caused some mobile/desktop WebViews to fail rendering the shadow.
- **Fix:** Implemented a javascript `hexToRgba()` converter to output universally supported standard `rgba()` CSS declarations.

---

# 🐛 Bugs Fixed (v9.0 Immersive Sync & Smart Sorting Upgrade)

## 1. 🐛 Browser Scroll Freezing & Stutters
**Issue:** "kisi linr pr click karne ke bad hylight ...etc work k r raha hain uske bad scrool freez hain". Programmatic scroll position updates via requestAnimationFrame were conflicting with the browser's native CSS `scroll-behavior: smooth` on `.lyrics-box`, locking the layout thread and freezing manual/auto scrolling.
**Fix:** Removed the conflicting CSS `scroll-behavior: smooth;` rule, allowing the JS-based custom `fastScrollCenter` script to update the scrollbar smoothly and instantly without stuttering.

## 2. 🐛 Bottom Lyrics Position Overlap & Cut-offs
**Issue:** When selecting `Vertical Position: Bottom`, the active lyric scrolled so far down that it collided with the absolute-positioned Player Controls timeline bar, getting cut off or hidden. Furthermore, long lyric lines scaled to 1.15x would overlap with adjacent lines.
**Fix:** 
- Programmed `fastScrollCenter` to scroll active lines to **58%** from the top of the viewport (safely above the timeline) when set to Bottom position.
- Increased text `line-height` to `1.5` and `.lyrics-scroll` row `gap` to `28px` to ensure there is plenty of vertical margin even when lines wrap or scale.
- Kept lyrics container padding at `50vh 0` constant to prevent scrolling boundary blocks.

## 3. 🐛 Missing Volume Controls in HTML
**Issue:** The CSS defined styles for `.vol-row` and `.vol-slider`, but the volume slider was completely missing from `index.html`.
**Fix:** Integrated a customized volume range input slider directly next to the player controls in `index.html` and bound it to both HTML5 Audio and YouTube Player API volume states in `app.js`.

---

# 🐛 Bugs Fixed (v6 Heart Wave)

## 1. 🐛 Autoplay Engine Race Condition & Hangs
**Issue:** "yesa banao ek ke bad ek song play hone lage". When a YouTube video ended, calling `loadVideoById` or `playVideo` exactly at the moment of the `ENDED` state event would lock the YouTube Iframe API internal state stack, causing the next song to freeze indefinitely on many browsers.
**Fix:** Introduced an asynchronous 250ms `setTimeout` queue to the `doNext` call when either YouTube or Local audio triggers the `ended` event. This allows the player to correctly exit its state machine before initializing the next track.

## 2. 🐛 Start-up Autoplay Blocking & Player Brick
**Issue:** "first bar web app start krne pr song ya ..etc work nahi kr raha hain". When the app loaded, it tried to immediately fire `loadVideoById`. Modern browsers aggressively block autoplay without user interaction, throwing a silent error and permanently corrupting the YouTube player state until the page was reloaded.
**Fix:** Refactored the `onYouTubeIframeAPIReady` startup logic to intelligently use `cueVideoById` instead. The video is silently pre-loaded without violating browser policies, and will instantly play when the user clicks the Play button.

## 3. 🐛 Lyrics Highlight Latency & Micro-Desync
**Issue:** "kabhi kabhi song lyrics same time pr nahi ho rahein hin". The JavaScript polling loop checking the audio/video progress was running at an interval of 150ms. This caused up to 150ms of visual latency, making the karaoke highlights feel slightly out of rhythm.
**Fix:** Slashed the global `startTick()` interval from `150ms` down to `50ms`. The application now updates the lyrics scroll and highlight UI 20 times a second, completely eliminating desynchronization.

---

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

## 6. 🐛 Playlist Flexbox Collapse & Overlap
**Issue:** On smaller screens, CSS Grid and Flexbox intrinsic sizing bugs caused the `Playlist` to collapse to 0 height (disappearing entirely) or overlap with the Theme labels.
**Fix:** Refactored the left sidebar by adding explicit `min-height: 0` and `height: 100%` constraints to the Grid columns. Replaced the expanding `flex: 1` playlist with a `height: clamp(200px, 35vh, 500px)` fixed-height container and made the entire sidebar globally scrollable via `overflow-y: auto`.

## 7. 🐛 Inline Custom Color Override Bug
**Issue:** When users specified custom inline hex colors (e.g. `[#00ffff]`), the color failed to apply to non-typewriter animations because the `.ll.active` CSS rule explicitly enforced `color: var(--text-1)`.
**Fix:** Updated the regex parser in `app.js` to inject `color: ${col} !important;` into the inline style tag, forcing the custom color to take precedence over the stylesheet.

## 8. 🐛 Wave Animation Not Triggering
**Issue:** The `wave` animation requires individual letters to be wrapped in `<span class="c">` to stagger the delay. The javascript only wrapped spans for the `typewriter` animation, breaking the `wave` animation completely.
**Fix:** Expanded the condition in `app.js` to generate `<span>` elements if `S.anim === 'typewriter' || S.anim === 'wave'`.

## 9. 🐛 YouTube API Race Condition & Playback Spam
**Issue:** "Sometimes it plays, sometimes it doesn't." Immediate calls to `loadFromLocal()` raced against the async YouTube API initialization, causing videos to fail to load. Furthermore, rapid `loadVideoById -> pauseVideo -> playVideo` commands caused the iframe to drop requests and freeze.
**Fix:** Introduced a `ytFallbackTimer` to cleanly wait for the YouTube API. Swapped `loadVideoById` with `cueVideoById` to silently buffer the video without triggering auto-play blocks.

## 10. 🐛 Local Storage Data Wipe by JSON
**Issue:** `loadFromLocal()` mistakenly called `loadJSON()` even after successfully loading local data, which then hard-synced and permanently overwrote the user's custom `localStorage` with `songs.json`.
**Fix:** Added an explicit `return;` statement upon successfully parsing local storage to prevent the destructive fallback.

## 11. 🐛 Audio Wave Visualizer Permanently Frozen
**Issue:** The `requestAnimationFrame` loop for the Audio Wave visualizer checked `document.body.classList.contains('playing')`, but the `playing` class was applied to `.now-playing`, rendering `isPlaying` perpetually false.
**Fix:** Replaced the expensive DOM lookup with a highly-performant direct state check (`S.playing`), restoring the reactive audio wave spikes and ambient visualizer movement.
