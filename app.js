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
    const npFilm      = $('#npFilm');
    const npArt       = $('#npImg');
    const nowPlaying  = $('.now-playing');
    const lyricsScroll = $('#lyricsScroll');

    const bPlay     = $('#bPlay');
    const bPrev     = $('#bPrev');
    const bNext     = $('#bNext');
    const bShuffle  = $('#bShuffle');
    const bRepeat   = $('#bRepeat');
    const progTrack = $('#progTrack');
    const progFill  = $('#progFill');
    const tCur      = $('#progTime');
    const tTot      = $('#progTotal');
    const iPlay     = $('#iPlay');
    const iPause    = $('#iPause');

    const edTitle   = $('#edTitle');
    const edArtist  = $('#edArtist');
    const edFilm    = $('#edFilm');
    const edDetails = $('#edDetails');
    const edLyrics  = $('#edLyrics');
    const applyBtn  = $('#applyBtn');

    const fsBox     = $('#fsBox');
    const fsBoxBtn  = $('#fsBoxBtn');

    const sizeRange     = $('#sizeRange');
    const glowRange     = $('#glowRange');
    const fontSelectEn  = $('#fontSelectEn');
    const fontSelectHi  = $('#fontSelectHi');
    const animBtns      = $$('#animPills .pill-btn');
    const speedBtns     = $$('#speedPills .pill-btn');
    const alignBtns     = $$('#alignPills .pill-btn');
    const posBtns       = $$('#posPills .pill-btn');

    // Guide Modal
    const btnGuide      = $('#btnGuide');
    const guideModal    = $('#guideModal');
    const guideClose    = $('#guideClose');
    const guideImg      = $('#guideImg');
    const guidePrev     = $('#guidePrev');
    const guideNext     = $('#guideNext');
    const guideDots     = $('#guideDots');

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
        vol: 80,
        lyricsFont: 'Poppins',
        lyricsSize: 1.8,
        particleMode: 'normal',
        align: 'center',
        pos: 'center',
        bars: 40,
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
        if (window.ytFallbackTimer) clearTimeout(window.ytFallbackTimer);
        ytOk = true;
        yt = new YT.Player('ytPlayer', {
            height: '1', width: '1',
            playerVars: { autoplay:0, controls:0, disablekb:1, fs:0, modestbranding:1, rel:0 },
            events: { 
                onReady: () => { if(yt) yt.setVolume(S.vol); loadFromLocal(); }, 
                onStateChange: onYtState,
                onError: onYtError
            },
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

    function onYtError(e) {
        if (e.data === 101 || e.data === 150) {
            toast('🚫 YouTube Blocked: The owner has disabled embedding for this video.');
        } else {
            toast('⚠️ YouTube Error: Could not play video (' + e.data + ')');
        }
        setPlayState(false);
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

    let audioCtx, analyser, dataArray;
    function initAudio() {
        if(!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            analyser = audioCtx.createAnalyser();
            analyser.fftSize = 256;
            const src = audioCtx.createMediaElementSource(audioEl);
            src.connect(analyser);
            analyser.connect(audioCtx.destination);
            dataArray = new Uint8Array(analyser.frequencyBinCount);
        }
    }

    function play() {
        if (S.idx < 0) return;
        try {
            if (S.source === 'yt' && yt) yt.playVideo();
            else if (S.source === 'local') {
                if(!audioCtx) initAudio();
                if(audioCtx.state === 'suspended') audioCtx.resume();
                audioEl.play();
            }
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
    function thumb(id) { return `https://img.youtube.com/vi/${id}/hqdefault.jpg`; }

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
            npArt.src = evt.target.result;
            saveToLocal(); renderList();
            toast('Thumbnail updated!');
        };
        reader.readAsDataURL(file);
        e.target.value = '';
    });

    /* ═══ LOCAL STORAGE & JSON ═══ */
    function savePrefs() {
        localStorage.setItem('songvibe_prefs', JSON.stringify({
            anim: S.anim, speed: S.speed, theme: S.theme, align: S.align, pos: S.pos, bars: S.bars, lyricsSize: S.lyricsSize
        }));
    }
    
    function saveToLocal() { localStorage.setItem('songvibe_songs', JSON.stringify(S.songs)); }
    function loadFromLocal() {
        try {
            const saved = localStorage.getItem('songvibe_songs');
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    S.songs = parsed; renderList();
                    if (S.idx < 0) loadSong(0);
                    return; // Return so we don't accidentally overwrite with loadJSON()
                }
            }
        } catch (e) {}
        loadJSON(); // fallback
    }

    loadJsonBtn.addEventListener('click', loadJSON);
    function loadJSON() {
        fetch('data/songs.json?v=' + Date.now()).then(r => r.json()).then(d => {
            if (!d.songs) return;
            
            const newSongs = [];
            d.songs.forEach(s => {
                let parsedLyrics = [];
                if (Array.isArray(s.lyrics)) {
                    if (s.lyrics.length > 0 && typeof s.lyrics[0] === 'string') {
                        parsedLyrics = parseLyrics(s.lyrics.join('\n'));
                    } else {
                        parsedLyrics = s.lyrics;
                    }
                }
                
                const id = vidId(s.youtubeUrl || '');
                newSongs.push({
                    id: 's' + Date.now() + Math.random().toString(36).slice(2,5),
                    title: s.title || 'Untitled', 
                    artist: s.artist || 'Unknown',
                    videoId: id, 
                    localUrl: null, 
                    thumb: id ? thumb(id) : '',
                    lyrics: parsedLyrics,
                });
            });
            
            S.songs = newSongs; // HARD SYNC
            saveToLocal(); 
            renderList(); 
            toast('Data fully synced with JSON!');
            
            if (S.idx < 0 && S.songs.length > 0) {
                loadSong(0);
            } else if (S.idx >= 0) {
                if (S.idx >= S.songs.length) S.idx = 0;
                S.lyrics = S.songs[S.idx].lyrics;
                if (S.lyrics.length) edLyrics.value = S.lyrics.map(l => `[${fmtStamp(l.time)}] ${l.text}`).join('\n');
                renderLyrics();
                loadSong(S.idx); // Reload completely to ensure UI updates
            }
        }).catch(e => {
            console.log('No JSON found or invalid JSON syntax', e);
            toast('Error: Invalid JSON syntax in songs.json');
        });
    }

    window.ytFallbackTimer = setTimeout(() => {
        if (!window.YT) loadFromLocal(); // If YT blocked or slow, load anyway
    }, 3000);

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
                loadSong(+el.dataset.i, true);
            });
        });
        songList.querySelectorAll('.sc-del').forEach(b => {
            b.addEventListener('click', e => {
                e.stopPropagation(); const i = +b.dataset.rm;
                S.songs.splice(i,1); saveToLocal();
                if (S.idx===i) { pause(); S.idx=-1; npTitle.textContent='SongVibe'; npArt.src=''; }
                else if (S.idx>i) S.idx--;
                renderList();
            });
        });
    }

    /* ═══ LOAD SONG ═══ */
    function loadSong(i, playNow = false) {
        if (i<0||i>=S.songs.length) return;
        pause();
        S.idx = i;
        const s = S.songs[i];
        npTitle.textContent = s.title;
        npArtist.textContent = s.artist;
        npFilm.textContent = (s.film ? s.film + ' ' : '') + (s.details ? `(${s.details})` : '');
        npArt.src = s.thumb || '';
        
        edTitle.value = s.title; edArtist.value = s.artist;
        edFilm.value = s.film || ''; edDetails.value = s.details || '';
        S.lyrics = s.lyrics || [];
        if (S.lyrics.length) edLyrics.value = S.lyrics.map(l => `[${fmtStamp(l.time)}] ${l.text}`).join('\n');
        else edLyrics.value = '';
        renderLyrics(); renderList();

        progFill.style.width = '0%'; tCur.textContent = '0:00'; tTot.textContent = '0:00';

        if (s.localUrl) {
            S.source = 'local';
            if (yt) yt.pauseVideo();
            audioEl.src = s.localUrl;
            audioEl.load();
            if (playNow) audioEl.play();
        } else if (s.videoId) {
            S.source = 'yt';
            audioEl.pause();
            if (yt) { 
                if (playNow && yt.loadVideoById) yt.loadVideoById(s.videoId);
                else if (yt.cueVideoById) yt.cueVideoById(s.videoId); 
            }
        }
    }

    function doNext() { if(S.songs.length) { loadSong(S.shuffle ? Math.floor(Math.random()*S.songs.length) : (S.idx+1)%S.songs.length, true); } }
    function doPrev() { if(S.songs.length) { if(getCurTime()>3) { seekTo(0); } else { loadSong((S.idx-1+S.songs.length)%S.songs.length, true); } } }

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
        if (e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA') return;
        if (e.code==='Space') { e.preventDefault(); if(S.playing) pause(); else play(); }
        if (e.key==='ArrowRight') seekTo(getCurTime()+5);
        if (e.key==='ArrowLeft') seekTo(Math.max(0,getCurTime()-5));
        if (e.key==='f' || e.key==='F') {
            e.preventDefault();
            if (!document.fullscreenElement) {
                mainContent.requestFullscreen().catch(()=>{});
            } else {
                document.exitFullscreen();
            }
        }
    });

    /* ═══ LYRICS PARSING & SYNC ═══ */
    function parseLyrics(text) {
        const lines = text.split('\n');
        const res = [];
        // Matches [0:15.0] Text OR (0:15 - 0:20): Text OR (0:15) Text
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

    applyBtn.addEventListener('click', () => {
        const txt = edLyrics.value.trim();
        S.lyrics = txt ? parseLyrics(txt) : [];
        if (S.idx>=0) {
            const s = S.songs[S.idx];
            s.lyrics = S.lyrics;
            if (edTitle.value.trim()) s.title = edTitle.value.trim();
            if (edArtist.value.trim()) s.artist = edArtist.value.trim();
            s.film = edFilm.value.trim();
            s.details = edDetails.value.trim();
            saveToLocal(); loadSong(S.idx);
        }
        toast('Changes applied!');
    });

    function renderLyrics() {
        if (!S.lyrics.length) { lyricsScroll.innerHTML = ''; return; }
        const ac = S.anim !== 'typewriter' ? `a-${S.anim}` : '';
        lyricsScroll.innerHTML = S.lyrics.map((l,i) => {
            const textContent = typeof l === 'string' ? l : (l.text || '');
            let colorStyle = '';
            let finalTxt = textContent;
            
            // Extract custom inline colors like [red] or [#00ff00]
            const colorMatch = textContent.match(/^\[(?:color:)?(#[a-fA-F0-9]{3,6}|[a-zA-Z]+)\]\s*(.*)/);
            if (colorMatch) {
                const col = colorMatch[1];
                colorStyle = `style="color: ${col} !important; --grad-text: ${col}; --accent-glow-2: ${col}; --accent-glow: ${col};"`;
                finalTxt = colorMatch[2];
            }

            // Custom Font Check: If line contains Hindi characters, use fontHi, else use fontEn
            const isHindi = /[\u0900-\u097F]/.test(finalTxt);
            const fontFamilyStr = isHindi ? `var(--font-hi, 'Yatra One', sans-serif)` : `var(--font-en, 'Poppins', sans-serif)`;

            if (S.anim === 'typewriter' || S.anim === 'wave') {
                const words = finalTxt.split(' ').map((w, wi) => `<span class="c" style="transition-delay: ${S.anim === 'typewriter' ? wi * 0.15 : 0}s">${esc(w)}</span>`).join(' ');
                return `<div class="ll ${ac}" data-i="${i}" style="font-family: ${fontFamilyStr}; ${colorStyle.replace('style="', '').replace('"', '')}">${words}</div>`;
            }
            return `<div class="ll ${ac}" data-i="${i}" style="font-family: ${fontFamilyStr}; ${colorStyle.replace('style="', '').replace('"', '')}">${esc(finalTxt)}</div>`;
        }).join('');

        lyricsScroll.querySelectorAll('.ll').forEach(el => {
            el.addEventListener('click', () => { 
                const i = +el.dataset.i; seekTo(S.lyrics[i].time); if(!S.playing)play(); 
            });
        });
    }

    function syncLyric(t) {
        if (!S.lyrics.length) return;
        let ai = -1;
        for (let i=S.lyrics.length-1; i>=0; i--) { if (t>=S.lyrics[i].time-0.1) { ai=i; break; } }
        if (ai !== S.lyricIdx) {
            S.lyricIdx = ai;
            highlight(lyricsScroll, ai);
        }
    }

    function highlight(box, ai) {
        box.querySelectorAll('.ll').forEach((el,i) => {
            el.classList.remove('active','done');
            const chars = el.querySelectorAll('.c');
            if (i===ai) {
                el.classList.add('active');
                if (S.anim==='typewriter') chars.forEach((c,ci) => setTimeout(()=>c.classList.add('v'), ci*40));
                // Smart Auto Scroll (Aggressive Focus)
                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else if (i<ai) {
                el.classList.add('done');
                chars.forEach(c=>c.classList.add('v'));
            } else {
                chars.forEach(c=>c.classList.remove('v'));
            }
        });
    }

    function scrollTo(el, box) {
        // Obsolete function, kept for legacy compatibility if called elsewhere
    }

    /* ═══ PILL BUTTONS UI HANDLERS ═══ */
    function setupPills(id, key, cb) {
        const el = $('#'+id);
        if(!el) return;
        el.querySelectorAll('.pill-btn').forEach(b => {
            if(b.dataset[key]===S[key]) b.classList.add('active');
            else b.classList.remove('active');
            b.addEventListener('click', () => {
                el.querySelectorAll('.pill-btn').forEach(x=>x.classList.remove('active'));
                b.classList.add('active');
                S[key] = b.dataset[key];
                if(cb) cb(S[key]);
                saveToLocal();
            });
        });
    }


    setupPills('animPills', 'anim', () => { if(S.lyrics.length) renderLyrics(); });
    setupPills('speedPills', 'speed', () => {});
    setupPills('alignPills', 'align', (v) => { 
        document.documentElement.style.setProperty('--lyrics-align', v); 
        lyricsScroll.style.textAlign = v; 
    });
    setupPills('posPills', 'pos', (v) => { 
        $('.lyrics-box').style.justifyContent = v; 
    });
    


    /* ═══ THEME SWITCHER ═══ */
    const themeBtns = document.querySelectorAll('.pill-btn[data-theme]');
    themeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            themeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            document.body.className = 'theme-' + btn.dataset.theme;
            localStorage.setItem('songvibe_theme', btn.dataset.theme);
        });
    });

    // Restore Theme on Load
    const savedTheme = localStorage.getItem('songvibe_theme');
    if (savedTheme) {
        document.body.className = 'theme-' + savedTheme;
        themeBtns.forEach(b => {
            b.classList.toggle('active', b.dataset.theme === savedTheme);
        });
    }

    function loadPrefs() {
        try {
            const p = JSON.parse(localStorage.getItem('songvibe_prefs'));
            if (p) {
                if (p.anim) S.anim = p.anim;
                if (p.speed) S.speed = p.speed;
                if (p.theme) S.theme = p.theme;
                if (p.align) S.align = p.align;
                if (p.pos) S.pos = p.pos;
                if (p.bars) S.bars = p.bars;
                if (p.lyricsSize) S.lyricsSize = p.lyricsSize;
                
                setPillActive(animBtns, S.anim, 'anim');
                setPillActive(speedBtns, S.speed, 'speed');
                setPillActive(themeBtns, S.theme, 'theme');
                setPillActive(alignBtns, S.align, 'align');
                setPillActive(posBtns, S.pos, 'pos');
                
                if(waveRange) waveRange.value = S.bars || 40;
                if(sizeRange) sizeRange.value = S.lyricsSize || 1.8;
                
                document.body.className = `theme-${S.theme}`;
                document.documentElement.style.setProperty('--lyrics-size', S.lyricsSize + 'rem');
                
                applyVisuals();
            }
        } catch(e) {}
    }

    loadPrefs();
    loadFromLocal();

    /* ═══ FULLSCREEN LYRICS BOX (FOR RECORDING) ═══ */
    const mainContent = $('.main-content');
    fsBoxBtn.addEventListener('click', () => {
        if (!document.fullscreenElement) {
            mainContent.requestFullscreen().catch(err => toast('Fullscreen failed: ' + err.message));
        } else {
            document.exitFullscreen();
        }
    });

    /* ═══ CUSTOMIZATION PANEL LOGIC ═══ */
    function setPillActive(btns, val, dataKey) {
        btns.forEach(b => {
            b.classList.toggle('active', b.dataset[dataKey] === val);
        });
    }

    animBtns.forEach(b => b.addEventListener('click', () => { S.anim = b.dataset.anim; setPillActive(animBtns, S.anim, 'anim'); renderLyrics(); savePrefs(); }));
    
    speedBtns.forEach(b => b.addEventListener('click', () => { 
        S.speed = b.dataset.speed; 
        setPillActive(speedBtns, S.speed, 'speed'); 
        if (S.idx >= 0) {
            S.songs[S.idx].lyrics = parseLyrics(edLyrics.value);
            S.lyrics = S.songs[S.idx].lyrics;
            renderLyrics();
            saveToLocal();
        }
        savePrefs();
    }));

    function applyVisuals() {
        lyricsScroll.style.alignItems = S.align === 'left' ? 'flex-start' : (S.align === 'right' ? 'flex-end' : 'center');
        lyricsScroll.style.textAlign = S.align;
        lyricsScroll.style.setProperty('--align-origin', S.align === 'left' ? 'left center' : (S.align === 'right' ? 'right center' : 'center center'));
        
        if (S.pos === 'flex-start') lyricsScroll.style.padding = '10vh 0 50vh 0';
        else if (S.pos === 'flex-end') lyricsScroll.style.padding = '50vh 0 10vh 0';
        else lyricsScroll.style.padding = '50vh 0';
    }

    alignBtns.forEach(b => b.addEventListener('click', () => { 
        S.align = b.dataset.align; 
        setPillActive(alignBtns, S.align, 'align'); 
        applyVisuals();
        savePrefs();
    }));

    posBtns.forEach(b => b.addEventListener('click', () => { 
        S.pos = b.dataset.pos; 
        setPillActive(posBtns, S.pos, 'pos'); 
        applyVisuals();
        savePrefs();
    }));

    if (fontSelectEn) {
        fontSelectEn.addEventListener('change', () => {
            document.documentElement.style.setProperty('--font-en', `"${fontSelectEn.value}", 'Poppins', sans-serif`);
            if(S.lyrics.length) renderLyrics();
        });
    }
    if (fontSelectHi) {
        fontSelectHi.addEventListener('change', () => {
            document.documentElement.style.setProperty('--font-hi', `"${fontSelectHi.value}", 'Yatra One', sans-serif`);
            if(S.lyrics.length) renderLyrics();
        });
    }

    sizeRange.addEventListener('input', () => {
        S.lyricsSize = sizeRange.value;
        document.documentElement.style.setProperty('--lyrics-size', S.lyricsSize + 'rem');
        savePrefs();
    });
    
    glowRange.addEventListener('input', () => {
        const v = glowRange.value / 100;
        document.documentElement.style.setProperty('--accent-glow', `rgba(0,212,255,${(v*0.35).toFixed(2)})`);
        document.documentElement.style.setProperty('--accent-glow-2', `rgba(0,212,255,${(v*0.6).toFixed(2)})`);
    });

    const waveRange = $('#waveRange');
    if (waveRange) {
        waveRange.addEventListener('input', () => {
            S.bars = parseInt(waveRange.value);
            savePrefs();
        });
    }

    /* ═══ USER GUIDE MODAL ═══ */
    let guideStep = 1;
    const maxSteps = 8;
    
    function updateGuide() {
        guideImg.src = `img/step${guideStep}.png`;
        guideDots.innerHTML = '';
        for(let i=1; i<=maxSteps; i++) {
            const d = document.createElement('div');
            d.className = 'dot' + (i === guideStep ? ' active' : '');
            d.onclick = () => { guideStep = i; updateGuide(); };
            guideDots.appendChild(d);
        }
    }

    if (btnGuide) {
        btnGuide.addEventListener('click', () => {
            guideStep = 1;
            updateGuide();
            guideModal.style.display = 'flex';
            setTimeout(() => guideModal.style.opacity = '1', 10);
        });
        
        guideClose.addEventListener('click', () => {
            guideModal.style.display = 'none';
        });
        
        guideNext.addEventListener('click', () => {
            if (guideStep < maxSteps) guideStep++; else guideStep = 1;
            updateGuide();
        });
        
        guidePrev.addEventListener('click', () => {
            if (guideStep > 1) guideStep--; else guideStep = maxSteps;
            updateGuide();
        });
    }





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
    /* ═══ AUDIO WAVE VISUALIZER ═══ */
    const waveCanvas = document.getElementById('audioWave');
    const waveCtx = waveCanvas.getContext('2d');
    let waveTime = 0;
    let waveSpike = 0;
    let lastWaveIdx = -1;
    
    (function drawWave() {
        requestAnimationFrame(drawWave);
        waveCtx.clearRect(0, 0, waveCanvas.width, waveCanvas.height);
        
        // Only animate if playing
        const isPlaying = S.playing;
        
        waveTime += isPlaying ? 0.05 : 0.005;
        
        // SMART SYNC: Spike the wave when a new lyric line is hit!
        if (isPlaying && S.lyricIdx !== lastWaveIdx && S.lyricIdx >= 0) {
            waveSpike = 1.0;
            lastWaveIdx = S.lyricIdx;
        }
        
        // Decay the spike rapidly for a natural beat drop effect
        waveSpike *= 0.92;
        
        const bars = parseInt(S.bars || 40);
        const barWidth = waveCanvas.width / bars;
        
        // Get accent color from CSS variables
        const accentStr = getComputedStyle(document.body).getPropertyValue('--accent').trim() || '#00d4ff';
        waveCtx.fillStyle = accentStr;
        
        if (S.source === 'local' && typeof analyser !== 'undefined' && isPlaying) {
            analyser.getByteFrequencyData(dataArray);
            const step = Math.max(1, Math.floor(dataArray.length / bars));
            for (let i = 0; i < bars; i++) {
                const val = dataArray[i * step] || 0;
                let h = 5 + (val / 255) * 55; // Real frequency height
                const x = i * barWidth + (barWidth * 0.2);
                const y = waveCanvas.height - h;
                const w = barWidth * 0.6;
                waveCtx.beginPath();
                waveCtx.roundRect(x, y, w, h, 3);
                waveCtx.fill();
            }
        } else {
            for (let i = 0; i < bars; i++) {
                let h = 5; // minimum height
                
                if (isPlaying) {
                    const noise1 = Math.sin(i * 0.5 + waveTime * 2);
                    const noise2 = Math.cos(i * 0.8 - waveTime * 3);
                    const noise3 = Math.sin(i * 0.2 + waveTime * 1.5);
                    
                    let magnitude = Math.abs(noise1 + noise2 + noise3) / 3;
                    const localSpike = waveSpike * (0.5 + Math.random() * 0.8);
                    magnitude += localSpike;
                    const centerDist = 1 - Math.abs((i / bars) - 0.5) * 2;
                    magnitude = magnitude * Math.pow(centerDist, 0.5);
                    
                    h = 5 + (magnitude * 55);
                }
                
                const x = i * barWidth + (barWidth * 0.2);
                const y = waveCanvas.height - h;
                const w = barWidth * 0.6;
                
                waveCtx.beginPath();
                waveCtx.roundRect(x, y, w, h, 3);
                waveCtx.fill();
            }
        }
    })();


})();
