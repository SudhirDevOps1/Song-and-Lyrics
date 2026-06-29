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
    const mainContent = $('.main-content');
    const sizeRange     = $('#sizeRange');
    const glowRange     = $('#glowRange');
    const vibeColor     = $('#vibeColor');
    const fontSelectEn  = $('#fontSelectEn');
    const fontSelectHi  = $('#fontSelectHi');
    const animBtns      = $$('#animPills .pill-btn');
    const speedBtns     = $$('#speedPills .pill-btn');
    const alignBtns     = $$('#alignPills .pill-btn');
    const posBtns       = $$('#posPills .pill-btn');
    const waveRange     = $('#waveRange');
    const sizeVal       = $('#sizeVal');
    const glowVal       = $('#glowVal');
    const waveVal       = $('#waveVal');
    const songCountBadge = $('#songCount');

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
        anim: 'glow',
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
        waveType: 'bars', // Default wave type
        layout: 'default', // 'default' or 'split'
        source: 'none', // 'yt' or 'local'
        fontEn: 'Caveat',
        fontHi: 'Amita',
        customColor: null
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
                onReady: () => { 
                    if(yt) yt.setVolume(S.vol); 
                    if (S.songs.length === 0) loadFromLocal();
                    else if (S.idx >= 0 && S.source === 'yt') {
                        if (yt.cueVideoById) yt.cueVideoById(S.songs[S.idx].videoId);
                    }
                },
                onStateChange: onYtState,
                onError: onYtError
            },
        });
    };

    /* ═══ LOADING OVERLAY ═══ */
    function setLoading(isLoading) {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) overlay.style.display = isLoading ? 'flex' : 'none';
    }

    function onYtState(e) {
        if (S.source !== 'yt') return;
        if (e.data === YT.PlayerState.PLAYING) { setPlayState(true); setLoading(false); }
        else if (e.data === YT.PlayerState.PAUSED) { setPlayState(false); }
        else if (e.data === YT.PlayerState.ENDED) {
            setPlayState(false); setLoading(false);
            if (S.repeat) { yt.seekTo(0); yt.playVideo(); } else setTimeout(doNext, 250);
        }
        else if (e.data === YT.PlayerState.BUFFERING) {
            setLoading(true);
        }
        else if (e.data === YT.PlayerState.CUED || e.data === -1) {
            setLoading(false);
        }
    }

    function onYtError(e) {
        if (e.data === 101 || e.data === 150) {
            toast('🚫 YouTube Blocked: The owner has disabled embedding for this video.');
        } else {
            toast('⚠️ YouTube Error: Could not play video (' + e.data + ')');
        }
        setPlayState(false); setLoading(false);
    }

    /* ═══ LOCAL AUDIO PLAYER ═══ */
    audioEl.addEventListener('play', () => { if(S.source==='local') { setPlayState(true); setLoading(false); } });
    audioEl.addEventListener('pause', () => { if(S.source==='local') setPlayState(false); });
    audioEl.addEventListener('waiting', () => { if(S.source==='local') setLoading(true); });
    audioEl.addEventListener('playing', () => { if(S.source==='local') setLoading(false); });
    audioEl.addEventListener('canplay', () => { if(S.source==='local') setLoading(false); });
    audioEl.addEventListener('ended', () => {
        setPlayState(false); setLoading(false);
        if (S.repeat) { audioEl.currentTime=0; audioEl.play(); } else setTimeout(doNext, 250);
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
                let p = audioEl.play();
                if (p !== undefined) {
                    p.catch(e => {
                        toast('⚠️ Audio playback blocked or file missing');
                        setPlayState(false);
                        setLoading(false);
                    });
                }
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
        }, 50);
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
            anim: S.anim, speed: S.speed, theme: S.theme, align: S.align, pos: S.pos, bars: S.bars, waveType: S.waveType, layout: S.layout, lyricsSize: S.lyricsSize, fontEn: S.fontEn, fontHi: S.fontHi, glow: glowRange ? glowRange.value : 60, customColor: S.customColor
        }));
    }
    
    function saveToLocal() { localStorage.setItem('songvibe_songs', JSON.stringify(S.songs)); }
    function loadFromLocal() {
        let hasLocal = false;
        try {
            const saved = localStorage.getItem('songvibe_songs');
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    S.songs = parsed;
                    renderList();
                    if (S.idx < 0) loadSong(0);
                    hasLocal = true;
                }
            }
        } catch (e) {}
        
        // Always fetch live JSON to get any new songs added to the server
        loadJSON(hasLocal);
    }

    if (loadJsonBtn) loadJsonBtn.addEventListener('click', () => loadJSON(false));
    
    function loadJSON(merge = false) {
        fetch('data/songs.json?v=' + Date.now()).then(r => r.json()).then(d => {
            if (!d.songs) return;
            
            let changed = false;
            d.songs.forEach(s => {
                const songId = s.id || ('s_' + vidId(s.youtubeUrl||'') || Date.now());
                
                // If merging, skip if we already have this song ID
                if (merge && S.songs.some(existing => existing.id === songId)) return;
                
                let parsedLyrics = [];
                if (Array.isArray(s.lyrics)) {
                    if (s.lyrics.length > 0 && typeof s.lyrics[0] === 'string') {
                        parsedLyrics = parseLyrics(s.lyrics.join('\n'));
                    } else {
                        parsedLyrics = s.lyrics;
                    }
                }
                
                const id = vidId(s.youtubeUrl || '');
                const newSong = {
                    id: songId,
                    title: s.title || 'Untitled', 
                    artist: s.artist || 'Unknown',
                    videoId: id, 
                    localUrl: null, 
                    thumb: id ? thumb(id) : '',
                    lyrics: parsedLyrics,
                };
                
                if (merge) {
                    S.songs.push(newSong);
                } else {
                    if (!S._tempNewSongs) S._tempNewSongs = [];
                    S._tempNewSongs.push(newSong);
                }
                changed = true;
            });
            
            if (!merge && S._tempNewSongs) {
                S.songs = S._tempNewSongs;
                S._tempNewSongs = null;
                changed = true;
            }
            
            if (changed) {
                saveToLocal(); 
                renderList();
            }
            
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
        if (songCountBadge) {
            songCountBadge.textContent = S.songs.length;
        }
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
                e.stopPropagation();
                const i = +b.dataset.rm;
                const title = S.songs[i].title;
                confirmDialog(`Delete "${title}"?`, () => {
                    S.songs.splice(i,1); saveToLocal();
                    if (S.idx===i) { 
                        pause(); S.idx=-1; 
                        npTitle.textContent='SongVibe'; npArtist.textContent=''; npFilm.textContent=''; npArt.src='';
                        S.lyrics = []; renderLyrics();
                        progFill.style.width = '0%'; tCur.textContent = '0:00'; tTot.textContent = '0:00';
                    }
                    else if (S.idx>i) S.idx--;
                    renderList();
                    toast('Song deleted');
                });
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
        S.lyricIdx = -1; // CRITICAL FIX: Reset lyric tracking state when changing songs
        
        if (S.lyrics.length) edLyrics.value = S.lyrics.map(l => `[${fmtStamp(l.time)}] ${l.text}`).join('\n');
        else edLyrics.value = '';
        renderLyrics(); renderList();

        progFill.style.width = '0%'; tCur.textContent = '0:00'; tTot.textContent = '0:00';
        if (playNow) setLoading(true);

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
        if (e.key==='n' || e.key==='N') {
            e.preventDefault();
            doNext();
        }
        if (e.key==='p' || e.key==='P') {
            e.preventDefault();
            doPrev();
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
            
            S.lyricIdx = -1; // CRITICAL FIX: Reset tracking so UI forces a re-sync
            
            // Update UI without stopping playback
            npTitle.textContent = s.title;
            npArtist.textContent = s.artist;
            npFilm.textContent = (s.film ? s.film + ' ' : '') + (s.details ? `(${s.details})` : '');
            
            saveToLocal();
            renderLyrics();
            renderList();
            // Force immediate UI sync even if audio is paused
            syncLyric(getCurTime() || 0);
        }
        toast('Changes applied seamlessly!');
    });

    function renderLyrics() {
        if (!S.lyrics.length) { lyricsScroll.innerHTML = ''; return; }
        const ac = `a-${S.anim}`;
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
            if (S.anim === 'karaoke') {
                const words = finalTxt.split(' ').map((w, wi) => `<span class="kw" data-w="${wi}">${esc(w)}</span>`).join(' ');
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
        // Exact timing without early offset
        for (let i=S.lyrics.length-1; i>=0; i--) { if (t >= S.lyrics[i].time) { ai = i; break; } }
        if (ai !== S.lyricIdx) {
            S.lyricIdx = ai;
            highlight(lyricsScroll, ai);
        }
        if (S.anim === 'karaoke' && ai >= 0) {
            syncKaraokeWords(ai, t);
        }
    }

    function syncKaraokeWords(ai, t) {
        const el = lyricsScroll.querySelector(`.ll[data-i="${ai}"]`);
        if (!el) return;
        const words = el.querySelectorAll('.kw');
        if (!words.length) return;
        const start = S.lyrics[ai].time;
        const end = (ai + 1 < S.lyrics.length) ? S.lyrics[ai+1].time : start + 4;
        const duration = Math.max(0.5, end - start);
        const progress = Math.max(0, Math.min(1, (t - start) / duration));
        
        const count = words.length;
        words.forEach((w, wIdx) => {
            if (progress >= (wIdx / count)) {
                w.classList.add('sung');
            } else {
                w.classList.remove('sung');
            }
        });
    }

    function highlight(box, ai) {
        box.querySelectorAll('.ll').forEach((el,i) => {
            el.classList.remove('active','done');
            const kws = el.querySelectorAll('.kw');
            if (i===ai) {
                el.classList.add('active');
                // Smart Auto Scroll (Aggressive Focus)
                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else if (i<ai) {
                el.classList.add('done');
                kws.forEach(w=>w.classList.add('sung'));
            } else {
                kws.forEach(w=>w.classList.remove('sung'));
            }
        });
    }

    function scrollTo(el, box) {
        // Obsolete function, kept for legacy compatibility if called elsewhere
    }

    /* ═══ PILL BUTTONS UI HANDLERS ═══ */
    function setupPills(id, stateKey, dataKey, cb) {
        if (!cb && typeof dataKey === 'function') { cb = dataKey; dataKey = stateKey; }
        const el = $('#'+id);
        if(!el) return;
        el.querySelectorAll('.pill-btn').forEach(b => {
            if(b.dataset[dataKey]===S[stateKey]) b.classList.add('active');
            else b.classList.remove('active');
            b.addEventListener('click', () => {
                el.querySelectorAll('.pill-btn').forEach(x=>x.classList.remove('active'));
                b.classList.add('active');
                S[stateKey] = b.dataset[dataKey];
                if(cb) cb(S[stateKey]);
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
    setupPills('waveTypePills', 'waveType', 'wavetype', () => savePrefs());
    setupPills('layoutPills', 'layout', (v) => {
        $('.main-content').classList.remove('layout-split', 'layout-split-rev', 'layout-focus');
        if (v !== 'default') {
            $('.main-content').classList.add('layout-' + v);
        }
        savePrefs();
    });


    const themeBtns = document.querySelectorAll('.pill-btn[data-theme]');
    themeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            themeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            // Remove old theme classes without wiping other classes like guided-active
            document.body.classList.forEach(cls => { if(cls.startsWith('theme-')) document.body.classList.remove(cls); });
            document.body.classList.add('theme-' + btn.dataset.theme);
            S.theme = btn.dataset.theme;
            localStorage.setItem('songvibe_theme', btn.dataset.theme);
            savePrefs();
        });
    });

    // Restore Theme on Load
    const savedTheme = localStorage.getItem('songvibe_theme');
    if (savedTheme) {
        document.body.classList.forEach(cls => { if(cls.startsWith('theme-')) document.body.classList.remove(cls); });
        document.body.classList.add('theme-' + savedTheme);
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
                if (p.fontEn) S.fontEn = p.fontEn;
                if (p.fontHi) S.fontHi = p.fontHi;
                
                if (p.waveType) S.waveType = p.waveType;
                if (p.layout) S.layout = p.layout;
                
                setPillActive(animBtns, S.anim, 'anim');
                setPillActive(speedBtns, S.speed, 'speed');
                setPillActive(themeBtns, S.theme, 'theme');
                setPillActive(alignBtns, S.align, 'align');
                setPillActive(posBtns, S.pos, 'pos');
                const wavePills = document.querySelectorAll('#waveTypePills .pill-btn');
                setPillActive(wavePills, S.waveType, 'wavetype');
                const layoutPills = document.querySelectorAll('#layoutPills .pill-btn');
                setPillActive(layoutPills, S.layout, 'layout');
                
                $('.main-content').classList.remove('layout-split', 'layout-split-rev', 'layout-focus');
                if (S.layout !== 'default') {
                    $('.main-content').classList.add('layout-' + S.layout);
                }
                
                if(waveRange) {
                    waveRange.value = S.bars || 40;
                    if (waveVal) waveVal.textContent = S.bars || 40;
                }
                if(sizeRange) {
                    sizeRange.value = S.lyricsSize || 1.8;
                    if (sizeVal) sizeVal.textContent = S.lyricsSize || 1.8;
                }
                
                document.body.classList.forEach(cls => { if(cls.startsWith('theme-')) document.body.classList.remove(cls); });
                document.body.classList.add(`theme-${S.theme}`);
                document.documentElement.style.setProperty('--lyrics-size', S.lyricsSize + 'rem');
                
                // Restore glow
                if (p.glow && glowRange) {
                    glowRange.value = p.glow;
                    const v = p.glow / 100;
                    document.documentElement.style.setProperty('--accent-glow', `rgba(0, 229, 255, ${v})`);
                    document.documentElement.style.setProperty('--accent-glow-2', `rgba(0, 229, 255, ${v * 1.5})`);
                    if (glowVal) glowVal.textContent = p.glow + '%';
                }
                
                // Restore custom color
                if (p.customColor && vibeColor) {
                    S.customColor = p.customColor;
                    vibeColor.value = p.customColor;
                    const hex = p.customColor;
                    document.documentElement.style.setProperty('--accent', hex);
                    document.documentElement.style.setProperty('--accent-2', hex);
                    const r = parseInt(hex.slice(1,3), 16) || 0;
                    const g = parseInt(hex.slice(3,5), 16) || 229;
                    const b = parseInt(hex.slice(5,7), 16) || 255;
                    const glowOpacity = (p.glow || 60) / 100;
                    document.documentElement.style.setProperty('--accent-glow', `rgba(${r},${g},${b},${glowOpacity})`);
                    document.documentElement.style.setProperty('--accent-glow-2', `rgba(${r},${g},${b},${glowOpacity * 1.5})`);
                }
                
                applyVisuals();
            }
        } catch(e) {}
        
        // Always apply fonts (whether from prefs or default)
        if(fontSelectEn) {
            fontSelectEn.value = S.fontEn || 'Caveat';
            document.documentElement.style.setProperty('--font-en', `"${S.fontEn}", 'Poppins', sans-serif`);
        }
        if(fontSelectHi) {
            fontSelectHi.value = S.fontHi || 'Amita';
            document.documentElement.style.setProperty('--font-hi', `"${S.fontHi}", 'Yatra One', sans-serif`);
        }
    }

    loadPrefs();
    loadFromLocal();

    /* ═══ FULLSCREEN LYRICS BOX (FOR RECORDING) ═══ */
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
            S.fontEn = fontSelectEn.value;
            document.documentElement.style.setProperty('--font-en', `"${fontSelectEn.value}", 'Poppins', sans-serif`);
            if(S.lyrics.length) renderLyrics();
            savePrefs();
        });
    }
    if (fontSelectHi) {
        fontSelectHi.addEventListener('change', () => {
            S.fontHi = fontSelectHi.value;
            document.documentElement.style.setProperty('--font-hi', `"${fontSelectHi.value}", 'Yatra One', sans-serif`);
            if(S.lyrics.length) renderLyrics();
            savePrefs();
        });
    }

    sizeRange.addEventListener('input', () => {
        S.lyricsSize = sizeRange.value;
        document.documentElement.style.setProperty('--lyrics-size', S.lyricsSize + 'rem');
        if (sizeVal) sizeVal.textContent = S.lyricsSize;
    });
    sizeRange.addEventListener('change', () => savePrefs());
    
    glowRange.addEventListener('input', () => {
        const v = glowRange.value / 100;
        document.documentElement.style.setProperty('--accent-glow', `rgba(0,212,255,${(v*0.35).toFixed(2)})`);
        document.documentElement.style.setProperty('--accent-glow-2', `rgba(0,212,255,${(v*0.6).toFixed(2)})`);
        if (glowVal) glowVal.textContent = glowRange.value + '%';
    });
    glowRange.addEventListener('change', () => savePrefs());

    if (vibeColor) {
        vibeColor.addEventListener('input', (e) => {
            const hex = e.target.value;
            document.documentElement.style.setProperty('--accent', hex);
            document.documentElement.style.setProperty('--accent-2', hex);
            const r = parseInt(hex.slice(1,3), 16) || 0;
            const g = parseInt(hex.slice(3,5), 16) || 229;
            const b = parseInt(hex.slice(5,7), 16) || 255;
            const glowOpacity = (glowRange ? glowRange.value : 60) / 100;
            document.documentElement.style.setProperty('--accent-glow', `rgba(${r},${g},${b},${glowOpacity})`);
            document.documentElement.style.setProperty('--accent-glow-2', `rgba(${r},${g},${b},${glowOpacity * 1.5})`);
            S.customColor = hex;
            savePrefs();
        });
    }

    if (waveRange) {
        waveRange.addEventListener('input', () => {
            S.bars = parseInt(waveRange.value);
            if (waveVal) waveVal.textContent = S.bars;
        });
        waveRange.addEventListener('change', () => savePrefs());
    }

    const copyLyricsBtn = $('#copyLyricsBtn');
    if (copyLyricsBtn) {
        copyLyricsBtn.addEventListener('click', () => {
            if (edLyrics && edLyrics.value.trim()) {
                navigator.clipboard.writeText(edLyrics.value.trim())
                    .then(() => toast('Lyrics copied!'))
                    .catch(() => toast('Copy failed!'));
            } else {
                toast('No lyrics to copy!');
            }
        });
    }

    const btnShortcuts = $('#btnShortcuts');
    const shortcutsModal = $('#shortcutsModal');
    const shortcutsClose = $('#shortcutsClose');
    if (btnShortcuts && shortcutsModal && shortcutsClose) {
        btnShortcuts.addEventListener('click', () => {
            shortcutsModal.style.display = 'flex';
        });
        shortcutsClose.addEventListener('click', () => {
            shortcutsModal.style.display = 'none';
        });
        shortcutsModal.addEventListener('click', e => {
            if (e.target === shortcutsModal) shortcutsModal.style.display = 'none';
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
            // Remove the done flag so it can run again
            localStorage.removeItem('songvibe_tut_done_v3');
            startTutorial();
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
    /* ═══ INTERACTIVE GUIDED TUTORIAL ═══ */
    const overlay = $('#guidedOverlay');
    const tooltip = $('#guidedTooltip');
    const gTitle = $('#guidedTitleText');
    const gDesc = $('#guidedDescText');
    const gStep = $('#guidedStepText');
    const gArrow = $('#guidedArrow');
    const gSkip = $('#guidedSkip');

    const tutSteps = [
        { 
            target: '#animField', 
            title: 'Cinematic Animations', 
            desc: 'Want your lyrics to bounce, fade, or pop? Click any animation here to test it instantly!', 
            event: 'click' 
        },
        { 
            target: '#themeField', 
            title: 'Premium Themes', 
            desc: 'Change the vibe of the entire player. Click on a Theme to see the magic!', 
            event: 'click' 
        },
        { 
            target: '#fontField', 
            title: 'Stylish Fonts', 
            desc: 'Change English or Hindi fonts. Try clicking and selecting a new Hindi Font!', 
            event: 'change' 
        },
        { 
            target: '#speedField', 
            title: 'Auto Timing Speed', 
            desc: 'Control how fast your lyrics animate based on the song tempo. Click a speed to test!', 
            event: 'click' 
        },
        { 
            target: '#alignField', 
            title: 'Text Alignment', 
            desc: 'Center, Left, or Right? Align your lyrics exactly how you want them!', 
            event: 'click' 
        },
        { 
            target: '#posField', 
            title: 'Vertical Position', 
            desc: 'Shift the lyrics to the Top, Middle, or Bottom of the screen. Click to see the change!', 
            event: 'click' 
        }
    ];

    let currentStep = 0;
    let activeHandler = null;
    let activeTarget = null;

    function posTooltip(targetEl) {
        const rect = targetEl.getBoundingClientRect();
        const tWidth = 280;
        const tHeight = tooltip.offsetHeight || 150;
        
        let left, top;
        top = rect.top + (rect.height / 2) - (tHeight / 2);
        
        // If target is on the left half of screen, put tooltip on its right
        if (rect.left < window.innerWidth / 2) {
            left = rect.right + 30;
            gArrow.className = 'guided-arrow left';
        } else {
            // Put tooltip on its left
            left = rect.left - tWidth - 30;
            gArrow.className = 'guided-arrow right';
        }
        
        // Adjust if out of bounds vertically
        if (top < 20) top = 20;
        if (top + tHeight > window.innerHeight - 20) top = window.innerHeight - tHeight - 20;
        
        tooltip.style.left = left + 'px';
        tooltip.style.top = top + 'px';
    }

    function showTutStep(idx) {
        if (idx >= tutSteps.length) { endTutorial(); return; }
        
        if (activeTarget) {
            activeTarget.classList.remove('guided-highlight');
            if (activeHandler) activeTarget.removeEventListener(tutSteps[currentStep].event, activeHandler, { capture: true });
        }

        currentStep = idx;
        const step = tutSteps[idx];
        activeTarget = $(step.target);
        
        if (!activeTarget) { showTutStep(idx + 1); return; }
        
        gTitle.innerText = step.title;
        gDesc.innerText = step.desc;
        gStep.innerText = `${idx + 1} / ${tutSteps.length}`;
        
        activeTarget.classList.add('guided-highlight');
        activeTarget.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Reposition after scroll
        setTimeout(() => {
            posTooltip(activeTarget);
            tooltip.classList.add('active');
        }, 300);

        activeHandler = () => {
            tooltip.classList.remove('active');
            setTimeout(() => showTutStep(idx + 1), 400);
        };
        
        // Add event listener (capture phase to ensure we catch it on the parent container)
        activeTarget.addEventListener(step.event, activeHandler, { once: true, capture: true });
    }

    function startTutorial() {
        document.body.classList.add('guided-active');
        overlay.classList.add('active');
        showTutStep(0);
    }

    function endTutorial() {
        document.body.classList.remove('guided-active');
        overlay.classList.remove('active');
        tooltip.classList.remove('active');
        if (activeTarget) {
            activeTarget.classList.remove('guided-highlight');
            if (activeHandler) activeTarget.removeEventListener(tutSteps[currentStep].event, activeHandler, { capture: true });
        }
        localStorage.setItem('songvibe_tut_done_v3', 'true');
    }

    if (gSkip) gSkip.addEventListener('click', endTutorial);

    // Start if not done
    if (overlay && tooltip && !localStorage.getItem('songvibe_tut_done_v3')) {
        setTimeout(startTutorial, 2000);
    }

    // Adjust tooltip on resize
    window.addEventListener('resize', () => {
        if (overlay && overlay.classList.contains('active') && activeTarget) {
            posTooltip(activeTarget);
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

    function confirmDialog(msg, onConfirm) {
        let el = $('.confirm-toast'); if(el) el.remove();
        el = document.createElement('div');
        el.className = 'confirm-toast';
        el.innerHTML = `
            <span>${esc(msg)}</span>
            <button class="cf-yes">Yes</button>
            <button class="cf-no">No</button>
        `;
        document.body.appendChild(el);
        
        const yesBtn = el.querySelector('.cf-yes');
        const noBtn = el.querySelector('.cf-no');
        
        yesBtn.addEventListener('click', () => {
            onConfirm();
            el.classList.remove('show');
            setTimeout(() => el.remove(), 400);
        });
        
        noBtn.addEventListener('click', () => {
            el.classList.remove('show');
            setTimeout(() => el.remove(), 400);
        });
        
        requestAnimationFrame(() => el.classList.add('show'));
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
        
        // Dynamically resize canvas to match its actual CSS size for high DPI crispness
        if (waveCanvas.width !== waveCanvas.clientWidth || waveCanvas.height !== waveCanvas.clientHeight) {
            waveCanvas.width = waveCanvas.clientWidth;
            waveCanvas.height = waveCanvas.clientHeight;
        }
        
        waveCtx.clearRect(0, 0, waveCanvas.width, waveCanvas.height);
        
        const isPlaying = S.playing;
        waveTime += isPlaying ? 0.05 : 0.005;
        
        if (isPlaying && S.lyricIdx !== lastWaveIdx && S.lyricIdx >= 0) {
            waveSpike = 1.0;
            lastWaveIdx = S.lyricIdx;
        }
        waveSpike *= 0.92;
        
        const bars = parseInt(S.bars || 40);
        const barWidth = waveCanvas.width / bars;
        
        // Premium Gradient
        const c1 = getComputedStyle(document.body).getPropertyValue('--accent').trim() || '#00e5ff';
        const c2 = getComputedStyle(document.body).getPropertyValue('--accent-2').trim() || '#7c4dff';
        const grad = waveCtx.createLinearGradient(0, 0, waveCanvas.width, 0);
        grad.addColorStop(0, c1);
        grad.addColorStop(0.5, c2);
        grad.addColorStop(1, c1);
        waveCtx.fillStyle = grad;
        
        let waveH = [];
        
        if (S.source === 'local' && typeof analyser !== 'undefined' && isPlaying) {
            analyser.getByteFrequencyData(dataArray);
            const step = Math.max(1, Math.floor(dataArray.length / bars));
            for (let i = 0; i < bars; i++) {
                const val = dataArray[i * step] || 0;
                waveH.push(5 + (val / 255) * (waveCanvas.height * 0.75));
            }
        } else {
            for (let i = 0; i < bars; i++) {
                let h = 5;
                if (isPlaying) {
                    const noise1 = Math.sin(i * 0.5 + waveTime * 2);
                    const noise2 = Math.cos(i * 0.8 - waveTime * 3);
                    const noise3 = Math.sin(i * 0.2 + waveTime * 1.5);
                    let magnitude = Math.abs(noise1 + noise2 + noise3) / 3;
                    const localSpike = waveSpike * (0.5 + Math.random() * 0.8);
                    magnitude += localSpike;
                    const centerDist = 1 - Math.abs((i / bars) - 0.5) * 2;
                    magnitude = magnitude * Math.pow(centerDist, 0.5);
                    h = 5 + (magnitude * (waveCanvas.height * 0.7));
                }
                waveH.push(h);
            }
        }
        
        waveCtx.beginPath();
        if (S.waveType === 'curve') {
            waveCtx.moveTo(0, waveCanvas.height / 2);
            for (let i = 0; i < bars; i++) {
                const x = i * barWidth + (barWidth / 2);
                waveCtx.lineTo(x, (waveCanvas.height / 2) - (waveH[i] / 2));
            }
            waveCtx.lineTo(waveCanvas.width, waveCanvas.height / 2);
            for (let i = bars - 1; i >= 0; i--) {
                const x = i * barWidth + (barWidth / 2);
                waveCtx.lineTo(x, (waveCanvas.height / 2) + (waveH[i] / 2));
            }
            waveCtx.closePath();
            waveCtx.fill();
        } else {
            for (let i = 0; i < bars; i++) {
                const h = waveH[i];
                const w = barWidth * 0.6;
                const x = i * barWidth + (barWidth * 0.2);
                const y = (waveCanvas.height / 2) - (h / 2);
                
                waveCtx.beginPath();
                if (S.waveType === 'dots') {
                    waveCtx.arc(x + w/2, waveCanvas.height / 2, Math.max(0.1, h/4), 0, Math.PI * 2);
                } else {
                    // Default bars (Safe fallback for all browsers)
                    if (waveCtx.roundRect) {
                        try { waveCtx.roundRect(x, y, w, Math.max(h, 5), Math.max(0, w/2)); } 
                        catch(e) { waveCtx.rect(x, y, w, Math.max(h, 5)); }
                    } else {
                        waveCtx.rect(x, y, w, Math.max(h, 5));
                    }
                }
                waveCtx.fill();
            }
        }
    })();

    /* ═══ HEART WAVE LOADER ═══ */
    function initHeartWave(groupId, pathId) {
        const SVG_NS = 'http://www.w3.org/2000/svg';
        const config = {
            name: "Heart Wave",
            rotate: false,
            particleCount: 102,
            trailSpan: 0.16,
            durationMs: 8400,
            rotationDurationMs: 22000,
            pulseDurationMs: 7800,
            strokeWidth: 3.9,
            heartWaveB: 6.4,
            heartWaveRoot: 3.3,
            heartWaveAmp: 0.9,
            heartWaveScaleX: 23.2,
            heartWaveScaleY: 24.5,
            point(progress, detailScale, config) {
                const xLimit = Math.sqrt(config.heartWaveRoot);
                const x = -xLimit + progress * xLimit * 2;
                const safeRoot = Math.max(0, config.heartWaveRoot - x * x);
                const b = config.heartWaveB;
                const wave = config.heartWaveAmp * Math.sqrt(safeRoot) * Math.sin(b * Math.PI * x);
                const curve = Math.pow(Math.abs(x), 2 / 3);
                const y = curve + wave;
                const scaleX = config.heartWaveScaleX;
                const scaleY = config.heartWaveScaleY + detailScale * 1.5;
                return { x: 50 + x * scaleX, y: 18 + (1.75 - y) * scaleY };
            }
        };
        
        const group = document.querySelector(groupId);
        const path = document.querySelector(pathId);
        if (!group || !path) return;
        
        path.setAttribute('stroke-width', String(config.strokeWidth));
        const particles = Array.from({ length: config.particleCount }, () => {
            const circle = document.createElementNS(SVG_NS, 'circle');
            circle.setAttribute('fill', 'currentColor');
            group.appendChild(circle);
            return circle;
        });
        
        function normalizeProgress(progress) { return ((progress % 1) + 1) % 1; }
        function getDetailScale(time) {
            const pulseProgress = (time % config.pulseDurationMs) / config.pulseDurationMs;
            const pulseAngle = pulseProgress * Math.PI * 2;
            return 0.52 + ((Math.sin(pulseAngle + 0.55) + 1) / 2) * 0.48;
        }
        function getRotation(time) {
            if (!config.rotate) return 0;
            return -((time % config.rotationDurationMs) / config.rotationDurationMs) * 360;
        }
        function buildPath(detailScale, steps = 480) {
            return Array.from({ length: steps + 1 }, (_, index) => {
                const point = config.point(index / steps, detailScale, config);
                return `${index === 0 ? 'M' : 'L'} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`;
            }).join(' ');
        }
        function getParticle(index, progress, detailScale) {
            const tailOffset = index / (config.particleCount - 1);
            const point = config.point(normalizeProgress(progress - tailOffset * config.trailSpan), detailScale, config);
            const fade = Math.pow(1 - tailOffset, 0.56);
            return { x: point.x, y: point.y, radius: 0.9 + fade * 2.7, opacity: 0.04 + fade * 0.96 };
        }
        
        const startedAt = performance.now();
        function render(now) {
            const time = now - startedAt;
            const progress = (time % config.durationMs) / config.durationMs;
            const detailScale = getDetailScale(time);
            group.setAttribute('transform', `rotate(${getRotation(time)} 50 50)`);
            path.setAttribute('d', buildPath(detailScale));
            particles.forEach((node, index) => {
                const particle = getParticle(index, progress, detailScale);
                node.setAttribute('cx', particle.x.toFixed(2));
                node.setAttribute('cy', particle.y.toFixed(2));
                node.setAttribute('r', particle.radius.toFixed(2));
                node.setAttribute('opacity', particle.opacity.toFixed(3));
            });
            requestAnimationFrame(render);
        }
        requestAnimationFrame(render);
    }
    initHeartWave('#groupLoader', '#pathLoader');
    initHeartWave('#groupInitialLoader', '#pathInitialLoader');

    /* ═══ FULLSCREEN IDLE MODE ═══ */
    let idleTimer = null;
    function resetIdle() {
        if (!document.fullscreenElement) {
            const player = $('.player');
            if(player) {
                player.style.opacity = '1';
                player.style.pointerEvents = 'auto';
            }
            document.body.style.cursor = 'default';
            return;
        }
        const player = $('.player');
        if(player) {
            player.style.opacity = '1';
            player.style.pointerEvents = 'auto';
        }
        document.body.style.cursor = 'default';
        clearTimeout(idleTimer);
        idleTimer = setTimeout(() => {
            if (document.fullscreenElement && S.playing) {
                const player = $('.player');
                if(player) {
                    player.style.opacity = '0';
                    player.style.pointerEvents = 'none';
                }
                document.body.style.cursor = 'none';
            }
        }, 3000);
    }
    
    document.addEventListener('mousemove', resetIdle);
    document.addEventListener('mousedown', resetIdle);
    document.addEventListener('keydown', resetIdle);
    document.addEventListener('fullscreenchange', resetIdle);


    setTimeout(() => {
        const initL = document.getElementById('initialLoader');
        if (initL) {
            initL.style.opacity = '0';
            initL.style.visibility = 'hidden';
            setTimeout(() => { initL.style.display = 'none'; }, 850);
        }
    }, 2500);

})();
