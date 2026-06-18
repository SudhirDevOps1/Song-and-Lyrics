# Changelog

All notable changes to the SongVibe Ultimate Pro project will be documented in this file.

## [Ultimate Pro Version] - 2026-06-18

### Added
- **Massive Font Library**: Added 40+ trending Google Fonts (Poppins, Inter, Outfit, Dancing Script, etc.) via a clean dropdown selector.
- **7-Color Rainbow Theme**: A new dynamic theme that flows 7 beautiful colors across the active lyrics.
- **Per-Line Custom Colors**: Added syntax support `[color:red]` or `[#ff00ff]` directly in the lyrics editor to colorize specific lines.
- **Fullscreen Recording Mode**: Added a dedicated Fullscreen button `[🔲]` to the main lyrics box. This allows the user to expand the core player UI (including the dynamic particle background) to fill the entire screen, making it perfect for clean screen recording (OBS/Game Bar) without the sidebars.
- **Film & Extra Metadata**: Added inputs for "Film / Album" and "Extra Details" in the Editor. These details now beautifully display on the Now Playing screen.
- **Visual Guide**: Added a comprehensive 8-step visual guide to `README.md` explaining how to extract time-synced lyrics from YouTube using Gemini.

### Fixed
- **CSS Layout Breakage**: Fixed a critical CSS issue where renaming `.center` to `.main-content` broke the flex layout, causing the player controls (Play, Pause, Progress Bar) to disappear off-screen.
- **Blank Line Timestamp Interpolation**: Fixed a bug where empty lines in the lyrics editor were being deleted. The parser now intelligently preserves blank lines and automatically calculates/interpolates intermediate timestamps for them, creating perfect instrumental gaps.
- **JSON Parsing Crash**: Bulletproofed the `localStorage` and `songs.json` parser to prevent fatal app crashes if lyrics were accidentally provided as raw strings instead of timestamped objects.
- **Zero-Delay Sync**: Verified and optimized the `requestAnimationFrame` timing loop to guarantee 0-millisecond delay accuracy between the audio track and lyric highlighting.
