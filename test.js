const fs = require('fs');
const https = require('https');
const data = JSON.parse(fs.readFileSync('data/songs.json', 'utf8'));

function vidId(url) {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|^shorts\/)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
        return match[2];
    }
    const trimmed = url.trim();
    if (trimmed.length === 11 && /^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
        return trimmed;
    }
    return null;
}

function checkEmbed(title, id) {
    return new Promise((resolve) => {
        https.get(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${id}`, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(body);
                    if (parsed.error) {
                        resolve({ id, title, ok: false, error: parsed.error });
                    } else {
                        resolve({ id, title, ok: true, videoTitle: parsed.title, author: parsed.author_name });
                    }
                } catch (e) {
                    resolve({ id, title, ok: false, error: 'JSON parse error' });
                }
            });
        }).on('error', () => {
            resolve({ id, title, ok: false, error: 'Network error' });
        });
    });
}

async function runCheck() {
    console.log("Checking YouTube links...");
    for (const song of data.songs) {
        const videoId = vidId(song.youtubeUrl);
        if (!videoId) {
            console.log(`⚠️  [NO VIDEO ID] "${song.title}" (Url: ${song.youtubeUrl})`);
            continue;
        }
        const res = await checkEmbed(song.title, videoId);
        if (res.ok) {
            console.log(`✅ [WORKING] "${res.title}" (ID: ${videoId}) -> YT: "${res.videoTitle}" (by ${res.author})`);
        } else {
            console.log(`❌ [BLOCKED/INVALID] "${res.title}" (ID: ${videoId}) -> Error: ${res.error}`);
        }
    }
}
runCheck();
