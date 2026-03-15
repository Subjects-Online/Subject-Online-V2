// ================================================================
// Subjects Online V2 — main.js
// Handles: theme, navbar, page routing, subject cards,
//          chapter accordion, media viewer
// ================================================================

// ===== THEME & SETTINGS =====
function getSettings() {
  const defaults = { name: "", theme: "dark", favSubjects: [], sortMode: "default", customOrder: [], accentColor: "#7c3aed" };
  const saved = localStorage.getItem("so_settings");
  const res = saved ? { ...defaults, ...JSON.parse(saved) } : defaults;
  // Migrate old favSubject if exists
  const oldSaved = JSON.parse(saved || "{}");
  if (oldSaved.favSubject && res.favSubjects.length === 0) {
    res.favSubjects = [oldSaved.favSubject];
  }
  return res;
}
function updateSettings(newSettings) {
  const current = getSettings();
  const updated = { ...current, ...newSettings };
  localStorage.setItem("so_settings", JSON.stringify(updated));
  return updated;
}
function initTheme() {
  const settings = getSettings();
  const theme = settings.theme || "dark";
  document.documentElement.setAttribute("data-theme", theme);
  applyAccentColor(settings.accentColor || "#7c3aed");
  updateThemeBtn(theme);
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
  const btns = document.querySelectorAll(".theme-btn");
  btns.forEach(b => {
    const ico = b.querySelector(".theme-ico");
    const lbl = b.querySelector(".theme-label");
    if (ico) ico.textContent = theme === "dark" ? "🌙" : "☀️";
    if (lbl) lbl.textContent = theme === "dark" ? "Dark" : "Light";
  });
}

// ===== NAVBAR =====
function initNavbar() {
  const hamburger = document.querySelector(".hamburger");
  const mobileMenu = document.querySelector(".mobile-menu");
  const backdrop = document.querySelector(".menu-backdrop");

  if (!hamburger) return;

  hamburger.addEventListener("click", () => {
    const isOpen = hamburger.classList.toggle("open");
    mobileMenu.classList.toggle("open", isOpen);
    backdrop.classList.toggle("open", isOpen);
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
window.toggleFavorite = function(e, type, subjectId, lecId = null) {
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
    <a href="subject.html?id=${s.id}" class="subject-card" style="animation-delay:${i * 0.07}s">
      <button class="fav-btn ${isFav ? 'active' : ''}" onclick="toggleFavorite(event, 'subject', '${s.id}')" title="Toggle Favorite">${isFav ? '⭐' : '☆'}</button>
      <div class="sc-glow" style="background:linear-gradient(${s.grad})"></div>
      <div class="sc-icon" style="background:linear-gradient(${s.grad})">
        <span>${s.icon}</span>
      </div>
      <div>
        <div class="sc-tag">${s.nameAr}</div>
        <div class="sc-name">${s.name}</div>
        <div class="sc-desc">${s.desc}</div>
      </div>
      <div class="sc-footer">
        <span class="sc-meta">7 Sections</span>
        <span class="sc-arr" style="color:${s.color}">→</span>
      </div>
      <div class="sc-accent" style="background:linear-gradient(${s.grad})"></div>
    </a>
  `;
  }).join("");
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
  ];

  container.innerHTML = cards.map((c, i) => `
    <a href="${c.href}" class="feat-card au" style="animation-delay:${0.1 + i * 0.12}s">
      <div class="fc-bar" style="background:linear-gradient(${c.grad})"></div>
      <div class="fc-head">
        <div class="fc-icon" style="background:linear-gradient(${c.grad})">${c.icon}</div>
        <div class="fc-tags">
          <span class="fc-tag">${c.tag1}</span>
          <span class="fc-tag">${c.tag2}</span>
        </div>
      </div>
      <h2 class="fc-title">${c.title}</h2>
      <p class="fc-desc">${c.desc}</p>
      <div class="fc-features">
        ${c.pills.map(p => `<span class="fc-pill" style="border-color:${c.color}44;color:${c.color};background:${c.color}11">${p}</span>`).join("")}
      </div>
      <div class="fc-cta" style="color:${c.color}">
        <span>Open Section</span>
        <span class="fc-arr">→</span>
      </div>
      <div class="fc-glow" style="background:linear-gradient(${c.grad})"></div>
    </a>
  `).join("");
}

// ===== SUBJECT PAGE =====
let activeSection = "course-content";

function initSubjectPage() {
  const params = new URLSearchParams(location.search);
  const id = params.get("id");
  if (!id || typeof SUBJECTS === "undefined") return;

  window._currentSubjectId = id;
  const subject = SUBJECTS.find(s => s.id === id);
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
      const hasContent = !!lec.content;
      const isCompleted = hasContent && (subjProg.pdfs.includes(lec.content) || subjProg.videos.includes(lec.content));
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

  overlay.classList.add("open");
  document.body.style.overflow = "hidden";

  if (subjectId && lec.content) {
    trackRecent({ id: lec.id, sid: subjectId, name: lec.title || "Lecture", type: lec.type || (lec.content.endsWith(".pdf") ? "pdf" : "video") });
    // Save as pending instead of auto-completing
    localStorage.setItem("so_pending_progress", JSON.stringify({
      subjectId,
      lecId: lec.id,
      content: lec.content,
      type: lec.type,
      title: lec.title
    }));
  }
}

function askProgress(pending) {
  if (!pending) return;

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
    const itemId = lec.content;
    if (!data[subjectId][type].includes(itemId)) {
      data[subjectId][type].push(itemId);
      localStorage.setItem("so_progress", JSON.stringify(data));

      const openedBtn = document.querySelector(`.lec-item[data-id="${lec.id}"] .lec-open`);
      if (openedBtn) {
        openedBtn.innerHTML = "✅";
        openedBtn.style.color = "#10b981";
      }
    }
  } catch (e) { }
}

function closeViewer() {
  const overlay = document.getElementById("mv-overlay");
  if (overlay) { overlay.classList.remove("open"); document.body.style.overflow = ""; }
  const body = document.getElementById("mv-body");
  if (body) body.innerHTML = "";

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
    Object.values(content).forEach(sections => {
      sections.forEach(ch => {
        ch.forEach(lec => {
          if (lec.content) {
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

    container.innerHTML = `
      <div class="greeting-wrap au d1">
        <h2>Hello, <span class="g-text">${settings.name}</span>! 👋</h2>
        <p>Glad to see you back. What subject are you going to master today?</p>
        ${bubblesHtml}
      </div>
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
  
  // Fill inputs
  const nameInput = document.getElementById("set-name");
  if (nameInput) nameInput.value = settings.name || "";
  
  const sortSelect = document.getElementById("set-sort");
  if (sortSelect) sortSelect.value = settings.sortMode || "default";
  
  const themeSelect = document.getElementById("set-theme");
  if (themeSelect) themeSelect.value = settings.theme || "dark";
  
  const colorInput = document.getElementById("set-color");
  if (colorInput) colorInput.value = settings.accentColor || "#7c3aed";

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

window.moveSubjectOrder = function(idx, dir) {
  const targetIdx = idx + dir;
  if (targetIdx < 0 || targetIdx >= _localCustomOrder.length) return;
  const temp = _localCustomOrder[idx];
  _localCustomOrder[idx] = _localCustomOrder[targetIdx];
  _localCustomOrder[targetIdx] = temp;
  renderSubjectOrderList();
};

window.saveUserSettings = function() {
  const name = document.getElementById("set-name").value;
  const sortMode = document.getElementById("set-sort").value;
  const theme = document.getElementById("set-theme").value;
  const accentColor = document.getElementById("set-color").value;
  
  const favSubjects = [];
  document.querySelectorAll("#set-fav-subs input:checked").forEach(cb => favSubjects.push(cb.value));

  const customOrder = [..._localCustomOrder];
  
  updateSettings({ name, sortMode, theme, favSubjects, customOrder, accentColor });
  
  // Apply changes immediately
  document.documentElement.setAttribute("data-theme", theme);
  applyAccentColor(accentColor);
  updateThemeBtn(theme);
  
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
        <a href="subject.html?id=${s.id}" class="subject-card" style="animation-delay:${i * 0.05}s">
          <button class="fav-btn active" onclick="toggleFavorite(event, 'subject', '${s.id}'); renderFavoritesPage();" title="Remove Favorite">⭐</button>
          <div class="sc-glow" style="background:linear-gradient(${s.grad})"></div>
          <div class="sc-icon" style="background:linear-gradient(${s.grad})">
            <span>${s.icon}</span>
          </div>
          <div>
            <div class="sc-tag">${s.nameAr}</div>
            <div class="sc-name">${s.name}</div>
          </div>
          <div class="sc-accent" style="background:linear-gradient(${s.grad})"></div>
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
        if(!sub) return;
        
        let foundLec = null;
        Object.values(CONTENT[sub.id] || {}).forEach(sec => {
          sec.forEach(ch => {
            ch.forEach(lec => {
              if(lec.id === favItem.lecId) foundLec = lec;
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

// ===== AI ASSISTANT =====
function initAiAssistant() {
  const body = document.body;

  // Inject UI
  const fab = document.createElement("button");
  fab.className = "ai-fab au";
  fab.style.animationDelay = "0.5s";
  fab.innerHTML = "✨";
  body.appendChild(fab);

  const panel = document.createElement("div");
  panel.className = "ai-panel";
  panel.innerHTML = `
    <div class="ai-header">
      <div class="ai-h-left">
        <span class="ai-h-icon">✨</span>
        <div>
          <div class="ai-h-title">Gemini AI Tutor</div>
          <div class="ai-h-sub">Always here to help</div>
        </div>
      </div>
      <button class="ai-close">✕</button>
    </div>
    <div class="ai-messages" id="ai-messages">
      <div class="ai-msg ai-msg-bot">Hello! I'm Gemini, your AI tutor. Ask me to explain a topic, summarize notes, or help you study!</div>
    </div>
    <div class="ai-input-area">
      <input type="text" class="ai-input" id="ai-input" placeholder="Ask anything..." autocomplete="off">
      <button class="ai-send" id="ai-send">↑</button>
    </div>
  `;
  body.appendChild(panel);

  const closeBtn = panel.querySelector(".ai-close");
  const msgsContainer = panel.querySelector("#ai-messages");
  const inputEl = panel.querySelector("#ai-input");
  const sendBtn = panel.querySelector("#ai-send");

  // Toggle panel
  fab.addEventListener("click", () => panel.classList.add("open"));
  closeBtn.addEventListener("click", () => panel.classList.remove("open"));

  const appendMsg = (text, isUser) => {
    const d = document.createElement("div");
    d.className = "ai-msg " + (isUser ? "ai-msg-user" : "ai-msg-bot");
    d.innerHTML = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
    msgsContainer.appendChild(d);
    msgsContainer.scrollTop = msgsContainer.scrollHeight;
  };

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

    // ⚠️ تحذير أمني: وضع الـ API Key في كود الـ JavaScript المفتوح (Frontend) بيخليه مكشوف لأي حد بيزور الموقع.
    // لأي موقع حقيقي، لازم الـ Key يتخزن في Backend. لكن بما إن الموقع هنا Static، دي الطريقة الوحيدة المؤقتة.
    const apiKey = "AIzaSyDFSCVw0Td3WEh4hpZZqweUufa9A1-S31g"; // حط الـ API Key بتاعك هنا مكان الكلمة دي

    if (!apiKey || apiKey === "YOUR_API_KEY_HERE") {
      appendMsg("عذراً، لم يتم إعداد مفتاح API من قبل مدير النظام بعد.", false);
      return;
    }

    showTyping();

    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: "You are an expert tutor for university students. Be helpful, concise, and friendly. Explain clearly but keep it short. Don't use heavy markdown except for bold and lists. The student says: " + text }] }]
        })
      });

      const data = await res.json();
      hideTyping();

      if (data.error) {
        appendMsg("API Error: " + data.error.message, false);
      } else if (data.candidates && data.candidates[0]) {
        appendMsg(data.candidates[0].content.parts[0].text, false);
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
              if (lec.name.toLowerCase().includes(query)) {
                results.push({ 
                  type: lec.type || 'file', 
                  sid: sid, 
                  sname: sub ? sub.name : '', 
                  name: lec.name, 
                  link: lec.link 
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

// ===== INIT =====
document.addEventListener("DOMContentLoaded", () => {
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
          if (lec.content) {
            if (lec.type === "video") videos++; else pdfs++;
          }
        });
      });
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

