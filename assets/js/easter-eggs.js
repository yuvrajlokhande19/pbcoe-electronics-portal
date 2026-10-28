/**
 * PBCOE Electronics Portal — Secret Hardware Telemetry Easter Eggs
 * Features:
 * 1. Konami Code (Up Up Down Down Left Right Left Right B A) or 'ETC' key sequence
 * 2. 5 Rapid clicks on PBCOE Round Seal in Nav
 * 3. Secret Overclock HUD with RGB Circuit Surge & Synthesizer SFX
 */
(function initPBCOEEasterEggs() {
  "use strict";

  let audioCtx = null;
  function getAudio() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === "suspended") audioCtx.resume();
    return audioCtx;
  }

  // Play High-Voltage Electronic Overclock Sound FX
  function playOverclockSFX() {
    try {
      const ctx = getAudio();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(1760, now + 0.6);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.9);
    } catch(e) {}
  }

  // Overclock Modal Component
  function showOverclockModal() {
    playOverclockSFX();

    let modal = document.getElementById("pbcoe-easter-egg-modal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "pbcoe-easter-egg-modal";
      modal.style.cssText = `
        position: fixed; inset: 0; background: rgba(2, 6, 23, 0.9);
        z-index: 9999999; display: flex; justify-content: center; align-items: center;
        padding: 20px; backdrop-filter: blur(12px); font-family: 'Inter', system-ui, sans-serif;
      `;
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div style="max-width:540px;width:100%;background:#090d16;border:2px solid #facc15;box-shadow:0 0 50px rgba(250,204,21,0.45);border-radius:20px;padding:28px;position:relative;color:#f8fafc;animation:zoomIn 0.3s ease;">
        <button onclick="document.getElementById('pbcoe-easter-egg-modal').style.display='none'" style="position:absolute;top:16px;right:18px;background:none;border:none;color:#94a3b8;font-size:1.4rem;cursor:pointer;">✕</button>
        
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">
          <span style="font-size:2rem;filter:drop-shadow(0 0 12px #facc15);">⚡</span>
          <div>
            <h2 style="margin:0;font-size:1.35rem;color:#facc15;font-family:'Share Tech Mono', monospace;letter-spacing:0.04em;">HARDWARE OVERCLOCK ACTIVATED</h2>
            <p style="margin:2px 0 0;font-size:0.75rem;color:#94a3b8;font-family:monospace;">PRIYADARSHINI BHAGWATI COLLEGE OF ENGINEERING · ETC DEPT</p>
          </div>
        </div>

        <div style="background:rgba(250,204,21,0.08);border:1px dashed #facc15;border-radius:12px;padding:14px;margin-bottom:18px;">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;font-size:0.8rem;font-family:'Share Tech Mono', monospace;">
            <div><span style="color:#94a3b8;">ESP32 CLOCK:</span> <strong style="color:#22c55e;">240MHz ➔ 320MHz ⚡</strong></div>
            <div><span style="color:#94a3b8;">R307 BAUD:</span> <strong style="color:#38bdf8;">115200 (TURBO)</strong></div>
            <div><span style="color:#94a3b8;">SRAM BUS:</span> <strong style="color:#a855f7;">520 KB ULTRA</strong></div>
            <div><span style="color:#94a3b8;">DTE CODE:</span> <strong style="color:#facc15;">EN 4177 (NAAC A+)</strong></div>
          </div>
        </div>

        <div style="font-size:0.85rem;line-height:1.6;color:#cbd5e1;margin-bottom:20px;">
          <p style="margin-bottom:8px;"><strong>🎉 You unlocked the secret ETC Embedded Telemetry Easter Egg!</strong></p>
          <p style="font-size:0.8rem;color:#94a3b8;">
            Engineered by <strong>Yuvraj Vilas Lokhande</strong> (PRN: 24121227 · Slot #16) under the guidance of Mr. Suhas D. Kakde (Academic Coordinator) &amp; Dr. Pravin B. Pokle (HOD, ETC).
          </p>
        </div>

        <div style="display:flex;gap:10px;">
          <button class="btn btn-primary" style="flex:1;background:#facc15;color:#0f172a;border:none;font-weight:700;" onclick="toggleRainbowTraces()">⚡ Toggle RGB Circuit Surge</button>
          <button class="btn btn-ghost" onclick="document.getElementById('pbcoe-easter-egg-modal').style.display='none'">Close HUD</button>
        </div>
      </div>
    `;

    modal.style.display = "flex";
  }

  // Toggle Rainbow RGB surge on background traces
  let isRainbow = false;
  window.toggleRainbowTraces = function() {
    isRainbow = !isRainbow;
    const canvas = document.getElementById("global-pcb-canvas");
    if (canvas) {
      if (isRainbow) {
        canvas.style.filter = "hue-rotate(180deg) saturate(2.5)";
      } else {
        canvas.style.filter = "none";
      }
    }
    const modal = document.getElementById("pbcoe-easter-egg-modal");
    if (modal) modal.style.display = "none";
  };

  // 1. Konami Code Sequence: Up, Up, Down, Down, Left, Right, Left, Right, B, A
  const konamiSequence = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
  let konamiIndex = 0;

  // 2. 'E' 'T' 'C' Sequence
  const etcSequence = ["e", "t", "c"];
  let etcIndex = 0;

  window.addEventListener("keydown", e => {
    // Check Konami Code
    const key = e.key.toLowerCase();
    const expectedKonami = konamiSequence[konamiIndex].toLowerCase();
    if (key === expectedKonami) {
      konamiIndex++;
      if (konamiIndex === konamiSequence.length) {
        konamiIndex = 0;
        showOverclockModal();
      }
    } else {
      konamiIndex = 0;
    }

    // Check 'E' 'T' 'C'
    if (key === etcSequence[etcIndex]) {
      etcIndex++;
      if (etcIndex === etcSequence.length) {
        etcIndex = 0;
        showOverclockModal();
      }
    } else {
      etcIndex = 0;
    }
  });

  // 3. 5 Rapid Clicks on PBCOE Round Seal in Nav
  document.addEventListener("DOMContentLoaded", () => {
    const seal = document.querySelector(".brand img");
    if (seal) {
      let clickCount = 0;
      let lastClick = 0;
      seal.style.cursor = "pointer";
      seal.addEventListener("click", e => {
        const now = Date.now();
        if (now - lastClick < 600) {
          clickCount++;
          if (clickCount >= 5) {
            clickCount = 0;
            e.preventDefault();
            showOverclockModal();
          }
        } else {
          clickCount = 1;
        }
        lastClick = now;
      });
    }

    // DevTools Console Easter Egg
    console.log(
      "%c⚡ PBCOE ETC EMBEDDED SYSTEM ACTIVE %c DTE: EN 4177 %c\nType window.PBCOE_EASTER_EGG.overclock() to activate overclock HUD!",
      "background:#2563eb;color:#fff;font-weight:bold;padding:4px 8px;border-radius:4px 0 0 4px;",
      "background:#facc15;color:#0f172a;font-weight:bold;padding:4px 8px;border-radius:0 4px 4px 0;",
      ""
    );
  });

  window.PBCOE_EASTER_EGG = {
    overclock: showOverclockModal,
    playSFX: playOverclockSFX
  };
})();
