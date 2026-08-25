const fs = require("fs");
new Function(fs.readFileSync("assets/js/main.js", "utf8"));
console.log("main.js: syntax OK");
["simulator", "tools", "games", "resources", "contact", "student-portal", "faculty-portal"].forEach(p => {
  const h = fs.readFileSync(p + ".html", "utf8");
  const m = [...h.matchAll(/<script>([\s\S]*?)<\/script>/g)];
  m.forEach((s, i) => {
    try { new Function(s[1]); }
    catch (e) { console.log(`${p} inline#${i} ERROR: ${e.message}`); process.exitCode = 1; }
  });
});
console.log("inline scripts: syntax OK");
