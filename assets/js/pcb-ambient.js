/**
 * PBCOE Electronics Portal — Ambient Global PCB Circuit Trace Network
 * Renders an attractive, continuous electronic motherboard trace canvas across the entire website.
 */
(function initAmbientPCB() {
  "use strict";

  let canvas = document.getElementById("global-pcb-canvas");
  if (!canvas) {
    canvas = document.createElement("canvas");
    canvas.id = "global-pcb-canvas";
    canvas.setAttribute("aria-hidden", "true");
    document.body.prepend(canvas);
  }

  const ctx = canvas.getContext("2d");
  let width, height;
  let traces = [];
  let vias = [];
  let packets = [];
  let isDarkMode = document.documentElement.getAttribute("data-theme") !== "light";

  // Watch for theme changes to adapt circuit colors
  const observer = new MutationObserver(() => {
    isDarkMode = document.documentElement.getAttribute("data-theme") !== "light";
  });
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    generateCircuitNetwork();
  }

  function generateCircuitNetwork() {
    traces = [];
    vias = [];
    packets = [];

    // Gutter widths on left & right where motherboard buses flow
    const leftMargin = Math.min(width * 0.16, 180);
    const rightMargin = width - leftMargin;

    // 1. LEFT MOTHERBOARD BUS (Vertical data lanes with 45° doglegs)
    const leftBusLanes = [24, 46, 68, 92, 120];
    leftBusLanes.forEach((offset, idx) => {
      if (offset > leftMargin) return;
      const points = [];
      let y = 0;
      let x = offset;
      points.push({ x, y });

      while (y < height) {
        y += 120 + (idx * 30);
        // Add a 45-degree jog
        const jog = (idx % 2 === 0 ? 22 : -22);
        const newX = Math.max(14, Math.min(leftMargin - 10, x + jog));
        points.push({ x, y: y - 22 });
        points.push({ x: newX, y });
        x = newX;

        // Add a via at some junctions
        if (Math.random() > 0.4) {
          vias.push({
            x,
            y,
            r: 3.2,
            label: idx === 0 ? "3V3" : idx === 1 ? "TXD" : idx === 2 ? "RXD" : "GND"
          });
        }
      }
      points.push({ x, y: height });
      traces.push({ points, isBus: true });

      // Signal packets traveling down the bus
      packets.push({
        points,
        progress: Math.random(),
        speed: 0.0012 + (idx * 0.0004),
        color: idx % 2 === 0 ? "cyan" : "gold"
      });
    });

    // 2. RIGHT MOTHERBOARD BUS
    const rightBusLanes = [24, 46, 68, 92, 120];
    rightBusLanes.forEach((offset, idx) => {
      const baseX = width - offset;
      if (baseX < rightMargin) return;
      const points = [];
      let y = 0;
      let x = baseX;
      points.push({ x, y });

      while (y < height) {
        y += 130 + (idx * 26);
        const jog = (idx % 2 === 0 ? -22 : 22);
        const newX = Math.min(width - 14, Math.max(rightMargin + 10, x + jog));
        points.push({ x, y: y - 22 });
        points.push({ x: newX, y });
        x = newX;

        if (Math.random() > 0.45) {
          vias.push({
            x,
            y,
            r: 3.2,
            label: idx === 0 ? "SCL" : idx === 1 ? "SDA" : idx === 2 ? "CLK" : "EN"
          });
        }
      }
      points.push({ x, y: height });
      traces.push({ points, isBus: true });

      packets.push({
        points,
        progress: Math.random(),
        speed: 0.0014 + (idx * 0.0003),
        color: idx % 2 === 0 ? "cyan" : "gold"
      });
    });

    // 3. HORIZONTAL CROSS-CONNECT TRACES (Span subtly between sections)
    const numCross = Math.min(Math.floor(height / 220), 5);
    for (let i = 0; i < numCross; i++) {
      const yBase = (i + 1) * (height / (numCross + 1));
      const startLeft = leftBusLanes[Math.floor(Math.random() * leftBusLanes.length)] || 40;
      const endRight = width - (rightBusLanes[Math.floor(Math.random() * rightBusLanes.length)] || 40);

      const mid1 = width * 0.35;
      const mid2 = width * 0.65;
      const points = [
        { x: startLeft, y: yBase },
        { x: mid1, y: yBase },
        { x: mid1 + 35, y: yBase + 35 },
        { x: mid2, y: yBase + 35 },
        { x: mid2 + 35, y: yBase },
        { x: endRight, y: yBase }
      ];

      traces.push({ points, isBus: false });

      // Signal packet
      packets.push({
        points,
        progress: Math.random(),
        speed: 0.0018 + Math.random() * 0.001,
        color: i % 2 === 0 ? "cyan" : "gold"
      });

      // Vias at turn points
      vias.push({ x: mid1, y: yBase, r: 3.0, label: "IO" + (i + 1) });
      vias.push({ x: mid2 + 35, y: yBase, r: 3.0, label: "CH" + (i + 1) });
    }
  }

  window.addEventListener("resize", resize, { passive: true });
  resize();

  function draw() {
    ctx.clearRect(0, 0, width, height);

    // Color definitions based on current theme
    const traceStroke = isDarkMode 
      ? "rgba(56, 189, 248, 0.16)" 
      : "rgba(30, 64, 175, 0.14)";
    const busStroke = isDarkMode 
      ? "rgba(56, 189, 248, 0.22)" 
      : "rgba(37, 99, 235, 0.18)";
    const viaBorder = isDarkMode 
      ? "rgba(56, 189, 248, 0.45)" 
      : "rgba(37, 99, 235, 0.38)";
    const viaFill = isDarkMode ? "#090d16" : "#f8fafc";
    const labelColor = isDarkMode 
      ? "rgba(148, 163, 184, 0.4)" 
      : "rgba(71, 85, 105, 0.45)";

    const cyanPacket = isDarkMode ? "#38bdf8" : "#0284c7";
    const goldPacket = isDarkMode ? "#facc15" : "#d97706";

    // 1. Draw PCB Copper Traces
    traces.forEach(t => {
      ctx.strokeStyle = t.isBus ? busStroke : traceStroke;
      ctx.lineWidth = t.isBus ? 1.2 : 0.85;
      ctx.beginPath();
      ctx.moveTo(t.points[0].x, t.points[0].y);
      for (let i = 1; i < t.points.length; i++) {
        ctx.lineTo(t.points[i].x, t.points[i].y);
      }
      ctx.stroke();
    });

    // 2. Draw Traveling Energy Packets
    packets.forEach(p => {
      p.progress += p.speed;
      if (p.progress >= 1) p.progress = 0;

      // Find segment along polyline
      const pts = p.points;
      const totalSegments = pts.length - 1;
      const segIndex = Math.min(Math.floor(p.progress * totalSegments), totalSegments - 1);
      const segProgress = (p.progress * totalSegments) - segIndex;

      const pA = pts[segIndex];
      const pB = pts[segIndex + 1];
      const px = pA.x + (pB.x - pA.x) * segProgress;
      const py = pA.y + (pB.y - pA.y) * segProgress;

      const pCol = p.color === "cyan" ? cyanPacket : goldPacket;

      // Glow halo
      ctx.shadowBlur = isDarkMode ? 8 : 4;
      ctx.shadowColor = pCol;
      ctx.fillStyle = pCol;
      ctx.beginPath();
      ctx.arc(px, py, 2.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    // 3. Draw Via Holes and Labels
    vias.forEach(v => {
      ctx.strokeStyle = viaBorder;
      ctx.lineWidth = 1.2;
      ctx.fillStyle = viaFill;

      // Copper annular ring
      ctx.beginPath();
      ctx.arc(v.x, v.y, v.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Drill center
      ctx.fillStyle = isDarkMode ? "#020617" : "#cbd5e1";
      ctx.beginPath();
      ctx.arc(v.x, v.y, v.r * 0.45, 0, Math.PI * 2);
      ctx.fill();

      // Micro silkscreen label
      if (v.label) {
        ctx.fillStyle = labelColor;
        ctx.font = "7.5px 'Share Tech Mono', monospace";
        ctx.fillText(v.label, v.x + 5, v.y - 2);
      }
    });

    requestAnimationFrame(draw);
  }

  draw();
})();
