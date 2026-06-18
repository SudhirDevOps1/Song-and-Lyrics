/* ============================================
   SONGVIBE v4 — Ultra Premium
   YouTube + Local Media + Full Customization
   ============================================ */
(function () {
    'use strict';

    const $ = s => document.querySelector(s);
    const $$ = s => document.querySelectorAll(s);

    /* ─── DOM ─── */
    const songList    = $('#songList');
    const ytUrl       = $('#ytUrl');
    const ytAdd       = $('#ytAdd');
    const localAudio  = $('#localAudio');
    const localThumb  = $('#localThumb');
    const loadJsonBtn = $('#loadJsonBtn');

    const npTitle     = $('#npTitle');
    const npArtist    = $('#npArtist');
    const npImg       = $('#npImg');
    const nowPlaying  = $('.now-playing');
    const lyricsScroll = $('#lyricsScroll');

    const bPlay     = $('#bPlay');
    const bPrev     = $('#bPrev');
    const bNext     = $('#bNext');
    const bShuffle  = $('#bShuffle');
    const bRepeat   = $('#bRepeat');
    const progTrack = $('#progTrack');
    const progFill  = $('#progFill');
    const tCur      = $('#tCur');
    const tTot      = $('#tTot');
    const iPlay     = $('#iPlay');
    const iPause    = $('#iPause');

    const edTitle   = $('#edTitle');
    const edArtist  = $('#edArtist');
    const edLyrics  = $('#edLyrics');
    const applyBtn  = $('#applyBtn');

    const reelEl    = $('#reel');
    const reelCd    = $('#reelCd');
    const reelBody  = $('#reelBody');
    const reelWm    = $('#reelWm');
    const reelT     = $('#reelT');
    const reelA     = $('#reelA');
    const reelBtn   = $('#reelBtn');
    const reelX     = $('#reelX');
    const reelCanvas = $('#reelCanvas');

    const reelBgUpload = $('#reelBgUpload');
    const removeBgBtn  = $('#removeBgBtn');
    const reelBgImg    = $('#reelBgImg');
    const reelBgVid    = $('#reelBgVid');
    const recordBtn    = $('#recordBtn');

    const sizeRange     = $('#sizeRange');
    const glowRange     = $('#glowRange');
    const canvas        = $('#particleCanvas');

    const audioEl = $('#localPlayer'); // Local HTML5 Audio

    /* ─── STATE ─── */
    const S = {
        songs: [],
        idx: -1,
        playing: false,
        lyrics: [],
        lyricIdx: -1,
        anim: 'typewriter',
        speed: 'medium',
        theme: 'neon',
        shuffle: false,
        repeat: false,
        reel: false,
        vol: 80,
        lyricsFont: 'Poppins',
        lyricsSize: 1.8,
        particleMode: 'normal',
        glowLevel: 60,
        align: 'center',
        pos: 'center',
        source: 'none' // 'yt' or 'local'
    };

    const SPEED = { slow: 4, medium: 3, fast: 2 };

    /* ═══ SVG ICONS ═══ */
    const ICO = {
        play: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>',
        pause: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>',
        music: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>',
        x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
    };

    /* ═══ YOUTUBE PLAYER ═══ */
    let yt = null;
    let ytOk = false;
    let ticker = null;

    window.onYouTubeIframeAPIReady = function () {
        ytOk = true;
        yt = new YT.Player('ytPlayer', {
            height: '1', width: '1',
            playerVars: { autoplay:0, controls:0, disablekb:1, fs:0, modestbranding:1, rel:0 },
            events: { onReady: () => { if(yt) yt.setVolume(S.vol); loadFromLocal(); }, onStateChange: onYtState },
        });
    };

    function onYtState(e) {
        if (S.source !== 'yt') return;
        if (e.data === YT.PlayerState.PLAYING) { setPlayState(true); }
        else if (e.data === YT.PlayerState.PAUSED) { setPlayState(false); }
        else if (e.data === YT.PlayerState.ENDED) {
            setPlayState(false);
            if (S.repeat) { yt.seekTo(0); yt.playVideo(); } else doNext();
        }
    }

    /* ═══ LOCAL AUDIO PLAYER ═══ */
    audioEl.addEventListener('play', () => { if(S.source==='local') setPlayState(true); });
    audioEl.addEventListener('pause', () => { if(S.source==='local') setPlayState(false); });
    audioEl.addEventListener('ended', () => {
        setPlayState(false);
        if (S.repeat) { audioEl.currentTime=0; audioEl.play(); } else doNext();
    });

    /* ═══ UNIFIED PLAYBACK ═══ */
    function setPlayState(isPlaying) {
        S.playing = isPlaying;
        iPlay.style.display  = isPlaying ? 'none' : 'block';
        iPause.style.display = isPlaying ? 'block' : 'none';
        isPlaying ? nowPlaying.classList.add('playing') : nowPlaying.classList.remove('playing');
        isPlaying ? startTick() : stopTick();
        renderList(); // update active icon
    }

    function play() {
        if (S.idx < 0) return;
        try {
            if (S.source === 'yt' && yt) yt.playVideo();
            else if (S.source === 'local') audioEl.play();
        } catch(e){}
    }
    
    function pause() {
        try {
            if (S.source === 'yt' && yt) yt.pauseVideo();
            else if (S.source === 'local') audioEl.pause();
        } catch(e){}
    }

    function toggle() { S.playing ? pause() : play(); }

    function getCurTime() {
        if (S.source === 'yt' && yt && yt.getCurrentTime) return yt.getCurrentTime();
        if (S.source === 'local') return audioEl.currentTime;
        return 0;
    }
    function getDuration() {
        if (S.source === 'yt' && yt && yt.getDuration) return yt.getDuration();
        if (S.source === 'local') return audioEl.duration;
        return 0;
    }
    function seekTo(sec) {
        if (S.source === 'yt' && yt && yt.seekTo) yt.seekTo(sec, true);
        if (S.source === 'local') audioEl.currentTime = sec;
    }

    /* ═══ TICKER & SYNC ═══ */
    function startTick() {
        stopTick();
        ticker = setInterval(() => {
            const c = getCurTime() || 0;
            const d = getDuration() || 0;
            progFill.style.width = (d > 0 ? (c/d)*100 : 0) + '%';
            tCur.textContent = fmt(c);
            tTot.textContent = fmt(d);
            syncLyric(c);
        }, 150);
    }
    function stopTick() { if (ticker) { clearInterval(ticker); ticker = null; } }

    /* ═══ VIDEO ID EXTRACT ═══ */
    function vidId(url) {
        if (!url) return null;
        let m = url.match(/(?:youtu\.be\/|v=|embed\/|shorts\/|^)([a-zA-Z0-9_-]{11})/);
        return m ? m[1] : null;
    }
    function thumb(id) { return `https://img.youtube.com/vi/${id}/maxresdefault.jpg`; } // high-res

    /* ═══ ADDING MEDIA ═══ */
    function addSong(title, artist, videoId, localUrl, thumbUrl, lyrics) {
        const song = {
            id: 's' + Date.now() + Math.random().toString(36).slice(2,5),
            title: title || 'Untitled', artist: artist || 'Artist',
            videoId: videoId || null, localUrl: localUrl || null,
            thumb: thumbUrl || (videoId ? thumb(videoId) : ''),
            lyrics: lyrics || [],
        };
        S.songs.push(song);
        saveToLocal();
        renderList();
        if (S.songs.length === 1 && S.idx < 0) loadSong(0);
        return song;
    }

    ytAdd.addEventListener('click', () => {
        const id = vidId(ytUrl.value.trim());
        if (!id) return toast('Invalid YouTube URL!');
        addSong('YouTube Song', 'Artist', id, null, null, []);
        ytUrl.value = ''; toast('YouTube song added!');
    });

    localAudio.addEventListener('change', e => {
        const file = e.target.files[0];
        if (!file) return;
        const url = URL.createObjectURL(file);
        const name = file.name.replace(/\.[^/.]+$/, "");
        addSong(name, 'Local File', null, url, null, []);
        toast('Local Audio added!');
        e.target.value = '';
    });

    // Custom Thumbnail Upload
    localThumb.addEventListener('change', e => {
        const file = e.target.files[0];
        if (!file || S.idx < 0) return;
        const reader = new FileReader();
        reader.onload = function(evt) {
            S.songs[S.idx].thumb = evt.target.result;
            npImg.src = evt.target.result;
            saveToLocal(); renderList();
            toast('Thumbnail updated!');
        };
        reader.readAsDataURL(file);
        e.target.value = '';
    });

    /* ═══ LOCAL STORAGE & JSON ═══ */
    function saveToLocal() { localStorage.setItem('songvibe_songs', JSON.stringify(S.songs)); }
    function loadFromLocal() {
        try {
            const saved = localStorage.getItem('songvibe_songs');
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    S.songs = parsed; renderList();
                    if (S.idx < 0) loadSong(0);
                }
            }
        } catch (e) {}
        loadJSON(); // fallback
    }

    loadJsonBtn.addEventListener('click', loadJSON);
    function loadJSON() {
        fetch('data/songs.json?v=' + Date.now()).then(r => r.json()).then(d => {
            if (!d.songs) return;
            let n = 0;
            d.songs.forEach(s => {
                const id = vidId(s.youtubeUrl || '');
                let existing = null;
                if (id) existing = S.songs.find(x => x.videoId === id);
                else existing = S.songs.find(x => x.title === s.title);
                
                let parsedLyrics = [];
                if (Array.isArray(s.lyrics)) {
                    if (s.lyrics.length > 0 && typeof s.lyrics[0] === 'string') {
                        parsedLyrics = parseLyrics(s.lyrics.join('\n'));
                    } else {
                        parsedLyrics = s.lyrics;
                    }
                }
                
                if (existing) {
                    existing.title = s.title || existing.title;
                    existing.artist = s.artist || existing.artist;
                    existing.lyrics = parsedLyrics;
                } else {
                    S.songs.push({
                        id: 's' + Date.now() + Math.random().toString(36).slice(2,5),
                        title: s.title || 'Untitled', artist: s.artist || 'Unknown',
                        videoId: id, localUrl: null, thumb: id ? thumb(id) : '',
                        lyrics: parsedLyrics,
                    }); 
                    n++;
                }
            });
            saveToLocal(); renderList(); 
            if (n>0) toast(`${n} new songs loaded from JSON`);
            else toast('Data synced with JSON!');
            
            if (S.idx < 0 && S.songs.length > 0) loadSong(0);
            else if (S.idx >= 0) {
                S.lyrics = S.songs[S.idx].lyrics;
                if (S.lyrics.length) edLyrics.value = S.lyrics.map(l => `[${fmtStamp(l.time)}] ${l.text}`).join('\n');
                renderLyrics();
            }
        }).catch(e => console.log('No JSON found', e));
    }

    if (!window.YT) loadFromLocal(); // If YT blocked, load anyway

    /* ═══ RENDER SONG LIST ═══ */
    function renderList() {
        if (!S.songs.length) {
            songList.innerHTML = `<div style="text-align:center;padding:40px 16px;opacity:0.4;">
                ${ICO.music}<p>No songs yet</p>
            </div>`; return;
        }
        songList.innerHTML = S.songs.map((s,i) => `
            <div class="song-card ${i===S.idx?'active':''}" data-i="${i}">
                ${s.thumb ? `<img class="sc-thumb" src="${s.thumb}" onerror="this.outerHTML='<div class=\\'sc-thumb-ph\\'>🎵</div>'">` : `<div class="sc-thumb-ph">${ICO.music}</div>`}
                <div class="sc-info">
                    <div class="sc-name">${esc(s.title)}</div>
                    <div class="sc-artist">${esc(s.artist)}</div>
                </div>
                <div style="opacity:${i===S.idx&&S.playing?1:0.3}; transition:0.3s;">
                    ${i===S.idx && S.playing ? ICO.pause : ICO.play}
                </div>
                <button class="sc-del" data-rm="${i}">${ICO.x}</button>
            </div>`).join('');

        songList.querySelectorAll('.song-card').forEach(el => {
            el.addEventListener('click', e => {
                if (e.target.closest('.sc-del')) return;
                loadSong(+el.dataset.i); play();
            });
        });
        songList.querySelectorAll('.sc-del').forEach(b => {
            b.addEventListener('click', e => {
                e.stopPropagation(); const i = +b.dataset.rm;
                S.songs.splice(i,1); saveToLocal();
                if (S.idx===i) { pause(); S.idx=-1; npTitle.textContent='SongVibe'; npImg.src=''; }
                else if (S.idx>i) S.idx--;
                renderList();
            });
        });
    }

    /* ═══ LOAD SONG ═══ */
    function loadSong(i) {
        if (i<0||i>=S.songs.length) return;
        pause();
        S.idx = i;
        const s = S.songs[i];
        npTitle.textContent = s.title;
        npArtist.textContent = s.artist;
        npImg.src = s.thumb || '';
        
        S.lyrics = s.lyrics || [];
        S.lyricIdx = -1;
        edTitle.value = s.title; edArtist.value = s.artist;
        if (s.lyrics.length) edLyrics.value = s.lyrics.map(l => `[${fmtStamp(l.time)}] ${l.text}`).join('\n');
        else edLyrics.value = '';
        renderLyrics(); renderList();

        progFill.style.width = '0%'; tCur.textContent = '0:00'; tTot.textContent = '0:00';

        if (s.localUrl) {
            S.source = 'local';
            if (yt) yt.pauseVideo();
            audioEl.src = s.localUrl;
            audioEl.load();
        } else if (s.videoId) {
            S.source = 'yt';
            audioEl.pause();
            if (yt && yt.loadVideoById) { yt.loadVideoById(s.videoId); yt.pauseVideo(); }
        }
    }

    function doNext() { if(S.songs.length) { loadSong(S.shuffle ? Math.floor(Math.random()*S.songs.length) : (S.idx+1)%S.songs.length); play(); } }
    function doPrev() { if(S.songs.length) { if(getCurTime()>3) { seekTo(0); } else { loadSong((S.idx-1+S.songs.length)%S.songs.length); play(); } } }

    /* ═══ CONTROLS ═══ */
    bPlay.addEventListener('click', toggle);
    bNext.addEventListener('click', doNext);
    bPrev.addEventListener('click', doPrev);
    bShuffle.addEventListener('click', () => { S.shuffle=!S.shuffle; bShuffle.classList.toggle('on',S.shuffle); });
    bRepeat.addEventListener('click', () => { S.repeat=!S.repeat; bRepeat.classList.toggle('on',S.repeat); });

    progTrack.addEventListener('click', e => {
        const r = progTrack.getBoundingClientRect();
        seekTo(Math.max(0,Math.min(1,(e.clientX-r.left)/r.width)) * getDuration());
    });

    document.addEventListener('keydown', e => {
        const t = e.target.tagName;
        if (t==='INPUT'||t==='TEXTAREA') return;
        if (e.key===' ') { e.preventDefault(); toggle(); }
        if (e.key==='Escape'&&S.reel) exitReel();
        if (e.key==='ArrowRight') seekTo(getCurTime()+5);
        if (e.key==='ArrowLeft') seekTo(Math.max(0,getCurTime()-5));
    });

    /* ═══ LYRICS PARSING & SYNC ═══ */
    function parseLyrics(text) {
        const lines = text.split('\n');
        const res = [];
        const re = /^\[(\d+):([\d.]+)\]\s*(.*)/;
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

    applyBtn.addEventListener('click', () => {
        const txt = edLyrics.value.trim();
        S.lyrics = txt ? parseLyrics(txt) : [];
        if (S.idx>=0) {
            const s = S.songs[S.idx];
            s.lyrics = S.lyrics;
            if (edTitle.value.trim()) s.title = edTitle.value.trim();
            if (edArtist.value.trim()) s.artist = edArtist.value.trim();
            saveToLocal(); loadSong(S.idx);
        }
        toast('Changes applied!');
    });

    function renderLyrics() {
        if (!S.lyrics.length) { lyricsScroll.innerHTML = ''; return; }
        const ac = S.anim !== 'typewriter' ? `a-${S.anim}` : '';
        lyricsScroll.innerHTML = S.lyrics.map((l,i) => {
            const textContent = typeof l === 'string' ? l : (l.text || '');
            if (S.anim === 'typewriter') {
                const words = textContent.split(' ').map(w => `<span class="c">${esc(w)}</span>`).join(' ');
                return `<div class="ll" data-i="${i}">${words}</div>`;
            }
            return `<div class="ll ${ac}" data-i="${i}">${esc(textContent)}</div>`;
        }).join('');

        lyricsScroll.querySelectorAll('.ll').forEach(el => {
            el.addEventListener('click', () => { const i = +el.dataset.i; seekTo(S.lyrics[i].time); if(!S.playing)play(); });
        });
    }

    function syncLyric(t) {
        if (!S.lyrics.length) return;
        let ai = -1;
        for (let i=S.lyrics.length-1; i>=0; i--) { if (t>=S.lyrics[i].time-0.1) { ai=i; break; } }
        if (ai !== S.lyricIdx) {
            S.lyricIdx = ai;
            highlight(lyricsScroll, ai);
            if (S.reel) highlight(reelBody, ai);
        }
    }

    function highlight(box, ai) {
        box.querySelectorAll('.ll').forEach((el,i) => {
            el.classList.remove('now','done');
            const chars = el.querySelectorAll('.c');
            if (i===ai) {
                el.classList.add('now');
                if (S.anim==='typewriter') chars.forEach((c,ci) => setTimeout(()=>c.classList.add('v'), ci*40));
                scrollTo(el, box);
            } else if (i<ai) {
                el.classList.add('done');
                chars.forEach(c=>c.classList.add('v'));
            } else {
                chars.forEach(c=>c.classList.remove('v'));
            }
        });
    }

    function scrollTo(el, box) {
        const sr = box.closest('.lyrics-scroll') || box;
        const br = sr.getBoundingClientRect(), er = el.getBoundingClientRect();
        sr.scrollBy({ top: er.top - br.top - br.height/2 + er.height/2, behavior:'smooth' });
    }

    /* ═══ PILL BUTTONS UI HANDLERS ═══ */
    function setupPills(containerId, stateKey, cb) {
        const cont = $('#'+containerId);
        if(!cont) return;
        cont.querySelectorAll('.pill-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                cont.querySelectorAll('.pill-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                S[stateKey] = btn.dataset[stateKey.replace('lyrics','')];
                if (cb) cb(btn.dataset[stateKey.replace('lyrics','')]);
            });
        });
    }

    setupPills('fontPills', 'lyricsFont', (v) => document.documentElement.style.setProperty('--font-lyrics', `'${v}', sans-serif`));
    setupPills('animPills', 'anim', () => { if(S.lyrics.length) renderLyrics(); });
    setupPills('speedPills', 'speed', () => {});
    setupPills('alignPills', 'align', (v) => { 
        document.documentElement.style.setProperty('--lyrics-align', v); 
        lyricsScroll.style.textAlign = v; 
        reelBody.style.textAlign = v;
    });
    setupPills('posPills', 'pos', (v) => { 
        reelBody.style.justifyContent = v; 
    });
    setupPills('formatPills', 'format', (v) => {
        if (v === 'portrait') reelEl.classList.add('fmt-portrait');
        else reelEl.classList.remove('fmt-portrait');
    });
    
    $$('.pill-row .pill-btn[data-theme]').forEach(btn => {
        btn.addEventListener('click', () => {
            btn.parentElement.querySelectorAll('.pill-btn').forEach(b=>b.classList.remove('active'));
            btn.classList.add('active');
            document.body.className = btn.dataset.theme !== 'neon' ? `th-${btn.dataset.theme}` : '';
        });
    });

    sizeRange.addEventListener('input', () => document.documentElement.style.setProperty('--lyrics-size', sizeRange.value + 'rem'));
    glowRange.addEventListener('input', () => {
        const v = glowRange.value / 100;
        document.documentElement.style.setProperty('--accent-glow', `rgba(0,212,255,${(v*0.35).toFixed(2)})`);
        document.documentElement.style.setProperty('--accent-glow-2', `rgba(0,212,255,${(v*0.6).toFixed(2)})`);
    });

    /* ═══ REEL MODE & BACKGROUNDS ═══ */
    reelBgUpload.addEventListener('change', e => {
        const file = e.target.files[0];
        if (!file) return;
        const url = URL.createObjectURL(file);
        if (file.type.startsWith('video/')) {
            reelBgVid.src = url; reelBgVid.style.display = 'block';
            reelBgImg.style.display = 'none'; reelBgVid.play();
        } else {
            reelBgImg.src = url; reelBgImg.style.display = 'block';
            reelBgVid.style.display = 'none';
        }
        removeBgBtn.style.display = 'block';
    });
    removeBgBtn.addEventListener('click', () => {
        reelBgImg.src = ''; reelBgVid.src = '';
        reelBgImg.style.display = 'none'; reelBgVid.style.display = 'none';
        removeBgBtn.style.display = 'none'; reelBgUpload.value = '';
    });

    reelBtn.addEventListener('click', () => {
        if (S.idx<0) return toast('Pehle song load karo!');
        S.reel = true; reelEl.classList.add('on');
        const s = S.songs[S.idx];
        reelT.textContent = s.title; reelA.textContent = s.artist; reelWm.textContent = '';
        reelBody.innerHTML = lyricsScroll.innerHTML; // clone lyrics
        reelBody.style.textAlign = S.align;
        reelBody.style.justifyContent = S.pos;
        if (S.lyricIdx>=0) highlight(reelBody,S.lyricIdx);
        let n=3; reelCd.textContent=n; reelCd.classList.add('pop');
        const iv = setInterval(()=>{
            n--;
            if(n>0){ reelCd.textContent=n; reelCd.classList.remove('pop'); void reelCd.offsetWidth; reelCd.classList.add('pop'); } 
            else { clearInterval(iv); reelCd.classList.remove('pop'); reelCd.textContent=''; seekTo(0); play(); }
        },1000);
        try{ reelEl.requestFullscreen(); }catch(e){}
    });
    
    function exitReel() { S.reel=false; reelEl.classList.remove('on'); try{document.exitFullscreen();}catch(e){} }
    reelX.addEventListener('click', exitReel);

    /* ═══ EXPORT / SCREEN RECORDING ═══ */
    let mediaRecorder = null;
    let recordedChunks = [];
    let isRecording = false;

    recordBtn.addEventListener('click', async () => {
        if (isRecording) {
            mediaRecorder.stop();
            recordBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor" stroke="none" width="16" height="16" style="color:#f43f5e;"><circle cx="12" cy="12" r="10"/></svg> Record Reel';
            recordBtn.style.boxShadow = '0 0 20px rgba(244,63,94,0.4)';
            toast('Processing Video...');
            isRecording = false;
            return;
        }
        try {
            const stream = await navigator.mediaDevices.getDisplayMedia({ video: { displaySurface: 'browser' }, audio: true });
            mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
            mediaRecorder.ondataavailable = e => { if (e.data.size > 0) recordedChunks.push(e.data); };
            mediaRecorder.onstop = () => {
                const blob = new Blob(recordedChunks, { type: 'video/webm' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url; a.download = `SongVibe_Reel_${Date.now()}.webm`; a.click();
                recordedChunks = [];
                toast('Video Downloaded!');
                stream.getTracks().forEach(track => track.stop()); // Stop sharing
            };
            mediaRecorder.start();
            isRecording = true;
            recordBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor" stroke="none" width="16" height="16" style="color:#10b981;"><rect x="6" y="6" width="12" height="12"/></svg> Stop Recording';
            recordBtn.style.boxShadow = '0 0 20px rgba(16,185,129,0.4)';
            seekTo(0); play();
            toast('Recording Started! Play audio to capture.');
        } catch (e) {
            toast('Recording failed: ' + e.message);
        }
    });

    /* ═══ UTILS & PARTICLES ═══ */
    function fmt(s) { if(!s||isNaN(s)) return '0:00'; return Math.floor(s/60)+':'+String(Math.floor(s%60)).padStart(2,'0'); }
    function fmtStamp(s) { return Math.floor(s/60)+':'+String((s%60).toFixed(1)).padStart(4,'0'); }
    function esc(s) { const d=document.createElement('div'); d.textContent=s; return d.innerHTML; }
    function toast(msg) {
        let el = $('.toast'); if(el) el.remove();
        el = document.createElement('div'); el.className='toast'; el.textContent=msg;
        document.body.appendChild(el);
        requestAnimationFrame(()=>el.classList.add('show'));
        setTimeout(()=>{ el.classList.remove('show'); setTimeout(()=>el.remove(),400); }, 2500);
    }

    const ctx = canvas.getContext('2d');
    let parts = [];
    function resize() { canvas.width=window.innerWidth; canvas.height=window.innerHeight; }
    window.addEventListener('resize', resize); resize();
    for(let i=0;i<100;i++) parts.push({x:Math.random()*canvas.width, y:Math.random()*canvas.height, r:Math.random()*1.5+0.3, vx:(Math.random()-0.5)*0.2, vy:(Math.random()-0.5)*0.2, p:Math.random()*6});
    (function drawLoop() {
        ctx.clearRect(0,0,canvas.width,canvas.height);
        parts.forEach(p=>{
            p.x+=p.vx; p.y+=p.vy; p.p+=0.01;
            if(p.x<0||p.x>canvas.width||p.y<0||p.y>canvas.height){ p.x=Math.random()*canvas.width; p.y=Math.random()*canvas.height; }
            ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.28);
            ctx.fillStyle=`rgba(0,212,255,${Math.max(0.05, 0.2+Math.sin(p.p)*0.1)})`; ctx.fill();
        });
        requestAnimationFrame(drawLoop);
    })();

})();
