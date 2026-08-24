// ======================================================================
// VIDEO CONFIGURATION
// ======================================================================

const clipFiles = [
  "Clip v Parische.mp4", 
  "Clip v Parische.exe.mp4" 
];

const equalizerFiles = [
  "blyuaha muha.mp4", "це експерементальний хіп хоп суки.mp4", "hype melstroy che.mp4", "sintisator noobprohackergod.mp4", "vitaliy ventilator (feat. Vitalya).mp4", "status.mp4", "альтуха номер 16.mp4", "межконтинентальний звонок (intro).mp4", "22.mp4", "running (за бітом).mp4", 
  "sperma na dzinsax (feat. Chaykovskiy, Floor).mp4", "martin.mp4", "dimon hendryx.mp4", "секс наркота і партньори (prod. Alexei Normalnyi).mp4", "death grips - форс.mp4", "jpegmafia - лох.mp4", "только 5 процентоф людей не заплакало от єтой песни.mp4", "Clip v Parische (House Limited Edition).mp4", "companiya zla.mp4", "smert navalnogo 16.02.24.mp4", 
  "gemini pizdun.mp4", "konec alboma (gotovo).mp4"
];

// ======================================================================
// AUDIO ALBUM DATA
// ======================================================================
const albumData = {
  '22': {
    title: "Потлатий & Партнери",
    tag: "22",
    cover: "22albumcov.png",
    c1: "#2d3748",
    c2: "#1a2233",
    c3: "#080d1a",
    accent: "#a5b4fc",
    status: 'released',
    links: { soundcloud: 'https://soundcloud.com/potlatiypartnyori/sets/22a' } 
  },
  '22demos': {
    title: "Потлатий & Партнери",
    tag: "22 Demos",
    cover: "22demos.png",
    c1: "#1b332b",
    c2: "#11221a",
    c3: "#05140d",
    accent: "#34d399",
    status: 'unreleased',
    links: {}
  },
  'cspg': {
    title: "Alexei Normalnyi",
    tag: "Constant Stimulation of Penial Glands",
    cover: "csopgnew.png",
    c1: "#5c1000",
    c2: "#360a00",
    c3: "#1a0300",
    accent: "#ff5500",
    status: 'released',
    links: {
      spotify: 'https://open.spotify.com/album/2Xt4WIICyGiVKsSUJqeXxN?go=1&nd=1',
      apple: 'https://music.apple.com/ua/album/constant-stimulation-of-penial-glands/1895401622',
      ytmusic: 'https://music.youtube.com/playlist?list=OLAK5uy_mBKeQ6psKyPgW90CNi_EKRHSkR4EyxBy4'
    }
  },
  'cvp': {
    title: "Потлатий & Партнери",
    tag: "Clip v Parische",
    cover: "clipcover.png",
    c1: "#334155",
    c2: "#1e293b",
    c3: "#0f172a",
    accent: "#38bdf8",
    status: 'released',
    links: {
      spotify: 'https://open.spotify.com/album/79kVW8XxLtFkNkto2YdtZl?go=1&nd=1',
      apple: 'https://music.apple.com/ua/album/clip-v-parische-single/1889513888',
      ytmusic: 'https://music.youtube.com/playlist?list=OLAK5uy_nKaLl6EU7TxB2G0NKvtaWVETPKnfGyg98'
    }
  },
  'jungle': {
    title: "Iroquois Plissken",
    tag: "Jungle Sub-volume 01",
    cover: "jngl.png",
    c1: "#142612",
    c2: "#0c170b",
    c3: "#050a05",
    accent: "#4ade80",
    status: 'unreleased',
    links: { soundcloud: 'https://soundcloud.com/potlatiypartnyori' }
  },
  'soon': {
    title: "Потлатий & Партнери",
    tag: "Coming soon",
    cover: "question.png",
    c1: "#2d2d2d",
    c2: "#1a1a1a",
    c3: "#0d0d0d",
    accent: "#a3a3a3",
    status: 'unreleased',
    links: {}
  }
};

let currentTrackList = [];
let currentTrackIndex = -1;
let currentActiveAlbum = null; 
let currentlyPlayingAlbum = null; 
let currentPlayingTrackElement = null; 
const trackDataMap = new Map();
const activeAnimations = new Map();
let modalStateTimeout;

let wasAudioPlayingBeforeVideo = false;

document.addEventListener('mousemove', (e) => {
  const cursorBlob = document.getElementById('blob-cursor');
  if (cursorBlob) {
    cursorBlob.style.left = `${e.clientX}px`;
    cursorBlob.style.top = `${e.clientY}px`;
  }
});

function switchTab(tabId) {
  document.querySelectorAll('.page-section').forEach(sec => sec.classList.remove('active'));
  document.getElementById('section-' + tabId).classList.add('active');
  document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
  document.getElementById('nav-' + tabId).classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderVideos() {
  const clipsGrid = document.getElementById('clips-grid');
  const eqsGrid = document.getElementById('eqs-grid');

  if (clipsGrid) {
    clipsGrid.innerHTML = '';
    clipFiles.forEach((file, index) => {
      let title = "";
      if (index === 0) title = file ? file.replace(/\.[^/.]+$/, "") : "Clip v Parische";
      else if (index === 1) title = file ? file.replace(/\.[^/.]+$/, "") : "Clip v Parische.exe";
      else title = file ? file.replace(/\.[^/.]+$/, "") : `Clip ${index + 1}`;

      const card = createVideoCard(file, 'clips', title);
      clipsGrid.appendChild(card);
    });
  }

  if (eqsGrid) {
    eqsGrid.innerHTML = '';
    equalizerFiles.forEach((file, index) => {
      let title = file ? file.replace(/\.[^/.]+$/, "") : `Equalizer ${index + 1} (Pending)`;
      const card = createVideoCard(file, 'eqs', title);
      eqsGrid.appendChild(card);
    });
  }
}

function createVideoCard(fileName, folder, title) {
  const card = document.createElement('div');
  card.className = 'yt-card glass-card video-card';

  const videoWrapper = document.createElement('div');
  videoWrapper.className = 'video-wrapper';

  if (fileName) {
    const videoEl = document.createElement('video');
    videoEl.controls = true;
    videoEl.preload = 'metadata';
    videoEl.src = `${folder}/${fileName}`;

    videoEl.addEventListener('play', (e) => {
      document.querySelectorAll('video').forEach(vid => {
        if (vid !== e.target && !vid.paused) vid.pause();
      });

      const player = document.getElementById('player');
      if (player && !player.paused) {
        wasAudioPlayingBeforeVideo = true;
        player.pause();
      }
    });

    const handleVideoStop = () => {
      const player = document.getElementById('player');
      const isAnyVideoPlaying = Array.from(document.querySelectorAll('video')).some(vid => !vid.paused);
      
      if (!isAnyVideoPlaying && player && wasAudioPlayingBeforeVideo) {
        player.play().catch(e => console.log('Playback resume error:', e));
        wasAudioPlayingBeforeVideo = false;
      }
    };

    videoEl.addEventListener('pause', handleVideoStop);

    if (folder === 'eqs') {
      videoEl.addEventListener('ended', (e) => {
        handleVideoStop();
        
        const parentGrid = e.target.closest('.yt-grid');
        if (parentGrid) {
          const videos = Array.from(parentGrid.querySelectorAll('video'));
          const currentIndex = videos.indexOf(e.target);
          if (currentIndex !== -1 && currentIndex < videos.length - 1) {
            const nextVideo = videos[currentIndex + 1];
            nextVideo.play().catch(err => console.log('Auto-play next visualizer prevented by browser:', err));
          }
        }
      });
    } else {
      videoEl.addEventListener('ended', handleVideoStop);
    }

    videoWrapper.appendChild(videoEl);
  } else {
    videoWrapper.classList.add('no-video');
    videoWrapper.innerHTML = `<span class="empty-video-icon">🎥<br></span>`;
  }

  const infoDiv = document.createElement('div');
  infoDiv.className = 'yt-info';

  const titleDiv = document.createElement('div');
  titleDiv.className = 'yt-title';
  titleDiv.innerText = title;

  const subtitleDiv = document.createElement('div');
  subtitleDiv.className = 'yt-subtitle';
  subtitleDiv.style.fontSize = '0.85rem';
  subtitleDiv.style.color = '#94a3b8';
  subtitleDiv.style.marginTop = '0.2rem';
  subtitleDiv.innerText = 'Потлатий & Партнери';

  infoDiv.appendChild(titleDiv);
  infoDiv.appendChild(subtitleDiv);
  
  card.appendChild(videoWrapper);
  card.appendChild(infoDiv);

  return card;
}

function applyMainPageTheme(albumKey) {
  if (!albumKey || !albumData[albumKey]) return;
  const data = albumData[albumKey];
  const root = document.documentElement;

  root.style.setProperty('--main-c1', data.accent);
  root.style.setProperty('--main-c1-dark', data.c1);
  root.style.setProperty('--main-c2', data.c1);
  root.style.setProperty('--main-c2-dark', data.c2);
  root.style.setProperty('--main-c3', data.accent);
  root.style.setProperty('--main-c3-dark', data.c3);
  root.style.setProperty('--main-bg-color', data.c3);
  root.style.setProperty('--accent', data.accent);
}

function resetMainPageTheme() {
  const root = document.documentElement;
  root.style.setProperty('--main-c1', 'rgba(255, 255, 255, 0.35)');
  root.style.setProperty('--main-c1-dark', 'rgba(30, 30, 35, 0.8)');
  root.style.setProperty('--main-c2', 'rgba(200, 200, 200, 0.25)');
  root.style.setProperty('--main-c2-dark', 'rgba(0, 0, 0, 0.95)');
  root.style.setProperty('--main-c3', 'rgba(255, 255, 255, 0.3)');
  root.style.setProperty('--main-c3-dark', 'rgba(15, 15, 20, 0.85)');
  root.style.setProperty('--main-bg-color', '#050608');
  root.style.setProperty('--accent', '#a5b4fc');
}

function cleanTrackName(name) {
  if (!name) return "";
  return name.replace(/^\d+[\s.\-_]+/g, '').trim();
}

function animateValue(element, startVal, endVal, duration = 1000, suffix = " listens") {
  if (!element) return;
  if (activeAnimations.has(element)) cancelAnimationFrame(activeAnimations.get(element));
  let startTime = null;

  function step(timestamp) {
    if (!startTime) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);
    const val = Math.floor(startVal + (endVal - startVal) * progress);
    element.textContent = `${val.toLocaleString()}${suffix}`;
    if (progress < 1) {
      const animId = requestAnimationFrame(step);
      activeAnimations.set(element, animId);
    } else {
      activeAnimations.delete(element);
    }
  }
  const animId = requestAnimationFrame(step);
  activeAnimations.set(element, animId);
}

function initTrackListens() {
  const tracks = document.querySelectorAll('.track');
  tracks.forEach((track) => {
    let nameEl = track.querySelector('.track-name');
    if (!nameEl) {
      const text = track.textContent.trim();
      track.textContent = '';
      nameEl = document.createElement('span');
      nameEl.className = 'track-name';
      nameEl.textContent = text;
      track.appendChild(nameEl);
    }

    let listensEl = track.querySelector('.track-listens');
    if (!listensEl) {
      listensEl = document.createElement('span');
      listensEl.className = 'track-listens';
      track.appendChild(listensEl);
    }

    const randomTrackListens = Math.floor(Math.random() * 12000) + 400 + Math.floor(Math.random() * 500);
    trackDataMap.set(track, { listens: randomTrackListens, displayedListens: randomTrackListens, miniDisplayedListens: randomTrackListens, element: listensEl });
    animateValue(listensEl, 0, randomTrackListens, 1000);
  });
}

function initListensCounter() {
  setInterval(() => {
    trackDataMap.forEach((data) => {
      const start = data.displayedListens;
      data.listens += Math.floor(Math.random() * 5) + 1;
      animateValue(data.element, start, data.listens, 1000);
      data.displayedListens = data.listens;
    });
  }, 4000);
}

document.addEventListener('DOMContentLoaded', () => {
  renderVideos();
  initTrackListens();
  initListensCounter();

  Object.keys(albumData).forEach(key => {
    const statusEl = document.getElementById(`status-${key}`);
    if (statusEl) {
      const isReleased = albumData[key].status === 'released';
      statusEl.innerText = isReleased ? 'Released' : 'Unreleased';
      statusEl.className = 'album-card-status ' + (isReleased ? 'status-released' : 'status-unreleased');
    }
  });

  const player = document.getElementById('player');
  if (player) {
    player.addEventListener('play', syncPlayPauseState);
    player.addEventListener('pause', syncPlayPauseState);
    player.addEventListener('ended', nextTrack); 
  }
});

function openAlbum(albumKey, originElement = null) {
  if (!albumData[albumKey]) return;
  currentActiveAlbum = albumKey;
  const data = albumData[albumKey];

  // Instantly enforce the selected album theme across the app
  applyMainPageTheme(albumKey);

  document.body.classList.add('modal-open');

  const miniPlayer = document.getElementById('mini-player');
  if (miniPlayer) {
    miniPlayer.classList.remove('active');
    setTimeout(() => { if (!miniPlayer.classList.contains('active')) miniPlayer.style.display = 'none'; }, 450);
  }

  const expandedView = document.getElementById('expanded-view');
  const expandedCover = document.getElementById('expanded-cover');
  const expandedAlbumTitle = document.getElementById('expanded-album-title');
  const spotifyLink = document.getElementById('spotify-link');
  const appleLink = document.getElementById('apple-link');
  const ytmusicLink = document.getElementById('ytmusic-link');
  const soundcloudLink = document.getElementById('soundcloud-link');

  // Enforce selected album visual information strictly
  if (expandedCover) expandedCover.src = data.cover;
  if (expandedAlbumTitle) expandedAlbumTitle.innerText = `${data.title} — ${data.tag}`;

  if (expandedView) {
    expandedView.style.setProperty('--album-c1', data.c1);
    expandedView.style.setProperty('--album-c2', data.c2);
    expandedView.style.setProperty('--album-c3', data.c3);
    expandedView.style.setProperty('--accent', data.accent);
  }

  // Handle the 'Currently Playing Banner' Logic
  const banner = document.getElementById('modal-now-playing-banner');
  if (currentlyPlayingAlbum && currentlyPlayingAlbum !== albumKey) {
    if (banner) {
      banner.style.display = 'flex';
      const pData = albumData[currentlyPlayingAlbum];
      let songName = "Track";
      if (currentPlayingTrackElement) {
         const n = currentPlayingTrackElement.querySelector('.track-name');
         songName = cleanTrackName(n ? n.textContent.trim() : currentPlayingTrackElement.textContent.trim());
      }
      const textEl = document.getElementById('modal-now-playing-text');
      if (textEl) textEl.innerText = `${songName} - ${pData.tag || pData.title}`;
    }
  } else {
    if (banner) banner.style.display = 'none';
  }

  document.querySelectorAll('.track-list-box').forEach(el => el.style.display = 'none');
  const activeList = document.getElementById(`list-${albumKey}`);
  if (activeList) {
    activeList.style.display = 'flex';
    currentTrackList = Array.from(activeList.querySelectorAll('.track'));

    if (currentlyPlayingAlbum === albumKey && currentPlayingTrackElement) {
      currentTrackList.forEach(el => el.classList.remove('active'));
      currentPlayingTrackElement.classList.add('active');
      currentTrackIndex = currentTrackList.indexOf(currentPlayingTrackElement);
      
      const rawFile = currentPlayingTrackElement.getAttribute('data-file');
      const lyricsBox = document.getElementById('lyrics-box');
      const text = (typeof lyricsData !== 'undefined' && lyricsData[rawFile]) ? lyricsData[rawFile] : 'no lyrics';
      if (lyricsBox) lyricsBox.innerText = (!text || text.trim() === '' || text === 'no lyrics') ? 'Текст відсутній / No lyrics available' : text;
    } else {
      const player = document.getElementById('player');
      const isPlayingOrLoaded = player && player.src && player.src !== window.location.href && player.currentSrc !== "";

      if (!isPlayingOrLoaded) {
        currentTrackIndex = currentTrackList.length > 0 ? 0 : -1;
        const trackToPlay = currentTrackList[currentTrackIndex];
        if (trackToPlay) {
          playTrack(trackToPlay);
        }
      } else {
        currentTrackList.forEach(el => el.classList.remove('active'));
        if (currentlyPlayingAlbum === albumKey && currentPlayingTrackElement) {
          currentPlayingTrackElement.classList.add('active');
          currentTrackIndex = currentTrackList.indexOf(currentPlayingTrackElement);
        } else {
          currentTrackIndex = 0;
        }
      }
    }
    updatePlayerTrackInfo();
    updateMiniPlayerInfo(currentlyPlayingAlbum === albumKey ? currentPlayingTrackElement : null);
  }

  if (soundcloudLink) soundcloudLink.onclick = null;
  
  if (albumKey === '22' || albumKey === '22demos' || albumKey === 'jungle' || albumKey === 'soon') {
    if (spotifyLink) spotifyLink.style.display = 'none';
    if (appleLink) appleLink.style.display = 'none';
    if (ytmusicLink) ytmusicLink.style.display = 'none';
    
    if (soundcloudLink) {
      soundcloudLink.style.display = 'inline-block';
      if (albumKey === '22demos' || albumKey === 'soon') {
        soundcloudLink.innerText = 'UNRELEASED';
        soundcloudLink.href = '#';
        soundcloudLink.onclick = (e) => {
          e.preventDefault();
          closeExpandedAlbum();
          switchTab('home');
        };
      } else {
        soundcloudLink.innerText = 'SoundCloud';
        soundcloudLink.href = data.links?.soundcloud || '#';
      }
    }
  } else {
    if (spotifyLink) { spotifyLink.style.display = 'inline-block'; spotifyLink.href = data.links?.spotify || '#'; }
    if (appleLink) { appleLink.style.display = 'inline-block'; appleLink.href = data.links?.apple || '#'; }
    if (ytmusicLink) { ytmusicLink.style.display = 'inline-block'; ytmusicLink.href = data.links?.ytmusic || '#'; }
    if (soundcloudLink) soundcloudLink.style.display = 'none';
  }

  if (modalStateTimeout) clearTimeout(modalStateTimeout);

  if (expandedView) {
    expandedView.style.display = 'flex';
    void expandedView.offsetWidth;
    expandedView.classList.add('active');
  }
}

function closeExpandedAlbum() {
  const expandedView = document.getElementById('expanded-view');
  const miniPlayer = document.getElementById('mini-player');
  const player = document.getElementById('player');

  document.body.classList.remove('modal-open');
  const hasTrackPlayingOrLoaded = player && (player.src || !player.paused) && currentTrackIndex !== -1;

  if (modalStateTimeout) clearTimeout(modalStateTimeout);

  if (expandedView) {
    expandedView.classList.remove('active');
    modalStateTimeout = setTimeout(() => {
      if (!expandedView.classList.contains('active')) expandedView.style.display = 'none';
    }, 300);
  }

  if (hasTrackPlayingOrLoaded && miniPlayer) {
    miniPlayer.style.display = 'flex';
    void miniPlayer.offsetWidth;
    miniPlayer.classList.add('active');
    // Important theme reset: when you close modal, theme snaps back to the playing album
    if (currentlyPlayingAlbum) applyMainPageTheme(currentlyPlayingAlbum);
  } else {
    currentActiveAlbum = null;
    currentlyPlayingAlbum = null;
    resetMainPageTheme();
  }
}

function reopenFullPlayer() {
  const targetAlbum = currentlyPlayingAlbum || currentActiveAlbum;
  if (targetAlbum) openAlbum(targetAlbum, document.getElementById('mini-player'));
}

function dismissMiniPlayer() {
  const miniPlayer = document.getElementById('mini-player');
  const player = document.getElementById('player');
  document.body.classList.remove('modal-open');
  
  if (modalStateTimeout) clearTimeout(modalStateTimeout);
  if (miniPlayer) {
    miniPlayer.classList.remove('active');
    setTimeout(() => { if (!miniPlayer.classList.contains('active')) miniPlayer.style.display = 'none'; }, 450);
  }
  if (player) player.pause();
  currentlyPlayingAlbum = null;
  currentPlayingTrackElement = null;
  resetMainPageTheme();
}

function playTrack(trackEl) {
  const player = document.getElementById('player');
  const lyricsBox = document.getElementById('lyrics-box');
  
  wasAudioPlayingBeforeVideo = false;

  const parentBox = trackEl.closest('.track-list-box');
  if (parentBox) {
    const boxId = parentBox.id; 
    if (boxId && boxId.startsWith('list-')) {
      currentlyPlayingAlbum = boxId.replace('list-', '');
    }
  }

  currentPlayingTrackElement = trackEl;

  // The moment we play a track, shift theme to this new album
  applyMainPageTheme(currentlyPlayingAlbum);

  const banner = document.getElementById('modal-now-playing-banner');
  if (banner) banner.style.display = 'none';

  const expandedView = document.getElementById('expanded-view');
  if (expandedView && currentlyPlayingAlbum && albumData[currentlyPlayingAlbum]) {
    const data = albumData[currentlyPlayingAlbum];
    expandedView.style.setProperty('--album-c1', data.c1);
    expandedView.style.setProperty('--album-c2', data.c2);
    expandedView.style.setProperty('--album-c3', data.c3);
    expandedView.style.setProperty('--accent', data.accent);

    const expandedCover = document.getElementById('expanded-cover');
    if (expandedCover) expandedCover.src = data.cover;
  }

  document.querySelectorAll('.track').forEach(el => el.classList.remove('active'));
  trackEl.classList.add('active');

  const rawFile = trackEl.getAttribute('data-file');
  const file = rawFile ? (rawFile.startsWith('music/') ? rawFile : `music/${rawFile}`) : '';

  if (file && player) {
    if (!decodeURIComponent(player.src).endsWith(file)) {
      player.src = file;
      player.play().catch(e => console.log('Playback error:', e));
    } else if (player.paused) {
      player.play().catch(e => console.log('Playback error:', e));
    }
  }

  const text = (typeof lyricsData !== 'undefined' && lyricsData[rawFile]) ? lyricsData[rawFile] : 'no lyrics';
  if (lyricsBox) lyricsBox.innerText = (!text || text.trim() === '' || text === 'no lyrics') ? 'Текст відсутній / No lyrics available' : text;

  if (parentBox) {
    currentTrackList = Array.from(parentBox.querySelectorAll('.track'));
    currentTrackIndex = currentTrackList.indexOf(trackEl);
  }

  updatePlayerTrackInfo();
  updateMiniPlayerInfo(trackEl);
}

function updatePlayerTrackInfo(trackEl) {
  const trackNameEl = document.getElementById('player-track-name');
  const albumNameEl = document.getElementById('player-album-name');
  
  const targetAlbum = currentActiveAlbum;
  if (!targetAlbum || !albumData[targetAlbum]) return;

  const data = albumData[targetAlbum];

  // Display 'Select a track' if viewing another album
  if (currentlyPlayingAlbum && currentlyPlayingAlbum !== targetAlbum) {
    if (trackNameEl) trackNameEl.innerText = "Select a Track";
    if (albumNameEl) albumNameEl.innerText = data.tag || data.title;
    return;
  }

  if (!trackEl && currentlyPlayingAlbum === targetAlbum) {
    trackEl = currentPlayingTrackElement;
  }
  
  let songName = "";
  if (trackEl) {
    const nameSpan = trackEl.querySelector('.track-name');
    songName = nameSpan ? nameSpan.textContent.trim() : trackEl.textContent.trim();
  }

  songName = cleanTrackName(songName);
  if (trackNameEl) trackNameEl.innerText = songName || "Select a Track";
  if (albumNameEl) albumNameEl.innerText = data.tag || data.title;
}

function updateMiniPlayerInfo(trackEl) {
  const miniCover = document.getElementById('mini-cover');
  const miniTitle = document.getElementById('mini-title');
  
  const targetAlbum = currentlyPlayingAlbum || currentActiveAlbum;
  if (!targetAlbum || !albumData[targetAlbum]) return;

  if (!trackEl && currentlyPlayingAlbum === targetAlbum) {
    trackEl = currentPlayingTrackElement;
  }
  
  if (!trackEl) return;

  const data = albumData[targetAlbum];
  if (miniCover) miniCover.src = data.cover;

  const nameEl = trackEl.querySelector('.track-name');
  let songName = cleanTrackName(nameEl ? nameEl.textContent.trim() : trackEl.textContent.trim());

  if (miniTitle) miniTitle.innerText = `${songName} - ${data.tag || data.title}`;
}

function syncPlayPauseState() {
  const player = document.getElementById('player');
  const miniPlayBtn = document.getElementById('mini-play-btn');
  if (!player || !miniPlayBtn) return;
  const btnTextEl = miniPlayBtn.querySelector('.btn-text');
  if (btnTextEl) btnTextEl.innerText = player.paused ? ' PLAY' : ' PAUSE';
}

function prevTrack() {
  if (currentTrackList.length === 0 || currentTrackIndex <= 0) return;
  playTrack(currentTrackList[--currentTrackIndex]);
}

function nextTrack() {
  if (currentTrackList.length === 0 || currentTrackIndex >= currentTrackList.length - 1) return;
  playTrack(currentTrackList[++currentTrackIndex]);
}

function togglePlayPause() {
  const player = document.getElementById('player');
  if (!player || !player.src || player.currentSrc === "" || player.src.endsWith(window.location.host + '/')) return;
  
  wasAudioPlayingBeforeVideo = false;

  player.paused ? player.play() : player.pause();
}