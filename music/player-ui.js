const musicTab = document.createElement("button");
musicTab.className = "music-tab";
musicTab.textContent = "♪ Playlist";

const musicPanel = document.createElement("div");
musicPanel.className = "music-panel";
const credit = typeof musicCredit !== "undefined"
  ? ` Credits: <a href="${musicCredit.url}" target="_blank" rel="noopener">${musicCredit.text}</a>` : "";
musicPanel.innerHTML = `
  <h3>Playlist</h3>
  <div class="volume-control"><span>🎵</span><input type="range" min="0" max="1" step="0.01" aria-label="Volume"></div>
  <div class="music-columns">
    <div><h4>Playlist</h4><div class="track-list" data-list="playlist"></div></div>
    <div><h4>Songs</h4><div class="track-list" data-list="library"></div></div>
  </div>
  <p class="music-note">Press + to add, − to remove.${credit}</p>`;
document.body.append(musicTab, musicPanel);

const slider = musicPanel.querySelector("input");
const playlistEl = musicPanel.querySelector('[data-list="playlist"]');
const libraryEl = musicPanel.querySelector('[data-list="library"]');

slider.value = audio.volume;
slider.addEventListener("input", () => setVolume(parseFloat(slider.value)));
musicTab.addEventListener("click", () => {
  const open = musicPanel.classList.toggle("open");
  musicTab.textContent = open ? "✕ Close" : "♪ Playlist";
});

// build one song row
function songRow(song, list, index, listName, symbol, onAction) {
  const playing = activeListName === listName && activeList[activeIndex] && activeList[activeIndex].id === song.id && !audio.paused && !audio.error;
  const row = document.createElement("div");
  row.className = "track-row" + (playing ? " playing" : "");
  row.dataset.id = song.id;
  row.innerHTML = `<button class="track-play" aria-label="Play or pause">${playing ? "⏸" : "▶"}</button><span class="track-name"></span><button class="track-action" aria-label="${symbol === "+" ? "Add" : "Remove"} song">${symbol}</button>`;
  row.querySelector(".track-name").textContent = song.name;
  row.querySelector(".track-play").addEventListener("click", () => togglePlay(list, index, listName));
  row.querySelector(".track-action").addEventListener("click", onAction);
  return row;
}

// redraw both song lists
function renderLists() {
  libraryEl.innerHTML = "";
  songLibrary.forEach((song, i) => {
    libraryEl.appendChild(songRow(song, songLibrary, i, "library", "+", () => { addToPlaylist(song.id); renderLists(); }));
  });
  playlistEl.innerHTML = "";
  const mine = getPlaylistSongs();
  if (!mine.length) {
    playlistEl.innerHTML = '<p class="empty-note">Empty. Press + to add.</p>';
    return;
  }
  mine.forEach((song, i) => {
    const row = songRow(song, mine, i, "playlist", "−", () => { removeFromPlaylist(song.id); renderLists(); });
    row.draggable = true;
    row.addEventListener("dragstart", (e) => {
      row.classList.add("dragging");
      e.dataTransfer.setData("text/plain", song.id);
      e.dataTransfer.effectAllowed = "move";
    });
    row.addEventListener("dragend", () => row.classList.remove("dragging"));
    playlistEl.appendChild(row);
  });
}

playlistEl.addEventListener("dragover", (e) => {
  e.preventDefault();
  const dragging = playlistEl.querySelector(".dragging");
  if (!dragging) return;
  const after = [...playlistEl.querySelectorAll(".track-row:not(.dragging)")]
    .find((r) => e.clientY < r.getBoundingClientRect().top + r.offsetHeight / 2);
  playlistEl.insertBefore(dragging, after || null);
});

playlistEl.addEventListener("drop", (e) => {
  e.preventDefault();
  userPlaylist = [...playlistEl.querySelectorAll(".track-row")].map((r) => r.dataset.id);
  savePlaylist();
  if (activeListName === "playlist") {
    const current = activeList[activeIndex];
    activeList = getPlaylistSongs();
    activeIndex = activeList.findIndex((s) => current && s.id === current.id);
  }
  renderLists();
});

audio.addEventListener("play", renderLists);
audio.addEventListener("pause", renderLists);
audio.addEventListener("error", renderLists);
renderLists();
