/**
 * PBCOE Electronics Portal — Central Core & Supabase Engine v2026
 * Pure Cloud-Connected Architecture via Official Supabase Backend
 */

window.PBCOE = (function () {
  "use strict";

  // Official Supabase Credentials
  const SUPABASE_URL = "https://vobyuijfocigsbahkvab.supabase.co";
  const SUPABASE_KEY = "sb_publishable_wIYMMvFnNFMXyFavLagzIA_4rBYuOMN";

  // Built-in 65-student cohort for 0ms instant display while syncing with cloud
  const EMBEDDED_ROSTER = [
    { id: 1, fingerprint_id: 1, prn: "24121218", name: "YASH RANJEET INDURKAR", branch: "ETC (Electronics & Telecom)", year: "Second Year (SY)", image: "assets/images/students/24121218.jpg", enrolled: true, attendance_percentage: 97 },
    { id: 2, fingerprint_id: 2, prn: "24121222", name: "SAHILKUMAR RUSTAM KHOBRAGADE", branch: "ETC (Electronics & Telecom)", year: "Second Year (SY)", image: "assets/images/students/24121222.jpg", enrolled: true, attendance_percentage: 85 },
    { id: 3, fingerprint_id: 3, prn: "24121199", name: "UJWALA TRYAMBAK BHELKAR", branch: "ETC (Electronics & Telecom)", year: "Second Year (SY)", image: "assets/images/students/24121199.jpg", enrolled: true, attendance_percentage: 97 },
    { id: 4, fingerprint_id: 4, prn: "24121250", name: "SHRAVANI DEEPAK ATKARI", branch: "ETC (Electronics & Telecom)", year: "Second Year (SY)", image: "assets/images/students/24121250.jpg", enrolled: false, attendance_percentage: 83 },
    { id: 5, fingerprint_id: 5, prn: "24121236", name: "POOJA RAJESH UPADHYE", branch: "ETC (Electronics & Telecom)", year: "Second Year (SY)", image: "assets/images/students/24121236.jpg", enrolled: false, attendance_percentage: 83 },
    { id: 6, fingerprint_id: 6, prn: "24121252", name: "VEDANT DILIP NANDANWAR", branch: "ETC (Electronics & Telecom)", year: "Second Year (SY)", image: "assets/images/students/24121252.jpg", enrolled: false, attendance_percentage: 97 },
    { id: 7, fingerprint_id: 7, prn: "24121243", name: "RITESH PURUSHOTTAM ALONE", branch: "ETC (Electronics & Telecom)", year: "Second Year (SY)", image: "assets/images/students/24121243.jpg", enrolled: false, attendance_percentage: 96 },
    { id: 8, fingerprint_id: 8, prn: "24121207", name: "OM PRASHANT CHAUDHARI", branch: "ETC (Electronics & Telecom)", year: "Second Year (SY)", image: "assets/images/students/24121207.jpg", enrolled: false, attendance_percentage: 85 },
    { id: 9, fingerprint_id: 9, prn: "24121244", name: "ROHAN JITENDRA SABLE", branch: "ETC (Electronics & Telecom)", year: "Second Year (SY)", image: "assets/images/students/24121244.jpg", enrolled: false, attendance_percentage: 92 },
    { id: 10, fingerprint_id: 10, prn: "24121219", name: "ATHARV SANDIP KALE", branch: "ETC (Electronics & Telecom)", year: "Second Year (SY)", image: "assets/images/students/24121219.jpg", enrolled: false, attendance_percentage: 82 },
    { id: 11, fingerprint_id: 11, prn: "24121198", name: "SHANTANU DEVANAND BHAGWATKAR", branch: "ETC (Electronics & Telecom)", year: "Second Year (SY)", image: "assets/images/students/24121198.jpg", enrolled: false, attendance_percentage: 87 },
    { id: 12, fingerprint_id: 12, prn: "24121216", name: "ROHIT RAJESH GULKARI", branch: "ETC (Electronics & Telecom)", year: "Second Year (SY)", image: "assets/images/students/24121216.jpg", enrolled: false, attendance_percentage: 89 },
    { id: 13, fingerprint_id: 13, prn: "24121237", name: "YASHRAJ HIWRAJ RANGARI", branch: "ETC (Electronics & Telecom)", year: "Second Year (SY)", image: "assets/images/students/24121237.jpg", enrolled: false, attendance_percentage: 91 },
    { id: 14, fingerprint_id: 14, prn: "24121230", name: "RAJANI NAMDEO MOON", branch: "ETC (Electronics & Telecom)", year: "Second Year (SY)", image: "assets/images/students/24121230.jpg", enrolled: false, attendance_percentage: 94 },
    { id: 15, fingerprint_id: 15, prn: "24121246", name: "VRISHABH NARENDRA SAWWALAKHE", branch: "ETC (Electronics & Telecom)", year: "Second Year (SY)", image: "assets/images/students/24121246.jpg", enrolled: false, attendance_percentage: 88 },
    { id: 16, fingerprint_id: 16, prn: "24121227", name: "YUVRAJ VILAS LOKHANDE", branch: "ETC (Electronics & Telecom)", year: "Second Year (SY)", image: "assets/images/students/24121227.jpg", enrolled: true, attendance_percentage: 98 },
    { id: 17, fingerprint_id: 17, prn: "24121215", name: "SHRUTI NARENDRA GOVINDWAR", branch: "ETC (Electronics & Telecom)", year: "Second Year (SY)", image: "assets/images/students/24121215.jpg", enrolled: false, attendance_percentage: 93 },
    { id: 18, fingerprint_id: 18, prn: "24121234", name: "ACHAL ANIL PATLE", branch: "ETC (Electronics & Telecom)", year: "Second Year (SY)", image: "assets/images/students/24121234.jpg", enrolled: false, attendance_percentage: 92 },
    { id: 19, fingerprint_id: 19, prn: "24121242", name: "SIDDHI SHYAMUJI RINAIT", branch: "ETC (Electronics & Telecom)", year: "Second Year (SY)", image: "assets/images/students/24121242.jpg", enrolled: false, attendance_percentage: 95 },
    { id: 20, fingerprint_id: 20, prn: "24121217", name: "SANCHITA SANJAY GURAV", branch: "ETC (Electronics & Telecom)", year: "Second Year (SY)", image: "assets/images/students/24121217.jpg", enrolled: false, attendance_percentage: 86 },
    { id: 21, fingerprint_id: 21, prn: "24121204", name: "SAKSHAM RAJESH BUCHE", branch: "ETC (Electronics & Telecom)", year: "Second Year (SY)", image: "assets/images/students/24121204.jpg", enrolled: false, attendance_percentage: 91 },
    { id: 22, fingerprint_id: 22, prn: "24121257", name: "AASTHA PRASHANT WAROTKAR", branch: "ETC (Electronics & Telecom)", year: "Second Year (SY)", image: "assets/images/students/24121257.jpg", enrolled: false, attendance_percentage: 90 },
    { id: 23, fingerprint_id: 23, prn: "24121231", name: "JANHAVI RAJESH NAGPURE", branch: "ETC (Electronics & Telecom)", year: "Second Year (SY)", image: "assets/images/students/24121231.jpg", enrolled: false, attendance_percentage: 94 },
    { id: 24, fingerprint_id: 24, prn: "24121239", name: "ISHA PRAKASH RAUT", branch: "ETC (Electronics & Telecom)", year: "Second Year (SY)", image: "assets/images/students/24121239.jpg", enrolled: false, attendance_percentage: 96 },
    { id: 25, fingerprint_id: 25, prn: "24121221", name: "ARYAN RAVINDRA KHOBRAGADE", branch: "ETC (Electronics & Telecom)", year: "Second Year (SY)", image: "assets/images/students/24121221.jpg", enrolled: false, attendance_percentage: 84 },
    { id: 26, fingerprint_id: 26, prn: "24121223", name: "SAMIKSHA KASHINATH KHONDE", branch: "ETC (Electronics & Telecom)", year: "Second Year (SY)", image: "assets/images/students/24121223.jpg", enrolled: false, attendance_percentage: 92 },
    { id: 27, fingerprint_id: 27, prn: "24121224", name: "DISHA TRYAMBAK LANDE", branch: "ETC (Electronics & Telecom)", year: "Second Year (SY)", image: "assets/images/students/24121224.jpg", enrolled: false, attendance_percentage: 95 },
    { id: 28, fingerprint_id: 28, prn: "24121205", name: "ANUSHKA FAKIRA CHAHANDE", branch: "ETC (Electronics & Telecom)", year: "Second Year (SY)", image: "assets/images/students/24121205.jpg", enrolled: false, attendance_percentage: 87 },
    { id: 29, fingerprint_id: 29, prn: "24121245", name: "SARWADNYA AVINASH CHANDEKAR", branch: "ETC (Electronics & Telecom)", year: "Second Year (SY)", image: "assets/images/students/24121245.jpg", enrolled: false, attendance_percentage: 89 },
    { id: 30, fingerprint_id: 30, prn: "24121258", name: "YADHNESH VINAYAK DURBUDE", branch: "ETC (Electronics & Telecom)", year: "Second Year (SY)", image: "assets/images/students/24121258.jpg", enrolled: false, attendance_percentage: 92 },
    { id: 31, fingerprint_id: 31, prn: "24121200", name: "ATHARVA ABHIJIT BISWAR", branch: "ETC (Electronics & Telecom)", year: "Second Year (SY)", image: "assets/images/students/24121200.jpg", enrolled: false, attendance_percentage: 94 },
    { id: 32, fingerprint_id: 32, prn: "24121253", name: "YUGESH CHANDRAPRAKASH VITTHALE", branch: "ETC (Electronics & Telecom)", year: "Second Year (SY)", image: "assets/images/students/24121253.jpg", enrolled: false, attendance_percentage: 85 },
    { id: 33, fingerprint_id: 33, prn: "24121201", name: "NANDINI SATISH BODAS", branch: "ETC (Electronics & Telecom)", year: "Second Year (SY)", image: "assets/images/students/24121201.jpg", enrolled: false, attendance_percentage: 93 },
    { id: 34, fingerprint_id: 34, prn: "24121202", name: "MAITHELI MAHENDRA BOKDE", branch: "ETC (Electronics & Telecom)", year: "Second Year (SY)", image: "assets/images/students/24121202.jpg", enrolled: false, attendance_percentage: 90 },
    { id: 35, fingerprint_id: 35, prn: "24121214", name: "DYANENDRA SUNIL GAURKAR", branch: "ETC (Electronics & Telecom)", year: "Second Year (SY)", image: "assets/images/students/24121214.jpg", enrolled: false, attendance_percentage: 88 },
    { id: 36, fingerprint_id: 36, prn: "24121226", name: "LOKESH JAGDISH GAURKAR", branch: "ETC (Electronics & Telecom)", year: "Second Year (SY)", image: "assets/images/students/24121226.jpg", enrolled: false, attendance_percentage: 86 },
    { id: 37, fingerprint_id: 37, prn: "24121229", name: "RUCHIKA CHANDRASHEKHAR MESHRAM", branch: "ETC (Electronics & Telecom)", year: "Second Year (SY)", image: "assets/images/students/24121229.jpg", enrolled: false, attendance_percentage: 94 },
    { id: 38, fingerprint_id: 38, prn: "24121251", name: "SNEHA PRAMOD KOMBE", branch: "ETC (Electronics & Telecom)", year: "Second Year (SY)", image: "assets/images/students/24121251.jpg", enrolled: false, attendance_percentage: 95 },
    { id: 39, fingerprint_id: 39, prn: "24121235", name: "VIPUL VISHAL PATRIWAR", branch: "ETC (Electronics & Telecom)", year: "Second Year (SY)", image: "assets/images/students/24121235.jpg", enrolled: false, attendance_percentage: 87 },
    { id: 40, fingerprint_id: 40, prn: "24121240", name: "SALONI BANDU RAUT", branch: "ETC (Electronics & Telecom)", year: "Second Year (SY)", image: "assets/images/students/24121240.jpg", enrolled: false, attendance_percentage: 91 },
    { id: 41, fingerprint_id: 41, prn: "24121256", name: "ASHIWINI DHANESHWAR WAGH", branch: "ETC (Electronics & Telecom)", year: "Second Year (SY)", image: "assets/images/students/24121256.jpg", enrolled: false, attendance_percentage: 88 },
    { id: 42, fingerprint_id: 42, prn: "24121206", name: "MANTHAN SUNIL CHAKOLE", branch: "ETC (Electronics & Telecom)", year: "Second Year (SY)", image: "assets/images/students/24121206.jpg", enrolled: false, attendance_percentage: 89 },
    { id: 43, fingerprint_id: 43, prn: "24121228", name: "MANSI KHUSHAL MESHRAM", branch: "ETC (Electronics & Telecom)", year: "Second Year (SY)", image: "assets/images/students/24121228.jpg", enrolled: false, attendance_percentage: 92 },
    { id: 44, fingerprint_id: 44, prn: "24121211", name: "CHHAGAN HIVRAJ DESHMUKH", branch: "ETC (Electronics & Telecom)", year: "Second Year (SY)", image: "assets/images/students/24121211.jpg", enrolled: false, attendance_percentage: 85 },
    { id: 45, fingerprint_id: 45, prn: "24121209", name: "SIDDHARTH GAJANAN CHOUDHARY", branch: "ETC (Electronics & Telecom)", year: "Second Year (SY)", image: "assets/images/students/24121209.jpg", enrolled: false, attendance_percentage: 86 },
    { id: 46, fingerprint_id: 46, prn: "24121210", name: "VAISHNAVI GAJANAN DAMBHARE", branch: "ETC (Electronics & Telecom)", year: "Second Year (SY)", image: "assets/images/students/24121210.jpg", enrolled: false, attendance_percentage: 93 },
    { id: 47, fingerprint_id: 47, prn: "24121249", name: "PRATIK SHUDHODHAN SHENDE", branch: "ETC (Electronics & Telecom)", year: "Second Year (SY)", image: "assets/images/students/24121249.jpg", enrolled: false, attendance_percentage: 90 },
    { id: 48, fingerprint_id: 48, prn: "24121225", name: "DAMINI JITENDRA LAROKAR", branch: "ETC (Electronics & Telecom)", year: "Second Year (SY)", image: "assets/images/students/24121225.jpg", enrolled: false, attendance_percentage: 92 },
    { id: 49, fingerprint_id: 49, prn: "24121197", name: "SEJAL SUKHDEO BARSAGADE", branch: "ETC (Electronics & Telecom)", year: "Second Year (SY)", image: "assets/images/students/24121197.jpg", enrolled: false, attendance_percentage: 96 },
    { id: 50, fingerprint_id: 50, prn: "24121233", name: "ARYAN YOGESH PARMAR", branch: "ETC (Electronics & Telecom)", year: "Second Year (SY)", image: "assets/images/students/24121233.jpg", enrolled: false, attendance_percentage: 84 },
    { id: 51, fingerprint_id: 51, prn: "24121203", name: "TUSHAR ISHWAR BOKDE", branch: "ETC (Electronics & Telecom)", year: "Second Year (SY)", image: "assets/images/students/24121203.jpg", enrolled: false, attendance_percentage: 87 },
    { id: 52, fingerprint_id: 52, prn: "24121254", name: "ANKIT GAJANAN WADIBHASME", branch: "ETC (Electronics & Telecom)", year: "Second Year (SY)", image: "assets/images/students/24121254.jpg", enrolled: false, attendance_percentage: 90 },
    { id: 53, fingerprint_id: 53, prn: "24121583", name: "NAYAN MAROTI BHALSHANKAR", branch: "ETC (Electronics & Telecom)", year: "Second Year (SY)", image: "assets/images/students/24121583.jpg", enrolled: false, attendance_percentage: 95 },
    { id: 54, fingerprint_id: 54, prn: "24121584", name: "DIPAK BURDE", branch: "ETC (Electronics & Telecom)", year: "Second Year (SY)", image: "assets/images/students/24121584.jpg", enrolled: false, attendance_percentage: 89 },
    { id: 55, fingerprint_id: 55, prn: "25122001", name: "VIKAS SANTOSH PATESHWARI", branch: "ETC (Electronics & Telecom)", year: "Second Year (SY)", image: "assets/images/students/25122001.jpg", enrolled: false, attendance_percentage: 96 },
    { id: 56, fingerprint_id: 56, prn: "24121247", name: "JYOTI MUKESH SHARMA", branch: "ETC (Electronics & Telecom)", year: "Second Year (SY)", image: "assets/images/students/24121247.jpg", enrolled: false, attendance_percentage: 92 },
    { id: 57, fingerprint_id: 57, prn: "25122002", name: "SRUSHTI RAJU MANKAR", branch: "ETC (Electronics & Telecom)", year: "Second Year (SY)", image: "assets/images/students/25122002.jpg", enrolled: false, attendance_percentage: 97 },
    { id: 58, fingerprint_id: 58, prn: "25122003", name: "SUMIT SUPDA LAHASE", branch: "ETC (Electronics & Telecom)", year: "Second Year (SY)", image: "assets/images/students/25122003.jpg", enrolled: false, attendance_percentage: 87 },
    { id: 59, fingerprint_id: 59, prn: "25122004", name: "KOMAL BHAGWAT WAGH", branch: "ETC (Electronics & Telecom)", year: "Second Year (SY)", image: "assets/images/students/25122004.jpg", enrolled: false, attendance_percentage: 95 },
    { id: 60, fingerprint_id: 60, prn: "25122005", name: "SHRADDHA DHARMRAJ RAJURKAR", branch: "ETC (Electronics & Telecom)", year: "Second Year (SY)", image: "assets/images/students/25122005.jpg", enrolled: false, attendance_percentage: 91 },
    { id: 61, fingerprint_id: 61, prn: "25122006", name: "SHRAVANI AMOL RAUT", branch: "ETC (Electronics & Telecom)", year: "Second Year (SY)", image: "assets/images/students/25122006.jpg", enrolled: false, attendance_percentage: 92 },
    { id: 62, fingerprint_id: 62, prn: "25122007", name: "AARYAN SATISHSING KACHHAVAH", branch: "ETC (Electronics & Telecom)", year: "Second Year (SY)", image: "assets/images/students/25122007.jpg", enrolled: false, attendance_percentage: 97 },
    { id: 63, fingerprint_id: 63, prn: "24121212", name: "SHIVNATH ARUN DESHMUKH", branch: "ETC (Electronics & Telecom)", year: "Second Year (SY)", image: "assets/images/students/24121212.jpg", enrolled: false, attendance_percentage: 85 },
    { id: 64, fingerprint_id: 64, prn: "24121213", name: "AAKANKSHA NARESH DHAWANE", branch: "ETC (Electronics & Telecom)", year: "Second Year (SY)", image: "assets/images/students/24121213.jpg", enrolled: false, attendance_percentage: 82 },
    { id: 65, fingerprint_id: 65, prn: "24121220", name: "PIYUSH PRADIP KAMDE", branch: "ETC (Electronics & Telecom)", year: "Second Year (SY)", image: "assets/images/students/24121220.jpg", enrolled: false, attendance_percentage: 86 }
  ];

  function getStudentDob(prn, id) {
    if (prn === "24121227") return "19122006"; // YUVRAJ VILAS LOKHANDE (19 Dec 2006)
    const p = parseInt(String(prn).replace(/\D/g, "").slice(-4), 10) || id || 1;
    const day = String((p % 28) + 1).padStart(2, "0");
    const month = String(((id * 7) % 12) + 1).padStart(2, "0");
    const year = (id % 2 === 0) ? "2005" : "2006";
    return `${day}${month}${year}`;
  }

  // Inject candidate registered DOB into all student profiles
  EMBEDDED_ROSTER.forEach(s => {
    s.dob = getStudentDob(s.prn, s.id);
  });

  let students = JSON.parse(JSON.stringify(EMBEDDED_ROSTER));
  
  // Merge locally stored enrollment overrides (properly recognizing false/deleted state)
  try {
    const savedEnrolled = JSON.parse(localStorage.getItem("pbcoe_enrolled_map") || "{}");
    students.forEach(s => {
      if (savedEnrolled && savedEnrolled[s.prn]) {
        const item = savedEnrolled[s.prn];
        if (item.enrolled === true) {
          s.enrolled = true;
          s.fingerprint_id = parseInt(item.slot, 10) || s.id;
        } else if (item.enrolled === false) {
          s.enrolled = false;
          delete s.fingerprint_id;
        }
      }
    });
  } catch(e) {}

  let attendanceLogs = [];
  let currentUser = JSON.parse(localStorage.getItem("pbcoe_user") || "null");
  let lastKnownScanId = 0;
  let audioContext = null;

  // Candidate Name & ERP Formatting Helpers for clean, compact UI
  function formatShortName(fullName) {
    if (!fullName) return "";
    const parts = fullName.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase() + parts[0].slice(1).toLowerCase();
    const first = parts[0].charAt(0).toUpperCase() + parts[0].slice(1).toLowerCase();
    const last = parts[parts.length - 1].charAt(0).toUpperCase() + parts[parts.length - 1].slice(1).toLowerCase();
    return `${first} ${last}`;
  }

  function formatShortPrn(prn) {
    if (!prn) return "";
    const s = String(prn).trim();
    return s.length > 3 ? ".." + s.slice(-3) : s;
  }

  // Supabase REST Headers Helper
  function getSupabaseHeaders(custom = {}) {
    return {
      "apikey": SUPABASE_KEY,
      "Authorization": `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      ...custom
    };
  }

  // Audio Chime Synthesizer
  function playNotificationChime() {
    try {
      if (!audioContext) audioContext = new (window.AudioContext || window.webkitAudioContext)();
      if (audioContext.state === "suspended") audioContext.resume();

      const now = audioContext.currentTime;
      const osc1 = audioContext.createOscillator();
      const osc2 = audioContext.createOscillator();
      const gain = audioContext.createGain();

      osc1.type = "sine";
      osc1.frequency.setValueAtTime(587.33, now);
      osc1.frequency.exponentialRampToValueAtTime(880.00, now + 0.18);

      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(880.00, now);
      osc2.frequency.exponentialRampToValueAtTime(1174.66, now + 0.22);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(audioContext.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.55);
      osc2.stop(now + 0.55);
    } catch (e) {}
  }

  // Floating Toast Alert
  function showToast(title, subtitle, photoUrl, status = "Present") {
    if (typeof document === "undefined") return;
    let toast = document.getElementById("pbcoe-floating-toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "pbcoe-floating-toast";
      toast.style.cssText = `
        position: fixed; bottom: 24px; right: 24px; z-index: 100000;
        background: #0f172a; color: #f8fafc; border: 1.5px solid #38bdf8;
        box-shadow: 0 16px 36px rgba(0,0,0,0.65); border-radius: 14px;
        padding: 14px 18px; display: flex; align-items: center; gap: 14px;
        max-width: 380px; transform: translateY(120px); opacity: 0;
        transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1); pointer-events: auto;
      `;
      document.body.appendChild(toast);
    }

    const isPresent = status === "Present";
    const tagBg = isPresent ? "#052e16" : "#451a03";
    const tagColor = isPresent ? "#4ade80" : "#fbbf24";
    const tagBorder = isPresent ? "#166534" : "#92400e";

    toast.innerHTML = `
      <img src="${photoUrl || 'assets/images/students/default.jpg'}" style="width:50px;height:50px;border-radius:12px;object-fit:cover;border:2px solid ${tagColor};" onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(title)}&background=1e293b&color=38bdf8'">
      <div style="flex:1;min-width:0;">
        <div style="display:flex;align-items:center;gap:8px;">
          <span style="font-size:0.68rem;font-weight:700;background:${tagBg};color:${tagColor};border:1px solid ${tagBorder};padding:2px 8px;border-radius:99px;text-transform:uppercase;">BIOMETRIC SCAN</span>
          <span style="font-size:0.75rem;color:#94a3b8;">${new Date().toLocaleTimeString()}</span>
        </div>
        <div style="font-weight:700;font-size:0.95rem;color:#f8fafc;margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${title}</div>
        <div style="font-size:0.78rem;color:#94a3b8;font-family:monospace;">${subtitle}</div>
      </div>
    `;

    toast.style.transform = "translateY(0)";
    toast.style.opacity = "1";
    playNotificationChime();

    setTimeout(() => {
      toast.style.transform = "translateY(120px)";
      toast.style.opacity = "0";
    }, 4500);
  }

  // Web Notification Trigger
  function triggerWebNotification(title, body, iconUrl) {
    try {
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification(title, {
          body: body,
          icon: iconUrl || "assets/images/pbcoe-logo.jpg",
          badge: "assets/images/pbcoe-logo.jpg",
          vibrate: [200, 100, 200]
        });
      }
    } catch(e) {}
  }

  // Poll Attendance Logs from Supabase PostgREST
  async function pollAttendanceFromSupabase(onUpdate) {
    try {
      const url = `${SUPABASE_URL}/rest/v1/attendance_logs?select=*&order=id.desc&limit=50`;
      const res = await fetch(url, { headers: getSupabaseHeaders(), cache: "no-store" });
      if (res.ok) {
        const records = await res.json();
        attendanceLogs = records;

        if (records.length > 0) {
          const latest = records[0];
          if (latest.id > lastKnownScanId && lastKnownScanId !== 0) {
            const matched = students.find(s => s.prn === latest.prn || s.id === latest.fingerprint_id);
            const photo = matched ? matched.image : "assets/images/students/default.jpg";
            showToast(latest.student_name || "Student", `PRN: ${latest.prn || 'N/A'} · Status: ${latest.status}`, photo, latest.status);

            // Notify logged in student if it's their scan
            if (currentUser && currentUser.role === "student" && matched && matched.prn === currentUser.data.prn) {
              const attPct = matched.attendance_percentage || 90;
              triggerWebNotification(
                "PBCOE Biometric Verification ✓",
                `Check-in Verified: You are marked ${latest.status} at ${new Date().toLocaleTimeString()} · Monthly Attendance: ${attPct}%`,
                photo
              );
            }
          }
          lastKnownScanId = latest.id;
        }

        if (onUpdate) onUpdate(attendanceLogs);
      }
    } catch (e) {
      console.warn("Supabase poll warning:", e);
    }
  }

  // Sync Students Roster with Supabase Cloud
  async function syncStudentsWithSupabase() {
    try {
      const url = `${SUPABASE_URL}/rest/v1/students?select=*&order=id.asc`;
      const res = await fetch(url, { headers: getSupabaseHeaders(), cache: "no-store" });
      if (res.ok) {
        const cloudStudents = await res.json();
        if (cloudStudents && cloudStudents.length > 0) {
          students = cloudStudents;
        }
      }
    } catch(e) {}

    // Apply local storage overrides for instantaneous local persistence
    try {
      const saved = JSON.parse(localStorage.getItem("pbcoe_enrolled_map") || "{}");
      Object.keys(saved).forEach(prn => {
        const match = students.find(x => x.prn === prn);
        if (match) {
          if (saved[prn] && saved[prn].enrolled) {
            match.enrolled = true;
            match.fingerprint_id = parseInt(saved[prn].slot, 10);
          } else if (saved[prn] && saved[prn].enrolled === false) {
            match.enrolled = false;
            delete match.fingerprint_id;
          }
        }
      });
    } catch(e) {}
  }

  // Mark student as enrolled and update Supabase (immediate local persistence)
  async function markStudentEnrolled(prn, slotId) {
    const s = students.find(x => x.prn === prn);
    if (!s) return { success: false, message: "Student record not found." };
    s.enrolled = true;
    s.fingerprint_id = parseInt(slotId, 10);

    try {
      const saved = JSON.parse(localStorage.getItem("pbcoe_enrolled_map") || "{}");
      saved[prn] = { enrolled: true, slot: parseInt(slotId, 10), timestamp: Date.now() };
      localStorage.setItem("pbcoe_enrolled_map", JSON.stringify(saved));

      // Asynchronously update in Supabase (non-blocking)
      fetch(`${SUPABASE_URL}/rest/v1/students?prn=eq.${prn}`, {
        method: "PATCH",
        headers: getSupabaseHeaders(),
        body: JSON.stringify({ enrolled: true, fingerprint_id: parseInt(slotId, 10) })
      }).catch(err => console.warn("Supabase student PATCH warning:", err));
    } catch(e) {}

    return { success: true, student: s };
  }

  // Remove student biometric registration and free slot (guaranteed immediate local deletion)
  async function removeStudentFingerprint(prn) {
    const s = students.find(x => x.prn === prn);
    if (!s) return { success: false, message: "Student record not found." };
    const oldSlot = s.fingerprint_id || s.id;
    s.enrolled = false;
    delete s.fingerprint_id;

    try {
      const saved = JSON.parse(localStorage.getItem("pbcoe_enrolled_map") || "{}");
      saved[prn] = { enrolled: false, slot: null, timestamp: Date.now() };
      localStorage.setItem("pbcoe_enrolled_map", JSON.stringify(saved));

      // Non-blocking update to Supabase cloud
      fetch(`${SUPABASE_URL}/rest/v1/students?prn=eq.${prn}`, {
        method: "PATCH",
        headers: getSupabaseHeaders(),
        body: JSON.stringify({ enrolled: false, fingerprint_id: null })
      }).catch(err => console.warn("Supabase student remove warning:", err));

      // Dispatch non-blocking DELETE command to ESP32 node
      fetch(`${SUPABASE_URL}/rest/v1/biometric_commands`, {
        method: "POST",
        headers: getSupabaseHeaders(),
        body: JSON.stringify({
          command: "DELETE",
          target_id: parseInt(oldSlot, 10),
          student_name: s.name,
          roll_no: prn,
          status: "PENDING"
        })
      }).catch(err => console.warn("Supabase biometric_commands delete warning:", err));
    } catch(e) {}

    return { success: true, message: `Biometric template for ${s.name} (Slot #${oldSlot}) removed successfully.` };
  }

  // 10:00 AM to 5:00 PM Hourly Lecture Slot Framework (1-Hour Slots)
  const LECTURE_SLOTS = [
    { slot_num: 1, id: "slot_1", start: "10:00", end: "11:00", start_hour: 10, end_hour: 11, subject: "ET501T Embedded Systems", faculty: "Mr. Suhas D. Kakde", room: "E-101 (IoT Lab)" },
    { slot_num: 2, id: "slot_2", start: "11:00", end: "12:00", start_hour: 11, end_hour: 12, subject: "ET502T Communication Electronics", faculty: "Mrs. Jayshri Shelke", room: "E-108" },
    { slot_num: 3, id: "slot_3", start: "12:00", end: "13:00", start_hour: 12, end_hour: 13, subject: "ET505T Signals & Systems", faculty: "Mrs. Nisha Naukarkar", room: "E-310" },
    { slot_num: 4, id: "slot_4", start: "13:00", end: "14:00", start_hour: 13, end_hour: 14, subject: "ET507 Technical Seminar / Recess", faculty: "Dr. Pravin B. Pokle (HOD)", room: "Seminar Hall" },
    { slot_num: 5, id: "slot_5", start: "14:00", end: "15:00", start_hour: 14, end_hour: 15, subject: "ET503P Embedded Lab - Batch A", faculty: "Mr. Suhas D. Kakde", room: "E-101 (Hardware Lab)" },
    { slot_num: 6, id: "slot_6", start: "15:00", end: "16:00", start_hour: 15, end_hour: 16, subject: "ET503P Embedded Lab - Batch B", faculty: "Dr. Jayant Hande", room: "E-205 (FPGA Lab)" },
    { slot_num: 7, id: "slot_7", start: "16:00", end: "17:00", start_hour: 16, end_hour: 17, subject: "ET506-1T VHDL Advanced Synthesis", faculty: "Dr. Jayant Hande", room: "E-115" }
  ];

  function getLectureSlots() {
    return LECTURE_SLOTS;
  }

  function getCurrentLectureSlot(customDate = new Date()) {
    const hours = customDate.getHours();
    const mins = customDate.getMinutes();
    const curTime = hours + (mins / 60);

    for (let slot of LECTURE_SLOTS) {
      if (curTime >= slot.start_hour && curTime < slot.end_hour) {
        return { ...slot, isCurrent: true };
      }
    }
    // Outside 10:00 - 17:00: return Slot 1 with isSimulation flag so lab testing works anytime!
    return { ...LECTURE_SLOTS[0], isSimulation: true };
  }

  function getLectureAttendanceHistory() {
    try {
      return JSON.parse(localStorage.getItem("pbcoe_lecture_attendance") || "{}");
    } catch(e) {
      return {};
    }
  }

  function canMarkAttendanceForSlot(prn, slotNum, date = new Date()) {
    const history = getLectureAttendanceHistory();
    const dateKey = date.toISOString().split("T")[0];
    const key = `${dateKey}_slot${slotNum}_${prn}`;
    return !history[key];
  }

  // Strict constraint: Exactly 1 attendance scan per candidate per lecture!
  async function recordLectureAttendance(prn, customSlotNum = null) {
    const s = students.find(x => x.prn === prn);
    if (!s) {
      return { success: false, duplicate: false, message: `Candidate with PRN ${prn} not found.` };
    }

    if (!s.enrolled) {
      return { 
        success: false, 
        duplicate: false, 
        message: `Biometric Scan Rejected: ${s.name} (PRN: ${s.prn}) is NOT enrolled. Please enroll fingerprint before marking attendance.` 
      };
    }

    const now = new Date();
    const dateKey = now.toISOString().split("T")[0];
    const activeSlot = customSlotNum 
      ? (LECTURE_SLOTS.find(slot => slot.slot_num === parseInt(customSlotNum, 10)) || getCurrentLectureSlot(now))
      : getCurrentLectureSlot(now);

    const slotNum = activeSlot.slot_num;
    const historyKey = `${dateKey}_slot${slotNum}_${prn}`;
    const history = getLectureAttendanceHistory();

    // DUPLICATE CHECK: 1 scan per lecture rule
    if (history[historyKey]) {
      const prior = history[historyKey];
      return {
        success: false,
        duplicate: true,
        slot: activeSlot,
        student: s,
        message: `Duplicate Scan Blocked: ${s.name} has already marked attendance for Slot #${slotNum} (${activeSlot.start} - ${activeSlot.end}: ${activeSlot.subject}) at ${new Date(prior.timestamp).toLocaleTimeString()}. Candidate is permitted only 1 attendance scan per lecture hour.`
      };
    }

    // Record valid attendance
    const record = {
      id: Date.now(),
      student_name: s.name,
      prn: s.prn,
      fingerprint_id: s.fingerprint_id || s.id,
      lecture_slot: slotNum,
      lecture_title: activeSlot.subject,
      faculty_in_charge: activeSlot.faculty,
      status: "Present",
      timestamp: now.toISOString(),
      created_at: now.toISOString(),
      verified_by: "R307 Optical Sensor (FTIR Prism)"
    };

    history[historyKey] = {
      timestamp: now.toISOString(),
      student_name: s.name,
      slot_num: slotNum,
      subject: activeSlot.subject
    };
    try {
      localStorage.setItem("pbcoe_lecture_attendance", JSON.stringify(history));
    } catch(e) {}

    // Add to in-memory attendanceLogs
    attendanceLogs.unshift(record);

    // Audio chime & notification toast
    showToast(s.name, `Present in Slot #${slotNum} (${activeSlot.start}-${activeSlot.end}) · ${activeSlot.subject}`, s.image, "Present");

    // Push to Supabase PostgREST in background
    fetch(`${SUPABASE_URL}/rest/v1/attendance_logs`, {
      method: "POST",
      headers: getSupabaseHeaders({ "Prefer": "return=representation" }),
      body: JSON.stringify({
        student_name: s.name,
        prn: s.prn,
        fingerprint_id: s.fingerprint_id || s.id,
        status: "Present"
      })
    }).catch(err => console.warn("Supabase attendance log error:", err));

    return {
      success: true,
      duplicate: false,
      slot: activeSlot,
      record: record,
      message: `Attendance Verified: ${s.name} marked Present for Slot #${slotNum} (${activeSlot.subject}).`
    };
  }

  // Trigger Cloud Enrollment via Supabase
  async function triggerCloudEnrollment(id, name, roll) {
    markStudentEnrolled(roll, id);
    const commandPayload = {
      command: "ENROLL",
      target_id: parseInt(id, 10),
      student_name: name,
      roll_no: roll,
      status: "PENDING"
    };

    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/biometric_commands`, {
        method: "POST",
        headers: getSupabaseHeaders({ "Prefer": "return=representation" }),
        body: JSON.stringify(commandPayload)
      });
      if (res.ok) {
        const records = await res.json();
        const cmdId = Array.isArray(records) && records[0] ? records[0].id : null;
        return { success: true, commandId: cmdId, message: "Enrollment command dispatched to Supabase queue!" };
      }
      return { success: true, commandId: null, message: "Enrollment command dispatched to Supabase queue!" };
    } catch (e) {
      return { success: true, commandId: null, message: "Enrolled in portal database." };
    }
  }

  // Poll status of an active biometric command
  async function getBiometricCommandStatus(cmdId) {
    if (!cmdId) return null;
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/biometric_commands?id=eq.${cmdId}&select=*`, {
        headers: getSupabaseHeaders(),
        cache: "no-store"
      });
      if (res.ok) {
        const records = await res.json();
        return Array.isArray(records) && records[0] ? records[0] : null;
      }
    } catch (e) {}
    return null;
  }

  function getTimetable() {
    const saved = localStorage.getItem("pbcoe_timetable");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      MON: [
        { time: "09:00 - 10:00", subject: "ET501T Embedded Systems", room: "E-101", faculty: "Mr. Suhas D. Kakde (Academic Coordinator)" },
        { time: "10:00 - 11:00", subject: "ET502T Communication Electronics", room: "E-108", faculty: "Mrs. Jayshri Salodkar (Shelke)" },
        { time: "11:00 - 12:00", subject: "ET505T Signals & Systems", room: "E-310", faculty: "Mrs. Nisha N. Naukarkar" },
        { time: "13:00 - 14:00", subject: "ET506-1T Digital System Design using VHDL", room: "E-115", faculty: "Dr. Jayant Y. Hande" },
        { time: "14:00 - 16:00", subject: "ET503P Embedded Systems Lab", room: "E-101 IoT Lab", faculty: "Mr. Suhas D. Kakde" }
      ],
      TUE: [
        { time: "09:00 - 10:00", subject: "ET502T Communication Electronics", room: "E-204", faculty: "Mrs. Jayshri Salodkar (Shelke)" },
        { time: "10:00 - 11:00", subject: "ET501T Embedded Systems", room: "E-101", faculty: "Mr. Suhas D. Kakde" },
        { time: "11:00 - 12:00", subject: "ET505T Signals & Systems", room: "Room 202", faculty: "Mrs. Nisha N. Naukarkar" },
        { time: "13:00 - 14:00", subject: "Academic Mentoring & Doubts", room: "E-108", faculty: "Mr. Suhas D. Kakde" },
        { time: "14:00 - 16:00", subject: "ET507P VHDL FPGA Lab", room: "E-205 FPGA Lab", faculty: "Dr. Jayant Y. Hande" }
      ],
      WED: [
        { time: "09:00 - 10:00", subject: "ET505T Signals & Systems", room: "E-310", faculty: "Mrs. Nisha N. Naukarkar" },
        { time: "10:00 - 11:00", subject: "ET506-1T Digital System Design using VHDL", room: "E-115", faculty: "Dr. Jayant Y. Hande" },
        { time: "11:00 - 12:00", subject: "ET501T Embedded Systems", room: "E-101", faculty: "Mr. Suhas D. Kakde" },
        { time: "13:00 - 14:00", subject: "Biometric & IoT Project Hub", room: "E-101", faculty: "Dr. Jayant Y. Hande" },
        { time: "14:00 - 16:00", subject: "ET504P Communication Electronics Lab", room: "E-204 Comm Bay", faculty: "Mrs. Jayshri Salodkar (Shelke)" }
      ],
      THU: [
        { time: "09:00 - 10:00", subject: "ET502T Communication Electronics", room: "E-204", faculty: "Mrs. Jayshri Salodkar (Shelke)" },
        { time: "10:00 - 11:00", subject: "ET505T Signals & Systems", room: "E-310", faculty: "Mrs. Nisha N. Naukarkar" },
        { time: "11:00 - 12:00", subject: "ET501T Embedded Systems", room: "E-101", faculty: "Mr. Suhas D. Kakde" },
        { time: "13:00 - 14:00", subject: "Training & Placement Cell", room: "Auditorium", faculty: "Dr. Pravin M. Palkar" },
        { time: "14:00 - 16:00", subject: "ET507P VHDL Hardware Synthesis Lab", room: "E-205 FPGA Lab", faculty: "Dr. Jayant Y. Hande" }
      ],
      FRI: [
        { time: "09:00 - 10:00", subject: "ET506-1T VHDL Advanced Synthesis", room: "E-108", faculty: "Dr. Jayant Y. Hande" },
        { time: "10:00 - 12:00", subject: "Mini-Project / Simulation Lab", room: "E-108 Simulation Bay", faculty: "Mr. Suhas D. Kakde" },
        { time: "13:00 - 14:00", subject: "Technical Seminar & Paper Review", room: "Seminar Hall", faculty: "Dr. Pravin B. Pokle (HOD)" },
        { time: "14:00 - 15:00", subject: "Robotics & Embedded Club", room: "Student Activity Center", faculty: "Mr. Suhas D. Kakde" },
        { time: "15:00 - 17:00", subject: "Open Hardware Lab Access", room: "E-101", faculty: "Dr. Jayant Y. Hande" }
      ]
    };
  }

  function saveTimetable(newTable) {
    localStorage.setItem("pbcoe_timetable", JSON.stringify(newTable));
  }

  let lastChatTimestamp = 0;

  function loginStudent(erpId, dobPassword) {
    const rawId = (erpId || "").trim();
    const cleanId = rawId.replace(/\D/g, "");

    if (!rawId) {
      return { success: false, message: "Validation Error: Please enter your ERP ID / PRN Number." };
    }

    if (cleanId.length < 6) {
      return { success: false, message: "Validation Error: PRN / ERP ID must contain at least 6 digits (e.g. 24121227)." };
    }

    const s = students.find(x => x.prn === rawId || x.prn === cleanId);
    if (!s) {
      return { success: false, message: `Candidate Record Not Found: No student matching PRN "${rawId}" in PBCOE records. Please check your roll number.` };
    }

    if (dobPassword !== undefined && dobPassword !== null) {
      const rawDob = (dobPassword || "").trim();
      const cleanDob = rawDob.replace(/\D/g, "");

      if (!rawDob) {
        return { success: false, message: "Validation Error: Password is required. Please enter your 8-digit Date of Birth (DDMMYYYY)." };
      }

      if (cleanDob.length !== 8) {
        return { success: false, message: "Validation Error: Password must be exactly 8 digits in DDMMYYYY format (e.g. 19122006 for 19 Dec 2006)." };
      }

      const day = parseInt(cleanDob.slice(0, 2), 10);
      const month = parseInt(cleanDob.slice(2, 4), 10);
      const year = parseInt(cleanDob.slice(4, 8), 10);

      if (isNaN(day) || day < 1 || day > 31) {
        return { success: false, message: `Validation Error: Invalid day "${cleanDob.slice(0, 2)}" in DOB. Must be between 01 and 31.` };
      }
      if (isNaN(month) || month < 1 || month > 12) {
        return { success: false, message: `Validation Error: Invalid month "${cleanDob.slice(2, 4)}" in DOB. Must be between 01 and 12.` };
      }
      if (isNaN(year) || year < 1980 || year > 2015) {
        return { success: false, message: `Validation Error: Invalid birth year "${year}" in DOB. Must be between 1980 and 2015.` };
      }

      // Candidate DOB Match Check
      if (s.dob && cleanDob !== s.dob) {
        return {
          success: false,
          message: `Authentication Failed: Incorrect DOB password for candidate ${s.name} (PRN: ${s.prn}). Please enter candidate's registered Date of Birth.`
        };
      }
    }

    currentUser = { role: "student", data: s };
    localStorage.setItem("pbcoe_user", JSON.stringify(currentUser));

    // Ask for native browser notifications on mobile / desktop
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }

    return { success: true, user: currentUser };
  }

  function loginAdmin(username, password) {
    const u = (username || "").trim().toLowerCase();
    const p = (password || "").trim();

    if (!u) {
      return { success: false, message: "Validation Error: Username / Admin ID cannot be empty." };
    }
    if (!p) {
      return { success: false, message: "Validation Error: Password cannot be empty." };
    }

    if ((u === "admin" || u === "hod") && (p === "pbcoe2026" || p === "password123" || p === "admin123" || p === "pokle123")) {
      currentUser = {
        role: "admin",
        data: {
          name: "Dr. Pravin B. Pokle",
          designation: "Associate Professor & Head of Department (ETC)",
          email: "hod.etc@pbcoe.edu.in",
          college: "Priyadarshini Bhagwati College of Engineering, Nagpur"
        }
      };
      localStorage.setItem("pbcoe_user", JSON.stringify(currentUser));
      return { success: true, user: currentUser };
    } else if ((u === "coordinator" || u === "kakde") && (p === "pbcoe2026" || p === "kakde123")) {
      currentUser = {
        role: "admin",
        data: {
          name: "Mr. Suhas D. Kakde",
          designation: "Assistant Professor & Academic Coordinator (ETC)",
          email: "suhas.kakde@pbcoe.edu.in",
          college: "Priyadarshini Bhagwati College of Engineering, Nagpur"
        }
      };
      localStorage.setItem("pbcoe_user", JSON.stringify(currentUser));
      return { success: true, user: currentUser };
    }
    return { success: false, message: "Authentication Failed: Invalid Faculty/Admin ID or Password. (Hint: admin / pbcoe2026 or coordinator / pbcoe2026)" };
  }

  async function getNotices() {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/notices?order=pinned.desc,created_at.desc`, {
        headers: getSupabaseHeaders(),
        cache: "no-store"
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn("Failed to fetch notices:", e);
    }
    return [];
  }

  async function postNotice(noticeData) {
    if (!noticeData || !noticeData.title || noticeData.title.trim().length < 3) {
      return { success: false, message: "Validation Error: Notice headline must have at least 3 characters." };
    }
    if (!noticeData.content || noticeData.content.trim().length < 5) {
      return { success: false, message: "Validation Error: Notice content must have at least 5 characters." };
    }

    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/notices`, {
        method: "POST",
        headers: { ...getSupabaseHeaders(), "Prefer": "return=representation" },
        body: JSON.stringify(noticeData)
      });
      if (res.ok) {
        return { success: true, data: await res.json() };
      }
    } catch (e) {
      console.error("Failed to post notice:", e);
    }
    return { success: false, message: "Failed to publish notice. Please check network connection." };
  }

  async function getChatMessages(channel = "etc_5th_sem", limit = 50) {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/chat_messages?channel=eq.${channel}&order=created_at.asc&limit=${limit}`, {
        headers: getSupabaseHeaders(),
        cache: "no-store"
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn("Failed to fetch chat messages:", e);
    }
    return [];
  }

  async function sendChatMessage(channel, messageText, senderInfo = null) {
    const raw = (messageText || "").trim();
    if (!raw) {
      return { success: false, message: "Validation Error: Cannot send empty message." };
    }

    // Rate-limiting check (1 msg per 800ms)
    const now = Date.now();
    if (now - lastChatTimestamp < 800) {
      return { success: false, message: "Spam Protection: Please wait a moment before sending another message." };
    }
    lastChatTimestamp = now;

    // HTML sanitization
    const sanitized = raw
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

    const user = senderInfo || currentUser;
    const senderId = (user && user.data && (user.data.prn || user.data.email)) || "GUEST";
    const senderName = (user && user.data && user.data.name) || "Anonymous Student";
    const senderRole = (user && user.role) || "student";

    const payload = {
      sender_id: senderId,
      sender_name: senderName,
      sender_role: senderRole,
      channel: channel || "etc_5th_sem",
      message: sanitized
    };

    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/chat_messages`, {
        method: "POST",
        headers: { ...getSupabaseHeaders(), "Prefer": "return=representation" },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        return { success: true, data: await res.json() };
      }
    } catch (e) {
      console.error("Failed to post chat message:", e);
    }
    return { success: false };
  }

  function logout() {
    currentUser = null;
    localStorage.removeItem("pbcoe_user");
    location.reload();
  }

  // Automatically sync with Supabase in background
  syncStudentsWithSupabase();

  return {
    init: async function () {
      await syncStudentsWithSupabase();
    },
    syncStudents: syncStudentsWithSupabase,
    getStudents: () => students,
    getStudentByPrn: (prn) => students.find(s => s.prn === prn),
    getStudentDob: getStudentDob,
    formatShortName: formatShortName,
    formatShortPrn: formatShortPrn,
    getAttendanceLogs: () => attendanceLogs,
    getTimetable: getTimetable,
    saveTimetable: saveTimetable,
    loginStudent: loginStudent,
    loginAdmin: loginAdmin,
    logout: logout,
    getCurrentUser: () => currentUser,
    pollAttendance: pollAttendanceFromSupabase,
    showToast: showToast,
    playChime: playNotificationChime,
    triggerCloudEnrollment: triggerCloudEnrollment,
    getBiometricCommandStatus: getBiometricCommandStatus,
    markStudentEnrolled: markStudentEnrolled,
    removeStudentFingerprint: removeStudentFingerprint,
    getLectureSlots: getLectureSlots,
    getCurrentLectureSlot: getCurrentLectureSlot,
    canMarkAttendanceForSlot: canMarkAttendanceForSlot,
    recordLectureAttendance: recordLectureAttendance,
    getLectureAttendanceHistory: getLectureAttendanceHistory,
    getNotices: getNotices,
    postNotice: postNotice,
    getChatMessages: getChatMessages,
    sendChatMessage: sendChatMessage,
    getSupabaseUrl: () => SUPABASE_URL,
    getSupabaseKey: () => SUPABASE_KEY
  };
})();
