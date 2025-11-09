Супер, продължаваме! Ето следващите файлове за сайта **MAJSTOR-NASTE**:

---

### 🎨 `style.css`
```css
body {
  margin: 0;
  font-family: 'Segoe UI', sans-serif;
  background-color: #f4f4f4;
  color: #333;
}

header {
  background-color: #ff6600;
  color: white;
  padding: 1em;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 1.5em;
  font-weight: bold;
}

.language-switcher button {
  margin-left: 0.5em;
  padding: 0.3em 0.6em;
  border: none;
  background-color: white;
  color: #ff6600;
  cursor: pointer;
  border-radius: 4px;
}

section {
  padding: 2em;
}

#hero {
  background: linear-gradient(to right, #ff6600, #ffa64d);
  color: white;
  text-align: center;
  padding: 3em 2em;
}

#services ul {
  list-style: none;
  padding: 0;
}

#services li {
  background-color: #fff;
  margin: 0.5em 0;
  padding: 1em;
  border-left: 5px solid #ff6600;
}

.images {
  display: flex;
  gap: 1em;
  flex-wrap: wrap;
}

.images img {
  width: 100%;
  max-width: 300px;
  border-radius: 8px;
}

form {
  display: flex;
  flex-direction: column;
  gap: 1em;
}

form input, form textarea {
  padding: 0.8em;
  border: 1px solid #ccc;
  border-radius: 4px;
}

form button {
  background-color: #ff6600;
  color: white;
  border: none;
  padding: 1em;
  cursor: pointer;
  border-radius: 4px;
}

footer {
  background-color: #333;
  color: white;
  text-align: center;
  padding: 2em;
}

.social-icons img {
  width: 32px;
  margin: 0 0.5em;
}
```

---

### 🧠 `script.js`
```javascript
let translations = {};

function setLanguage(lang) {
  fetch(`lang/${lang}.json`)
    .then(res => res.json())
    .then(data => {
      translations = data;
      applyTranslations();
    });
}

function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[key]) {
      el.textContent = translations[key];
    }
  });
}

// Default language
setLanguage('bg');
```

---

Следващата стъпка: преводните файлове `bg.json`, `en.json`, `al.json`. Да продължа ли с тях?
