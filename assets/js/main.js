/* ============================================================
   PBCOE ELECTRONICS PORTAL — Core Engine v2.0
   nav · themes · reveals · counters · tilt · parallax · canvas fx
   ============================================================ */
(() => {
"use strict";
const $  = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- THEME ---------- */
const root = document.documentElement;
const savedTheme = localStorage.getItem("pbcoe-theme");
if (savedTheme) root.dataset.theme = savedTheme;
$$(".theme-toggle").forEach(btn => btn.addEventListener("click", () => {
  root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
  localStorage.setItem("pbcoe-theme", root.dataset.theme);
}));

/* ---------- NAV ---------- */
const nav = $("#nav");
const onScrollNav = () => {
  if (nav) nav.classList.toggle("scrolled", scrollY > 30);
};
addEventListener("scroll", onScrollNav, { passive: true });
onScrollNav();

const burger = $(".burger");
const drawer = $("#drawer");
if (burger && drawer) {
  burger.addEventListener("click", () => {
    const open = drawer.classList.toggle("open");
    burger.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", open);
  });
  $$("a", drawer).forEach(a => a.addEventListener("click", () => {
    drawer.classList.remove("open"); burger.classList.remove("open");
  }));
}

/* active link by filename */
const page = location.pathname.split("/").pop() || "index.html";
$$(".nav-links a.nlink").forEach(a => {
  const href = a.getAttribute("href");
  if (href === page) a.classList.add("active");
});
$$(".has-dd").forEach(li => {
  if ($("a", li)?.getAttribute("href") === page) $("a.nlink", li).classList.add("active");
});

/* ---------- SCROLL PROGRESS + TO TOP ---------- */
const bar = $("#scroll-progress");
const topBtn = $("#to-top");
addEventListener("scroll", () => {
  const h = document.documentElement.scrollHeight - innerHeight;
  if (bar) bar.style.transform = `scaleX(${h > 0 ? scrollY / h : 0})`;
  if (topBtn) topBtn.classList.toggle("show", scrollY > 600);
}, { passive: true });
if (topBtn) topBtn.addEventListener("click", () => scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" }));

/* ---------- REVEALS ---------- */
$$(".reveal").forEach(el => el.classList.add("js"));
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
  });
}, { threshold: 0.14, rootMargin: "0px 0px -6% 0px" });
$$(".reveal:not(.native)").forEach(el => io.observe(el));

/* stagger helper: children of [data-stagger] get incremental delays */
$$("[data-stagger]").forEach(wrap => {
  [...wrap.children].forEach((c, i) => {
    c.classList.add("reveal");
    c.style.setProperty("--d", `${Math.min(i * 0.09, 0.72)}s`);
    io.observe(c);
  });
});

/* ---------- COUNTERS ---------- */
const fmt = n => n >= 1000 ? n.toLocaleString() : String(n);
const cio = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target, end = parseFloat(el.dataset.count), dur = 1600, t0 = performance.now();
    const dec = el.dataset.dec ? parseInt(el.dataset.dec) : 0;
    const tick = t => {
      const p = Math.min((t - t0) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = dec ? (end * eased).toFixed(dec) : fmt(Math.round(end * eased));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    cio.unobserve(el);
  });
}, { threshold: 0.5 });
$$("[data-count]").forEach(el => cio.observe(el));

/* ---------- METERS & RINGS ---------- */
$$(".meter i[data-w]").forEach(el => {
  const o = new IntersectionObserver(es => es.forEach(x => {
    if (x.isIntersecting) { el.style.width = el.dataset.w; o.disconnect(); }
  }), { threshold: 0.3 });
  o.observe(el);
});
$$(".ring").forEach(el => {
  const o = new IntersectionObserver(es => es.forEach(x => {
    if (x.isIntersecting) { el.classList.add("in"); o.disconnect(); }
  }), { threshold: 0.4 });
  o.observe(el);
});

/* ---------- TILT CARDS ---------- */
if (!reduced && matchMedia("(hover:hover)").matches) {
  $$("[data-tilt]").forEach(card => {
    let raf = null;
    card.addEventListener("mousemove", e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        card.style.transform = `perspective(850px) rotateX(${(-y * 7).toFixed(2)}deg) rotateY(${(x * 9).toFixed(2)}deg) translateY(-6px)`;
      });
    });
    card.addEventListener("mouseleave", () => {
      cancelAnimationFrame(raf);
      card.style.transition = "transform .5s var(--ease)";
      card.style.transform = "";
      setTimeout(() => card.style.transition = "", 500);
    });
  });
}

/* ---------- PARALLAX BLOBS ---------- */
const blobs = $$(".blob");
if (!reduced && blobs.length) {
  addEventListener("scroll", () => {
    const sy = scrollY;
    blobs.forEach((b, i) => b.style.transform = `translateY(${sy * (0.06 + i * 0.04)}px) translateX(${Math.sin(sy / 600 + i) * 26}px)`);
  }, { passive: true });
}

/* ---------- FOOTER YEAR ---------- */
$$("#year").forEach(el => el.textContent = new Date().getFullYear());

/* ============================================================
   HERO LIGHTNING CANVAS
   ============================================================ */
const lCanvas = $("#lightning-canvas");
if (lCanvas) {
  const ctx = lCanvas.getContext("2d");
  let W, H, bolts = [], lastBolt = 0, running = true;
  const resize = () => {
    W = lCanvas.width = lCanvas.offsetWidth * devicePixelRatio;
    H = lCanvas.height = lCanvas.offsetHeight * devicePixelRatio;
  };
  resize(); addEventListener("resize", resize);

  const makeBolt = () => {
    const targetX = W / 2 + (Math.random() - 0.5) * W * 0.22;
    const targetY = H / 2 + (Math.random() - 0.5) * H * 0.18;
    const pts = [{ x: Math.random() * W, y: -20 }];
    let { x, y } = pts[0];
    while (y < targetY) {
      x += (targetX - x) * 0.22 + (Math.random() - 0.5) * W * 0.09;
      y += Math.random() * H * 0.07 + 18;
      pts.push({ x, y });
    }
    return { pts, life: 1, hue: Math.random() > 0.5 ? "#facc15" : "#60a5fa" };
  };

  const drawBolt = b => {
    ctx.save();
    ctx.globalAlpha = b.life * 0.95;
    ctx.strokeStyle = b.hue;
    ctx.shadowColor = b.hue;
    ctx.shadowBlur = 18;
    ctx.lineWidth = 2.2 * devicePixelRatio;
    ctx.beginPath();
    b.pts.forEach((p, i) => i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y));
    ctx.stroke();
    /* branches */
    b.pts.forEach((p, i) => {
      if (i % 4 !== 2 || i < 2) return;
      ctx.lineWidth = 1 * devicePixelRatio;
      ctx.globalAlpha = b.life * 0.45;
      ctx.beginPath(); ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x + (Math.random() - 0.5) * 90, p.y + 60 + Math.random() * 50);
      ctx.stroke();
    });
    ctx.restore();
  };

  const loop = t => {
    if (!running) return;
    ctx.clearRect(0, 0, W, H);
    if (!reduced && t - lastBolt > (900 + Math.random() * 1400)) {
      bolts.push(makeBolt());
      lastBolt = t;
    }
    bolts = bolts.filter(b => (b.life -= 0.03) > 0);
    bolts.forEach(drawBolt);
    requestAnimationFrame(loop);
  };
  if (!reduced) requestAnimationFrame(loop);
  document.addEventListener("visibilitychange", () => {
    running = !document.hidden && !reduced;
    if (running) requestAnimationFrame(loop);
  });
}

/* ============================================================
   CALIBRATION PROTOCOL (index scrollytelling)
   ============================================================ */
const calSection = $("#calibration");
if (calSection) {
  const steps = $$(".cal-step", calSection);
  const meterFill = $("#cal-meter-fill");
  const readoutMode = $("#cal-mode");
  const readoutPct = $("#cal-pct");
  const waveCanvas = $("#cal-wave");

  const modes = [
    { name: "SINE SWEEP", draw: sineWave },
    { name: "SQUARE DRIVE", draw: squareWave },
    { name: "PWM GATING", draw: pwmWave },
    { name: "NOISE FILTER", draw: noiseWave },
    { name: "LOCKED · STABLE", draw: cleanWave }
  ];
  let phase = 0, current = 0;

  function drawGrid(c, w, h) {
    c.strokeStyle = "rgba(51,65,85,.55)";
    c.lineWidth = 1;
    for (let x = 0; x <= w; x += w / 12) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, h); c.stroke(); }
    for (let y = 0; y <= h; y += h / 6) { c.beginPath(); c.moveTo(0, y); c.lineTo(w, y); c.stroke(); }
  }
  function pathWave(c, w, h, fn) {
    c.beginPath();
    for (let x = 0; x <= w; x++) {
      const y = h / 2 - fn(x / w, phase) * h * 0.36;
      x ? c.lineTo(x, y) : c.moveTo(x, y);
    }
    c.stroke();
  }
  function sineWave(c, w, h) { c.strokeStyle = "#38bdf8"; c.shadowColor = "#38bdf8"; c.shadowBlur = 12; pathWave(c, w, h, (u, ph) => Math.sin(u * Math.PI * 4 - ph)); }
  function squareWave(c, w, h) { c.strokeStyle = "#facc15"; c.shadowColor = "#facc15"; c.shadowBlur = 12; pathWave(c, w, h, u => (Math.sin(u * Math.PI * 4 - phase) > 0 ? 1 : -1)); }
  function pwmWave(c, w, h) {
    c.strokeStyle = "#fb923c"; c.shadowColor = "#fb923c"; c.shadowBlur = 12;
    pathWave(c, w, h, u => ((u * 8 + phase / 2) % 1) < 0.35 ? 1 : -1);
  }
  function noiseWave(c, w, h) {
    c.strokeStyle = "#f87171"; c.shadowColor = "#f87171"; c.shadowBlur = 10;
    pathWave(c, w, h, u => Math.sin(u * Math.PI * 4 - phase) * 0.55 + (Math.random() - 0.5) * 0.75);
  }
  function cleanWave(c, w, h) {
    c.strokeStyle = "#4ade80"; c.shadowColor = "#4ade80"; c.shadowBlur = 16;
    pathWave(c, w, h, u => Math.sin(u * Math.PI * 4 - phase));
    c.strokeStyle = "rgba(250,204,21,.7)"; c.shadowBlur = 10; c.setLineDash([6, 8]);
    pathWave(c, w, h, u => Math.cos(u * Math.PI * 4 - phase) * 0.85);
    c.setLineDash([]);
  }

  function render() {
    if (!waveCanvas) return;
    const dpr = devicePixelRatio;
    const w = waveCanvas.width = waveCanvas.offsetWidth * dpr;
    const h = waveCanvas.height = waveCanvas.offsetHeight * dpr;
    const c = waveCanvas.getContext("2d");
    c.clearRect(0, 0, w, h);
    drawGrid(c, w, h);
    modes[current].draw(c, w, h);
  }
  function animate(t) {
    phase = t / 240;
    render();
    requestAnimationFrame(animate);
  }
  if (!reduced) requestAnimationFrame(animate); else render();

  const sio = new IntersectionObserver(entries => entries.forEach(e => {
    if (!e.isIntersecting) return;
    steps.forEach(s => s.classList.remove("active"));
    e.target.classList.add("active");
    const idx = steps.indexOf(e.target);
    current = idx;
    const pct = Math.round(((idx + 1) / steps.length) * 100);
    if (meterFill) meterFill.style.width = pct + "%";
    if (readoutMode) readoutMode.textContent = modes[idx].name;
    if (readoutPct) readoutPct.textContent = pct + "%";
  }), { threshold: 0.55 });
  steps.forEach(s => sio.observe(s));

  /* sticky progress tied to overall section scroll */
  addEventListener("scroll", () => {
    const r = calSection.getBoundingClientRect();
    const total = r.height - innerHeight;
    const prog = Math.min(Math.max(-r.top / total, 0), 1);
    if (readoutPct) readoutPct.textContent = Math.round(prog * 100) + "%";
  }, { passive: true });
}
})();
