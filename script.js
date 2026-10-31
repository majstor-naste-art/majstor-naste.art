// ============================================
// АВТОМАТСКО СКЕНИРАЊЕ НА ПАПКИ
// ============================================
// Само ставај слики во папките: slike/kukji/, slike/ogradi/,
// slike/kamini/, slike/laminat/ – нумерирани 1, 2, 3... без празнини
// и апликацијата сама ќе ги најде. Ништо не треба да менуваш во кодот!

const categories = {
  kukji:   { label: "Куќи",    folder: "kukji" },
  ogradi:  { label: "Огради",  folder: "ogradi" },
  kamini:  { label: "Камини",  folder: "kamini" },
  laminat: { label: "Ламинат", folder: "laminat" }
};

const extensions = ["jpg", "jpeg", "png", "webp"];
const MAX_PER_FOLDER = 200; // максимум слики по папка

// Проверува дали сликата постои
function checkImage(src) {
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = src;
  });
}

// Бара слика со даден број, обидувајќи се со сите екстензии
async function findImage(base, num) {
  for (const ext of extensions) {
    const src = `${base}/${num}.${ext}`;
    if (await checkImage(src)) return src;
  }
  return null;
}

// Скенира една папка до првата празнина
async function scanFolder(key) {
  const cfg = categories[key];
  const base = `slike/${cfg.folder}`;
  const found = [];
  for (let i = 1; i <= MAX_PER_FOLDER; i++) {
    const src = await findImage(base, i);
    if (!src) break; // запре кога нема повеќе
    found.push({
      src,
      category: key,
      title: `${cfg.label} ${i}`
    });
  }
  return found;
}

// Ги вчитува сите папки една по една
async function loadAllImages() {
  const all = [];
  for (const key of Object.keys(categories)) {
    const imgs = await scanFolder(key);
    all.push(...imgs);
  }
  return all;
}

// ============================================
// СОСТОЈБА
// ============================================
let images = [];
let currentList = [];
let currentIndex = 0;

const grid = document.getElementById("grid");

// ============================================
// ГЕНЕРИРАЊЕ НА ГАЛЕРИЈАТА
// ============================================
function renderGrid(filter = "all") {
  grid.innerHTML = "";
  currentList = filter === "all"
    ? [...images]
    : images.filter(i => i.category === filter);

  if (currentList.length === 0) {
    grid.innerHTML = `<div class="empty">Нема слики во оваа категорија.</div>`;
    return;
  }

  currentList.forEach((img, idx) => {
    const div = document.createElement("div");
    div.className = "grid-item";
    div.innerHTML = `
      <img src="${img.src}" alt="${img.title}" loading="lazy">
      <div class="label">${img.title}</div>
    `;
    div.addEventListener("click", () => openLightbox(idx));
    grid.appendChild(div);
  });
}

// ============================================
// ФИЛТРИ
// ============================================
document.querySelectorAll(".filter-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    renderGrid(btn.dataset.filter);
  });
});

// ============================================
// LIGHTBOX
// ============================================
const lightbox    = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const counter     = document.getElementById("counter");

function openLightbox(index) {
  currentIndex = index;
  updateLightbox();
  lightbox.classList.add("open");
  document.body.style.overflow = "hidden";
}

function updateLightbox() {
  lightboxImg.src = currentList[currentIndex].src;
  counter.textContent = `${currentIndex + 1} / ${currentList.length}`;
}

function closeLightbox() {
  lightbox.classList.remove("open");
  document.body.style.overflow = "";
}

function nextImage() {
  currentIndex = (currentIndex + 1) % currentList.length;
  updateLightbox();
}

function prevImage() {
  currentIndex = (currentIndex - 1 + currentList.length) % currentList.length;
  updateLightbox();
}

document.getElementById("close").addEventListener("click", closeLightbox);
document.getElementById("next").addEventListener("click", nextImage);
document.getElementById("prev").addEventListener("click", prevImage);
lightbox.addEventListener("click", e => {
  if (e.target === lightbox) closeLightbox();
});

// ============================================
// SWIPE
// ============================================
let touchStartX = 0;
lightbox.addEventListener("touchstart", e => {
  touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

lightbox.addEventListener("touchend", e => {
  const diff = e.changedTouches[0].screenX - touchStartX;
  if (Math.abs(diff) > 60) {
    diff < 0 ? nextImage() : prevImage();
  }
}, { passive: true });

// ============================================
// ДОЛНА НАВИГАЦИЈА
// ============================================
document.querySelectorAll(".nav-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById(btn.dataset.page).classList.add("active");
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});

// ============================================
// СТАРТ – автоматско скенирање
// ============================================
grid.innerHTML = `<div class="empty">⏳ Се вчитуваат слики...</div>`;

loadAllImages().then(found => {
  images = found;
  renderGrid();
  console.log(`Пронајдени ${found.length} слики.`);
});