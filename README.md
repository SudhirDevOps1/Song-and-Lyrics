# 🎵 SongVibe Ultimate Pro

Welcome to **SongVibe Ultimate Pro** – The most advanced web-based Lyric Video & Reel Maker. 
This tool lets you sync, customize, and record breathtaking lyric videos natively in your browser with zero delay.

---

## 🚀 Production Features
- **Smart Audio Wave Sync:** Procedural audio visualizer that perfectly bounces and syncs with the lyrics in real-time.
- **Smart Auto-Scroll Focus:** The active lyric line is always dynamically centered on the screen. Manual scrolling is supported with a 3-second auto-resume timer.
- **Cinematic Text Animations (22+ Options):** Choose from Typewriter, Fade Up, Slide In, Pop In, Blur Drop, Glitch, Neon Flash, Wave, Ken Burns, Glow Pulse, and many more.
- **Premium Animated Themes:** Animated moving gradients for Midnight Mesh, Deep Ocean, Vaporwave, Sunset, Rose Gold, Neon Dark, and the classic Spotify Green.
- **Dual Language Font Engine:** Automatically detects Hindi (`Yatra One`) and English (`Poppins`) characters in the same song and renders them with beautiful contrasting typography.
- **Spotify-Style Real-time Typing:** Word-by-word karaoke-style text fill that syncs smoothly with the music cadence.
- **Advanced Customization Panel:** Manual sliders for Lyrics Size, Neon Glow intensity, Alignment (Left/Center/Right), and Vertical Positioning (Top/Middle/Bottom).
- **YouTube Restriction Detector:** Seamlessly handles official YouTube videos that block embedding and alerts the user to use an alternative link.

---

## 📸 Step-by-Step Visual Guide (How to Use)

Follow these simple steps to extract time-synced lyrics directly from YouTube using Gemini and play them in SongVibe!

### Step 1: Find your song
Search for your song name on YouTube.
![Search song name](img/step1.png)

### Step 2: Copy the Link
Click on the **Share** button and copy the YouTube link.
![Copy link](img/step2.png)

### Step 3: Ask Gemini
Click on the **"Ask"** ✨ button (Gemini integration in YouTube).
![Ask Gemini](img/step3.png)

### Step 4: Request Timestamps (Use these Prompts)
Copy one of the prompts below based on your preferred language and paste it into Gemini. This will force Gemini to give you a perfectly color-coded, time-synced JSON block that you can directly paste into your app!

**For Hinglish Lyrics (Recommended)**
```text
Is YouTube video gaane ke pure lyrics Hinglish (English alphabet mein Hindi) mein nikal kar do. 
Mujhe output ek valid JSON format mein chahiye, bilkul is example ki tarah:

{
    "id": "song_tu_agar_meri",
    "title": "Tu Agar Meri",
    "artist": "Arijit Singh",
    "youtubeUrl": "https://youtu.be/GVizJ_jpUnw",
    "lyrics": [
        "(0:21 - 0:35): [#00ffff] Tu agar meri ye hawayein teri, tu agar meri saari raahein teri, tu agar meri main hoon tera",
        "(0:36 - 0:50): [#ff00ff] Tu agar meri ye ujale tere, tu agar meri dil hawale tere, tu agar meri main hoon tera",
        "(0:51 - 1:05): [#ff9900] Betab sa mohabbat ka tu inqalab hai, mera jahan teri baahon mein khwab khwab hai",
        "(1:06 - 1:35): [#00ff00] Gehra hua, gehra hua, rang aashiqi, gehra hua, gehra hua, gehra hua, gehra hua",
        "(2:08 - 2:27): [#00ffff] Palkein jhapakta hai aasman, laakhon farishton ki hai tu jaan, wo poochte hain rehti kahan, meri baahon mein rehti unko bata",
        "(2:28 - 2:47): [#ff00ff] Palkein jhapakta hai aasman, usne bhi tujh sa dekha kahan, hai raunakein wahan tu hai jahan, meri baahon mein rehna yahi hai dua",
        "(2:48 - 3:08): [#ff9900] Tu agar meri hai fasana tera, tu agar meri to jamana tera, tu agar meri main hoon tera",
        "(3:41 - 3:55): [#00ff00] Ni sa ga sa ga ma pa ga ma re, ni sa ga sa ga ma pa ga re sa",
        "(3:56 - 4:25): [#ffff00] Teri mohabbat mein jalna bhi hai, aur tujhse bach ke hi chalna bhi hai, kuch rang apna badalna bhi hai, maine dhalna tere rang mein hai sada, tu chaand hai ik dhadakta hua, chori se mujhko hi takta hua, seene se lag ke chamakta hua, meri jannat ka rasta tu hi to hua"
    ]
}

Gaane ke mood ke hisaab se har line ke liye alag alag vibrant HEX colors use karna (jaise #ff4444, #00ffcc, #ffaa00).
Sirf aur sirf valid JSON block do taaki main seedha copy paste kar saku.
```

**For Pure Hindi Lyrics (Devanagari)**
```text
Is YouTube video gaane ke pure lyrics Hindi font (Devanagari) mein nikal kar do. 
Mujhe output ek valid JSON format mein chahiye, bilkul is example ki tarah:

{
    "id": "song_tu_agar_meri",
    "title": "Tu Agar Meri",
    "artist": "Arijit Singh",
    "youtubeUrl": "https://youtu.be/GVizJ_jpUnw",
    "lyrics": [
        "(0:21 - 0:35): [#00ffff] तू अगर मेरी ये हवाएं तेरी, तू अगर मेरी सारी राहें तेरी, तू अगर मेरी मैं हूं तेरा",
        "(0:36 - 0:50): [#ff00ff] तू अगर मेरी ये उजाले तेरे, तू अगर मेरी दिल हवाले तेरे, तू अगर मेरी मैं हूं तेरा",
        "(0:51 - 1:05): [#ff9900] बेताब सा मोहब्बत का तू इंकलाब है, मेरा जहां तेरी बाहों में ख्वाब ख्वाब है",
        "(1:06 - 1:35): [#00ff00] गहरा हुआ, गहरा हुआ, रंग आशिकी, गहरा हुआ, गहरा हुआ, गहरा हुआ, गहरा हुआ",
        "(2:08 - 2:27): [#00ffff] पलकें झपकता है आसमान, लाखों फरिश्तों की है तू जान, वो पूछते हैं रहती कहां, मेरी बाहों में रहती उनको बता",
        "(2:28 - 2:47): [#ff00ff] पलकें झपकता है आसमान, उसने भी तुझ सा देखा कहां, है रौनकें वहां तू है जहां, मेरी बाहों में रहना यही है दुआ",
        "(2:48 - 3:08): [#ff9900] तू अगर मेरी है फसाना तेरा, तू अगर मेरी तो जमाना तेरा, तू अगर मेरी मैं हूं तेरा",
        "(3:41 - 3:55): [#00ff00] नी सा गा सा गा मा पा गा मा रे, नी सा गा सा गा मा पा गा रे सा",
        "(3:56 - 4:25): [#ffff00] तेरी मोहब्बत में जलना भी है, और तुझसे बच के ही चलना भी है, कुछ रंग अपना बदलना भी है, मैंने ढलना तेरे रंग में है सदा, तू चांद है इक धड़कता हुआ, चोरी से मुझको ही तकता हुआ, सीने से लग के चमकता हुआ, मेरी जन्नत का रस्ता तू ही तो हुआ"
    ]
}

Gaane ke mood ke hisaab se har line ke liye alag alag vibrant HEX colors use karna (jaise #ff4444, #00ffcc, #ffaa00).
Sirf aur sirf valid JSON block do taaki main seedha copy paste kar saku.
```

**For English Lyrics**
```text
Extract the full lyrics of this YouTube video song in English. 
Provide the output as a valid JSON object, strictly following this example:

{
    "id": "song_tu_agar_meri",
    "title": "Tu Agar Meri",
    "artist": "Arijit Singh",
    "youtubeUrl": "https://youtu.be/GVizJ_jpUnw",
    "lyrics": [
        "(0:21 - 0:35): [#00ffff] If you are mine, these winds are yours, if you are mine, all paths are yours, if you are mine, I am yours",
        "(0:36 - 0:50): [#ff00ff] If you are mine, these lights are yours, if you are mine, my heart is yours, if you are mine, I am yours",
        "(0:51 - 1:05): [#ff9900] You are a restless revolution of love, my world is a dream in your arms",
        "(1:06 - 1:35): [#00ff00] Deepened, deepened, the color of love, deepened, deepened, deepened, deepened",
        "(2:08 - 2:27): [#00ffff] The sky blinks its eyes, you are the life of millions of angels, they ask where she lives, tell them she lives in my arms",
        "(2:28 - 2:47): [#ff00ff] The sky blinks its eyes, where else has it seen someone like you, there is radiance wherever you are, my prayer is that you stay in my arms",
        "(2:48 - 3:08): [#ff9900] If you are mine, your story is mine, if you are mine, the world is yours, if you are mine, I am yours",
        "(3:41 - 3:55): [#00ff00] Ni sa ga sa ga ma pa ga ma re, ni sa ga sa ga ma pa ga re sa",
        "(3:56 - 4:25): [#ffff00] In your love I have to burn, and save myself from you too, I have to change some of my colors, I always have to mold into your color, you are a beating moon, secretly staring at me, shining close to my chest, you are the path to my heaven"
    ]
}

Assign a different vibrant HEX color to each line based on the mood of the song (e.g., #ff4444, #00ffcc, #ffaa00).
Output strictly a valid JSON block so I can copy and paste it directly.
```
![Request timestamps](img/step4.png)

### Step 5: Copy the Lyrics
Highlight and copy the perfectly time-synced lyrics provided by Gemini.
![Copy lyrics](img/step5.png)

### Step 6: Add to SongVibe
Go to SongVibe. Under **ADD MEDIA**, paste the YouTube link you copied earlier and click the **`+`** button.
![Add media](img/step6.png)

### Step 7: Paste the Lyrics
In the right sidebar (Lyrics Editor), paste the lyrics you copied from Gemini into the large text box.
![Paste lyrics](img/step7.png)

### Step 8: Play and Enjoy!
Click the **Play** button at the bottom of the screen. Your lyrics will perfectly sync with the music! You can now hit the Fullscreen button and record your Reel.
![Play video](img/step8.png)

---
*Built with ❤️ by SongVibe*
