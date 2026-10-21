const siteRoot = new URL("../", document.currentScript.src);

// read saved value safely
function readSaved(key) { try { return localStorage.getItem(key); } catch (e) { return null; } }
// write saved value safely
function writeSaved(key, value) { try { localStorage.setItem(key, value); } catch (e) {} }

const audio = new Audio();
const savedVolume = readSaved("zethSite.volume");
audio.volume = savedVolume !== null ? parseFloat(savedVolume) : 0.8;

let activeList = [];
let activeListName = null;
let activeIndex = -1;

// save and apply volume
function setVolume(value) {
  audio.volume = value;
  writeSaved("zethSite.volume", value);
}

// play song from list
function playFromList(list, index, listName) {
  if (!list.length) return;
  activeList = list;
  activeListName = listName;
  activeIndex = (index + list.length) % list.length;
  audio.src = new URL(list[activeIndex].file, siteRoot).href;
  audio.play().catch(() => {});
}

// pause or play clicked song
function togglePlay(list, index, listName) {
  const same = activeListName === listName && activeList[activeIndex] && activeList[activeIndex].id === list[index].id;
  if (same && !audio.paused) audio.pause();
  else if (same) audio.play().catch(() => {});
  else playFromList(list, index, listName);
}

// jump to next song
audio.addEventListener("ended", () => playFromList(activeList, activeIndex + 1, activeListName));
