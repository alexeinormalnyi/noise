// Listens Counter Logic
function initListensCounter() {
  const listensEl = document.getElementById('listens-count');
  if (!listensEl) return;

  let count = Math.floor(Math.random() * (5000 - 1000 + 1)) + 1000;
  listensEl.textContent = `${count.toLocaleString()} listens`;

  setInterval(() => {
    const increment = Math.floor(Math.random() * 6) + 1;
    count += increment;
    listensEl.textContent = `${count.toLocaleString()} listens`;
  }, 60000);
}

// Album Data Configuration
const albumData = {
  '22': {
    title: "Потлатий & Партнери",
    tag: "Album 22",
    cover: "22albumcov.png",
    c1: "#ffffff",
    c2: "#1a2233",
    c3: "#080d1a",
    accent: "#d9e6ff",
    links: { spotify: '#', apple: '#', ytmusic: '#' }
  },
  '22demos': {
    title: "Потлатий & Партнери",
    tag: "22 Demos",
    cover: "22demos.png",
    c1: "#ffffff",
    c2: "#1a2233",
    c3: "#080d1a",
    accent: "#d9e6ff",
    links: { spotify: '#', apple: '#', ytmusic: '#' }
  },
  'cspg': {
    title: "Alexei Normalnyi",
    tag: "Constant Stimulation of Penial Glands",
    cover: "csopgnew.png",
    c1: "#8a0e00",
    c2: "#d93800",
    c3: "#2e0500",
    accent: "#ff4500",
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
    c1: "#ffffff",
    c2: "#888888",
    c3: "#222222",
    accent: "#ffffff",
    links: {
      spotify: 'https://open.spotify.com/album/79kVW8XxLtFkNkto2YdtZl?go=1&nd=1',
      apple: 'https://music.apple.com/ua/album/clip-v-parische-single/1889513888',
      ytmusic: 'https://music.youtube.com/playlist?list=OLAK5uy_nKaLl6EU7TxB2G0NKvtaWVETPKnfGyg98'
    }
  }
};

let currentTrackList = [];
let currentTrackIndex = -1;

document.addEventListener('DOMContentLoaded', () => {
  initListensCounter();
});

function openAlbum(albumKey, clickedElement) {
  const expandedView = document.getElementById('expanded-view');
  const expandedCover = document.getElementById('expanded-cover');
  const expandedAlbumTitle = document.getElementById('expanded-album-title');
  const spotifyLink = document.getElementById('spotify-link');
  const appleLink = document.getElementById('apple-link');
  const ytmusicLink = document.getElementById('ytmusic-link');

  if (!albumData[albumKey]) return;
  const data = albumData[albumKey];

  expandedCover.src = data.cover;
  expandedAlbumTitle.innerText = `${data.title} — ${data.tag}`;

  expandedView.style.setProperty('--album-c1', data.c1);
  expandedView.style.setProperty('--album-c2', data.c2);
  expandedView.style.setProperty('--album-c3', data.c3);
  expandedView.style.setProperty('--accent', data.accent);

  document.querySelectorAll('.track-list-box').forEach(el => el.style.display = 'none');
  const activeList = document.getElementById(`list-${albumKey}`);
  if (activeList) {
    activeList.style.display = 'block';
    const firstTrack = activeList.querySelector('.track');
    if (firstTrack) {
      playTrack(firstTrack);
    }
  }

  if (spotifyLink) spotifyLink.href = data.links.spotify;
  if (appleLink) appleLink.href = data.links.apple;
  if (ytmusicLink) ytmusicLink.href = data.links.ytmusic;

  expandedView.style.display = 'flex';
}

function closeExpandedAlbum() {
  const expandedView = document.getElementById('expanded-view');
  const player = document.getElementById('player');
  expandedView.style.display = 'none';
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
