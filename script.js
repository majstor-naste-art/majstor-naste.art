// ============================================================
// ⚙️ ПОДЕСУВАЊА
// ============================================================
const GITHUB_USER = "majstor-naste-art";
const GITHUB_REPO = "majstor-naste.art";
const BRANCH      = "main";
const GITHUB_TOKEN = ""; // <-- залепи го тука генерираниот токен
// ============================================================

const categories = {
  kukji:   { label: "Куќи",    folder: "kukji"   },
  ogradi:  { label: "Огради",  folder: "ogradi"  },
  kamini:  { label: "Камини",  folder: "kamini"  },
  laminat: { label: "Ламинат", folder: "laminat" }
};

const imageExts = [".jpg", ".jpeg", ".png", ".webp", ".gif"];

// Ги вчитува сите слики од сите папки со ЕДНО барање до GitHub API
async function loadAllImages() {
  const url = `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/git/trees/${BRANCH}?recursive=1`;

  try {
    const res = await fetch(url, {
      headers: {
        "Authorization": `Bearer ${GITHUB_TOKEN}`,
        "Accept": "application/vnd.github.v3+json"
      }
    });

    if (!res.ok) {
      console.error(`❌ GitHub API: HTTP ${res.status}`);
      return [];
    }

    const data = await res.json();
    if (!data.tree) {
      console.warn("⚠️ Не можам да го прочитам дрвото на фајлови.");
      return [];
    }

    const allImages = [];

    data.tree.forEach(item => {
      // item.path изгледа вака: "slike/kukji/IMG_20220602_073923.jpg"
      if (item.type !== "blob") return;

      const parts = item.path.split("/");
      if (parts.length !== 3 || parts[0] !== "slike") return;

      const folderKey = parts[1];
      const fileName = parts[2];

      if (!categories[folderKey]) return;
      if (!imageExts.some(ext => fileName.toLowerCase().endsWith(ext))) return;

      const cfg = categories[folderKey];
      // Конструирај директна RAW URL адреса до сликата
      const rawUrl = `https://raw.githubusercontent.com/${GITHUB_USER}/${GITHUB_REPO}/${BRANCH}/slike/${folderKey}/${encodeURIComponent(fileName)}`;

      allImages.push({
        src: rawUrl,
        category: folderKey,
        title: `${cfg.label} - ${fileName.replace(/\.[^.]+$/, '')}` // Прикажи го името без екстензија
      });
    });

    // Подреди ги по име за секоја категорија
    allImages.sort((a, b) => a.title.localeCompare(b.title));

    console.log(`✅ Вкупно ${allImages.length} слики.`);
    return allImages;

  } catch (e) {
    console.error("❌ Грешка при вчитување:", e);
    return [];
  }
}

// ============================================================
// ЛОГИКА (не менувај)
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
        <p>1️⃣ Дали токенот е точно копиран?</p>
        <p>2️⃣ Дали repo-то е Public?</p>
        <p>3️⃣ Дали папката <code>slike/kukji</code> има барем 1 слика?</p>
        <p style="margin-top:12px">💡 Console (F12) покажува детали.</p>
      </div>
    `;
  } else {
    renderGrid();
  }
});