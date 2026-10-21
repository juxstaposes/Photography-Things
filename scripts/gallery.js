// read this date's data
const info = window.dateInfo || { title: "images.js missing", images: [] };
document.title = info.title;
document.getElementById("date-title").textContent = info.title;
const scroller = document.getElementById("art-scroll");

// build one art piece
info.images.forEach((item) => {
  const piece = document.createElement("article");
  piece.className = "art-piece";
  const pic = document.createElement("img");
  pic.src = "Image Folder/" + item.file;
  pic.alt = item.title || "";
  pic.loading = "lazy";
  piece.appendChild(pic);
  [["span", "art-label", item.label], ["h2", "art-title", item.title], ["p", "art-poem", item.poem]].forEach((part) => {
    if (!part[2]) return;
    const el = document.createElement(part[0]);
    el.className = part[1];
    el.textContent = part[2];
    piece.appendChild(el);
  });
  scroller.appendChild(piece);
});
