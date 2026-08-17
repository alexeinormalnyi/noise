const albumData = {
  '22': {
    title: "Потлатий & Партнери",
    tag: "22",
    cover: "22albumcov.png",
    c1: "#2d3748",
    c2: "#1a2233",
    c3: "#080d1a",
    accent: "#a5b4fc",
    listens: 15000 + Math.floor(Math.random() * 8000),
    displayedListens: 0,
    links: { spotify: '#', apple: '#', ytmusic: '#' }
  },
  '22demos': {
    title: "Потлатий & Партнери",
    tag: "22 Demos",
    cover: "22demos.png",
    c1: "#1b332b",
    c2: "#11221a",
    c3: "#05140d",
    accent: "#34d399",
    listens: 3000 + Math.floor(Math.random() * 2500),
    displayedListens: 0,
    links: { spotify: '#', apple: '#', ytmusic: '#' }
  },
  'cspg': {
    title: "Alexei Normalnyi",
    tag: "Constant Stimulation of Penial Glands",
    cover: "csopgnew.png",
    c1: "#5c1000",
    c2: "#360a00",
    c3: "#1a0300",
    accent: "#ff5500",
    listens: 28000 + Math.floor(Math.random() * 12000),
    displayedListens: 0,
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
    listens: 8000 + Math.floor(Math.random() * 5000),
    displayedListens: 0,
    links: {
      spotify: 'https://open.spotify.com/album/79kVW8XxLtFkNkto2YdtZl?go=1&nd=1',
      apple: 'https://music.apple.com/ua/album/clip-v-parische-single/1889513888',
      ytmusic: 'https://music.youtube.com/playlist?list=OLAK5uy_nKaLl6EU7TxB2G0NKvtaWVETPKnfGyg98'
    }
  }
};

let currentTrackList = [];
let currentTrackIndex = -1;
let currentActiveAlbum = null;
const trackDataMap = new Map();
const activeAnimations = new Map();

// Cursor Following Ambient Blob Logic
document.addEventListener('mousemove', (e) => {
  const cursorBlob = document.getElementById('blob-cursor');
  if (cursorBlob) {
    cursorBlob.style.left = `${e.clientX}px`;
    cursorBlob.style.top = `${e.clientY}px`;
  }
});

// Dynamic Theme Switchers
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
  if (activeAnimations.has(element)) {
    cancelAnimationFrame(activeAnimations.get(element));
  }
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
    trackDataMap.set(track, {
      listens: randomTrackListens,
      displayedListens: 0,
      miniDisplayedListens: 0,
      element: listensEl
    });

    animateValue(listensEl, 0, randomTrackListens, 1000);
    trackDataMap.get(track).displayedListens = randomTrackListens;
  });
}

function updateMainPageAlbumListens() {
  Object.keys(albumData).forEach(key => {
    const mainEl = document.getElementById(`main-listens-${key}`);
    if (mainEl) {
      const start = albumData[key].displayedListens || 0;
      const end = albumData[key].listens;
      animateValue(mainEl, start, end, 1000);
      albumData[key].displayedListens = end;
    }
  });
}

function updateModalListensDisplay() {
  if (currentActiveAlbum && albumData[currentActiveAlbum]) {
    const listensEl = document.getElementById('listens-count');
    if (listensEl) {
      const start = albumData[currentActiveAlbum].modalDisplayedListens || 0;
      const end = albumData[currentActiveAlbum].listens;
      animateValue(listensEl, start, end, 1000);
      albumData[currentActiveAlbum].modalDisplayedListens = end;
    }
  }
}

function updateMiniPlayerTrackListens() {
  const miniListensEl = document.getElementById('mini-listens-count');
  if (!miniListensEl || currentTrackIndex === -1 || !currentTrackList[currentTrackIndex]) return;

  const activeTrackEl = currentTrackList[currentTrackIndex];
  const trackData = trackDataMap.get(activeTrackEl);

  if (trackData) {
    const start = trackData.miniDisplayedListens || 0;
    const end = trackData.listens;
    animateValue(miniListensEl, start, end, 1000);
    trackData.miniDisplayedListens = end;
  }
}

function initListensCounter() {
  updateMainPageAlbumListens();

  setInterval(() => {
    Object.keys(albumData).forEach(key => {
      albumData[key].listens += Math.floor(Math.random() * 7) + 1;
    });
    updateMainPageAlbumListens();
    updateModalListensDisplay();

    trackDataMap.forEach((data) => {
      const inc = Math.floor(Math.random() * 5) + 1;
      const start = data.displayedListens;
      data.listens += inc;
      animateValue(data.element, start, data.listens, 1000);
      data.displayedListens = data.listens;
    });

    updateMiniPlayerTrackListens();
  }, 4000);
}

document.addEventListener('DOMContentLoaded', () => {
  initTrackListens();
  initListensCounter();

  const player = document.getElementById('player');
  if (player) {
    player.addEventListener('play', syncPlayPauseState);
    player.addEventListener('pause', syncPlayPauseState);
  }
});

function animateArtworkFlyIn(sourceImg, targetImg) {
  if (!sourceImg || !targetImg) return;

  const startRect = sourceImg.getBoundingClientRect();
  if (!startRect.width || !startRect.height) return;

  targetImg.style.opacity = '0';

  const clone = sourceImg.cloneNode(true);
  clone.style.position = 'fixed';
  clone.style.top = `${startRect.top}px`;
  clone.style.left = `${startRect.left}px`;
  clone.style.width = `${startRect.width}px`;
  clone.style.height = `${startRect.height}px`;
  clone.style.borderRadius = getComputedStyle(sourceImg).borderRadius || '16px';
  clone.style.zIndex = '99999';
  clone.style.objectFit = 'cover';
  clone.style.pointerEvents = 'none';
  clone.style.boxShadow = '0 20px 50px rgba(0,0,0,0.85)';
  clone.style.transition = 'all 0.55s cubic-bezier(0.16, 1, 0.3, 1)';

  document.body.appendChild(clone);

  requestAnimationFrame(() => {
    const finalRect = targetImg.getBoundingClientRect();

    clone.style.top = `${finalRect.top}px`;
    clone.style.left = `${finalRect.left}px`;
    clone.style.width = `${finalRect.width}px`;
    clone.style.height = `${finalRect.height}px`;
    clone.style.borderRadius = '20px';

    setTimeout(() => {
      targetImg.style.opacity = '1';
      if (clone.parentNode) {
        clone.parentNode.removeChild(clone);
      }
    }, 550);
  });
}

function openAlbum(albumKey, originElement = null) {
  if (!albumData[albumKey]) return;

  const isSameAlbum = (currentActiveAlbum === albumKey);
  currentActiveAlbum = albumKey;
  const data = albumData[albumKey];

  applyMainPageTheme(albumKey);
  document.body.classList.add('modal-open');

  let sourceImg = null;
  if (originElement && originElement.querySelector('img')) {
    sourceImg = originElement.querySelector('img');
  } else {
    const matchingCard = document.querySelector(`.album-card[onclick*="'${albumKey}'"] img`);
    if (matchingCard) sourceImg = matchingCard;
  }

  const miniPlayer = document.getElementById('mini-player');
  if (miniPlayer) {
    miniPlayer.classList.remove('active');
    setTimeout(() => {
      if (!miniPlayer.classList.contains('active')) {
        miniPlayer.style.display = 'none';
      }
    }, 450);
  }

  const expandedView = document.getElementById('expanded-view');
  const expandedCover = document.getElementById('expanded-cover');
  const expandedAlbumTitle = document.getElementById('expanded-album-title');
  const spotifyLink = document.getElementById('spotify-link');
  const appleLink = document.getElementById('apple-link');
  const ytmusicLink = document.getElementById('ytmusic-link');

  if (expandedCover) expandedCover.src = data.cover;
  if (expandedAlbumTitle) expandedAlbumTitle.innerText = `${data.title} — ${data.tag}`;

  if (expandedView) {
    expandedView.style.setProperty('--album-c1', data.c1);
    expandedView.style.setProperty('--album-c2', data.c2);
    expandedView.style.setProperty('--album-c3', data.c3);
    expandedView.style.setProperty('--accent', data.accent);
  }

  data.modalDisplayedListens = 0;
  updateModalListensDisplay();

  document.querySelectorAll('.track-list-box').forEach(el => el.style.display = 'none');
  const activeList = document.getElementById(`list-${albumKey}`);
  if (activeList) {
    activeList.style.display = 'flex';
    currentTrackList = Array.from(activeList.querySelectorAll('.track'));

    if (!isSameAlbum || currentTrackIndex === -1 || !currentTrackList[currentTrackIndex]) {
      currentTrackIndex = 0;
    }

    const trackToPlay = currentTrackList[currentTrackIndex] || currentTrackList[0];
    if (trackToPlay) {
      const trackNameEl = document.getElementById('player-track-name');
      const albumNameEl = document.getElementById('player-album-name');
      const nameSpan = trackToPlay.querySelector('.track-name');
      const rawName = nameSpan ? (nameSpan.textContent || nameSpan.innerText || "").trim() : trackToPlay.textContent.trim();
      const cleanedName = cleanTrackName(rawName);

      if (trackNameEl) trackNameEl.innerText = cleanedName || data.tag || data.title;
      if (albumNameEl) albumNameEl.innerText = data.tag || data.title;

      playTrack(trackToPlay);
    }
  }

  if (spotifyLink) spotifyLink.href = data.links.spotify;
  if (appleLink) appleLink.href = data.links.apple;
  if (ytmusicLink) ytmusicLink.href = data.links.ytmusic;

  if (expandedView) {
    expandedView.style.display = 'flex';
    void expandedView.offsetWidth;
    expandedView.classList.add('active');

    if (sourceImg && expandedCover) {
      animateArtworkFlyIn(sourceImg, expandedCover);
    }
  }
}

function closeExpandedAlbum() {
  const expandedView = document.getElementById('expanded-view');
  const miniPlayer = document.getElementById('mini-player');
  const player = document.getElementById('player');

  document.body.classList.remove('modal-open');

  const hasTrackPlayingOrLoaded = player && (player.src || !player.paused) && currentTrackIndex !== -1;

  if (expandedView) {
    expandedView.classList.remove('active');
    setTimeout(() => {
      if (!expandedView.classList.contains('active')) {
        expandedView.style.display = 'none';
      }
    }, 350);
  }

  if (hasTrackPlayingOrLoaded && miniPlayer) {
    miniPlayer.style.display = 'flex';
    void miniPlayer.offsetWidth;
    miniPlayer.classList.add('active');
  } else {
    currentActiveAlbum = null;
    resetMainPageTheme();
  }
}

function reopenFullPlayer() {
  if (currentActiveAlbum) {
    openAlbum(currentActiveAlbum);
  }
}

function dismissMiniPlayer() {
  const miniPlayer = document.getElementById('mini-player');
  const player = document.getElementById('player');

  document.body.classList.remove('modal-open');

  if (miniPlayer) {
    miniPlayer.classList.remove('active');
    setTimeout(() => {
      if (!miniPlayer.classList.contains('active')) {
        miniPlayer.style.display = 'none';
      }
    }, 450);
  }
  if (player) player.pause();
  resetMainPageTheme();
}

function playTrack(trackEl) {
  const player = document.getElementById('player');
  const lyricsBox = document.getElementById('lyrics-box');

  document.querySelectorAll('.track').forEach(el => el.classList.remove('active'));
  trackEl.classList.add('active');

  const file = trackEl.getAttribute('data-file');
  if (file && player) {
    const currentSrc = decodeURIComponent(player.src);
    if (!currentSrc.endsWith(file)) {
      player.src = file;
      player.play().catch(e => console.log('Playback error:', e));
    } else if (player.paused) {
      player.play().catch(e => console.log('Playback error:', e));
    }
  }

  const text = (typeof lyricsData !== 'undefined' && lyricsData[file]) ? lyricsData[file] : 'no lyrics';

  if (lyricsBox) {
    if (!text || text.trim() === '' || text.trim() === 'no lyrics') {
      lyricsBox.innerText = 'Текст відсутній / No lyrics available';
    } else {
      lyricsBox.innerText = text;
    }
  }

  const parentBox = trackEl.closest('.track-list-box');
  if (parentBox) {
    currentTrackList = Array.from(parentBox.querySelectorAll('.track'));
    currentTrackIndex = currentTrackList.indexOf(trackEl);
  }

  updatePlayerTrackInfo(trackEl);
  updateMiniPlayerInfo(trackEl);
}

function updatePlayerTrackInfo(trackEl) {
  const trackNameEl = document.getElementById('player-track-name');
  const albumNameEl = document.getElementById('player-album-name');
  if (!currentActiveAlbum || !albumData[currentActiveAlbum]) return;

  if (!trackEl && currentTrackList.length > 0) {
    trackEl = currentTrackList[currentTrackIndex >= 0 ? currentTrackIndex : 0];
  }

  const data = albumData[currentActiveAlbum];
  const albumName = data.tag || data.title;

  let songName = "";
  if (trackEl) {
    const nameSpan = trackEl.querySelector('.track-name');
    songName = nameSpan ? (nameSpan.textContent || nameSpan.innerText || "").trim() : trackEl.textContent.trim();
  }

  songName = cleanTrackName(songName);

  if (!songName && currentTrackList.length > 0) {
    const firstTrack = currentTrackList[0];
    const firstSpan = firstTrack.querySelector('.track-name');
    const firstRaw = firstSpan ? (firstSpan.textContent || firstSpan.innerText || "").trim() : firstTrack.textContent.trim();
    songName = cleanTrackName(firstRaw);
  }

  if (trackNameEl) trackNameEl.innerText = songName || "Select a Track";
  if (albumNameEl) albumNameEl.innerText = albumName;
}

function updateMiniPlayerInfo(trackEl) {
  const miniCover = document.getElementById('mini-cover');
  const miniTitle = document.getElementById('mini-title');

  if (!trackEl && currentTrackList.length > 0) {
    trackEl = currentTrackList[currentTrackIndex >= 0 ? currentTrackIndex : 0];
  }

  if (!trackEl || !currentActiveAlbum || !albumData[currentActiveAlbum]) return;

  const data = albumData[currentActiveAlbum];
  if (miniCover) miniCover.src = data.cover;

  const nameEl = trackEl.querySelector('.track-name');
  let songName = nameEl ? (nameEl.textContent || nameEl.innerText || "").trim() : trackEl.textContent.trim();
  songName = cleanTrackName(songName);

  if (!songName && currentTrackList.length > 0) {
    const firstTrack = currentTrackList[0];
    const firstSpan = firstTrack.querySelector('.track-name');
    const firstRaw = firstSpan ? (firstSpan.textContent || firstSpan.innerText || "").trim() : firstTrack.textContent.trim();
    songName = cleanTrackName(firstRaw);
  }

  const albumName = data.tag || data.title;

  if (miniTitle) {
    miniTitle.innerText = `${songName} - ${albumName}`;
  }

  updateMiniPlayerTrackListens();
}

function syncPlayPauseState() {
  const player = document.getElementById('player');
  const miniPlayBtn = document.getElementById('mini-play-btn');
  if (!player || !miniPlayBtn) return;

  const btnTextEl = miniPlayBtn.querySelector('.btn-text');
  if (player.paused) {
    if (btnTextEl) btnTextEl.innerText = ' PLAY';
  } else {
    if (btnTextEl) btnTextEl.innerText = ' PAUSE';
  }
}

function prevTrack() {
  if (currentTrackList.length === 0 || currentTrackIndex <= 0) return;
  currentTrackIndex--;
  playTrack(currentTrackList[currentTrackIndex]);
}

function nextTrack() {
  if (currentTrackList.length === 0 || currentTrackIndex >= currentTrackList.length - 1) return;
  currentTrackIndex++;
  playTrack(currentTrackList[currentTrackIndex]);
}

function togglePlayPause() {
  const player = document.getElementById('player');
  if (!player) return;
  if (player.paused) {
    player.play();
  } else {
    player.pause();
  }
}
