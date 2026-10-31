// ============================================================
// ⚙️ ПОДЕСИ ГИ ОВИЕ ДВЕ ВРЕДНОСТИ
// ============================================================
const GITHUB_USER = "majstor-naste-art";   // ✅ ЦРТИЧКА – ова е корисничкото име
const GITHUB_REPO = "majstor-naste.art";   // ✅ ТОЧКА – ова е repo-то
// ============================================================

const categories = {
  kukji:   { label: "Куќи",    folder: "kukji"   },
  ogradi:  { label: "Огради",  folder: "ogradi"  },
  kamini:  { label: "Камини",  folder: "kamini"  },
  laminat: { label: "Ламинат", folder: "laminat" }
};

const imageExts = [".jpg", ".jpeg", ".png", ".webp", ".gif"];

// Земи ги сите слики од една папка преку GitHub API
async function loadFolder(key) {
  const cfg = categories[key];
  const url = `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/slike/${cfg.folder}`;
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.warn(`⚠️ ${cfg.folder}: HTTP ${res.status}`);
      return [];
    }
    const files = await res.json();
    const imgs = files
      .filter(f => f.type === "file" && imageExts.some(ext => f.name.toLowerCase().endsWith(ext)))
      .sort((a, b) => a.name.localeCompare(b.name));

    console.log(`📁 ${cfg.folder}: ${imgs.length} слики`);
    return imgs.map((f, i) => ({
      src: f.download_url,
      category: key,
      title: `${cfg.label} ${i + 1}`
    }));
  } catch (e) {
    console.error(`❌ ${cfg.folder}:`, e);
    return [];
  }
}

async function loadAllImages() {
  const all = [];
  for (const key of Object.keys(categories)) {
    all.push(...await loadFolder(key));
  }
  return all;
}

// ============================================================
// ЛОГИКА НА АПЛИКАЦИЈАТА (не менувај)
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
        <p>1️⃣ <code>GITHUB_USER</code> и <code>GITHUB_REPO</code> во <code>script.js</code> се точни?</p>
        <p>2️⃣ Repo-то е <b>Public</b> (не Private)?</p>
        <p>3️⃣ Апликацијата е отворена преку <b>GitHub Pages</b> (не локално)?</p>
        <p>4️⃣ Имаш слики во <code>slike/kamini/</code> итн?</p>
        <p style="margin-top:12px">💡 Отвори Console (F12) за детали.</p>
      </div>
    `;
  } else {
    renderGrid();
    console.log(`✅ Вкупно ${found.length} слики вчитани.`);
  }
});