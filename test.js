const fs = require('fs');
const S = { speed: 'medium' };
const SPEED = { slow: 4, medium: 3, fast: 2 };

function parseLyrics(text) {
    const lines = text.split('\n');
    const res = [];
    const re = /^(?:\[|\()(\d+):([\d.]+).*?(?:\]|\))\s*:?\s*(.*)/;
    const hasTm = lines.some(l => re.test(l));
    
    if (hasTm) {
        lines.forEach((l, i) => {
            const m = l.match(re);
            if (m) {
                res.push({ explicit: true, time: +m[1]*60 + parseFloat(m[2]), text: m[3].trim() });
            } else if (l.trim() === '') {
                res.push({ explicit: false, isBlank: true, text: '' });
            } else {
                res.push({ explicit: false, isBlank: false, text: l.trim() });
            }
        });
        
        for (let i = 0; i < res.length; i++) {
            if (!res[i].explicit) {
                let prev = 0;
                for (let j = i - 1; j >= 0; j--) { if (res[j].explicit) { prev = res[j].time; break; } }
                let next = prev + 10;
                for (let j = i + 1; j < res.length; j++) { if (res[j].explicit) { next = res[j].time; break; } }
                
                if (res[i].isBlank) res[i].time = prev + Math.min(2, (next - prev) / 2);
                else res[i].time = prev + Math.min(3, (next - prev) / 2);
                
                res[i].explicit = true; 
            }
        }
        res.sort((a,b) => a.time - b.time);
        return res.map(x => ({ time: x.time, text: x.text }));
    } else {
        const gap = SPEED[S.speed]||3;
        lines.filter(l=>l.trim()).forEach((l,i) => res.push({ time: i*gap, text: l.trim() }));
        return res;
    }
}

const data = JSON.parse(fs.readFileSync('data/songs.json', 'utf8'));
data.songs.forEach((song, idx) => {
    console.log(`\nSong ${idx + 1}: "${song.title}" - ${song.artist}`);
    const parsed = parseLyrics(song.lyrics.join('\n'));
    console.log(`Parsed ${parsed.length} lines. First line time: ${parsed[0]?.time}s, text: "${parsed[0]?.text}"`);
    // Print a few lines for verification
    if (parsed.length > 2) {
        console.log(`Second line time: ${parsed[1]?.time}s, text: "${parsed[1]?.text}"`);
    }
});
