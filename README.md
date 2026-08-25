# ⚡ PBCOE Electronics Portal

**Department of Electronics & Communication Engineering — Prabhu Bhole College of Engineering & Technology**

A full SaaS-style academic portal blending glassmorphism UI, neon "Modern Academic Tech" aesthetics, real working circuit simulation, gamified electronics learning, and a careers intelligence engine for ECE students.

**Live site:** https://yuvrajlokhande19.github.io/pbcoe-electronics-portal/

---

## ✨ Features

### 🏠 Big Animated Index
- HTML5 canvas **high-voltage lightning** striking a floating CPU hero
- **Circuit Calibration Protocol** — a scroll-driven scrollytelling sequence with a live oscilloscope that switches waveforms (sine → square → PWM → noise → lock) as you pass each stage
- Infinite marquee tickers, animated stat counters, parallax gradient blobs, 3D tilt cards, staggered scroll reveals
- Dark-themed "Academic Excellence" course grid with sliding accent bars

### 🔬 Circuit Lab (`simulator.html`)
A genuine series RLC bench in the browser:
- Log-scaled R / L / C / frequency sliders
- Live phasor readouts: Xʟ, Xᴄ, impedance Z, current I, phase φ, resonant f₀, Q-factor, bandwidth
- Animated current flow whose speed tracks magnitude
- Dual-trace oscilloscope (source voltage vs phase-shifted current)
- Presets: Resonance Demo · Crossover Network · RF Tank

### 🛠 Engineering Tools (`tools.html`)
- **Resistor Color Decoder** — 4-band selection with live visual resistor + tolerance range
- **Component Finder** — searchable 16-part stock index with availability pills
- Calculators: Ohm's Law (any two inputs), LED series resistor, voltage divider

### 🎮 Logic Arcade (`games.html`)
Three playable machines:
1. **GPIO Simulator** — drive an 8-bit port register with toggle switches; binary/hex/decimal readouts + knight-rider animation mode
2. **Waveform Match** — name-that-waveform quiz on an animated canvas with scoring and streaks
3. **VHDL Builder** — assemble entity/architecture statements from shuffled token tiles (shake-on-error feedback)

### 💼 Careers Intelligence
- **Opportunity Engine** (`resources.html`) — tabbed hub of internships, remote work and earn-while-learning paths with tag filters, stipend meters and deadlines
- **Underrated Tech Radar** (`trends.html`) — high-leverage skills ranked by demand ÷ crowdedness gap scores (embedded security, Embedded Rust, chiplet packaging, BMS, ATE…)

### 🎓 Portals & Campus
- **Student Portal** — GPA/attendance/credit SVG progress rings, IA grade tables, document vault, bench booking, week grid
- **Faculty Console** — roster management, approvals queue, section analytics, announcement broadcast
- About (HOD message + history timeline), Academics (semester accordion + syllabus bank), Faculty, Facilities, Admissions (scholarship meters), Events & News timeline, CSS-art Gallery, Contact (validated form)

---

## 🎨 Design System

| Token | Value |
|---|---|
| Display font | Share Tech Mono |
| Body font | Inter |
| Neon accents | ⚡ Yellow `#facc15` · Blue `#3b82f6` · Red `#ef4444` |
| Glass surfaces | white/slate @ 45–85% opacity + 16px backdrop blur |
| Dark zones | Slate 900 `#0f172a` |
| Extra | persisted **light/dark theme toggle**, scanline CRT overlays, circuit-grid backgrounds |

Fully responsive · honors `prefers-reduced-motion` · no frameworks, no build step required to view.

## 📄 Pages (16)

`index` · `about` · `academics` · `faculty` · `facilities` · `admissions` · `events` · `gallery` · `contact` · `simulator` · `tools` · `games` · `resources` · `trends` · `student-portal` · `faculty-portal`

## 🔧 Project Structure

```
├── index.html            # big animated home
├── *.html                # 15 more pages (flat, portable links)
├── assets/
│   ├── css/style.css     # complete design system (tokens, glass, neon, dark mode)
│   └── js/main.js        # core engine: nav, themes, reveals, counters,
│                         # tilt, parallax, lightning canvas, calibration protocol
└── _src/                 # page builder (optional, for development only)
    ├── head.html         # shared <head> + navbar shell
    ├── foot.html         # shared footer shell
    ├── pages/*.html      # per-page content partials
    └── build.ps1         # assembles partials -> root pages
                          #   powershell -ExecutionPolicy Bypass -File _src\build.ps1
```

The deployed site is plain static HTML/CSS/JS — edit any `.html` directly, or edit `_src/pages/*` and rebuild if you prefer the template workflow.

## 🚀 Run Locally

Just open `index.html`, or serve it:

```bash
python -m http.server 8080
# or
npx serve .
```

## 📦 Tech

Vanilla HTML5 · CSS3 (custom properties, container-friendly grids, native scroll-driven animation enhancement) · JavaScript (Canvas 2D, IntersectionObserver, Web APIs) · Google Fonts. Zero npm dependencies.
