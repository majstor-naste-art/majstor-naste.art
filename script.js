// ============================================================
// ⚙️ ПОДЕСУВАЊА
// ============================================================
const GITHUB_USER = "majstor-naste-art";
const GITHUB_REPO = "majstor-naste.art";
const BRANCH      = "main";
// ============================================================

// 🌐 РЕЧНИК ЗА ПРЕВОД
const translations = {
  mk: {
    header_sub: "Куќи • Огради • Камини • Ламинат",
    marquee_text: "🔥 Висококвалитетни мајсторски услуги! • Поволен однос цена-квалитет! • Побарајте понуда уште денес! 🔥",
    filter_all: "Сите", cat_kukji: "🏠 Куќи", cat_ogradi: "🚧 Огради", cat_kamini: "🔥 Камини", cat_laminat: "🪵 Ламинат",
    services_title: "Наши услуги",
    srv_1: "🏠 Изградба и реновирање на куќи", srv_2: "🧱 Ѕидање, малтер, фасади", srv_3: "🚧 Поставување на огради (метал, дрво, бетон)", srv_4: "🔥 Изградба и обложување на камини", srv_5: "🪵 Поставување на ламинат и паркет", srv_6: "🛠️ Малтерски, гипсени и завршни работи",
    contact_title: "Контакт", btn_call: "Јави се", btn_mail: "Е-пошта",
    info_area: "Работна област: цела Македонија", info_hours: "Пон – Саб: 08:00 – 18:00", follow_us: "Следи не:",
    nav_gallery: "Галерија", nav_services: "Услуги", nav_contact: "Контакт"
  },
  bg: {
    header_sub: "Къщи • Огради • Камини • Ламинат",
    marquee_text: "🔥 Висококачествени майсторски услуги! • Добро съотношение цена-качество! • Поискайте оферта още днес! 🔥",
    filter_all: "Всички", cat_kukji: "🏠 Къщи", cat_ogradi: "🚧 Огради", cat_kamini: "🔥 Камини", cat_laminat: "🪵 Ламинат",
    services_title: "Нашите услуги",
    srv_1: "🏠 Строителство и ремонт на къщи", srv_2: "🧱 Зидарство, мазилка, фасади", srv_3: "🚧 Монтаж на огради (метал, дърво, бетон)", srv_4: "🔥 Изграждане и облицовка на камини", srv_5: "🪵 Монтаж на ламинат и паркет", srv_6: "🛠️ Мазилки, гипсокартон и довършителни работи",
    contact_title: "Контакти", btn_call: "Обади се", btn_mail: "Имейл",
    info_area: "Район на работа: цяла Македония", info_hours: "Пон – Съб: 08:00 – 18:00", follow_us: "Последвай ни:",
    nav_gallery: "Галерия", nav_services: "Услуги", nav_contact: "Контакти"
  },
  en: {
    header_sub: "Houses • Fences • Fireplaces • Laminate",
    marquee_text: "🔥 High-quality craftsmanship! • Great price-quality ratio! • Request a quote today! 🔥",
    filter_all: "All", cat_kukji: "🏠 Houses", cat_ogradi: "🚧 Fences", cat_kamini: "🔥 Fireplaces", cat_laminat: "🪵 Laminate",
    services_title: "Our Services",
    srv_1: "🏠 House construction and renovation", srv_2: "🧱 Masonry, plaster, facades", srv_3: "🚧 Fence installation (metal, wood, concrete)", srv_4: "🔥 Fireplace construction and cladding", srv_5: "🪵 Laminate and parquet installation", srv_6: "🛠️ Plastering, drywall and finishing works",
    contact_title: "Contact", btn_call: "Call Us", btn_mail: "Email",
    info_area: "Working area: all of Macedonia", info_hours: "Mon – Sat: 08:00 – 18:00", follow_us: "Follow us:",
    nav_gallery: "Gallery", nav_services: "Services", nav_contact: "Contact"
  }
};

let currentLang = localStorage.getItem("lang") || "mk";

// Функција за менување на јазик
function changeLanguage(lang) {
  currentLang = lang;
  localStorage.setItem("lang", lang);
  
  // Смени активна класа на копчињата
  document.querySelectorAll(".lang-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.lang === lang);
  });

  // Преведи ги сите елементи што имаат data-i18n
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.dataset.i18n;
    if (translations[lang][key]) {
      el.textContent = translations[lang][key];
    }
  });

  // Повторно вчитај ја галеријата за насловите да бидат на новиот јазик
  if (images.length > 0) renderGrid(document.querySelector(".filter-btn.active").dataset.filter);
}

// ============================================================
// ВЧИТУВАЊЕ НА СЛИКИ (slike.json)
// ============================================================
async function loadAllImages() {
  try {
    const res = await fetch(`https://raw.githubusercontent.com/${GITHUB_USER}/${GITHUB_REPO}/${BRANCH}/slike.json`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data;
  } catch (e) {
    console.error("❌ Грешка:", e);
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
  currentList = filter === "all" ? [...images] : images.filter(i => i.category === filter);

  if (currentList.length === 0) {
    grid.innerHTML = `<div class="empty">${translations[currentLang].filter_all === "All" ? "No images in this category." : "Нема слики во оваа категорија."}</div>`;
    return;
  }

  currentList.forEach((img, idx) => {
    const div = document.createElement("div");
    div.className = "grid-item";
    // Земете го преводот за категоријата (на пр. "Куќи") и додајте број
    const catName = translations[currentLang][`cat_${img.category}`] || img.category;
    div.innerHTML = `
      <img src="${img.src}" alt="${img.title}" loading="lazy">
      <div class="label">${catName} ${idx + 1}</div>
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
function nextImage() { currentIndex = (currentIndex + 1) % currentList.length; updateLightbox(); }
function prevImage() { currentIndex = (currentIndex - 1 + currentList.length) % currentList.length; updateLightbox(); }

document.getElementById("close").addEventListener("click", closeLightbox);
document.getElementById("next").addEventListener("click", nextImage);
document.getElementById("prev").addEventListener("click", prevImage);
lightbox.addEventListener("click", e => { if (e.target === lightbox) closeLightbox(); });

let touchStartX = 0;
lightbox.addEventListener("touchstart", e => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
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
document.querySelectorAll(".lang-btn").forEach(btn => {
  btn.addEventListener("click", () => changeLanguage(btn.dataset.lang));
});

grid.innerHTML = `<div class="empty">⏳ Се вчитуваат слики...</div>`;

loadAllImages().then(found => {
  images = found;
  changeLanguage(currentLang); // Ова автоматски ќе го примени преводот и ќе ја нацрта галеријата
});