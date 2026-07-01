
(() => {
  const audio = document.getElementById("ga-audio");
  const playBtn = document.getElementById("ga-play");
  const prevBtn = document.getElementById("ga-prev");
  const nextBtn = document.getElementById("ga-next");
  const titleEl = document.getElementById("ga-track-title");
  const volume = document.getElementById("ga-volume");

  const playlist = [
    // Exemple :
    // { title: "Thème principal", src: "music/theme.mp3" },
  ];

  let current = Number(localStorage.getItem("gaTrackIndex") || 0);
  let unlocked = false;

  function setTitle(text) {
    titleEl.textContent = text || "Aucune musique configurée";
  }

  function loadTrack(index) {
    if (!playlist.length) {
      setTitle("Ajoute tes musiques dans js/player.js");
      return;
    }
    current = (index + playlist.length) % playlist.length;
    const track = playlist[current];
    audio.src = track.src;
    setTitle(track.title || track.src);
    localStorage.setItem("gaTrackIndex", String(current));
  }

  function syncButton() {
    playBtn.textContent = audio.paused ? "▶" : "⏸";
  }

  async function playPause() {
    if (!playlist.length) return;
    if (!audio.src) loadTrack(current);

    if (audio.paused) {
      try {
        await audio.play();
        unlocked = true;
      } catch (err) {
        console.warn("Lecture bloquée par le navigateur avant interaction.", err);
      }
    } else {
      audio.pause();
    }
    syncButton();
  }

  function next() {
    if (!playlist.length) return;
    loadTrack(current + 1);
    if (unlocked) audio.play().catch(() => {});
    syncButton();
  }

  function prev() {
    if (!playlist.length) return;
    loadTrack(current - 1);
    if (unlocked) audio.play().catch(() => {});
    syncButton();
  }

  playBtn.addEventListener("click", playPause);
  nextBtn.addEventListener("click", next);
  prevBtn.addEventListener("click", prev);

  volume.value = localStorage.getItem("gaVolume") || "0.55";
  audio.volume = Number(volume.value);
  volume.addEventListener("input", () => {
    audio.volume = Number(volume.value);
    localStorage.setItem("gaVolume", volume.value);
  });

  audio.addEventListener("play", syncButton);
  audio.addEventListener("pause", syncButton);
  audio.addEventListener("ended", next);

  loadTrack(current);
  syncButton();
})();
