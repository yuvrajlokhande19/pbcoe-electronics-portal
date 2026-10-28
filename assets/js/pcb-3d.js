/**
 * PBCOE Electronics Portal — Interactive 3D Multilayer PCB Hardware Engine
 * Renders a full 3D interactive model of the ESP32 + R307 Biometric Telemetry Board.
 */
(function init3DPCB() {
  "use strict";

  const canvas = document.getElementById("pcb-3d-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let width, height;
  let rotX = 0.28;  // Pitch (tilt up/down)
  let rotY = -0.32; // Yaw (rotate left/right)
  let targetRotX = 0.28;
  let targetRotY = -0.32;
  let isDragging = false;
  let lastMouseX = 0;
  let lastMouseY = 0;
  let autoWobble = 0;
  let lastBurstTime = 0;
  let pulseWave = 0;

  // Board dimensions in 3D units
  const BW = 300;
  const BH = 200;
  const BD = 12; // Board substrate thickness

  function resize() {
    width = canvas.width = canvas.offsetWidth;
    height = canvas.height = canvas.offsetHeight;
  }
  window.addEventListener("resize", resize, { passive: true });
  resize();

  // 3D Projection & Rotation Helper
  function project(x, y, z) {
    // 1. Rotate around Y axis (yaw)
    const cosY = Math.cos(rotY);
    const sinY = Math.sin(rotY);
    const x1 = x * cosY + z * sinY;
    const z1 = -x * sinY + z * cosY;

    // 2. Rotate around X axis (pitch)
    const cosX = Math.cos(rotX);
    const sinX = Math.sin(rotX);
    const y2 = y * cosX - z1 * sinX;
    const z2 = y * sinX + z1 * cosX;

    // 3. Perspective Projection
    const distance = 560;
    const scale = distance / (distance + z2 + 80);
    const cx = width / 2;
    const cy = height / 2;

    return {
      x: cx + x1 * scale,
      y: cy + y2 * scale,
      z: z2,
      scale: scale
    };
  }

  // Interactive Mouse & Touch Dragging
  canvas.addEventListener("mousedown", e => {
    isDragging = true;
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
    canvas.style.cursor = "grabbing";
  });

  window.addEventListener("mousemove", e => {
    if (isDragging) {
      const dx = e.clientX - lastMouseX;
      const dy = e.clientY - lastMouseY;
      targetRotY += dx * 0.008;
      targetRotX -= dy * 0.008;
      targetRotX = Math.max(-0.65, Math.min(0.75, targetRotX));
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
    } else {
      const rect = canvas.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / width - 0.5;
      const ny = (e.clientY - rect.top) / height - 0.5;
      targetRotY = -0.32 + nx * 0.45;
      targetRotX = 0.28 - ny * 0.35;
    }
  });

  window.addEventListener("mouseup", () => {
    isDragging = false;
    canvas.style.cursor = "grab";
  });

  canvas.addEventListener("click", () => {
    lastBurstTime = Date.now();
    pulseWave = 0;
  });

  // Touch Support for Mobile Phones
  canvas.addEventListener("touchstart", e => {
    if (e.touches.length === 1) {
      isDragging = true;
      lastMouseX = e.touches[0].clientX;
      lastMouseY = e.touches[0].clientY;
    }
  }, { passive: true });

  window.addEventListener("touchmove", e => {
    if (isDragging && e.touches.length === 1) {
      const dx = e.touches[0].clientX - lastMouseX;
      const dy = e.touches[0].clientY - lastMouseY;
      targetRotY += dx * 0.008;
      targetRotX -= dy * 0.008;
      targetRotX = Math.max(-0.65, Math.min(0.75, targetRotX));
      lastMouseX = e.touches[0].clientX;
      lastMouseY = e.touches[0].clientY;
    }
  }, { passive: true });

  window.addEventListener("touchend", () => {
    isDragging = false;
  });

  // 3D Polygons Drawing
  function drawPolygon(pts, fillStyle, strokeStyle = null, lineWidth = 1) {
    if (pts.length < 3) return;
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) {
      ctx.lineTo(pts[i].x, pts[i].y);
    }
    ctx.closePath();
    ctx.fillStyle = fillStyle;
    ctx.fill();
    if (strokeStyle) {
      ctx.strokeStyle = strokeStyle;
      ctx.lineWidth = lineWidth;
      ctx.stroke();
    }
  }

  // 3D Box Helper
  function draw3DBox(x, y, z, w, h, d, topColor, sideColor1, sideColor2, strokeColor = null) {
    const hw = w / 2;
    const hh = h / 2;

    // 8 vertices of box
    const p1 = project(x - hw, y - hh, z - d);
    const p2 = project(x + hw, y - hh, z - d);
    const p3 = project(x + hw, y + hh, z - d);
    const p4 = project(x - hw, y + hh, z - d);
    const p5 = project(x - hw, y - hh, z);
    const p6 = project(x + hw, y - hh, z);
    const p7 = project(x + hw, y + hh, z);
    const p8 = project(x - hw, y + hh, z);

    // Front / Bottom side
    drawPolygon([p4, p3, p7, p8], sideColor1, strokeColor);
    // Right side
    drawPolygon([p2, p6, p7, p3], sideColor2, strokeColor);
    // Top face
    drawPolygon([p1, p2, p3, p4], topColor, strokeColor);
  }

  // Active Signal Particles running along PCB copper traces
  const boardTraces = [
    // ESP32 to R307 UART line 1 (TXD)
    [ {x:-20, y:-12}, {x:0, y:-12}, {x:24, y:-12}, {x:48, y:-12} ],
    // ESP32 to R307 UART line 2 (RXD)
    [ {x:-20, y:2}, {x:0, y:2}, {x:24, y:2}, {x:48, y:2} ],
    // Power bus to AMS1117 regulator
    [ {x:-10, y:45}, {x:30, y:45}, {x:54, y:60}, {x:76, y:60} ],
    // Crystal to MCU clock bus
    [ {x:-100, y:30}, {x:-90, y:20}, {x:-80, y:20}, {x:-70, y:10} ],
    // Upper GPIO bus
    [ {x:-60, y:-45}, {x:-40, y:-65}, {x:20, y:-65}, {x:60, y:-65} ],
    // Lower Bus to Edge Pins
    [ {x:-50, y:40}, {x:-30, y:65}, {x:10, y:65}, {x:50, y:65} ]
  ];

  let traceProgress = [0.1, 0.45, 0.7, 0.25, 0.6, 0.85];

  function render() {
    ctx.clearRect(0, 0, width, height);

    // Damping rotation towards target
    rotX += (targetRotX - rotX) * 0.08;
    rotY += (targetRotY - rotY) * 0.08;

    // Gentle ambient wobble when not dragging
    if (!isDragging) {
      autoWobble += 0.015;
      rotX += Math.sin(autoWobble) * 0.001;
      rotY += Math.cos(autoWobble * 0.8) * 0.0015;
    }

    const isDark = document.documentElement.getAttribute("data-theme") !== "light";

    // 1. BOARD DROP SHADOW ON CHASSIS
    const shadowP1 = project(-BW * 0.55, -BH * 0.55, BD + 35);
    const shadowP2 = project(BW * 0.55, -BH * 0.55, BD + 35);
    const shadowP3 = project(BW * 0.55, BH * 0.55, BD + 35);
    const shadowP4 = project(-BW * 0.55, BH * 0.55, BD + 35);
    drawPolygon([shadowP1, shadowP2, shadowP3, shadowP4], isDark ? "rgba(2, 6, 23, 0.65)" : "rgba(100, 116, 139, 0.25)");

    // 2. FR-4 MULTILAYER PCB SUBSTRATE SLAB
    const substrateTop = isDark ? "#064e3b" : "#047857";     // Deep Emerald Solder Mask
    const substrateEdge1 = isDark ? "#022c22" : "#065f46";   // Darker green edge
    const substrateEdge2 = isDark ? "#011c16" : "#022c22";   // Shaded edge
    const copperGold = isDark ? "#fbbf24" : "#d97706";

    // Base PCB 3D slab
    draw3DBox(0, 0, BD, BW, BH, BD, substrateTop, substrateEdge1, substrateEdge2, isDark ? "rgba(52, 211, 153, 0.4)" : "rgba(16, 185, 129, 0.5)");

    // 3. SILKSCREEN BORDER & MOUNTING SCREW HOLES
    const cornerHoles = [
      { x: -BW/2 + 16, y: -BH/2 + 16 },
      { x:  BW/2 - 16, y: -BH/2 + 16 },
      { x:  BW/2 - 16, y:  BH/2 - 16 },
      { x: -BW/2 + 16, y:  BH/2 - 16 }
    ];

    cornerHoles.forEach(h => {
      const hp = project(h.x, h.y, 0);
      const r = 6 * hp.scale;
      // Gold pad
      ctx.beginPath();
      ctx.arc(hp.x, hp.y, r, 0, Math.PI * 2);
      ctx.fillStyle = "#facc15";
      ctx.fill();
      // Drill hole
      ctx.beginPath();
      ctx.arc(hp.x, hp.y, r * 0.55, 0, Math.PI * 2);
      ctx.fillStyle = isDark ? "#0f172a" : "#1e293b";
      ctx.fill();
    });

    // 4. GOLD SILKSCREEN LABELS & CHASSIS LINES
    const silkP1 = project(-BW/2 + 24, -BH/2 + 24, 0);
    const silkP2 = project(BW/2 - 24, -BH/2 + 24, 0);
    const silkP3 = project(BW/2 - 24, BH/2 - 24, 0);
    const silkP4 = project(-BW/2 + 24, BH/2 - 24, 0);
    drawPolygon([silkP1, silkP2, silkP3, silkP4], "transparent", isDark ? "rgba(255, 255, 255, 0.28)" : "rgba(255, 255, 255, 0.45)", 1.2);

    // Silkscreen text on board
    const titlePos = project(-BW/2 + 30, -BH/2 + 38, 0);
    ctx.save();
    ctx.fillStyle = isDark ? "rgba(255, 255, 255, 0.75)" : "rgba(255, 255, 255, 0.9)";
    ctx.font = `${Math.round(8 * titlePos.scale)}px 'Share Tech Mono', monospace`;
    ctx.fillText("PBCOE · EMBEDDED IoT BIOMETRICS v4.2", titlePos.x, titlePos.y);
    const subPos = project(-BW/2 + 30, -BH/2 + 50, 0);
    ctx.font = `${Math.round(7 * subPos.scale)}px 'Share Tech Mono', monospace`;
    ctx.fillText("DTE: EN 4177 · NAAC 'A+' · R307 + ESP32", subPos.x, subPos.y);
    ctx.restore();

    // 5. COPPER TRACES ON BOARD SURFACE
    boardTraces.forEach(tr => {
      ctx.beginPath();
      const p0 = project(tr[0].x, tr[0].y, 0);
      ctx.moveTo(p0.x, p0.y);
      for (let i = 1; i < tr.length; i++) {
        const pt = project(tr[i].x, tr[i].y, 0);
        ctx.lineTo(pt.x, pt.y);
      }
      ctx.strokeStyle = copperGold;
      ctx.lineWidth = 1.6;
      ctx.stroke();
    });

    // 6. TRAVELING CURRENT PARTICLES
    traceProgress = traceProgress.map(p => (p + 0.012) % 1);
    boardTraces.forEach((tr, idx) => {
      const prog = traceProgress[idx];
      const segCount = tr.length - 1;
      const segIndex = Math.min(Math.floor(prog * segCount), segCount - 1);
      const segProg = (prog * segCount) - segIndex;
      const ptA = tr[segIndex];
      const ptB = tr[segIndex + 1];
      const cx = ptA.x + (ptB.x - ptA.x) * segProg;
      const cy = ptA.y + (ptB.y - ptA.y) * segProg;
      const pp = project(cx, cy, -1);

      ctx.shadowBlur = 8;
      ctx.shadowColor = "#38bdf8";
      ctx.fillStyle = idx % 2 === 0 ? "#38bdf8" : "#facc15";
      ctx.beginPath();
      ctx.arc(pp.x, pp.y, 2.8 * pp.scale, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    // 7. 3D HARDWARE COMPONENTS

    // A. ESP32-WROOM-32S METALLIC MODULE (-58, 2)
    const espTop = isDark ? "#334155" : "#64748b";        // Brushed metal shield
    const espSide1 = isDark ? "#1e293b" : "#475569";
    const espSide2 = isDark ? "#0f172a" : "#334155";
    draw3DBox(-58, 4, 0, 92, 70, 7, espTop, espSide1, espSide2, "#94a3b8");

    // ESP32 Silkscreen & Logo
    const espText = project(-58, 4, -7.5);
    ctx.save();
    ctx.fillStyle = "#e2e8f0";
    ctx.font = `bold ${Math.round(8 * espText.scale)}px sans-serif`;
    ctx.textAlign = "center";
    ctx.fillText("ESP32-WROOM-32", espText.x, espText.y - 4);
    ctx.fillStyle = "#94a3b8";
    ctx.font = `${Math.round(6.5 * espText.scale)}px sans-serif`;
    ctx.fillText("240MHz · WiFi + BLE", espText.x, espText.y + 8);
    ctx.restore();

    // Antenna Area at top of ESP32 (Meandering trace)
    const antBox = project(-58, -36, 0);
    ctx.beginPath();
    ctx.arc(antBox.x, antBox.y, 8 * antBox.scale, 0, Math.PI);
    ctx.strokeStyle = "#facc15";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Castellated soldering pins along ESP32 bottom edge
    for (let p = -40; p <= 40; p += 8) {
      const pp = project(-58 + p, 40, 0);
      ctx.fillStyle = "#fbbf24";
      ctx.fillRect(pp.x - 2, pp.y - 1, 4 * pp.scale, 3 * pp.scale);
    }

    // B. R307 BIOMETRIC OPTICAL SENSOR MODULE (+74, -14)
    const r307Top = isDark ? "#1e1b4b" : "#312e81";        // Deep sensor housing
    draw3DBox(74, -14, 0, 68, 68, 14, r307Top, "#0f172a", "#020617", "#38bdf8");

    // R307 Optical Blue FTIR Glass Prism Aperture
    const prismPos = project(74, -14, -15);
    const prismRadius = 20 * prismPos.scale;
    const prismGrad = ctx.createRadialGradient(prismPos.x, prismPos.y, 2, prismPos.x, prismPos.y, prismRadius);
    prismGrad.addColorStop(0, "#38bdf8");
    prismGrad.addColorStop(0.65, "#1d4ed8");
    prismGrad.addColorStop(1, "#0f172a");

    ctx.save();
    ctx.shadowBlur = 12;
    ctx.shadowColor = "#38bdf8";
    ctx.beginPath();
    ctx.arc(prismPos.x, prismPos.y, prismRadius, 0, Math.PI * 2);
    ctx.fillStyle = prismGrad;
    ctx.fill();
    ctx.lineWidth = 1.8;
    ctx.strokeStyle = "#38bdf8";
    ctx.stroke();

    // Animated Optical Laser Scanning Bar over Prism
    const laserY = prismPos.y + Math.sin(Date.now() * 0.004) * (prismRadius * 0.7);
    ctx.beginPath();
    ctx.moveTo(prismPos.x - prismRadius * 0.75, laserY);
    ctx.lineTo(prismPos.x + prismRadius * 0.75, laserY);
    ctx.strokeStyle = "#4ade80";
    ctx.lineWidth = 2;
    ctx.shadowColor = "#4ade80";
    ctx.shadowBlur = 10;
    ctx.stroke();
    ctx.restore();

    // R307 Label
    const r307Txt = project(74, 28, 0);
    ctx.save();
    ctx.fillStyle = "#38bdf8";
    ctx.font = `bold ${Math.round(7.5 * r307Txt.scale)}px sans-serif`;
    ctx.textAlign = "center";
    ctx.fillText("R307 FTIR SENSOR", r307Txt.x, r307Txt.y);
    ctx.restore();

    // C. AMS1117-3.3 VOLTAGE REGULATOR (+72, 62)
    draw3DBox(72, 62, 0, 24, 18, 5, "#111827", "#030712", "#000000", "#475569");
    const regTxt = project(72, 62, -5.5);
    ctx.save();
    ctx.fillStyle = "#94a3b8";
    ctx.font = `${Math.round(5.5 * regTxt.scale)}px monospace`;
    ctx.textAlign = "center";
    ctx.fillText("AMS1117", regTxt.x, regTxt.y);
    ctx.restore();

    // D. 40MHz QUARTZ CRYSTAL OSCILLATOR (-114, 46)
    draw3DBox(-114, 46, 0, 18, 12, 6, "#94a3b8", "#64748b", "#475569", "#cbd5e1");

    // E. DUAL-ROW 0.1" GOLD HEADER PINS (TOP & BOTTOM)
    // Top Row (15 Pins)
    for (let i = -7; i <= 7; i++) {
      const hx = i * 16;
      const hy = -BH/2 + 10;
      // Plastic base
      draw3DBox(hx, hy, 0, 10, 10, 5, "#1e293b", "#0f172a", "#020617");
      // Gold Pin
      const pinTop = project(hx, hy, -16);
      const pinBase = project(hx, hy, -5);
      ctx.beginPath();
      ctx.moveTo(pinBase.x, pinBase.y);
      ctx.lineTo(pinTop.x, pinTop.y);
      ctx.strokeStyle = "#fbbf24";
      ctx.lineWidth = 2.2 * pinTop.scale;
      ctx.stroke();
    }

    // Bottom Row (15 Pins)
    for (let i = -7; i <= 7; i++) {
      const hx = i * 16;
      const hy = BH/2 - 10;
      draw3DBox(hx, hy, 0, 10, 10, 5, "#1e293b", "#0f172a", "#020617");
      const pinTop = project(hx, hy, -16);
      const pinBase = project(hx, hy, -5);
      ctx.beginPath();
      ctx.moveTo(pinBase.x, pinBase.y);
      ctx.lineTo(pinTop.x, pinTop.y);
      ctx.strokeStyle = "#fbbf24";
      ctx.lineWidth = 2.2 * pinTop.scale;
      ctx.stroke();
    }

    // F. SURFACE MOUNT BLINKING STATUS LEDs
    // PWR LED (Solid Green)
    const pwrLed = project(-118, -14, -2);
    ctx.beginPath();
    ctx.arc(pwrLed.x, pwrLed.y, 3 * pwrLed.scale, 0, Math.PI * 2);
    ctx.fillStyle = "#22c55e";
    ctx.shadowBlur = 8;
    ctx.shadowColor = "#22c55e";
    ctx.fill();

    // TXD LED (Blinks rapidly)
    const isTxOn = (Math.sin(Date.now() * 0.015) > 0.2);
    const txLed = project(-118, -4, -2);
    ctx.beginPath();
    ctx.arc(txLed.x, txLed.y, 3 * txLed.scale, 0, Math.PI * 2);
    ctx.fillStyle = isTxOn ? "#38bdf8" : "#0c4a6e";
    ctx.shadowBlur = isTxOn ? 10 : 0;
    ctx.shadowColor = "#38bdf8";
    ctx.fill();

    // RXD LED (Blinks irregularly)
    const isRxOn = (Math.sin(Date.now() * 0.025 + 1) > 0.35);
    const rxLed = project(-118, 6, -2);
    ctx.beginPath();
    ctx.arc(rxLed.x, rxLed.y, 3 * rxLed.scale, 0, Math.PI * 2);
    ctx.fillStyle = isRxOn ? "#f59e0b" : "#451a03";
    ctx.shadowBlur = isRxOn ? 10 : 0;
    ctx.shadowColor = "#f59e0b";
    ctx.fill();
    ctx.shadowBlur = 0;

    // G. HIGH-VOLTAGE BURST WAVE ON CLICK
    if (Date.now() - lastBurstTime < 1400) {
      pulseWave += 0.08;
      const center = project(0, 0, 0);
      const ringRadius = pulseWave * 70 * center.scale;
      ctx.beginPath();
      ctx.arc(center.x, center.y, ringRadius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(56, 189, 248, ${Math.max(0, 1 - pulseWave / 4.5)})`;
      ctx.lineWidth = 2.5;
      ctx.shadowBlur = 12;
      ctx.shadowColor = "#38bdf8";
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    requestAnimationFrame(render);
  }

  render();
})();
