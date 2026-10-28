/**
 * PBCOE WhatsApp Web Messenger & Document Verification Engine
 * Department of Electronics & Telecommunication Engineering, PBCOE Nagpur
 */
(function() {
  "use strict";

  // Initial Seed Contacts
  const DEFAULT_CONTACTS = [
    {
      id: "channel_broadcast",
      type: "group",
      name: "PBCOE ETC Official Broadcast",
      role: "Official Notice Channel",
      avatar: "assets/images/pbcoe-round-seal.png",
      verified: true,
      online: true,
      category: "groups",
      subtext: "Dr. Pravin B. Pokle, Suhas Kakde, 65 Students"
    },
    {
      id: "channel_5th_sem",
      type: "group",
      name: "5th Sem ETC Cohort (65 Students)",
      role: "Classroom Discussion",
      avatar: "https://ui-avatars.com/api/?name=ETC+Cohort&background=0284c7&color=ffffff",
      verified: true,
      online: true,
      category: "groups",
      subtext: "Batch 2026 · Class Discussion & Labs"
    },
    {
      id: "direct_kakde",
      type: "personal",
      name: "Mr. Suhas D. Kakde",
      role: "Academic Coordinator · Embedded Systems",
      avatar: "assets/images/faculty/suhas-kakde.jpg",
      verified: true,
      online: true,
      category: "personal",
      subtext: "online · Academic Coordinator"
    },
    {
      id: "direct_pokle",
      type: "personal",
      name: "Dr. Pravin B. Pokle",
      role: "Head of Department (HOD, ETC)",
      avatar: "assets/images/faculty/pravin-pokle.jpg",
      verified: true,
      online: true,
      category: "personal",
      subtext: "online · HOD, ETC"
    },
    {
      id: "direct_shende",
      type: "personal",
      name: "Dr. A. M. Shende",
      role: "Principal, PBCOE Nagpur",
      avatar: "https://ui-avatars.com/api/?name=A+M+Shende&background=0f172a&color=38bdf8",
      verified: true,
      online: false,
      category: "personal",
      subtext: "last seen today at 09:30 AM"
    },
    {
      id: "direct_24121227",
      type: "personal",
      name: "Yuvraj Lokhande",
      role: "Candidate PRN: ..227 · Slot #16",
      avatar: "assets/images/students/yuvraj-lokhande.jpg",
      verified: false,
      online: true,
      category: "personal",
      subtext: "online · IoT Biometric Project Lead"
    },
    {
      id: "direct_24121210",
      type: "personal",
      name: "Vaishnavi Dambhare",
      role: "Candidate PRN: ..210 · B.Tech ETC",
      avatar: "https://ui-avatars.com/api/?name=Vaishnavi+Dambhare&background=1e293b&color=38bdf8",
      verified: false,
      online: true,
      category: "personal",
      subtext: "online · 5th Sem Classmate"
    },
    {
      id: "direct_24121202",
      type: "personal",
      name: "Aayush Somnathe",
      role: "Candidate PRN: ..202 · B.Tech ETC",
      avatar: "https://ui-avatars.com/api/?name=Aayush+Somnathe&background=1e293b&color=38bdf8",
      verified: false,
      online: false,
      category: "personal",
      subtext: "last seen yesterday at 18:40"
    },
    {
      id: "direct_24121205",
      type: "personal",
      name: "Chetan Rahangdale",
      role: "Candidate PRN: ..205 · B.Tech ETC",
      avatar: "https://ui-avatars.com/api/?name=Chetan+Rahangdale&background=1e293b&color=38bdf8",
      verified: false,
      online: true,
      category: "personal",
      subtext: "online · Circuit Lab Partner"
    }
  ];

  // Initial Seed Conversations
  const SEED_MESSAGES = {
    "channel_broadcast": [
      {
        id: "m_bc_1",
        sender_id: "faculty_pokle",
        sender_name: "Dr. Pravin B. Pokle (HOD)",
        sender_role: "hod",
        text: "📢 Attention 5th Sem ETC Students: The ET501T Embedded Systems Activity-2 submissions and Biometric Telemetry log audits are now active. All 65 candidates must ensure their fingerprint template is verified in the lab terminal.",
        timestamp: Date.now() - 3600000 * 5,
        status: "read"
      },
      {
        id: "m_bc_2",
        sender_id: "faculty_kakde",
        sender_name: "Mr. Suhas D. Kakde",
        sender_role: "coordinator",
        text: "Please note that attendance threshold of 75% is strictly enforced under NEP 2020 guidelines. Students flagged at-risk should meet me during faculty mentoring hours.",
        timestamp: Date.now() - 3600000 * 2,
        status: "read"
      }
    ],
    "channel_5th_sem": [
      {
        id: "m_cs_1",
        sender_id: "24121210",
        sender_name: "Vaishnavi Dambhare",
        sender_role: "student",
        text: "Has everyone tested the 8051 Timer 1 baud formula from today's Embedded Systems class?",
        timestamp: Date.now() - 3600000 * 4,
        status: "read"
      },
      {
        id: "m_cs_2",
        sender_id: "24121227",
        sender_name: "Yuvraj Lokhande",
        sender_role: "student",
        text: "Yes, for 9600 bps with 11.0592 MHz crystal, TH1 is 0xFD (253 decimal). The ESP32 sensor node connects over UART at 57600 baud.",
        timestamp: Date.now() - 3600000 * 3,
        status: "read"
      },
      {
        id: "m_cs_3",
        sender_id: "faculty_kakde",
        sender_name: "Mr. Suhas D. Kakde",
        sender_role: "coordinator",
        text: "Good discussion! Keep your lab files and hardware schematics updated for Activity-2 inspection.",
        timestamp: Date.now() - 3600000,
        status: "read"
      }
    ],
    "direct_kakde": [
      {
        id: "m_k_1",
        sender_id: "faculty_kakde",
        sender_name: "Mr. Suhas D. Kakde",
        sender_role: "coordinator",
        text: "Hello! If you have any queries regarding your Activity-2 Embedded Biometric report or hardware pinouts (ESP32 GPIO 4 RX / GPIO 5 Buzzer), feel free to ask here. You can also send images of your circuit setup.",
        timestamp: Date.now() - 3600000 * 6,
        status: "read"
      }
    ],
    "direct_pokle": [
      {
        id: "m_p_1",
        sender_id: "faculty_pokle",
        sender_name: "Dr. Pravin B. Pokle",
        sender_role: "hod",
        text: "Welcome to the ETC Department direct communication channel. All document submissions, bonafide requests, and biometric telemetry questions can be addressed here directly.",
        timestamp: Date.now() - 3600000 * 8,
        status: "read"
      }
    ],
    "direct_24121227": [
      {
        id: "m_y_1",
        sender_id: "24121227",
        sender_name: "Yuvraj Lokhande",
        sender_role: "student",
        text: "Hey! The R307 optical fingerprint sensor and Supabase REST backend are working seamlessly now. Let me know if you need help with your slot configuration.",
        timestamp: Date.now() - 3600000 * 2,
        status: "read"
      }
    ]
  };

  // State Management
  let activeContactId = "channel_broadcast";
  let activeFilter = "all";
  let stagedImage = null; // { dataUrl, name, size }
  let stagedDoc = null;
  let simulatedTypingTimer = null;

  function getStoredMessages() {
    try {
      const saved = localStorage.getItem("pbcoe_wa_messages");
      if (saved) return JSON.parse(saved);
    } catch(e) {}
    localStorage.setItem("pbcoe_wa_messages", JSON.stringify(SEED_MESSAGES));
    return SEED_MESSAGES;
  }

  function saveStoredMessages(msgs) {
    try {
      localStorage.setItem("pbcoe_wa_messages", JSON.stringify(msgs));
    } catch(e) {}
  }

  function getCurrentSender() {
    const user = window.PBCOE && window.PBCOE.getCurrentUser ? window.PBCOE.getCurrentUser() : null;
    if (user && user.data) {
      return {
        id: user.data.prn || user.data.email || "CURRENT_USER",
        name: user.data.name || "Student User",
        role: user.role || "student",
        avatar: user.data.image || "https://ui-avatars.com/api/?name=" + encodeURIComponent(user.data.name || "User")
      };
    }
    return {
      id: "24121227",
      name: "Yuvraj Lokhande",
      role: "student",
      avatar: "assets/images/students/yuvraj-lokhande.jpg"
    };
  }

  // Render Contacts Sidebar
  function renderContactsList(searchQuery = "") {
    const listEl = document.getElementById("wa-contacts-list");
    if (!listEl) return;

    const msgs = getStoredMessages();
    const query = searchQuery.trim().toLowerCase();

    // Pull cohort students from PBCOE core if available
    let allContacts = [...DEFAULT_CONTACTS];
    if (window.PBCOE && window.PBCOE.getStudents) {
      const cohort = window.PBCOE.getStudents();
      cohort.forEach(s => {
        const cId = `direct_${s.prn}`;
        if (!allContacts.some(c => c.id === cId)) {
          const shortName = window.PBCOE.formatShortName ? window.PBCOE.formatShortName(s.name) : s.name;
          const shortPrn = window.PBCOE.formatShortPrn ? window.PBCOE.formatShortPrn(s.prn) : s.prn;
          allContacts.push({
            id: cId,
            type: "personal",
            name: `${shortName} (${shortPrn})`,
            role: `Candidate PRN: ${s.prn} · Slot #${s.fingerprint_id || s.id}`,
            avatar: s.image,
            verified: false,
            online: s.enrolled,
            category: "personal",
            subtext: s.enrolled ? "online · Biometric Registered" : "offline · Slot Pending"
          });
        }
      });
    }

    // Filter contacts
    let filtered = allContacts.filter(c => {
      if (activeFilter === "personal" && c.category !== "personal") return false;
      if (activeFilter === "groups" && c.category !== "groups") return false;
      if (query) {
        return c.name.toLowerCase().includes(query) || c.role.toLowerCase().includes(query);
      }
      return true;
    });

    listEl.innerHTML = filtered.map(c => {
      const cMsgs = msgs[c.id] || [];
      const lastMsg = cMsgs[cMsgs.length - 1];
      const snippet = lastMsg ? (lastMsg.image ? "📷 Photo" : lastMsg.text) : "Tap to open conversation";
      const timeStr = lastMsg ? new Date(lastMsg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "";
      const isActive = c.id === activeContactId;

      return `
        <div class="wa-contact-item ${isActive ? 'active' : ''}" onclick="window.PBCOE_WA.selectContact('${c.id}')">
          <div class="wa-contact-avatar-wrap">
            <img src="${c.avatar}" class="wa-contact-avatar" onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(c.name)}&background=1e293b&color=38bdf8'">
            ${c.online ? '<div class="wa-online-dot"></div>' : ''}
          </div>
          <div class="wa-contact-info">
            <div class="wa-contact-top">
              <span class="wa-contact-name">${c.name} ${c.verified ? '✓' : ''}</span>
              <span class="wa-contact-time">${timeStr}</span>
            </div>
            <div class="wa-contact-bottom">
              <span class="wa-contact-snippet">${snippet}</span>
              ${isActive ? '' : ''}
            </div>
          </div>
        </div>
      `;
    }).join("");
  }

  // Render Main Active Chat
  function renderActiveChat() {
    const headerName = document.getElementById("wa-header-name");
    const headerStatus = document.getElementById("wa-header-status");
    const headerAvatar = document.getElementById("wa-header-avatar");
    const container = document.getElementById("wa-messages-container");
    if (!container) return;

    let contact = DEFAULT_CONTACTS.find(c => c.id === activeContactId);
    if (!contact && window.PBCOE && window.PBCOE.getStudents) {
      const prn = activeContactId.replace("direct_", "");
      const s = window.PBCOE.getStudentByPrn(prn);
      if (s) {
        contact = {
          id: activeContactId,
          name: window.PBCOE.formatShortName ? window.PBCOE.formatShortName(s.name) : s.name,
          avatar: s.image,
          subtext: `Candidate PRN: ${s.prn} · Slot #${s.fingerprint_id || s.id}`
        };
      }
    }
    if (!contact) contact = DEFAULT_CONTACTS[0];

    if (headerName) headerName.innerHTML = `${contact.name} ${contact.verified ? '<span style="color:#00a884;font-size:0.8rem;">✓</span>' : ''}`;
    if (headerStatus) headerStatus.innerText = contact.subtext || "online";
    if (headerAvatar) {
      headerAvatar.src = contact.avatar;
      headerAvatar.onerror = () => { headerAvatar.src = 'assets/images/pbcoe-round-seal.png'; };
    }

    const msgs = getStoredMessages();
    const activeMsgs = msgs[activeContactId] || [];
    const sender = getCurrentSender();

    let html = `
      <div class="wa-pill-center">
        🔒 Messages and calls are end-to-end encrypted. PBCOE Institutional Telemetry Network.
      </div>
      <div class="wa-date-pill">TODAY</div>
    `;

    if (activeMsgs.length === 0) {
      html += `<div style="text-align:center;color:#8696a0;padding:40px;font-size:0.85rem;">No messages in this chat yet. Say hello or send an image!</div>`;
    } else {
      activeMsgs.forEach(m => {
        const isSent = m.sender_id === sender.id || m.sender_id === "CURRENT_USER" || m.sender_id === "me";
        const bubbleClass = isSent ? "wa-bubble-sent" : "wa-bubble-received";
        const timeStr = new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        html += `
          <div class="wa-bubble ${bubbleClass}">
            <button type="button" class="wa-msg-del" title="Delete message" onclick="event.stopPropagation(); window.PBCOE_WA.deleteMessage('${activeContactId}', '${m.id}')">🗑️</button>
            ${!isSent ? `<div class="wa-sender-tag">${m.sender_name}</div>` : ''}
            ${m.image ? `
              <div class="wa-bubble-img-wrap" onclick="window.PBCOE_WA.openLightbox('${m.image}', '${encodeURIComponent(m.text || '')}')">
                <img src="${m.image}" class="wa-bubble-img" alt="Attached Image">
              </div>
            ` : ''}
            ${m.doc ? `
              <div style="display:flex;align-items:center;gap:10px;background:rgba(0,0,0,0.2);padding:8px 12px;border-radius:6px;margin-bottom:6px;">
                <span style="font-size:1.4rem;">📄</span>
                <div>
                  <strong>${m.doc.title || 'Document'}</strong>
                  <div style="font-size:0.7rem;color:#8696a0;">${m.doc.name} · ${m.doc.size || 'PDF'}</div>
                </div>
              </div>
            ` : ''}
            ${m.text ? `<div class="wa-msg-text">${m.text}</div>` : ''}
            <div class="wa-bubble-meta">
              <span>${timeStr}</span>
              ${isSent ? '<span class="wa-checkmarks">✓✓</span>' : ''}
            </div>
          </div>
        `;
      });
    }

    container.innerHTML = html;
    container.scrollTop = container.scrollHeight;
  }

  // Send Message function
  async function sendMessage() {
    const input = document.getElementById("wa-msg-input");
    const text = (input ? input.value : "").trim();

    if (!text && !stagedImage && !stagedDoc) return;

    const sender = getCurrentSender();
    const newMsg = {
      id: "m_" + Date.now(),
      sender_id: sender.id,
      sender_name: sender.name,
      sender_role: sender.role,
      text: text,
      image: stagedImage ? stagedImage.dataUrl : null,
      doc: stagedDoc ? { title: stagedDoc.title, name: stagedDoc.name, size: stagedDoc.size } : null,
      timestamp: Date.now(),
      status: "sent"
    };

    const msgs = getStoredMessages();
    if (!msgs[activeContactId]) msgs[activeContactId] = [];
    msgs[activeContactId].push(newMsg);
    saveStoredMessages(msgs);

    // Reset input & attachment bar
    if (input) input.value = "";
    cancelAttachment();

    renderActiveChat();
    renderContactsList();

    // Trigger simulated mentor response if personal chat
    triggerSimulatedResponse(activeContactId, text, newMsg.image);

    // Also forward text to Supabase if group channel
    if (activeContactId.startsWith("channel_") && window.PBCOE && window.PBCOE.sendChatMessage && text) {
      try {
        window.PBCOE.sendChatMessage(activeContactId, text);
      } catch(e) {}
    }
  }

  // Automated intelligent mentor replies for personal contacts
  function triggerSimulatedResponse(contactId, userText, userImg) {
    if (!contactId.startsWith("direct_")) return;

    const statusEl = document.getElementById("wa-header-status");
    if (statusEl) {
      statusEl.innerText = "typing...";
      statusEl.classList.add("typing");
    }

    clearTimeout(simulatedTypingTimer);
    simulatedTypingTimer = setTimeout(() => {
      let replyText = "";
      let replyImg = null;

      if (contactId === "direct_kakde") {
        if (userImg) {
          replyText = "Received your circuit schematic image. The Dupont jumper connections between ESP32 3V3/GND and R307 optical sensor match standard ET501T Activity-2 pinouts. Keep it up!";
        } else if (userText.toLowerCase().includes("attendance") || userText.toLowerCase().includes("slot")) {
          replyText = "Hello! Your biometric registration is verified in our database. You can mark attendance once per lecture slot in the attendance portal.";
        } else if (userText.toLowerCase().includes("report") || userText.toLowerCase().includes("activity")) {
          replyText = "Make sure your Activity-2 Embedded Systems report includes the Bill of Materials (₹1,000 cost), FTIR optical physics theory, and Supabase cloud sync architecture.";
        } else {
          replyText = "Understood. Please keep your laboratory records prepared. Let me know if you need any clarification on the 8051 or ESP32 firmware.";
        }
      } else if (contactId === "direct_pokle") {
        if (userImg) {
          replyText = "Thank you for sharing the document/circuit preview. HOD verification has been noted. Please proceed with formal laboratory filing.";
        } else if (userText.toLowerCase().includes("bonafide") || userText.toLowerCase().includes("leave")) {
          replyText = "Official requests must be submitted through the 'Submitted Documents' tab. Once submitted, I will digitally verify and sign your certificate.";
        } else {
          replyText = "Message received. Maintain your attendance above 75% to remain eligible for Semester 5 university examinations.";
        }
      } else {
        replyText = "Hey! Got your message. Let's discuss this during the Embedded Systems lab session in Room 304.";
      }

      const msgs = getStoredMessages();
      if (!msgs[contactId]) msgs[contactId] = [];

      let contact = DEFAULT_CONTACTS.find(c => c.id === contactId);
      const replyMsg = {
        id: "m_reply_" + Date.now(),
        sender_id: contactId,
        sender_name: contact ? contact.name : "Contact",
        sender_role: "faculty",
        text: replyText,
        image: replyImg,
        timestamp: Date.now(),
        status: "read"
      };

      msgs[contactId].push(replyMsg);
      saveStoredMessages(msgs);

      if (activeContactId === contactId) {
        renderActiveChat();
        if (statusEl) {
          statusEl.innerText = "online";
          statusEl.classList.remove("typing");
        }
      }
      renderContactsList();
    }, 1400);
  }

  // Handle Image & Document Attachment
  function handleFileInput(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = function(evt) {
        stagedImage = {
          dataUrl: evt.target.result,
          name: file.name,
          size: (file.size / 1024).toFixed(1) + " KB"
        };
        showAttachmentPreview(stagedImage.name, stagedImage.size, stagedImage.dataUrl);
      };
      reader.readAsDataURL(file);
    } else {
      stagedDoc = {
        name: file.name,
        title: file.name.replace(/\.[^/.]+$/, ""),
        size: (file.size / (1024 * 1024)).toFixed(2) + " MB"
      };
      showAttachmentPreview(stagedDoc.name, stagedDoc.size, null);
    }
  }

  function showAttachmentPreview(name, size, dataUrl) {
    const bar = document.getElementById("wa-attachment-preview");
    const thumb = document.getElementById("wa-attach-thumb");
    const text = document.getElementById("wa-attach-text");
    if (!bar) return;

    bar.style.display = "flex";
    if (thumb) {
      if (dataUrl) {
        thumb.src = dataUrl;
        thumb.style.display = "block";
      } else {
        thumb.style.display = "none";
      }
    }
    if (text) text.innerText = `${name} (${size})`;
  }

  function cancelAttachment() {
    stagedImage = null;
    stagedDoc = null;
    const bar = document.getElementById("wa-attachment-preview");
    const fileInput = document.getElementById("wa-file-input");
    if (bar) bar.style.display = "none";
    if (fileInput) fileInput.value = "";
  }

  // Lightbox Modal
  function openLightbox(imgSrc, caption) {
    const box = document.getElementById("wa-lightbox");
    const img = document.getElementById("wa-lightbox-img");
    const cap = document.getElementById("wa-lightbox-cap");
    if (!box || !img) return;

    img.src = imgSrc;
    if (cap) cap.innerText = decodeURIComponent(caption || "");
    box.style.display = "flex";
  }

  function closeLightbox() {
    const box = document.getElementById("wa-lightbox");
    if (box) box.style.display = "none";
  }

  // Interactive Call Simulator
  function startCall(type) {
    const modal = document.getElementById("wa-call-modal");
    const title = document.getElementById("wa-call-title");
    const avatar = document.getElementById("wa-call-avatar");
    const status = document.getElementById("wa-call-status");
    if (!modal) return;

    let contact = DEFAULT_CONTACTS.find(c => c.id === activeContactId) || DEFAULT_CONTACTS[0];
    if (title) title.innerText = `${type === 'video' ? '📹 Video Call with' : '📞 Voice Call with'} ${contact.name}`;
    if (avatar) avatar.src = contact.avatar;
    if (status) status.innerText = "Ringing institutional terminal...";

    modal.style.display = "flex";

    // Play pleasant calling chime via Web Audio API
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.2);
    } catch(e) {}

    setTimeout(() => {
      if (status) status.innerText = "Connected · PBCOE Secure Encrypted Line (00:03)";
    }, 2500);
  }

  function endCall() {
    const modal = document.getElementById("wa-call-modal");
    if (modal) modal.style.display = "none";
  }

  // Emoji Drawer Toggle
  function toggleEmojiDrawer() {
    const drawer = document.getElementById("wa-emoji-drawer");
    if (!drawer) return;
    drawer.style.display = (drawer.style.display === "flex") ? "none" : "flex";
  }

  function insertEmoji(char) {
    const input = document.getElementById("wa-msg-input");
    if (!input) return;
    input.value += char;
    input.focus();
  }

  // Quick UI Select Contact
  function selectContact(cId) {
    activeContactId = cId;
    const app = document.querySelector(".wa-app");
    if (app) app.classList.add("show-chat"); // for mobile view
    renderContactsList();
    renderActiveChat();
  }

  function backToContacts() {
    const app = document.querySelector(".wa-app");
    if (app) app.classList.remove("show-chat");
  }

  function filterContacts(cat) {
    activeFilter = cat;
    document.querySelectorAll(".wa-filter-chip").forEach(b => {
      b.classList.toggle("active", b.dataset.cat === cat);
    });
    renderContactsList();
  }

  function deleteMessage(contactId, msgId) {
    if (!confirm("Are you sure you want to delete this message?")) return;
    const msgs = getStoredMessages();
    if (msgs[contactId]) {
      msgs[contactId] = msgs[contactId].filter(m => m.id !== msgId);
      saveStoredMessages(msgs);
      renderActiveChat();
      renderContactsList();
    }
  }

  function clearCurrentChat() {
    if (!confirm("Clear all messages in this conversation?")) return;
    const msgs = getStoredMessages();
    msgs[activeContactId] = [];
    saveStoredMessages(msgs);
    renderActiveChat();
    renderContactsList();
  }

  // Expose API
  window.PBCOE_WA = {
    init: function() {
      renderContactsList();
      renderActiveChat();
    },
    selectContact,
    backToContacts,
    filterContacts,
    sendMessage,
    deleteMessage,
    clearCurrentChat,
    handleFileInput,
    cancelAttachment,
    openLightbox,
    closeLightbox,
    startCall,
    endCall,
    toggleEmojiDrawer,
    insertEmoji
  };

  // ================= DOCUMENT VIEWER & VERIFICATION ENGINE =================
  window.PBCOE_DOCS = {
    openViewer: function(docId) {
      const modal = document.getElementById("pbcoe-doc-modal");
      if (!modal) return;

      const docs = JSON.parse(localStorage.getItem("pbcoe_student_docs") || "[]");
      const doc = docs.find((d, idx) => d.id === docId || idx === parseInt(docId, 10)) || docs[0] || {
        title: "Official Embedded Systems Laboratory File",
        type: "Activity-2 Report",
        fileName: "ET501T_Activity_2_Lokhande.pdf",
        date: new Date().toLocaleDateString(),
        status: "VERIFIED (FACULTY SIGNED) ✓",
        prn: "24121227",
        studentName: "Yuvraj Vilas Lokhande"
      };

      document.getElementById("doc-view-title").innerText = doc.title;
      document.getElementById("doc-view-type").innerText = doc.type || "Official Document";
      document.getElementById("doc-view-prn").innerText = `PRN: ${doc.prn || '24121227'} · Candidate: ${doc.studentName || 'Yuvraj Lokhande'}`;
      document.getElementById("doc-view-date").innerText = doc.date || new Date().toLocaleDateString();

      const previewArea = document.getElementById("doc-view-preview");
      if (previewArea) {
        if (doc.fileData && doc.fileData.startsWith("data:image/")) {
          previewArea.innerHTML = `<img src="${doc.fileData}" style="max-width:100%;max-height:420px;border-radius:10px;box-shadow:0 4px 14px rgba(0,0,0,0.4);" alt="Document preview">`;
        } else {
          previewArea.innerHTML = `
            <div style="background:#090d16;border:1px solid rgba(56,189,248,0.25);border-radius:12px;padding:24px;text-align:left;">
              <div style="display:flex;align-items:center;gap:12px;margin-bottom:14px;border-bottom:1px solid rgba(255,255,255,0.08);padding-bottom:12px;">
                <img src="assets/images/pbcoe-round-seal.png" style="width:48px;height:48px;border-radius:50%;background:#fff;padding:2px;">
                <div>
                  <h4 style="margin:0;color:#f8fafc;font-size:1.05rem;">PRIYADARSHINI BHAGWATI COLLEGE OF ENGINEERING</h4>
                  <p style="margin:2px 0 0;font-size:0.75rem;color:#94a3b8;">DEPARTMENT OF ELECTRONICS &amp; TELECOMMUNICATION ENGINEERING · DTE: EN 4177</p>
                </div>
              </div>
              <h3 style="color:#38bdf8;margin:10px 0 6px;">${doc.title}</h3>
              <p style="font-size:0.85rem;color:#cbd5e1;line-height:1.6;">
                <strong>Candidate:</strong> ${doc.studentName || 'YUVRAJ VILAS LOKHANDE'} (PRN: ${doc.prn || '24121227'})<br>
                <strong>Course:</strong> Embedded Systems (ET501T / ET503P) · Semester 5 · NEP 2020<br>
                <strong>Hardware Telemetry:</strong> ESP32 NodeMCU-32S + R307 Optical Sensor + Supabase PostgreSQL
              </p>
              <div style="margin-top:16px;padding:12px;background:rgba(56,189,248,0.06);border-left:3px solid #38bdf8;border-radius:4px;font-size:0.8rem;color:#94a3b8;">
                File Attachment: <code>${doc.fileName || 'Document.pdf'}</code> (${doc.fileSize || 'Standard Lab Record'})
              </div>
            </div>
          `;
        }
      }

      // Digital Seal
      const sealArea = document.getElementById("doc-view-seal");
      if (sealArea) {
        const isVerified = (doc.status || "").includes("VERIFIED") || (doc.status || "").includes("SIGNED");
        if (isVerified) {
          sealArea.innerHTML = `
            <div class="pbcoe-verified-seal">
              <span style="font-size:2rem;">🛡️</span>
              <div>
                <strong style="color:#22c55e;font-size:0.9rem;display:block;">OFFICIALLY DIGITALLY SIGNED &amp; VERIFIED ✓</strong>
                <span style="font-size:0.75rem;color:#94a3b8;">
                  Signatory: <b>${doc.verifiedBy || 'Dr. Pravin B. Pokle (HOD, ETC)'}</b><br>
                  Verification Timestamp: <b>${doc.verifiedAt || new Date().toLocaleString()}</b><br>
                  PBCOE Digital Hash: <code>${doc.verificationRef || 'PBCOE/ETC/2026/DOC-9821'}</code>
                </span>
              </div>
            </div>
          `;
        } else {
          sealArea.innerHTML = `
            <div style="display:inline-flex;align-items:center;gap:12px;border:1.5px dashed #f59e0b;border-radius:12px;padding:12px 18px;background:rgba(245,158,11,0.08);margin-top:16px;">
              <span style="font-size:2rem;">⏳</span>
              <div>
                <strong style="color:#f59e0b;font-size:0.9rem;display:block;">SUBMISSION QUEUED · PENDING FACULTY REVIEW</strong>
                <span style="font-size:0.75rem;color:#94a3b8;">
                  This document has been submitted and is awaiting digital sign-off from HOD / Academic Coordinator.
                </span>
              </div>
            </div>
          `;
        }
      }

      modal.style.display = "flex";
    },

    closeViewer: function() {
      const modal = document.getElementById("pbcoe-doc-modal");
      if (modal) modal.style.display = "none";
    },

    verifyDocument: function(docId) {
      const docs = JSON.parse(localStorage.getItem("pbcoe_student_docs") || "[]");
      const idx = typeof docId === "number" ? docId : docs.findIndex((d, i) => d.id === docId || i === parseInt(docId, 10));
      if (docs[idx]) {
        docs[idx].status = "VERIFIED (FACULTY SIGNED) ✓";
        docs[idx].verifiedBy = "Dr. Pravin B. Pokle (HOD, ETC)";
        docs[idx].verifiedAt = new Date().toLocaleString();
        docs[idx].verificationRef = "PBCOE/ETC/2026/DOC-" + Math.floor(1000 + Math.random() * 9000);
        localStorage.setItem("pbcoe_student_docs", JSON.stringify(docs));
        if (typeof renderFacultyDocs === "function") renderFacultyDocs();
        if (typeof renderStudentDocuments === "function") renderStudentDocuments();
        alert(`Document "${docs[idx].title}" successfully digitally verified and signed!`);
      }
    },

    downloadDocument: function() {
      alert("Preparing official PBCOE digitally stamped certificate/document download...");
      setTimeout(() => {
        const title = document.getElementById("doc-view-title").innerText;
        const blob = new Blob([
          `PRIYADARSHINI BHAGWATI COLLEGE OF ENGINEERING, NAGPUR\nDEPARTMENT OF ELECTRONICS & TELECOMMUNICATION ENGINEERING\n\nOFFICIAL VERIFICATION CERTIFICATE\n--------------------------------------------------\nDocument: ${title}\nVerified by: Dr. Pravin B. Pokle (HOD, ETC)\nDate: ${new Date().toLocaleString()}\nInstitution Affiliation: RTM Nagpur University · AICTE · NAAC 'A+'\nStatus: AUTHENTICATED & DIGITALLY SEALED ✓`
        ], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `PBCOE_${title.replace(/\s+/g, '_')}_Verified.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }, 500);
    }
  };

  // Auto-init on DOMContentLoaded if WhatsApp container exists
  document.addEventListener("DOMContentLoaded", function() {
    if (document.getElementById("wa-contacts-list")) {
      window.PBCOE_WA.init();
    }
  });

})();
