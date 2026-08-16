const albumData = {
  '22': {
    title: "Потлатий & Партнери",
    tag: "Album 22",
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
let countAnimId = null;

function animateListens(targetValue) {
  const listensEl = document.getElementById('listens-count');
  if (!listensEl || !currentActiveAlbum) return;

  if (countAnimId) cancelAnimationFrame(countAnimId);

  const start = albumData[currentActiveAlbum].displayedListens || 0;
  const end = targetValue;
  const duration = 1000;
  let startTime = null;

  function step(timestamp) {
    if (!startTime) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);
    const val = Math.floor(start + (end - start) * progress);
    albumData[currentActiveAlbum].displayedListens = val;
    listensEl.textContent = `${val.toLocaleString()} listens`;
    if (progress < 1) {
      countAnimId = requestAnimationFrame(step);
    }
  }
  countAnimId = requestAnimationFrame(step);
}

function updateListensDisplay() {
  if (currentActiveAlbum && albumData[currentActiveAlbum]) {
    animateListens(albumData[currentActiveAlbum].listens);
  }
}

function initListensCounter() {
  setInterval(() => {
    Object.keys(albumData).forEach(key => {
      albumData[key].listens += Math.floor(Math.random() * 7) + 1;
    });
    updateListensDisplay();
  }, 4000);
}

document.addEventListener('DOMContentLoaded', () => {
  initListensCounter();

  const player = document.getElementById('player');
  if (player) {
    player.addEventListener('play', syncPlayPauseState);
    player.addEventListener('pause', syncPlayPauseState);
  }
});

function openAlbum(albumKey) {
  if (!albumData[albumKey]) return;

  const isSameAlbum = (currentActiveAlbum === albumKey);
  currentActiveAlbum = albumKey;
  albumData[albumKey].displayedListens = 0;
  const data = albumData[albumKey];

  const miniPlayer = document.getElementById('mini-player');
  if (miniPlayer) miniPlayer.classList.remove('active');

  const expandedView = document.getElementById('expanded-view');
  const expandedCover = document.getElementById('expanded-cover');
  const expandedAlbumTitle = document.getElementById('expanded-album-title');
  const spotifyLink = document.getElementById('spotify-link');
  const appleLink = document.getElementById('apple-link');
  const ytmusicLink = document.getElementById('ytmusic-link');

  expandedCover.src = data.cover;
  expandedAlbumTitle.innerText = `${data.title} — ${data.tag}`;

  expandedView.style.setProperty('--album-c1', data.c1);
  expandedView.style.setProperty('--album-c2', data.c2);
  expandedView.style.setProperty('--album-c3', data.c3);
  expandedView.style.setProperty('--accent', data.accent);

  updateListensDisplay();

  document.querySelectorAll('.track-list-box').forEach(el => el.style.display = 'none');
  const activeList = document.getElementById(`list-${albumKey}`);
  if (activeList) {
    activeList.style.display = 'block';
    if (!isSameAlbum || currentTrackIndex === -1) {
      const firstTrack = activeList.querySelector('.track');
      if (firstTrack) {
        playTrack(firstTrack);
      }
    }
  }

  if (spotifyLink) spotifyLink.href = data.links.spotify;
  if (appleLink) appleLink.href = data.links.apple;
  if (ytmusicLink) ytmusicLink.href = data.links.ytmusic;

  expandedView.style.display = 'flex';
}

function closeExpandedAlbum() {
  const expandedView = document.getElementById('expanded-view');
  const miniPlayer = document.getElementById('mini-player');
  expandedView.style.display = 'none';
  if (countAnimId) cancelAnimationFrame(countAnimId);

  const player = document.getElementById('player');
  if (player && (player.src || !player.paused) && currentTrackIndex !== -1) {
    if (miniPlayer) miniPlayer.classList.add('active');
  } else {
    currentActiveAlbum = null;
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
  if (miniPlayer) miniPlayer.classList.remove('active');
  if (player) player.pause();
}

function playTrack(trackEl) {
  const player = document.getElementById('player');
  const lyricsBox = document.getElementById('lyrics-box');

  document.querySelectorAll('.track').forEach(el => el.classList.remove('active'));
  trackEl.classList.add('active');

  const file = trackEl.getAttribute('data-file');
  if (file && player) {
    player.src = file;
    player.play().catch(e => console.log('Playback error:', e));
  }

  const text = (typeof lyricsData !== 'undefined' && lyricsData[file]) ? lyricsData[file] : 'no lyrics';

  if (!text || text.trim() === '' || text.trim() === 'no lyrics') {
    lyricsBox.innerText = 'Текст відсутній / No lyrics available';
  } else {
    lyricsBox.innerText = text;
  }

  const parentBox = trackEl.closest('.track-list-box');
  if (parentBox) {
    currentTrackList = Array.from(parentBox.querySelectorAll('.track'));
    currentTrackIndex = currentTrackList.indexOf(trackEl);
  }

  updateMiniPlayerInfo(trackEl);
}

function updateMiniPlayerInfo(trackEl) {
  const miniCover = document.getElementById('mini-cover');
  const miniTitle = document.getElementById('mini-title');
  const miniArtist = document.getElementById('mini-artist');

  if (currentActiveAlbum && albumData[currentActiveAlbum]) {
    const data = albumData[currentActiveAlbum];
    if (miniCover) miniCover.src = data.cover;
    if (miniArtist) miniArtist.innerText = `${data.title} — ${data.tag}`;
  }
  if (miniTitle && trackEl) {
    miniTitle.innerText = trackEl.innerText || trackEl.textContent;
  }
}

function syncPlayPauseState() {
  const player = document.getElementById('player');
  const miniPlayBtn = document.getElementById('mini-play-btn');
  if (!player || !miniPlayBtn) return;

  if (player.paused) {
    miniPlayBtn.innerText = '⏯ PLAY';
  } else {
    miniPlayBtn.innerText = '⏸ PAUSE';
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
