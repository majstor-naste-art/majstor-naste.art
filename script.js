// ============================================================
// АВТОМАТСКО СКЕНИРАЊЕ – САМО СТАВАШ СЛИКИ И ГОТОВО!
// ============================================================
// Правило: сликите во секоја папка мора да бидат нумерирани
// 1.jpg, 2.jpg, 3.jpg... (без празнини). Може .jpg .jpeg .png .webp.
// Апликацијата сама ги наоѓа. Не менувај ништо тука.

const categories = {
  kukji:   { label: "Куќи",    folder: "kukji"   },
  ogradi:  { label: "Огради",  folder: "ogradi"  },
  kamini:  { label: "Камини",  folder: "kamini"  },
  laminat: { label: "Ламинат", folder: "laminat" }
};

const extensions = ["jpg", "JPG", "jpeg", "JPEG", "png", "PNG", "webp", "WEBP"];
const MAX_PER_FOLDER = 500;

function checkImage(src) {
  return new Promise(resolve => {
    const img = new Image();
    img.onload  = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = src;
  });
}

async function findImage(base, num) {
  for (const ext of extensions) {
    const src = `${base}/${num}.${ext}`;
    if (await checkImage(src)) return src;
  }
  return null;
}

async function scanFolder(key) {
  const cfg = categories[key];
  const base = `slike/${cfg.folder}`;
  const found = [];
  for (let i = 1; i <= MAX_PER_FOLDER; i++) {
    const src = await findImage(base, i);
    if (!src) break;
    found.push({ src, category: key, title: `${cfg.label} ${i}` });
  }
  console.log(`📁 ${base}: најдени ${found.length} слики`);
  return found;
}

async function loadAllImages() {
  const all = [];
  for (const key of Object.keys(categories)) {
    all.push(...await scanFolder(key));
  }
  return all;
}

// ============================================================
// ОД ТУКА НАДОЛУ – ЛОГИКА НА АПЛИКАЦИЈАТА
// ============================================================

let images = [];
let currentList = [];
let currentIndex = 0;

const grid = document.getElementById("grid");

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

document.querySelectorAll(".filter-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    renderGrid(btn.dataset.filter);
  });
});

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

let touchStartX = 0;
lightbox.addEventListener("touchstart", e => {
  touchStartX = e.changedTouches[0].screenX;
}, { passive: true });
lightbox.addEventListener("touchend", e => {
  const diff = e.changedTouches[0].screenX - touchStartX;
  if (Math.abs(diff) > 60) diff < 0 ? nextImage() : prevImage();
}, { passive: true });

document.querySelectorAll(".nav-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById(btn.dataset.page).classList.add("active");
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});

// ============================================================
// СТАРТ
// ============================================================
grid.innerHTML = `<div class="empty">⏳ Се вчитуваат слики...</div>`;

loadAllImages().then(found => {
  images = found;

  if (found.length === 0) {
    grid.innerHTML = `
      <div class="empty" style="text-align:left">
        <p><b>⚠️ Не се пронајдени слики.</b></p>
        <p style="margin-top:12px">Провери:</p>
        <p>1️⃣ Имаш папки <code>slike/kukji</code>, <code>slike/ogradi</code>, <code>slike/kamini</code>, <code>slike/laminat</code>?</p>
        <p>2️⃣ Сликите се викаат <code>1.jpg</code>, <code>2.jpg</code>, <code>3.jpg</code>...?</p>
        <p>3️⃣ Нема празнина? (не смее 1, 2, 4 – без 3)</p>
        <p>4️⃣ Папката <code>slike</code> е ДО <code>index.html</code>, не внатре?</p>
        <p style="margin-top:12px">💡 Совет: избери сите слики → десен клик → Rename → внеси <code>1</code> → Windows автоматски ги нумерира.</p>
      </div>
    `;
  } else {
    renderGrid();
    console.log(`✅ Вкупно ${found.length} слики.`);
  }
});