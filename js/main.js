// ================================================================
// Subjects Online V2 — main.js
// Handles: theme, navbar, page routing, subject cards,
//          chapter accordion, media viewer
// ================================================================

// ===== THEME & SETTINGS =====
// ===== THEME & SETTINGS =====
const defaultSettings = {
  theme: 'dark',
  festive: 'off',
  lang: 'en'
};

// Track Last Visit
if (typeof window !== 'undefined' && !window.lastVisitTimeSet) {
  window.lastVisitTime = localStorage.getItem('lastVisit');
  localStorage.setItem('lastVisit', new Date().toISOString());
  window.lastVisitTimeSet = true;
}

function getSettings() {
  const defaults = { name: "", avatar: "", phone: "", lang: "en", theme: "dark", festive: "off", favSubjects: [], sortMode: "default", customOrder: [], accentColor: "#7c3aed" };
  const saved = localStorage.getItem("so_settings");
  const res = saved ? { ...defaults, ...JSON.parse(saved) } : defaults;
  return res;
}
function updateSettings(newSettings) {
  const current = getSettings();
  const updated = { ...current, ...newSettings };
  localStorage.setItem("so_settings", JSON.stringify(updated));

  // Sync with Firestore if logged in
  if (typeof firebase !== 'undefined' && firebase.auth().currentUser) {
    const user = firebase.auth().currentUser;
    firebase.firestore().collection('users').doc(user.uid).set(updated, { merge: true }).catch(console.error);
  }

  return updated;
}
function initTheme() {
  const settings = getSettings();
  const theme = settings.theme || "dark";
  const festive = settings.festive || "off";
  document.documentElement.setAttribute("data-theme", theme);
  if (festive !== "off") {
    document.documentElement.setAttribute("data-festive", festive);
  } else {
    document.documentElement.removeAttribute("data-festive");
  }
  applyAccentColor(settings.accentColor || "#7c3aed");
  updateThemeBtn(theme);
  applyFestiveIcons();

  if (typeof applyLanguage === 'function') {
    applyLanguage();
  }
}
function applyFestiveIcons() {
  const festive = document.documentElement.getAttribute("data-festive") || "off";
  const logoMaps = { off: "📚", kahk: "🍪", biscuit: "🍞", balloons: "🎈" };

  // Update Logo Icons
  const logoSpans = document.querySelectorAll(".nav-logo span:first-child");
  logoSpans.forEach(s => s.textContent = logoMaps[festive] || "📚");

  // Update Theme Buttons already handled by updateThemeBtn which we will enhance
}
function applyAccentColor(color) {
  if (!color) return;
  const root = document.documentElement;
  root.style.setProperty('--accent', color);
  // Optional: lighter/darker shades or secondary colors
  // For simplicity, let's just use the color provided and a slightly transparent version for glow
  root.style.setProperty('--glow', `${color}4d`); // 4d = ~30% alpha
  // If we want a gradient effect, we can derive a second color or just use the same
  root.style.setProperty('--accent2', color);
}
function toggleTheme() {
  const current = document.documentElement.getAttribute("data-theme");
  const next = current === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  updateSettings({ theme: next });
  updateThemeBtn(next);
}
function updateThemeBtn(theme) {
  const festive = document.documentElement.getAttribute("data-festive") || "off";
  const btns = document.querySelectorAll(".theme-btn");
  const festiveIcons = { kahk: "🍪", biscuit: "🍞", balloons: "🎈" };

  btns.forEach(b => {
    const ico = b.querySelector(".theme-ico");
    const lbl = b.querySelector(".theme-label");
    if (ico) {
      if (festive !== "off") {
        ico.textContent = festiveIcons[festive] || "🍪";
      } else {
        ico.textContent = theme === "dark" ? "🌙" : "☀️";
      }
    }
    if (lbl) {
      if (festive !== "off") {
        lbl.textContent = festive.charAt(0).toUpperCase() + festive.slice(1);
      } else {
        lbl.textContent = theme === "dark" ? "Dark" : "Light";
      }
    }
  });
}

// ===== NAVBAR & PROFILE =====
function renderNavProfile() {
  const navRight = document.querySelector(".nav-right");
  if (!navRight) return;

  const settings = getSettings();
  if (!settings.name) return;

  // Remove existing if any
  const existing = document.querySelector(".nav-profile");
  if (existing) existing.remove();

  const profile = document.createElement("a");
  profile.href = "settings.html";
  profile.className = "nav-profile au";

  const isEmoji = !settings.avatar || settings.avatar.length < 10;
  const avatarContent = isEmoji ? `<span>${settings.avatar || "👤"}</span>` : `<img src="${settings.avatar}" alt="Avatar">`;

  profile.innerHTML = `
    <div class="nav-avatar">${avatarContent}</div>
    <span class="nav-user-name">${settings.name}</span>
  `;

  navRight.insertBefore(profile, navRight.firstChild);

  // Update Mobile Menu
  const mobileMenuInner = document.querySelector(".mobile-menu-inner");
  if (mobileMenuInner) {
    const existingMob = document.querySelector(".mobile-profile");
    if (existingMob) existingMob.remove();

    const mobProfile = document.createElement("div");
    mobProfile.className = "mobile-profile";
    mobProfile.innerHTML = `
      <div class="mobile-avatar">${avatarContent}</div>
      <div class="mobile-profile-info">
        <h3>${settings.name}</h3>
        <p>Student @ Subjects Online</p>
      </div>
    `;
    mobileMenuInner.insertBefore(mobProfile, mobileMenuInner.firstChild);
  }
}

// ===== LOGIN & AUTH REDIRECT =====
function checkLoginStatus() {
  const settings = getSettings();
  const path = location.pathname.split("/").pop() || "index.html";

  if (!settings.name && path !== "login.html") {
    location.href = "login.html";
    return;
  }
}

// Redirect if unauthenticated (called on pages that need auth)
if (location.pathname.split("/").pop() !== "login.html") {
  checkLoginStatus();
}

function showLoginModal() {
  // Disabled in favor of standalone login.html
  location.href = "login.html";
  return;
}

function initNavbar() {
  const hamburger = document.querySelector(".hamburger");
  const mobileMenu = document.querySelector(".mobile-menu");
  const backdrop = document.querySelector(".menu-backdrop");

  if (!hamburger) return;

  hamburger.addEventListener("click", () => {
    const isOpen = hamburger.classList.toggle("open");
    mobileMenu.classList.toggle("open", isOpen);
    backdrop.classList.toggle("open", isOpen);
    if (isOpen) renderNavProfile(); // Refresh in mobile menu
  });

  backdrop.addEventListener("click", closeMenu);
  document.querySelectorAll(".mobile-link").forEach(l => l.addEventListener("click", closeMenu));

  function closeMenu() {
    hamburger.classList.remove("open");
    mobileMenu.classList.remove("open");
    backdrop.classList.remove("open");
  }

  // Mark active link
  const path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-link, .mobile-link").forEach(link => {
    const href = link.getAttribute("href") || "";
    if (href === path || (path === "" && href === "index.html")) {
      link.classList.add("active");
    }
  });
}

// ===== FAVORITES LOGIC =====
function getFavorites() {
  return JSON.parse(localStorage.getItem("so_favorites") || '{"subjects":[],"items":[]}');
}
function isFavorite(type, subjectId, lecId = null) {
  const favs = getFavorites();
  if (type === "subject") return favs.subjects.includes(subjectId);
  if (type === "item") return favs.items.some(i => i.subjectId === subjectId && i.lecId === lecId);
  return false;
}
window.toggleFavorite = function (e, type, subjectId, lecId = null) {
  e.preventDefault();
  e.stopPropagation();

  const favs = getFavorites();

  if (type === "subject") {
    const idx = favs.subjects.indexOf(subjectId);
    if (idx > -1) favs.subjects.splice(idx, 1);
    else favs.subjects.push(subjectId);
  } else if (type === "item") {
    const existingIdx = favs.items.findIndex(i => i.subjectId === subjectId && i.lecId === lecId);
    if (existingIdx > -1) favs.items.splice(existingIdx, 1);
    else favs.items.push({ subjectId, lecId });
  }

  localStorage.setItem("so_favorites", JSON.stringify(favs));

  const btn = e.currentTarget;
  if (btn.classList.contains("active")) {
    btn.classList.remove("active");
    btn.innerHTML = "☆";
  } else {
    btn.classList.add("active");
    btn.innerHTML = "⭐";
  }
};

// ===== SUBJECT CARDS (browse page) =====
function renderSubjectCards() {
  const grid = document.getElementById("subjects-grid");
  if (!grid || typeof SUBJECTS === "undefined") return;

  const settings = getSettings();
  let sortedSubjects = [...SUBJECTS];

  if (settings.sortMode === "alphabetical") {
    sortedSubjects.sort((a, b) => a.name.localeCompare(b.name));
  } else if (settings.sortMode === "reverse") {
    sortedSubjects.reverse();
  } else if (settings.sortMode === "custom" && settings.customOrder && settings.customOrder.length > 0) {
    sortedSubjects.sort((a, b) => {
      const idxA = settings.customOrder.indexOf(a.id);
      const idxB = settings.customOrder.indexOf(b.id);
      if (idxA === -1 && idxB === -1) return 0;
      if (idxA === -1) return 1;
      if (idxB === -1) return -1;
      return idxA - idxB;
    });
  }

  // If favorite subjects are set, bring them to front
  if (settings.favSubjects && settings.favSubjects.length > 0) {
    const favs = [];
    const rest = [];
    sortedSubjects.forEach(s => {
      if (settings.favSubjects.includes(s.id)) favs.push(s);
      else rest.push(s);
    });
    // Sort favs by current sortMode? Let's just keep them together.
    sortedSubjects = [...favs, ...rest];
  }

  grid.innerHTML = sortedSubjects.map((s, i) => {
    const isFav = isFavorite("subject", s.id);
    return `
    <a href="subject.html?id=${s.id}" class="subject-card au" style="animation-delay:${i * 0.07}s; --fc-color: ${s.color}; --fc-grad: linear-gradient(${s.grad})">
      <div class="fc-top">
        <div class="fc-icon" style="background: var(--fc-grad)">${s.icon}</div>
        <button class="fav-btn ${isFav ? 'active' : ''} sc-fav-override" onclick="toggleFavorite(event, 'subject', '${s.id}')" title="Toggle Favorite">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="${isFav ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
        </button>
      </div>
      <div class="fc-bottom">
        <h3 class="fc-title">${s.name}</h3>
        <p class="fc-desc-short">${s.nameAr} • 7 Sections</p>
      </div>
      <div class="fc-glow" style="background: var(--fc-grad)"></div>
    </a>
  `;
  }).join("");

  // Trigger ScrollReveal on newly rendered subject cards
  if (window.sr) {
    window.sr.reveal('.subject-card', {
      distance: '0px', scale: 0.85, opacity: 0,
      duration: 700, easing: 'cubic-bezier(0.22,1,0.36,1)', interval: 90, delay: 50
    });
  }
}

// ===== HOME CARDS =====
function renderHomeCards() {
  const container = document.getElementById("home-cards");
  if (!container) return;

  const cards = [
    { href: "subjects.html", icon: "📚", title: "Browse Subjects", desc: "Course content, quizzes, section solutions, summaries, Q&A, final reviews & videos — perfectly organized.", grad: "135deg,#7c3aed,#3b82f6", color: "#7c3aed", tag1: "7 Subjects", tag2: "7 Sections Each", pills: ["Course Content", "Quizzes", "Videos", "Final Review"] },
    { href: "doctors-news.html", icon: "📰", title: "Doctors News", desc: "Latest announcements, notes, and updates from your professors — delivered instantly.", grad: "135deg,#059669,#06b6d4", color: "#059669", tag1: "Stay Updated", tag2: "All Professors", pills: ["Announcements", "Notes", "Reminders", "Updates"] },
    { href: "personal-dev.html", icon: "🌱", title: "Self Development", desc: "Build the mindset, habits, and skills that make you unstoppable beyond the classroom.", grad: "135deg,#f59e0b,#ec4899", color: "#f59e0b", tag1: "Grow Every Day", tag2: "6 Categories", pills: ["Mindset", "Productivity", "Focus", "Goal Setting"] },
    { href: "favorites.html", icon: "⭐", title: "Favorites", desc: "Easily access your saved lectures, summaries, and videos in one convenient place.", grad: "135deg,#eab308,#f97316", color: "#eab308", tag1: "Quick Access", tag2: "Your Picks", pills: ["Saved Items", "Bookmarks", "Quick Nav"] },
    { href: "special.html", icon: "💎", title: "Special Subject", desc: "Exclusive PDF materials & interactive study mode for top core subjects.", grad: "135deg,#6366f1,#a855f7", color: "#a855f7", tag1: "Premium", tag2: "PDF & Interactive", pills: ["Elite Content", "Smart Study", "Fast Access"] },
  ];

  container.innerHTML = cards.map((c, i) => `
    <a href="${c.href}" class="feat-card au" style="animation-delay:${0.1 + i * 0.12}s; --fc-color: ${c.color}; --fc-grad: linear-gradient(${c.grad})">
      <div class="fc-top">
        <div class="fc-icon" style="background: var(--fc-grad)">${c.icon}</div>
        <div class="fc-arrow">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </div>
      </div>
      <div class="fc-bottom">
        <h3 class="fc-title">${c.title}</h3>
        <p class="fc-desc-short">${c.tag1} • ${c.tag2}</p>
      </div>
      <div class="fc-glow" style="background: var(--fc-grad)"></div>
    </a>
  `).join("");

  // Trigger ScrollReveal on newly rendered feature cards
  if (window.sr) {
    window.sr.reveal('.feat-card', {
      distance: '0px', scale: 0.85, opacity: 0,
      duration: 750, easing: 'cubic-bezier(0.22,1,0.36,1)', interval: 100, delay: 60
    });
  }
}

// ===== SUBJECT PAGE =====
let activeSection = "course-content";

function initSubjectPage() {
  const params = new URLSearchParams(location.search);
  const id = params.get("id");
  if (!id || typeof SUBJECTS === "undefined") return;

  window._currentSubjectId = id;
  const subject = SUBJECTS.find(s => s.id.toLowerCase() === id.toLowerCase());
  if (!subject) { location.href = "subjects.html"; return; }

  // Header
  document.getElementById("subj-icon").style.background = `linear-gradient(${subject.grad})`;
  document.getElementById("subj-icon").textContent = subject.icon;
  document.getElementById("subj-name").textContent = subject.name;
  document.getElementById("subj-name-ar").textContent = subject.nameAr;
  document.getElementById("subj-desc").textContent = subject.desc;
  document.title = subject.name + " — Subjects Online";

  // Sidebar tabs
  const sidebar = document.getElementById("sec-sidebar");
  sidebar.innerHTML = `<div class="sidebar-lbl">Sections</div>` +
    SECTIONS.map(sec => `
      <button class="sec-tab ${sec.id === activeSection ? "active" : ""}" data-sec="${sec.id}"
        style="${sec.id === activeSection ? `border-color:${sec.color};color:${sec.color}` : ""}">
        <span class="tab-ico">${sec.icon}</span>
        <span class="tab-ttl">${sec.title}</span>
        ${sec.id === activeSection ? `<span class="tab-dot" style="background:${sec.color}"></span>` : ""}
      </button>
    `).join("");

  sidebar.querySelectorAll(".sec-tab").forEach(btn => {
    btn.addEventListener("click", () => {
      activeSection = btn.dataset.sec;
      renderSectionContent(id);
      sidebar.querySelectorAll(".sec-tab").forEach(b => {
        const sec = SECTIONS.find(s => s.id === b.dataset.sec);
        const isActive = b.dataset.sec === activeSection;
        b.className = "sec-tab" + (isActive ? " active" : "");
        b.style = isActive ? `border-color:${sec.color};color:${sec.color}` : "";
        b.innerHTML = `<span class="tab-ico">${sec.icon}</span><span class="tab-ttl">${sec.title}</span>${isActive ? `<span class="tab-dot" style="background:${sec.color}"></span>` : ""}`;
      });
    });
  });

  renderSectionContent(id);
}

function renderSectionContent(subjectId) {
  const sec = SECTIONS.find(s => s.id === activeSection);
  const chapters = getChapters(subjectId, activeSection);

  // Section header
  document.getElementById("sec-hdr").innerHTML = `
    <div class="sec-ico" style="background:${sec.color}22;border:1px solid ${sec.color}44">${sec.icon}</div>
    <div>
      <h2>${sec.title}</h2>
      <p>${sec.desc}</p>
    </div>
    <div class="sec-stats"><span class="stat-chip">4 Chapters</span></div>
  `;

  // Chapters accordion
  const lista = document.getElementById("chapters-list");
  lista.innerHTML = chapters.map((ch, idx) => `
    <div class="ch-item" style="animation-delay:${idx * 0.08}s" data-chid="${ch.id}">
      <button class="ch-btn" onclick="toggleChapter(this, '${sec.color}')">
        <div class="ch-left">
          <span class="ch-num">${idx + 1}</span>
          <span class="ch-title">${ch.title}</span>
        </div>
        <div class="ch-right">
          <span class="ch-count">${ch.lectures.length > 0 ? ch.lectures.length + " item" + (ch.lectures.length > 1 ? "s" : "") : "Empty"}</span>
          <span class="ch-chev">▾</span>
        </div>
      </button>
    </div>
  `).join("");

  // Store chapters data for accordion
  window._currentChapters = chapters;
  window._currentSecColor = sec.color;
}

function toggleChapter(btn, color) {
  const item = btn.closest(".ch-item");
  const isOpen = item.classList.toggle("open");
  const chev = btn.querySelector(".ch-chev");
  const num = btn.querySelector(".ch-num");

  chev.style.transform = isOpen ? "rotate(180deg)" : "rotate(0)";
  btn.style.borderColor = isOpen ? color : "transparent";
  btn.style.color = isOpen ? color : "";
  num.style.background = isOpen ? color : "";

  // Remove existing body
  const existing = item.querySelector(".ch-body");
  if (existing) existing.remove();

  if (!isOpen) return;

  // Find chapter data
  const chIdx = Array.from(item.parentNode.children).indexOf(item);
  const ch = (window._currentChapters || [])[chIdx];
  if (!ch) return;

  const body = document.createElement("div");
  body.className = "ch-body";

  if (ch.lectures.length === 0) {
    body.innerHTML = `<div class="ch-empty"><span>📂</span><p>No content yet — will be uploaded soon.</p></div>`;
  } else {
    const typeMap = { lecture: ["📖", "Lecture"], video: ["🎬", "Video"], summary: ["🔑", "Summary"], file: ["📄", "PDF"] };

    // Store lectures globally for safe lookup
    window._currentLecs = window._currentLecs || {};
    ch.lectures.forEach((lec, i) => { window._currentLecs[`${chIdx}-${i}`] = lec; });

    const list = document.createElement("div");
    list.className = "lecs-list";

    const progressData = JSON.parse(localStorage.getItem("so_progress") || "{}");
    const subjProg = progressData[window._currentSubjectId] || { pdfs: [], videos: [] };

    ch.lectures.forEach((lec, i) => {
      const [ico, lbl] = typeMap[lec.type] || ["📖", "Content"];
      const hasContent = !!lec.content || (lec.interactive && lec.interactive.length > 0);
      const isCompleted = (subjProg.pdfs.includes(lec.id) || subjProg.videos.includes(lec.id)) ||
        (lec.content && (subjProg.pdfs.includes(lec.content) || subjProg.videos.includes(lec.content)));
      const resetBtnHTML = isCompleted ? `<button class="lec-reset-btn" onclick="resetProgress(event, '${window._currentSubjectId}', '${lec.id}', '${lec.type}', '${lec.content || ''}')" title="Reset Progress">✕</button>` : "";
      const iconRight = isCompleted ? `<span class="lec-open" style="color:#10b981">✅</span>` : (hasContent ? `<span class="lec-open">▶</span>` : "");

      const isFav = isFavorite("item", window._currentSubjectId, lec.id);
      const favBtnHTML = `<button class="fav-btn item-fav ${isFav ? 'active' : ''}" onclick="toggleFavorite(event, 'item', '${window._currentSubjectId}', '${lec.id}')" title="Toggle Favorite">${isFav ? '⭐' : '☆'}</button>`;

      const btn2 = document.createElement("button");
      btn2.className = "lec-item";
      btn2.style.cssText = `--acc:${color}`;
      btn2.disabled = !hasContent;
      btn2.dataset.ch = chIdx;
      btn2.dataset.lec = i;
      btn2.dataset.id = lec.id;
      btn2.innerHTML = `
        <span class="lec-num">${i + 1}</span>
        <span class="lec-ico">${ico}</span>
        <span class="lec-ttl">${lec.title || "(no title)"}</span>
        <span class="lec-badge">${lbl}</span>
        <div class="lec-actions">
          ${hasContent ? favBtnHTML : ''}
          ${resetBtnHTML}
          ${iconRight}
        </div>
      `;

      if (hasContent) {
        btn2.addEventListener("click", () => {
          const l = window._currentLecs[`${btn2.dataset.ch}-${btn2.dataset.lec}`];
          if (l) openViewer(l, window._currentSubjectId);
        });
      }

      list.appendChild(btn2);
    });

    body.appendChild(list);
  }

  item.appendChild(body);
}

// ===== MEDIA VIEWER =====
function openViewer(lec, subjectId) {
  const overlay = document.getElementById("mv-overlay");
  if (!overlay) return;

  const isPdf = lec.content && /\.pdf$/i.test(lec.content);
  const isVideo = lec.type === "video";
  const filename = (lec.content || "").split("/").pop() || "download";

  document.getElementById("mv-type-icon").textContent = isPdf ? "📄" : isVideo ? "🎬" : "📖";
  document.getElementById("mv-title").textContent = lec.title || "(no title)";
  document.getElementById("mv-sub").textContent = isPdf ? "PDF Document" : isVideo ? "Video" : "Content";

  const dlBtn = document.getElementById("mv-dl");
  if (lec.content) {
    dlBtn.href = lec.content;
    dlBtn.download = filename;
    dlBtn.style.display = "";
  } else {
    dlBtn.style.display = "none";
  }

  const body = document.getElementById("mv-body");
  body.innerHTML = "";

  if (isPdf && lec.content) {
    const fr = document.createElement("iframe");
    fr.className = "mv-iframe";
    fr.src = lec.content;
    fr.title = lec.title;
    body.appendChild(fr);
  } else if (isVideo && lec.content) {
    if (lec.content.includes("youtube.com") || lec.content.includes("youtu.be")) {
      const fr = document.createElement("iframe");
      fr.className = "mv-iframe";
      fr.src = lec.content.replace("watch?v=", "embed/");
      fr.allowFullscreen = true;
      fr.allow = "accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture";
      body.appendChild(fr);
    } else {
      const vid = document.createElement("video");
      vid.className = "mv-video";
      vid.src = lec.content;
      vid.controls = true;
      body.appendChild(vid);
    }
  } else {
    body.innerHTML = `<div class="mv-empty-state"><span>📂</span><p>No preview available.</p></div>`;
  }

  const interactiveBtn = document.getElementById("mv-interactive-toggle");
  if (interactiveBtn) {
    // Only allow for Statistics
    if (subjectId === 'statistics' || (lec.interactive && lec.interactive.length > 0)) {
      interactiveBtn.style.display = "inline-block";
      interactiveBtn.dataset.lecId = lec.id;
      interactiveBtn.dataset.subId = subjectId;
      interactiveBtn.textContent = "✨ Interactive Mode";
    } else {
      interactiveBtn.style.display = "none";
    }
  }

  overlay.classList.add("open");
  document.body.style.overflow = "hidden";

  if (subjectId && lec.content) {
    trackRecent({ id: lec.id, sid: subjectId, name: lec.title || "Lecture", type: lec.type || (lec.content.endsWith(".pdf") ? "pdf" : "video") });
    // Save as pending instead of auto-completing
    localStorage.setItem("so_pending_progress", JSON.stringify({
      subjectId,
      id: lec.id,
      title: lec.title || "Lecture",
      type: lec.type || (lec.content.endsWith(".pdf") ? "pdf" : "video"),
      content: lec.content,
      timestamp: Date.now()
    }));
  }
}

let isInteractive = false;
function toggleInteractiveMode() {
  const btn = document.getElementById("mv-interactive-toggle");
  const subId = btn.dataset.subId;
  const lecId = btn.dataset.lecId;
  const body = document.getElementById("mv-body");

  isInteractive = !isInteractive;

  if (isInteractive) {
    btn.textContent = "📄 View PDF";
    btn.style.background = "var(--bg2)";
    renderInteractiveStats(subId, lecId);
  } else {
    btn.textContent = "✨ Interactive Mode";
    btn.style.background = "var(--accent)";
    // Re-trigger openViewer logic for PDF
    const subjectContent = CONTENT[subId];
    let lecItem = null;
    Object.values(subjectContent).forEach(sec => {
      sec.forEach(ch => {
        const found = ch.find(l => l.id === lecId);
        if (found) lecItem = found;
      });
    });
    if (lecItem) {
      body.innerHTML = `<iframe class="mv-iframe" src="${lecItem.content}" title="${lecItem.title}"></iframe>`;
    }
  }
}

function renderInteractiveStats(subId, lecId) {
  const body = document.getElementById("mv-body");
  const subjectContent = CONTENT[subId];
  let lecItem = null;
  Object.values(subjectContent).forEach(sec => {
    sec.forEach(ch => {
      const found = ch.find(l => l.id === lecId);
      if (found) lecItem = found;
    });
  });

  if (!lecItem || !lecItem.interactive) {
    body.innerHTML = `<div class="mv-empty-state"><p>Interactive content not available for this item.</p></div>`;
    return;
  }

  body.innerHTML = `
    <div class="interactive-viewer">
      <div class="iv-progress-bar"><div class="iv-progress-fill" id="iv-prog" style="width: 0%"></div></div>
      <div class="iv-container" id="iv-container">
        ${lecItem.interactive.map((step, idx) => `
          <div class="iv-step ${idx === 0 ? 'active' : ''}" id="step-${idx}">
            <div class="iv-card glass">
              <div class="iv-card-num">Step ${idx + 1}</div>
              <h2>${step.title}</h2>
              <p>${step.content}</p>
              ${step.image ? `<img src="${step.image}" class="iv-img" />` : ''}
              <div class="iv-actions">
                ${idx > 0 ? `<button class="btn btn-ghost" onclick="showStep(${idx - 1})">Back</button>` : ''}
                ${idx < lecItem.interactive.length - 1 ?
      `<button class="btn btn-primary" onclick="showStep(${idx + 1})">Next Step</button>` :
      `<button class="btn btn-primary" onclick="completeInteractive('${subId}', '${lecId}')">Finish Lesson</button>`}
              </div>
            </div>
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

window.showStep = function (idx) {
  document.querySelectorAll(".iv-step").forEach(s => s.classList.remove("active"));
  document.getElementById(`step-${idx}`).classList.add("active");
  const steps = document.querySelectorAll(".iv-step").length;
  const progress = ((idx + 1) / steps) * 100;
  document.getElementById("iv-prog").style.width = `${progress}%`;
}

window.completeInteractive = function (subId, lecId) {
  alert("Great job! You've completed this interactive lesson.");
  // Add to progress
  const progress = JSON.parse(localStorage.getItem("so_progress") || "{}");
  if (!progress[subId]) progress[subId] = { pdfs: [], videos: [] };
  if (!progress[subId].pdfs.includes(lecId)) progress[subId].pdfs.push(lecId);
  localStorage.setItem("so_progress", JSON.stringify(progress));

  // Update UI and close
  const lecItem = document.querySelector(`.lec-item[data-id="${lecId}"]`);
  if (lecItem) {
    const openedBtn = lecItem.querySelector(".lec-open");
    if (openedBtn) {
      openedBtn.innerHTML = "✅";
      openedBtn.style.color = "#10b981";
    }
    if (!lecItem.querySelector(".lec-reset-btn")) {
      const actions = lecItem.querySelector(".lec-actions");
      if (actions) {
        const rb = document.createElement("button");
        rb.className = "lec-reset-btn";
        rb.title = "Reset Progress";
        rb.innerHTML = "✕";
        rb.onclick = (e) => resetProgress(e, subId, lecId, "file", "");
        actions.insertBefore(rb, openedBtn);
      }
    }
  }

  renderProgressSection();
  renderDashboard();
  renderSpecialPage(); // Update Archive if open
  closeViewer();
}

function closeViewer() {
  const overlay = document.getElementById("mv-overlay");
  if (!overlay) return;
  overlay.classList.remove("open");
  document.body.style.overflow = "";
  const body = document.getElementById("mv-body");
  body.innerHTML = "";
  isInteractive = false;
  const btn = document.getElementById("mv-interactive-toggle");
  if (btn) btn.style.display = "none";
}

function askProgress(pending) {
  if (!pending) return;

  // DON'T ask if already completed
  const progressData = JSON.parse(localStorage.getItem("so_progress") || "{}");
  const subjProg = progressData[pending.subjectId] || { pdfs: [], videos: [] };
  if (subjProg.pdfs.includes(pending.id) || subjProg.videos.includes(pending.id) ||
    (pending.content && (subjProg.pdfs.includes(pending.content) || subjProg.videos.includes(pending.content)))) {
    localStorage.removeItem("so_pending_progress");
    return;
  }

  let dialog = document.getElementById("progress-dialog-overlay");
  if (!dialog) {
    dialog = document.createElement("div");
    dialog.id = "progress-dialog-overlay";
    dialog.className = "progress-dialog-overlay";
    dialog.innerHTML = `
      <div class="progress-dialog">
        <span class="pd-icon">🎉</span>
        <h3>Great job!</h3>
        <p>You just finished viewing <strong><span id="pd-title"></span></strong>. Would you like to track this in your progress?</p>
        <div class="pd-actions">
          <button class="pd-btn pd-btn-no" id="pd-btn-no">Not yet</button>
          <button class="pd-btn pd-btn-yes" id="pd-btn-yes">Yes, add it!</button>
        </div>
      </div>
    `;
    document.body.appendChild(dialog);
  }

  document.getElementById("pd-title").textContent = pending.title || "the material";

  const btnYes = document.getElementById("pd-btn-yes");
  const btnNo = document.getElementById("pd-btn-no");

  const closeDialog = () => {
    dialog.classList.remove("open");
    localStorage.removeItem("so_pending_progress");
  };

  btnYes.onclick = () => {
    saveProgress(pending.subjectId, pending);
    closeDialog();
  };

  btnNo.onclick = () => {
    closeDialog();
  };

  // Add slight delay before showing so it isn't jarring if immediately closing reader
  setTimeout(() => dialog.classList.add("open"), 100);
}

function saveProgress(subjectId, lec) {
  try {
    const data = JSON.parse(localStorage.getItem("so_progress") || "{}");
    if (!data[subjectId]) data[subjectId] = { pdfs: [], videos: [] };
    const type = (lec.type === "video") ? "videos" : "pdfs";
    const itemId = lec.id || lec.content; // Use ID if available, else content path
    if (itemId && !data[subjectId][type].includes(itemId)) {
      data[subjectId][type].push(itemId);
      localStorage.setItem("so_progress", JSON.stringify(data));

      const lecItem = document.querySelector(`.lec-item[data-id="${lec.id}"]`);
      if (lecItem) {
        const openedBtn = lecItem.querySelector(".lec-open");
        if (openedBtn) {
          openedBtn.innerHTML = "✅";
          openedBtn.style.color = "#10b981";
        }

        // DYNAMICALLY show the reset button if not already there
        if (!lecItem.querySelector(".lec-reset-btn")) {
          const actions = lecItem.querySelector(".lec-actions");
          if (actions) {
            const rb = document.createElement("button");
            rb.className = "lec-reset-btn";
            rb.title = "Reset Progress";
            rb.innerHTML = "✕";
            rb.onclick = (e) => resetProgress(e, subjectId, lec.id, lec.type, lec.content || "");
            actions.insertBefore(rb, openedBtn);
          }
        }
      }
    }
  } catch (e) { }
}

window.resetProgress = function (e, subjectId, lecId, type, content) {
  if (e) { e.preventDefault(); e.stopPropagation(); }
  if (!confirm("Are you sure you want to reset progress for this item?")) return;

  try {
    const data = JSON.parse(localStorage.getItem("so_progress") || "{}");
    if (data[subjectId]) {
      const typeKey = (type === "video") ? "videos" : "pdfs";
      // Try removing by ID OR Content path
      const idxP_id = data[subjectId].pdfs.indexOf(lecId);
      const idxV_id = data[subjectId].videos.indexOf(lecId);
      const idxP_co = content ? data[subjectId].pdfs.indexOf(content) : -1;
      const idxV_co = content ? data[subjectId].videos.indexOf(content) : -1;

      let found = false;
      if (idxP_id > -1) { data[subjectId].pdfs.splice(idxP_id, 1); found = true; }
      if (idxV_id > -1) { data[subjectId].videos.splice(idxV_id, 1); found = true; }
      if (idxP_co > -1) { data[subjectId].pdfs.splice(idxP_co, 1); found = true; }
      if (idxV_co > -1) { data[subjectId].videos.splice(idxV_co, 1); found = true; }

      if (found) {
        localStorage.setItem("so_progress", JSON.stringify(data));

        // Update UI surgically
        const lecItem = document.querySelector(`.lec-item[data-id="${lecId}"]`);
        if (lecItem) {
          const openedIcon = lecItem.querySelector(".lec-open");
          const resetBtn = lecItem.querySelector(".lec-reset-btn");
          if (openedIcon) {
            openedIcon.innerHTML = "▶";
            openedIcon.style.color = "";
          }
          if (resetBtn) resetBtn.remove();
        }

        renderProgressSection();
        renderDashboard();
        renderSpecialPage();
        // REMOVED initSubjectPage() to prevent accordion closing
      }
    }
  } catch (err) { console.error("Reset failed", err); }
};

function closeViewer() {
  const overlay = document.getElementById("mv-overlay");
  if (!overlay) return;
  overlay.classList.remove("open");
  document.body.style.overflow = "";

  const body = document.getElementById("mv-body");
  if (body) body.innerHTML = "";

  isInteractive = false;
  const btn = document.getElementById("mv-interactive-toggle");
  if (btn) btn.style.display = "none";

  const pendingStr = localStorage.getItem("so_pending_progress");
  if (pendingStr) {
    try {
      const pending = JSON.parse(pendingStr);
      askProgress(pending);
    } catch (e) { }
  }
}

// Close on backdrop click
document.addEventListener("click", e => {
  const overlay = document.getElementById("mv-overlay");
  if (overlay && e.target === overlay) closeViewer();
});

// Close on Escape
document.addEventListener("keydown", e => { if (e.key === "Escape") closeViewer(); });

// ===== PROGRESS TRACKING =====
function renderProgressSection() {
  const container = document.getElementById("home-progress-sec");
  if (!container || typeof SUBJECTS === "undefined") return;

  let totalPdfs = 0, totalVids = 0;
  let subjTotals = {};

  SUBJECTS.forEach(sub => {
    subjTotals[sub.id] = { pdfs: 0, videos: 0 };
    const content = CONTENT[sub.id] || {};
    const special = SPECIAL_CONTENT[sub.id] || [];

    // Standard Content
    Object.values(content).forEach(sections => {
      sections.forEach(ch => {
        ch.forEach(lec => {
          if (lec.content || (lec.interactive && lec.interactive.length > 0)) {
            if (lec.type === "video") {
              totalVids++;
              subjTotals[sub.id].videos++;
            } else {
              totalPdfs++;
              subjTotals[sub.id].pdfs++;
            }
          }
        });
      });
    });

    // Special Content
    special.forEach(lec => {
      if (lec.content || (lec.interactive && lec.interactive.length > 0)) {
        if (lec.type === "video") {
          totalVids++;
          subjTotals[sub.id].videos++;
        } else {
          totalPdfs++;
          subjTotals[sub.id].pdfs++;
        }
      }
    });
  });

  const progressData = JSON.parse(localStorage.getItem("so_progress") || "{}");
  let readPdfs = 0, watchedVids = 0;

  Object.keys(subjTotals).forEach(subjId => {
    const p = progressData[subjId] || { pdfs: [], videos: [] };
    readPdfs += p.pdfs.length;
    watchedVids += p.videos.length;
  });

  const setCircle = (id, count, total) => {
    const valEl = document.getElementById(`${id}-val`);
    const countEl = document.getElementById(`${id}-count`);
    const fg = document.querySelector(`.${id}-fg`);
    if (!valEl || !fg) return;

    const pct = total > 0 ? Math.round((count / total) * 100) : 0;
    valEl.textContent = `${pct}%`;
    countEl.textContent = `${count} / ${total}`;

    setTimeout(() => {
      const offset = 283 - (283 * pct) / 100;
      fg.style.strokeDashoffset = offset;
    }, 100);
  };

  setCircle("pdf", readPdfs, totalPdfs);
  setCircle("vid", watchedVids, totalVids);

  const grid = document.getElementById("subject-progress-grid");
  if (!grid) return;

  grid.innerHTML = SUBJECTS.map((sub, i) => {
    const tot = subjTotals[sub.id] || { pdfs: 0, videos: 0 };

    const p = progressData[sub.id] || { pdfs: [], videos: [] };
    const pdfPct = tot.pdfs > 0 ? (p.pdfs.length / tot.pdfs) * 100 : 0;
    const vidPct = tot.videos > 0 ? (p.videos.length / tot.videos) * 100 : 0;

    return `
      <div class="sp-card au active" style="animation-delay:${i * 0.1}s">
        <div class="sp-header">
          <div class="sp-icon" style="background:linear-gradient(${sub.grad})">${sub.icon}</div>
          <div class="sp-title">${sub.name}</div>
        </div>
        <div class="sp-stats">
          <div class="sp-stat-row">
            <span style="width:40px">PDFs</span>
            <div class="sp-bar-bg"><div class="sp-bar-fg" style="width:${pdfPct}%; background:#ec4899"></div></div>
            <span style="width:40px; text-align:right">${p.pdfs.length}/${tot.pdfs}</span>
          </div>
          <div class="sp-stat-row">
            <span style="width:40px">Vids</span>
            <div class="sp-bar-bg"><div class="sp-bar-fg" style="width:${vidPct}%; background:#3b82f6"></div></div>
            <span style="width:40px; text-align:right">${p.videos.length}/${tot.videos}</span>
          </div>
        </div>
      </div>
    `;
  }).join("");

  // Trigger ScrollReveal on newly rendered subject progress cards
  if (window.sr) {
    window.sr.reveal('.sp-card', {
      distance: '0px', scale: 0.85, opacity: 0,
      duration: 700, easing: 'cubic-bezier(0.22,1,0.36,1)', interval: 90, delay: 60
    });
  }
}


// ===== HOME GREETING =====
function renderGreeting() {
  const container = document.getElementById("home-greeting");
  if (!container) return;

  const settings = getSettings();
  const heroEye = document.querySelector(".hero-eye");
  const heroTitle = document.querySelector(".hero-title");
  const heroSub = document.querySelector(".hero-sub");
  const heroCta = document.querySelector(".hero-cta");

  if (settings.name) {
    if (heroEye) heroEye.style.display = "none";
    if (heroTitle) heroTitle.style.display = "none";
    if (heroSub) heroSub.style.display = "none";
    if (heroCta) heroCta.style.display = "none";

    // Fav Bubbles
    let bubblesHtml = "";
    if (settings.favSubjects && settings.favSubjects.length > 0 && typeof SUBJECTS !== "undefined") {
      const favs = SUBJECTS.filter(s => settings.favSubjects.includes(s.id));
      bubblesHtml = `
        <div class="fav-bubbles-wrap au as">
          <div class="bubbles-label">Quick Access</div>
          <div class="bubbles-grid">
            ${favs.map(s => `
              <a href="subject.html?id=${s.id}" class="fav-bubble" title="${s.name}" style="background:linear-gradient(${s.grad})">
                <span>${s.icon}</span>
              </a>
            `).join("")}
          </div>
        </div>
      `;
    }

    const isEmoji = !settings.avatar || settings.avatar.length < 10;
    const avatarHtml = isEmoji
      ? `<span>${settings.avatar || "👨‍🎓"}</span>`
      : `<img src="${settings.avatar}" alt="Avatar" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">`;

    const lang = settings.lang || "en";
    const hour = new Date().getHours();
    let greetKey = 'greet_evening';
    if (hour >= 5 && hour < 12) greetKey = 'greet_morning';
    else if (hour >= 12 && hour < 17) greetKey = 'greet_afternoon';

    let greetText = (typeof TRANSLATIONS !== 'undefined' && TRANSLATIONS[lang] && TRANSLATIONS[lang][greetKey])
      ? TRANSLATIONS[lang][greetKey] : "Hello";

    const timeNowStr = new Date().toLocaleTimeString(lang === 'ar' ? 'ar-EG' : 'en-US', { hour: '2-digit', minute: '2-digit' });
    let lastVisitStr = "-";
    if (window.lastVisitTime) {
      const lvDate = new Date(window.lastVisitTime);
      lastVisitStr = lvDate.toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    }

    const timeLbl = (typeof TRANSLATIONS !== 'undefined' && TRANSLATIONS[lang]?.time_now) ? TRANSLATIONS[lang].time_now : "Local Time";
    const visitLbl = (typeof TRANSLATIONS !== 'undefined' && TRANSLATIONS[lang]?.last_visit) ? TRANSLATIONS[lang].last_visit : "Last Seen";

    container.innerHTML = `
      <div class="greeting-wrap au d1" style="display:flex; flex-direction:column; align-items:center; justify-content:center; gap:20px; text-align:center;">
        <div class="mobile-avatar" style="width:140px; height:140px; font-size:65px; border-width:6px; box-shadow: 0 10px 25px var(--glow);">${avatarHtml}</div>
        <div>
          <h2 style="margin:0; font-size:36px; font-weight:900; letter-spacing: -0.5px;">${greetText}, <span class="g-text">${settings.name}</span>! </h2>
          <p style="margin:12px 0 0; font-size: 15px; color: var(--muted); display:flex; justify-content:center; gap:24px; flex-wrap:wrap; font-weight:500;">
            <span><i style="font-style:normal; opacity: 0.8;">🕒</i> ${timeLbl}: ${timeNowStr}</span>
            <span><i style="font-style:normal; opacity: 0.8;">📅</i> ${visitLbl}: ${lastVisitStr}</span>
          </p>
        </div>
      </div>
      ${bubblesHtml}
    `;
  } else {
    if (heroEye) heroEye.style.display = "";
    if (heroTitle) heroTitle.style.display = "";
    if (heroSub) heroSub.style.display = "";
    if (heroCta) heroCta.style.display = "";
    container.innerHTML = "";
  }
}

// ===== SETTINGS PAGE =====
function renderSettingsPage() {
  const container = document.getElementById("settings-container");
  if (!container || typeof SUBJECTS === "undefined") return;

  const settings = getSettings();

  const avatarGrid = document.getElementById("set-avatar-grid");
  if (avatarGrid) {
    const avatars = ["👨‍🎓", "👩‍🎓"];
    const currentAvatar = settings.avatar || "👨‍🎓";
    const isCustom = currentAvatar.length > 2;

    avatarGrid.querySelectorAll(".avatar-option").forEach(o => o.remove());

    const html = avatars.map(a => `
      <div class="avatar-option ${a === currentAvatar && !isCustom ? "selected" : ""}" data-avatar="${a}" onclick="selectSettingAvatar(this)">${a}</div>
    `).join("");

    const btn = avatarGrid.querySelector(".custom-avatar-btn");
    btn.insertAdjacentHTML("beforebegin", html);

    if (isCustom) {
      btn.insertAdjacentHTML("beforebegin", `
        <div class="avatar-option selected" data-avatar="${currentAvatar}" onclick="selectSettingAvatar(this)">
          <img src="${currentAvatar}" alt="custom">
        </div>
      `);
    }

    const uploader = document.getElementById("set-avatar-upload");
    if (uploader) {
      uploader.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (re) => {
            const base64 = re.target.result;
            let preview = avatarGrid.querySelector(".avatar-option img")?.parentNode;
            if (!preview) {
              preview = document.createElement("div");
              preview.className = "avatar-option selected";
              preview.onclick = () => selectSettingAvatar(preview);
              avatarGrid.insertBefore(preview, btn);
            }
            avatarGrid.querySelectorAll(".avatar-option").forEach(o => o.classList.remove("selected"));
            preview.classList.add("selected");
            preview.dataset.avatar = base64;
            preview.innerHTML = `<img src="${base64}" alt="custom">`;
          };
          reader.readAsDataURL(file);
        }
      };
    }
  }

  // Fill inputs
  const nameInput = document.getElementById("set-name");
  if (nameInput) nameInput.value = settings.name || "";

  const langSelect = document.getElementById("set-lang");
  if (langSelect) langSelect.value = settings.lang || "en";

  const sortSelect = document.getElementById("set-sort");
  if (sortSelect) sortSelect.value = settings.sortMode || "default";

  const themeSelect = document.getElementById("set-theme");
  if (themeSelect) themeSelect.value = settings.theme || "dark";

  const colorInput = document.getElementById("set-color");
  if (colorInput) colorInput.value = settings.accentColor || "#7c3aed";

  const festiveSelect = document.getElementById("set-festive");
  if (festiveSelect) festiveSelect.value = settings.festive || "off";

  const phoneInput = document.getElementById("set-phone");
  if (phoneInput) phoneInput.value = settings.phone || "";

  const favSubjectsSelect = document.getElementById("set-fav-subs");
  if (favSubjectsSelect) {
    favSubjectsSelect.innerHTML = SUBJECTS.map(s => `
      <div class="fav-sub-check">
        <input type="checkbox" id="fav-${s.id}" value="${s.id}" ${settings.favSubjects && settings.favSubjects.includes(s.id) ? "checked" : ""}>
        <label for="fav-${s.id}"><span>${s.icon}</span> ${s.name}</label>
      </div>
    `).join("");
  }

  // Custom Order List
  renderSubjectOrderList();
}

window.selectSettingAvatar = function (el) {
  const grid = document.getElementById("set-avatar-grid");
  grid.querySelectorAll(".avatar-option").forEach(o => o.classList.remove("selected"));
  el.classList.add("selected");
};

let _localCustomOrder = [];

function renderSubjectOrderList() {
  const listWrap = document.getElementById("set-custom-order-list");
  if (!listWrap || typeof SUBJECTS === "undefined") return;

  const settings = getSettings();
  if (_localCustomOrder.length === 0) {
    _localCustomOrder = settings.customOrder && settings.customOrder.length === SUBJECTS.length
      ? [...settings.customOrder]
      : SUBJECTS.map(s => s.id);
  }

  listWrap.innerHTML = _localCustomOrder.map((id, idx) => {
    const sub = SUBJECTS.find(s => s.id === id);
    if (!sub) return "";
    return `
      <div class="order-item" data-id="${id}">
        <span class="order-drag">☰</span>
        <span class="order-name">${sub.icon} ${sub.name}</span>
        <div class="order-btns">
          <button class="order-btn" onclick="moveSubjectOrder(${idx}, -1)" ${idx === 0 ? "disabled" : ""}>↑</button>
          <button class="order-btn" onclick="moveSubjectOrder(${idx}, 1)" ${idx === _localCustomOrder.length - 1 ? "disabled" : ""}>↓</button>
        </div>
      </div>
    `;
  }).join("");
}

window.moveSubjectOrder = function (idx, dir) {
  const targetIdx = idx + dir;
  if (targetIdx < 0 || targetIdx >= _localCustomOrder.length) return;
  const temp = _localCustomOrder[idx];
  _localCustomOrder[idx] = _localCustomOrder[targetIdx];
  _localCustomOrder[targetIdx] = temp;
  renderSubjectOrderList();
};

window.saveUserSettings = function () {
  const name = (document.getElementById("set-name")?.value || "").trim() || getSettings().name;
  const avatar = document.querySelector("#set-avatar-grid .avatar-option.selected")?.dataset.avatar || getSettings().avatar || "👨‍🎓";
  const lang = document.getElementById("set-lang")?.value || getSettings().lang || "en";
  const sortMode = document.getElementById("set-sort").value;
  const theme = document.getElementById("set-theme").value;
  const festive = document.getElementById("set-festive").value;
  const accentColor = document.getElementById("set-color").value;

  const favSubjects = [];
  document.querySelectorAll("#set-fav-subs input:checked").forEach(cb => favSubjects.push(cb.value));

  const customOrder = [..._localCustomOrder];
  const phone = document.getElementById("set-phone").value;

  updateSettings({ name, avatar, lang, sortMode, theme, festive, favSubjects, customOrder, accentColor, phone });

  renderNavProfile();
  renderGreeting();
  updateNavProfile(); // Call the new function

  // Apply changes immediately
  document.documentElement.setAttribute("data-theme", theme);
  if (festive !== "off") {
    document.documentElement.setAttribute("data-festive", festive);
  } else {
    document.documentElement.removeAttribute("data-festive");
  }
  applyAccentColor(accentColor);
  updateThemeBtn(theme);
  applyFestiveIcons();

  const saveBtn = document.querySelector(".save-settings-btn");
  if (saveBtn) {
    const originalText = saveBtn.textContent;
    saveBtn.textContent = "✅ Saved!";
    saveBtn.classList.add("success");
    setTimeout(() => {
      saveBtn.textContent = originalText;
      saveBtn.classList.remove("success");
    }, 2000);
  }
};

// ===== FAVORITES PAGE =====
function renderFavoritesPage() {
  const container = document.getElementById("fav-container");
  if (!container || typeof SUBJECTS === "undefined") return;

  const favs = getFavorites();

  // Render Subjects
  const subjGrid = document.getElementById("fav-subjects-grid");
  if (subjGrid) {
    if (favs.subjects.length === 0) {
      subjGrid.innerHTML = `<div class="fav-empty"><span>📭</span><p>You haven't favorited any subjects yet.</p></div>`;
    } else {
      subjGrid.innerHTML = SUBJECTS.filter(s => favs.subjects.includes(s.id)).map((s, i) => `
        <a href="subject.html?id=${s.id}" class="subject-card au" style="animation-delay:${i * 0.05}s; --fc-color: ${s.color}; --fc-grad: linear-gradient(${s.grad})">
          <div class="fc-top">
            <div class="fc-icon" style="background: var(--fc-grad)">${s.icon}</div>
            <button class="fav-btn active sc-fav-override" onclick="toggleFavorite(event, 'subject', '${s.id}'); renderFavoritesPage();" title="Remove Favorite">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
            </button>
          </div>
          <div class="fc-bottom">
            <h3 class="fc-title">${s.name}</h3>
            <p class="fc-desc-short">${s.nameAr} • 7 Sections</p>
          </div>
          <div class="fc-glow" style="background: var(--fc-grad)"></div>
        </a>
      `).join("");
    }
  }

  // Render Items (PDFs/Videos)
  const itemsGrid = document.getElementById("fav-items-grid");
  if (itemsGrid && typeof CONTENT !== "undefined") {
    if (favs.items.length === 0) {
      itemsGrid.innerHTML = `<div class="fav-empty"><span>📭</span><p>You haven't favorited any PDFs or videos yet.</p></div>`;
    } else {
      const typeMap = { lecture: ["📖", "Lecture"], video: ["🎬", "Video"], summary: ["🔑", "Summary"], file: ["📄", "PDF"] };
      let itemsHTML = '';

      favs.items.forEach((favItem, i) => {
        const sub = SUBJECTS.find(s => s.id === favItem.subjectId);
        if (!sub) return;

        let foundLec = null;
        Object.values(CONTENT[sub.id] || {}).forEach(sec => {
          sec.forEach(ch => {
            ch.forEach(lec => {
              if (lec.id === favItem.lecId) foundLec = lec;
            });
          });
        });

        if (foundLec) {
          const [ico, lbl] = typeMap[foundLec.type] || ["📖", "Content"];
          const escapedLec = JSON.stringify(foundLec).replace(/'/g, "&apos;").replace(/"/g, "&quot;");
          itemsHTML += `
            <div class="fav-item-card" style="animation-delay:${i * 0.05}s">
              <button class="fav-btn active" onclick="toggleFavorite(event, 'item', '${sub.id}', '${foundLec.id}'); renderFavoritesPage();" title="Remove Favorite">⭐</button>
              <div class="fic-header">
                <span class="fic-subj" style="color:${sub.color}">${sub.name}</span>
              </div>
              <div class="fic-title">${foundLec.title || "(no title)"}</div>
              <div class="fic-footer">
                <span class="fic-badge">${ico} ${lbl}</span>
                <button class="s-pill" onclick='openViewer(${escapedLec}, "${sub.id}")'>Open ↗</button>
              </div>
            </div>
          `;
        }
      });
      itemsGrid.innerHTML = itemsHTML;
    }
  }
}

// ===== CHECK PENDING ON LOAD =====
function checkPendingProgress() {
  const pendingStr = localStorage.getItem("so_pending_progress");
  if (pendingStr) {
    try {
      const pending = JSON.parse(pendingStr);
      askProgress(pending);
    } catch (e) { }
  }
}

// ===== AI SITE CONTEXT =====
function buildSiteContext() {
  if (typeof SUBJECTS === "undefined" || typeof CONTENT === "undefined") return "";

  let ctx = "=== محتوى موقع Subjects Online ===\n";
  ctx += "الموقع ده بيخدم طلاب كلية التجارة. فيه المواد دي:\n\n";

  SUBJECTS.forEach(sub => {
    ctx += `📚 مادة: ${sub.name} (ID: ${sub.id})\n`;
    const subContent = CONTENT[sub.id] || {};

    Object.entries(subContent).forEach(([sectionId, chapters]) => {
      const sec = (typeof SECTIONS !== "undefined" ? SECTIONS : []).find(s => s.id === sectionId);
      const secTitle = sec ? sec.title : sectionId;
      const lectures = [];

      chapters.forEach((ch, chIdx) => {
        ch.forEach(lec => {
          let lecLine = `  - ${lec.title} (${lec.type === "video" ? "فيديو" : "PDF"})`;
          // Include interactive step content if available
          if (lec.interactive && lec.interactive.length > 0) {
            lecLine += "\n    محتوى تفاعلي:";
            lec.interactive.forEach(step => {
              lecLine += `\n      • ${step.title}: ${step.content}`;
            });
          }
          lectures.push(lecLine);
        });
      });

      if (lectures.length > 0) {
        ctx += `  [${secTitle}]:\n${lectures.join("\n")}\n`;
      }
    });

    // Special content
    if (typeof SPECIAL_CONTENT !== "undefined" && SPECIAL_CONTENT[sub.id]) {
      ctx += `  [Special/Premium]:\n`;
      SPECIAL_CONTENT[sub.id].forEach(lec => {
        ctx += `  - ${lec.title}\n`;
      });
    }

    ctx += "\n";
  });

  ctx += "=== نهاية محتوى الموقع ===\n\n";

  // إضافة بيانات الطالب (Memory & Stats)
  ctx += "=== إحصائيات ونشاط الطالب الحالي ===\n";

  try {
    const progress = JSON.parse(localStorage.getItem("so_progress") || "{}");
    const recents = JSON.parse(localStorage.getItem("so_recents") || "[]");
    const favorites = JSON.parse(localStorage.getItem("so_favorites") || '{"subjects":[],"items":[]}');

    let totalPdfs = 0, totalVids = 0;
    Object.values(progress).forEach(p => {
      if (p.pdfs) totalPdfs += p.pdfs.length;
      if (p.videos) totalVids += p.videos.length;
    });

    ctx += `- أنجز الطالب حتى الآن: ${totalPdfs} ملفات PDF و ${totalVids} فيديوهات.\n`;

    if (favorites.subjects.length > 0) {
      const favNames = favorites.subjects.map(id => {
        const s = SUBJECTS.find(sub => sub.id === id);
        return s ? s.name : id;
      }).join("، ");
      ctx += `- المواد المفضلة للطالب: ${favNames}\n`;
    }

    if (recents.length > 0) {
      ctx += `- أخر حاجات الطالب شافها أو ذاكرها (علشان تبقى عارف بيركز على إيه): \n`;
      recents.forEach(r => {
        const s = SUBJECTS.find(sub => sub.id === r.sid);
        ctx += `  • ${r.name} (في مادة ${s ? s.name : r.sid})\n`;
      });
    } else {
      ctx += `- الطالب لسه مبدأش يذاكر أو مفيش نشاط أخير متسجل.\n`;
    }
  } catch (e) {
    ctx += "تعذر جلب إحصائيات الطالب.\n";
  }

  ctx += "=== نهاية نشاط الطالب ===\n";
  return ctx;
}

// ===== AI ASSISTANT =====
function initAiAssistant() {
  const body = document.body;

  // Inject UI
  const fab = document.createElement("button");
  fab.className = "ai-fab au";
  fab.style.animationDelay = "0.5s";
  fab.innerHTML = "AT";
  body.appendChild(fab);

  const panel = document.createElement("div");
  panel.className = "ai-panel";
  panel.innerHTML = `
    <div class="ai-header">
      <div class="ai-h-left">
        <span class="ai-h-icon">AT</span>
        <div>
          <div class="ai-h-title">AT AI Tutor</div>
          <div class="ai-h-sub">Always here to help</div>
        </div>
      </div>
      <div style="display: flex; gap: 8px;">
        <button class="ai-clear" title="مسح المحادثة" style="background:none; border:none; color:white; cursor:pointer; font-size:16px;">🗑️</button>
        <button class="ai-close" style="background:none; border:none; color:white; cursor:pointer; font-size:16px;">✕</button>
      </div>
    </div>
    <div class="ai-messages" id="ai-messages">
    </div>
    <div class="ai-input-area">
      <input type="text" class="ai-input" id="ai-input" placeholder="اسألني عن أي حاجة..." autocomplete="off">
      <button class="ai-send" id="ai-send">↑</button>
    </div>
  `;
  body.appendChild(panel);

  const closeBtn = panel.querySelector(".ai-close");
  const clearBtn = panel.querySelector(".ai-clear");
  const msgsContainer = panel.querySelector("#ai-messages");
  const inputEl = panel.querySelector("#ai-input");
  const sendBtn = panel.querySelector("#ai-send");

  let chatHistory = JSON.parse(localStorage.getItem("so_ai_history") || "[]");

  // Toggle panel
  fab.addEventListener("click", () => panel.classList.add("open"));
  closeBtn.addEventListener("click", () => panel.classList.remove("open"));

  clearBtn.addEventListener("click", () => {
    if (confirm("هل تريد مسح المحادثة بالكامل؟")) {
      chatHistory = [];
      localStorage.removeItem("so_ai_history");
      msgsContainer.innerHTML = '<div class="ai-msg ai-msg-bot" dir="auto">أهلاً بيك! أنا الـ AT AI Tutor بتاعك، جاهز أساعدك في أي وقت. اسألني أي حاجة.</div>';
    }
  });

  const appendMsg = (text, isUser, isRestore = false) => {
    const d = document.createElement("div");
    d.className = "ai-msg " + (isUser ? "ai-msg-user" : "ai-msg-bot");
    d.dir = "auto";
    d.innerHTML = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
    msgsContainer.appendChild(d);
    if (!isRestore) msgsContainer.scrollTop = msgsContainer.scrollHeight;
  };

  // Restore history on load
  if (chatHistory.length > 0) {
    chatHistory.forEach(msg => appendMsg(msg.content, msg.role === "user", true));
  } else {
    appendMsg("أهلاً بيك! أنا الـ AT AI Tutor بتاعك، جاهز أساعدك في أي وقت. اسألني أي حاجة.", false, true);
  }
  setTimeout(() => msgsContainer.scrollTop = msgsContainer.scrollHeight, 100);

  const showTyping = () => {
    const d = document.createElement("div");
    d.className = "ai-typing";
    d.id = "ai-typing-ind";
    d.innerHTML = '<div class="ai-dot"></div><div class="ai-dot"></div><div class="ai-dot"></div>';
    msgsContainer.appendChild(d);
    msgsContainer.scrollTop = msgsContainer.scrollHeight;
  };

  const hideTyping = () => {
    const ind = document.getElementById("ai-typing-ind");
    if (ind) ind.remove();
  };

  const handleSend = async () => {
    const text = inputEl.value.trim();
    if (!text) return;
    inputEl.value = "";

    appendMsg(text, true);

    chatHistory.push({ role: "user", content: text });
    localStorage.setItem("so_ai_history", JSON.stringify(chatHistory));

    const apiKey = typeof GROQ_API_KEY !== 'undefined' ? GROQ_API_KEY : "YOUR_GROQ_API_KEY_HERE";

    if (!apiKey || apiKey === "YOUR_GROQ_API_KEY_HERE") {
      const errorMsg = "عذراً، لم يتم إعداد مفتاح API بعد.";
      appendMsg(errorMsg, false);
      chatHistory.push({ role: "assistant", content: errorMsg });
      localStorage.setItem("so_ai_history", JSON.stringify(chatHistory));
      return;
    }

    showTyping();

    try {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-instruct",
          messages: [
            {
              role: "system",
              content: (() => {
                const studentName = (typeof getSettings === 'function' ? getSettings().name : '') || '';
                const nameNote = studentName ? `اسم الطالب اللي بتكلمه هو "${studentName}"، ناديه باسمه دايماً.` : '';
                return `أنت مساعد ذكي ومدرس لطلاب الجامعة اسمك "AI Tutor".
أهم قاعدة: اتكلم بالعامية المصرية الصميمة (زي ما المصريين بيتكلموا). ممنوع منعاً باتاً كتابة أي حروف صينية، أو لغات غريبة، أو كلام مش مفهوم. لو مش عارف حاجة قول "مش عارف" ببساطة. خليك طبيعي جداً وودود. ${nameNote}

دي معلومات محتوى الموقع ونشاط وإحصائيات الطالب عشان تبقى فاهمه وعارف هو بيذاكر إيه مؤخراً (دي الـ Memory بتاعتك عنه):
${buildSiteContext()}

لو الطالب سأل عن حاجة تخص تقدمه أو المحاضرات اللي شافها، ناقشه فيها وشجعه بناءً على بياناته. لو سأل عن محاضرة، اشرحها بالتفصيل.

لو الطالب طلب منك تفتحله صفحة معينة في الموقع، اديله الرد المناسب وضيف في آخر ردك الكود ده بالضبط (بين قوسين مربعين):
- لفتح الإعدادات: [ACTION: OPEN_SETTINGS]
- لفتح المفضلة: [ACTION: OPEN_FAVORITES]
- لفتح صفحة مادة معينة (مثلاً مادة المحاسبة اللي الأي دي بتاعها accounting): [ACTION: OPEN_SUBJECT_accounting]
- لفتح المطور الذاتي: [ACTION: OPEN_SELF_DEV]
- لفتح الدارك مود أو اللايت مود: [ACTION: TOGGLE_THEME]
- لإضافة المادة الحالية للمفضلة: [ACTION: TOGGLE_FAVORITE]
متكتبش الأكواد دي غير لو هو طلب منك تفتح حاجة أو ينفذ أمر.`;
              })()
            },
            ...chatHistory.slice(-20).map(m => ({
              role: m.role,
              content: m.content
            }))
          ],
          max_tokens: 4096,
          temperature: 0.3
        })
      });

      const data = await res.json();
      hideTyping();

      if (data.error) {
        appendMsg("API Error: " + data.error.message, false);
      } else if (data.choices && data.choices[0]) {
        let aiText = data.choices[0].message.content;

        // Handle Actions
        const actionRegex = /\[ACTION:\s*([^\]]+)\]/g;
        let match;
        while ((match = actionRegex.exec(aiText)) !== null) {
          const action = match[1].trim();
          setTimeout(() => executeAiAction(action), 1500); // execute after a small delay
        }

        // Remove the action tags from the visible message
        aiText = aiText.replace(actionRegex, "").trim();
        if (aiText) {
          appendMsg(aiText, false);
          chatHistory.push({ role: "assistant", content: aiText });
          // Limit history size to prevent context overflow but keep some memory
          if (chatHistory.length > 30) chatHistory = chatHistory.slice(-30);
          localStorage.setItem("so_ai_history", JSON.stringify(chatHistory));
        }
      } else {
        appendMsg("I'm sorry, I couldn't generate a response.", false);
      }
    } catch (e) {
      hideTyping();
      appendMsg("Network error. Check your connection or API key.", false);
    }
  };

  sendBtn.addEventListener("click", handleSend);
  inputEl.addEventListener("keypress", (e) => {
    if (e.key === "Enter") handleSend();
  });
}

// ===== AI ACTIONS EXECUTOR =====
function executeAiAction(action) {
  if (action === "OPEN_SETTINGS") {
    window.location.href = "settings.html";
  } else if (action === "OPEN_FAVORITES") {
    window.location.href = "favorites.html";
  } else if (action === "OPEN_SELF_DEV") {
    window.location.href = "personal-dev.html";
  } else if (action === "TOGGLE_THEME") {
    toggleTheme();
  } else if (action === "TOGGLE_FAVORITE") {
    if (window._currentSubjectId) {
      toggleFavorite(null, 'subject', window._currentSubjectId);
    }
  } else if (action.startsWith("OPEN_SUBJECT_")) {
    const subjectId = action.replace("OPEN_SUBJECT_", "").toLowerCase();
    window.location.href = `subject.html?id=${subjectId}`;
  }
}

// ===== GLOBAL SEARCH =====
function initSearch() {
  const input = document.getElementById("global-search");
  const resultsBox = document.getElementById("search-results");
  if (!input || !resultsBox) return;

  input.addEventListener("input", (e) => {
    const query = e.target.value.trim().toLowerCase();
    if (!query) {
      resultsBox.classList.remove("open");
      return;
    }

    const results = [];

    // Search Subjects
    if (typeof SUBJECTS !== "undefined") {
      SUBJECTS.forEach(s => {
        if (s.name.toLowerCase().includes(query)) {
          results.push({ type: 'subject', id: s.id, name: s.name, icon: s.icon });
        }
      });
    }

    // Search Content (Lects)
    if (typeof CONTENT !== "undefined") {
      Object.entries(CONTENT).forEach(([sid, sections]) => {
        const sub = SUBJECTS.find(s => s.id === sid);
        Object.values(sections).forEach(chapters => {
          chapters.forEach(ch => {
            ch.forEach(lec => {
              if (lec.title && lec.title.toLowerCase().includes(query)) {
                results.push({
                  id: lec.id,
                  type: lec.type || 'file',
                  sid: sid,
                  sname: sub ? sub.name : '',
                  name: lec.title,
                  link: lec.content
                });
              }
            });
          });
        });
      });
    }

    renderSearchResults(results.slice(0, 8)); // Limit to 8
  });

  // Close search when clicking outside
  document.addEventListener("click", (e) => {
    if (!input.contains(e.target) && !resultsBox.contains(e.target)) {
      resultsBox.classList.remove("open");
    }
  });
}

function renderSearchResults(results) {
  const box = document.getElementById("search-results");
  if (results.length === 0) {
    box.innerHTML = `<div class="search-no-results" style="padding:16px; text-align:center; color:var(--muted);">No results found.</div>`;
  } else {
    box.innerHTML = results.map(r => {
      if (r.type === 'subject') {
        return `
          <a href="subject.html?id=${r.id}" class="search-result-item">
            <span class="sr-icon">${r.icon}</span>
            <div class="sr-info">
              <div class="sr-name">${r.name}</div>
              <div class="sr-type">Subject</div>
            </div>
          </a>
        `;
      } else {
        const icon = r.type === 'video' ? '🎬' : '📄';
        return `
          <a href="subject.html?id=${r.sid}" class="search-result-item">
            <span class="sr-icon">${icon}</span>
            <div class="sr-info">
              <div class="sr-name">${r.name}</div>
              <div class="sr-type">${r.sname} • ${r.type.toUpperCase()}</div>
            </div>
          </a>
        `;
      }
    }).join("");
  }
  box.classList.add("open");
}

// Update Profile Nav with Avatar
function updateNavProfile() {
  const settings = getSettings();
  if (!settings.name) return;
  const lang = settings.lang || "en";
  const profileText = (typeof TRANSLATIONS !== 'undefined' && TRANSLATIONS[lang]?.nav_settings) ? TRANSLATIONS[lang].nav_settings : "Profile";
  const isEmoji = !settings.avatar || settings.avatar.length < 10;
  const avatarHtml = isEmoji
    ? `<span style="font-size:18px;">${settings.avatar || "👨‍🎓"}</span>`
    : `<div style="width:24px; height:24px; border-radius:50%; overflow:hidden; border:1px solid var(--border);"><img src="${settings.avatar}" style="width:100%; height:100%; object-fit:cover;" alt="Avatar"></div>`;

  const navLinks = document.querySelectorAll('.nav-link[href="settings.html"], .mobile-link[href="settings.html"]');
  navLinks.forEach(link => {
    link.innerHTML = `<div style="display:flex;align-items:center;gap:8px;">${avatarHtml}<span>${profileText}</span></div>`;
    link.removeAttribute("data-i18n");
  });
}

document.addEventListener("languageChanged", () => {
  renderGreeting();
  updateNavProfile();
});

// ===== INIT =====
document.addEventListener("DOMContentLoaded", () => {
  const settings = getSettings();
  initTheme();
  initNavbar();
  renderHomeCards();
  renderSubjectCards();
  initSubjectPage();
  renderProgressSection();
  checkPendingProgress();
  initAiAssistant();
  renderFavoritesPage();
  renderGreeting();
  initSearch();
  renderRecents();
  renderDashboard();
  renderSettingsPage();
  renderSpecialPage();

  const path = location.pathname.split("/").pop() || "index.html";
  if (!settings.name && path !== "login.html") {
    setTimeout(showLoginModal, 1000);
  }
});



// ===== DASHBOARD =====
function renderDashboard() {
  const container = document.querySelector(".dashboard-page");
  if (!container) return;

  const settings = getSettings();
  const progress = JSON.parse(localStorage.getItem("so_progress") || "{}");
  const recents = JSON.parse(localStorage.getItem("so_recents") || "[]");

  // Hello Greeting
  const dashGreeting = document.getElementById("dash-greeting");
  if (dashGreeting && settings.name) {
    dashGreeting.querySelector("h2").textContent = `Hello, ${settings.name}! 👋`;
  }

  // Global Calculation
  let totalPdfs = 0, donePdfs = 0;
  let totalVids = 0, doneVids = 0;

  SUBJECTS.forEach(s => {
    const subTotals = getSubjectTotals(s.id);
    totalPdfs += subTotals.pdfs;
    totalVids += subTotals.videos;

    const subProg = progress[s.id] || { pdfs: [], videos: [] };
    donePdfs += subProg.pdfs.length;
    doneVids += subProg.videos.length;
  });

  document.getElementById("gs-subjects").textContent = SUBJECTS.length;
  document.getElementById("gs-pdfs").textContent = `${donePdfs}/${totalPdfs}`;
  document.getElementById("gs-videos").textContent = `${doneVids}/${totalVids}`;

  // Subject List
  const subGrid = document.getElementById("dash-subject-list");
  if (subGrid) {
    subGrid.innerHTML = SUBJECTS.map(s => {
      const tot = getSubjectTotals(s.id);
      const prg = progress[s.id] || { pdfs: [], videos: [] };
      const pct = tot.pdfs + tot.videos > 0 ? Math.round(((prg.pdfs.length + prg.videos.length) / (tot.pdfs + tot.videos)) * 100) : 0;

      return `
        <div class="dash-item au">
          <div class="di-left">
            <div class="di-icon" style="background:linear-gradient(${s.grad})">${s.icon}</div>
            <div class="di-info">
              <div class="di-name">${s.name}</div>
              <div class="di-meta">${prg.pdfs.length + prg.videos.length} items completed</div>
            </div>
          </div>
          <div class="di-right">
            <div class="di-pct">${pct}%</div>
            <div class="di-bar-bg"><div class="di-bar-fg" style="width:${pct}%; background:${s.color}"></div></div>
          </div>
        </div>
      `;
    }).join("");
  }

  // Recent List
  const recGrid = document.getElementById("dash-recent-list");
  if (recGrid) {
    if (recents.length === 0) {
      recGrid.innerHTML = `<div style="padding:40px; text-align:center; color:var(--muted);">No recent activity. Start studying!</div>`;
    } else {
      recGrid.innerHTML = recents.map(r => {
        const sub = SUBJECTS.find(s => s.id === r.sid);
        const icon = r.type === "video" ? "🎬" : "📄";
        return `
          <div class="dash-item au">
             <div class="di-left">
                <div class="di-icon" style="background:var(--surface)">${icon}</div>
                <div class="di-info">
                  <div class="di-name">${r.name}</div>
                  <div class="di-meta">${sub ? sub.name : ''}</div>
                </div>
             </div>
             <a href="subject.html?id=${r.sid}" class="btn btn-primary" style="padding:6px 12px; font-size:12px">Resume</a>
          </div>
        `;
      }).join("");
    }
  }
}

function getSubjectTotals(subjectId) {
  let pdfs = 0, videos = 0;
  if (typeof CONTENT !== "undefined" && CONTENT[subjectId]) {
    Object.values(CONTENT[subjectId]).forEach(sections => {
      sections.forEach(chapters => {
        chapters.forEach(lec => {
          if (lec.content || (lec.interactive && lec.interactive.length > 0)) {
            if (lec.type === "video") videos++; else pdfs++;
          }
        });
      });
    });
  }
  if (typeof SPECIAL_CONTENT !== "undefined" && SPECIAL_CONTENT[subjectId]) {
    SPECIAL_CONTENT[subjectId].forEach(lec => {
      if (lec.content || (lec.interactive && lec.interactive.length > 0)) {
        if (lec.type === "video") videos++; else pdfs++;
      }
    });
  }
  return { pdfs, videos };
}


// ===== RECENTLY VIEWED =====
function trackRecent(item) {
  // item { id, sid, name, type }
  const settings = getSettings();
  let recents = JSON.parse(localStorage.getItem("so_recents") || "[]");

  // Remove duplicate
  recents = recents.filter(r => r.name !== item.name || r.sid !== item.sid);

  // Add to front
  recents.unshift(item);

  // Keep last 4
  localStorage.setItem("so_recents", JSON.stringify(recents.slice(0, 4)));
}

function renderRecents() {
  const container = document.getElementById("recents-section");
  const grid = document.getElementById("recents-grid");
  if (!container || !grid) return;

  const recents = JSON.parse(localStorage.getItem("so_recents") || "[]");
  if (recents.length === 0) {
    container.style.display = "none";
    return;
  }

  container.style.display = "block";
  const subjects = typeof SUBJECTS !== "undefined" ? SUBJECTS : [];

  grid.innerHTML = recents.map(r => {
    const sub = subjects.find(s => s.id === r.sid);
    const icon = r.type === "video" ? "🎬" : "📄";
    return `
      <a href="subject.html?id=${r.sid}" class="recent-card au">
        <div class="rc-icon" style="background:linear-gradient(${sub ? sub.grad : 'var(--surface), var(--surface)'})">${icon}</div>
        <div class="rc-info">
          <div class="rc-name">${r.name}</div>
          <div class="rc-subj">${sub ? sub.name : ''}</div>
        </div>
      </a>
    `;
  }).join("");
}


// ===== SPECIAL PAGE =====
function renderSpecialPage() {
  const grid = document.getElementById("special-page-grid");
  if (!grid) return;

  // Use SPECIAL_CONTENT for this page
  const subjects = SUBJECTS.filter(s => SPECIAL_CONTENT[s.id]);

  grid.innerHTML = subjects.map(s => {
    const materials = SPECIAL_CONTENT[s.id] || [];

    return `
      <div class="sp-card au">
        <div class="sp-badge">SMART LESSONS</div>
        <div class="sp-card-head">
          <div class="sp-card-icon" style="background:linear-gradient(${s.grad}); color:white;">${s.icon}</div>
          <div class="sp-card-info">
            <h3>${s.name}</h3>
            <p>${materials.length} Premium Explorations</p>
          </div>
        </div>
        <div class="sp-list">
          ${materials.length > 0 ? materials.map(m => {
      const isCompleted = (progress[s.id] && progress[s.id].pdfs.includes(m.id));
      const resetHTML = isCompleted ? `<span class="lec-reset-btn" style="margin-right:8px; width:20px; height:20px;" onclick="resetProgress(event, '${s.id}', '${m.id}', 'file', ''); return false;">✕</span>` : "";
      const statusIcon = isCompleted ? '<span style="color:#10b981">✅</span>' : '<i>✨</i>';

      return `
              <a href="#" class="sp-item" onclick="openViewer(${JSON.stringify(m).replace(/"/g, '&quot;')}, '${s.id}'); return false;">
                ${resetHTML}
                ${statusIcon}
                <span>${m.title}</span>
              </a>
            `;
    }).join("") : '<div style="padding:20px; color:var(--muted); font-size:13px;">Expanding Library...</div>'}
        </div>
        <a href="subject.html?id=${s.id}" class="btn btn-ghost" style="width:100%; margin-top:10px; font-size:11px;">View Subject Browser</a>
      </div>
    `;
  }).join("");
}
