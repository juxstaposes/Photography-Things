let userPlaylist = [];
try { userPlaylist = JSON.parse(readSaved("zethSite.playlist")) || []; } catch (e) {}

// save playlist to storage
function savePlaylist() { writeSaved("zethSite.playlist", JSON.stringify(userPlaylist)); }

// add song to playlist
function addToPlaylist(id) {
  if (!userPlaylist.includes(id)) { userPlaylist.push(id); savePlaylist(); }
}

// remove song from playlist
function removeFromPlaylist(id) {
  userPlaylist = userPlaylist.filter((x) => x !== id);
  savePlaylist();
}

// playlist ids as song objects
function getPlaylistSongs() {
  return userPlaylist.map((id) => songLibrary.find((s) => s.id === id)).filter(Boolean);
}
