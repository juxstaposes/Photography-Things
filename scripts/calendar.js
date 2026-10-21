const settings = calendarSettings;

// fill title and year
document.title = settings.title;
document.getElementById("calendar-title").textContent = settings.title;
document.getElementById("calendar-year").textContent = settings.year;
document.getElementById("notes-title").textContent = settings.notesTitle;

// fill the notes lines
const notes = settings.notes || [];
const notesEl = document.getElementById("notes-lines");
for (let i = 0; i < Math.max(12, notes.length); i++) {
  const li = document.createElement("li");
  li.textContent = notes[i] || "";
  notesEl.appendChild(li);
}

// build the date grid
const gridEl = document.getElementById("calendar-grid");
const totalCells = Math.max(35, Math.ceil(calendarDates.length / 7) * 7);
const linked = [];

// fill cells in order
for (let i = 0; i < totalCells; i++) {
  const entry = calendarDates[i];
  const cell = document.createElement("div");
  cell.className = "day-cell";
  if (entry) {
    const link = document.createElement("a");
    link.className = "day-link";
    link.href = entry.folder + "/index.html";
    link.setAttribute("aria-label", "Open " + entry.folder.split("/").pop());
    link.innerHTML = '<span class="day-number">' + entry.day + "</span>";
    cell.appendChild(link);
    linked.push({ entry: entry, link: link });
  }
  gridEl.appendChild(cell);
}

// load thumbnails one by one
function loadThumb(i) {
  if (i >= linked.length) return;
  const item = linked[i];
  const script = document.createElement("script");
  script.src = item.entry.folder + "/images.js";
  script.onload = () => {
    const first = window.dateInfo && window.dateInfo.images[0];
    if (first) {
      const img = document.createElement("img");
      img.className = "day-thumb";
      img.alt = first.title || "";
      img.onerror = () => img.remove();
      img.src = item.entry.folder + "/Image Folder/" + first.file;
      item.link.appendChild(img);
    }
    window.dateInfo = null;
    loadThumb(i + 1);
  };
  script.onerror = () => loadThumb(i + 1);
  document.head.appendChild(script);
}
loadThumb(0);
