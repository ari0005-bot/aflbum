(() => {
  const config = window.LOVE_STORY.song;
  const audio = document.getElementById("audio-track");
  const player = document.getElementById("music-player");
  const toggle = document.getElementById("play-toggle");
  const progress = document.getElementById("song-progress");
  const volume = document.getElementById("volume-range");
  const currentTime = document.getElementById("current-time");
  const duration = document.getElementById("duration");
  const hint = document.getElementById("player-hint");

  document.getElementById("track-title").textContent = config.title;
  document.getElementById("track-artist").textContent = config.artist;
  document.getElementById("album-art").src = config.cover;
  audio.src = config.src;
  audio.volume = Number(volume.value);
  audio.loop = true;

  function formatTime(seconds) {
    if (!Number.isFinite(seconds)) return "0:00";
    const minutes = Math.floor(seconds / 60);
    return `${minutes}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;
  }

  function setPlaying(isPlaying) {
    player.classList.toggle("is-playing", isPlaying);
    toggle.setAttribute("aria-label", isPlaying ? "Pause our song" : "Play our song");
    toggle.innerHTML = `<i data-lucide="${isPlaying ? "pause" : "play"}" aria-hidden="true"></i>`;
    if (window.lucide) window.lucide.createIcons();
  }

  async function playAudio() {
    if (!audio.paused) return true;
    try {
      await audio.play();
      hint.textContent = "A little song for us";
      return true;
    } catch {
      return false;
    }
  }

  toggle.addEventListener("click", () => {
    if (audio.paused) {
      playAudio();
    } else {
      audio.pause();
    }
  });

  audio.addEventListener("play", () => setPlaying(true));
  audio.addEventListener("pause", () => setPlaying(false));
  audio.addEventListener("ended", () => {
    if (!audio.loop) setPlaying(false);
  });
  audio.addEventListener("loadedmetadata", () => {
    duration.textContent = formatTime(audio.duration);
    progress.max = String(Math.floor(audio.duration));
  });
  audio.addEventListener("timeupdate", () => {
    currentTime.textContent = formatTime(audio.currentTime);
    progress.value = String(Math.floor(audio.currentTime));
  });
  audio.addEventListener("error", () => {
    hint.textContent = "Add your song file in assets/music";
  });
  progress.addEventListener("input", () => {
    if (Number.isFinite(audio.duration)) audio.currentTime = Number(progress.value);
  });
  volume.addEventListener("input", () => {
    audio.volume = Number(volume.value);
  });

  // Autoplay immediately on load if browser policy permits
  playAudio();
  window.addEventListener("load", () => {
    playAudio();
  }, { once: true });

  // Autoplay as soon as the user enters the first page / clicks the enter button
  const enterBtn = document.getElementById("enter-site");
  if (enterBtn) {
    enterBtn.addEventListener("click", () => {
      playAudio();
    });
  }

  // Backup fallback on first interaction anywhere if autoplay was restricted
  const startOnInteraction = () => {
    playAudio().then((started) => {
      if (started) {
        window.removeEventListener("pointerdown", startOnInteraction);
        window.removeEventListener("keydown", startOnInteraction);
      }
    });
  };
  window.addEventListener("pointerdown", startOnInteraction, { passive: true });
  window.addEventListener("keydown", startOnInteraction, { passive: true });
})();