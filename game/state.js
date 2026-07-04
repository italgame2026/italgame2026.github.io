"use strict";

// --- Estado Global del Juego -------------------------------------------------
const state = {
  playerName: "Studente",
  profileComplete: false,
  avatarPreset: "student",
  gender: "female",
  outfit: "#5fa6a7",
  hair: "#3a2418",
  skin: "#d8a079",
  score: 0,
  energy: 100,
  streak: 0,
  completed: {},
  vocabTracking: {},
  learningMetrics: {
    A1: { correct: 0, wrong: 0, time: 0 },
    A2: { correct: 0, wrong: 0, time: 0 },
    B1: { correct: 0, wrong: 0, time: 0 }
  },
  activeEffects: {},
  dialogueTurn: 0,
  activeMission: null,
  inDialogue: false,
  inVocabPhase: false,
  vocabSeen: false,
  musicMuted: false,
  musicTrack: 0,
  musicVolume: 0.15,
  selectedTrack: 0,
  hairStyle: "short",
  bodyType: "average",
  topStyle: "tshirt",
  pantsStyle: "jeans",
  shoeStyle: "sneakers",
  topColor: "#5fa6a7",
  pantsColor: "#2f3740",
  shoeColor: "#3a2b25"
};
window.state = state;

function saveState() {
  localStorage.setItem("italgame_state_v1", JSON.stringify(state));
}

function loadState() {
  try {
    const saved = localStorage.getItem("italgame_state_v1");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.playerName) state.playerName = parsed.playerName;
      if (parsed.profileComplete !== undefined) state.profileComplete = !!parsed.profileComplete;
      if (parsed.avatarPreset) state.avatarPreset = parsed.avatarPreset;
      if (parsed.gender) state.gender = parsed.gender;
      if (parsed.outfit) state.outfit = parsed.outfit;
      if (parsed.hair) state.hair = parsed.hair;
      if (parsed.skin) state.skin = parsed.skin;
      if (parsed.score !== undefined) state.score = parsed.score;
      if (parsed.energy !== undefined) state.energy = parsed.energy;
      if (parsed.streak !== undefined) state.streak = parsed.streak;
      if (parsed.completed) state.completed = parsed.completed;
      if (parsed.vocabTracking) state.vocabTracking = parsed.vocabTracking;
      if (parsed.learningMetrics) {
        Object.keys(parsed.learningMetrics).forEach(k => {
          if (state.learningMetrics[k]) {
            state.learningMetrics[k] = { ...state.learningMetrics[k], ...parsed.learningMetrics[k] };
          }
        });
      }
      if (parsed.activeEffects) state.activeEffects = parsed.activeEffects;
      if (parsed.musicMuted !== undefined) state.musicMuted = parsed.musicMuted;
      if (parsed.musicVolume !== undefined) state.musicVolume = parsed.musicVolume;
      if (parsed.selectedTrack !== undefined) state.selectedTrack = parsed.selectedTrack;
      if (parsed.hairStyle) state.hairStyle = parsed.hairStyle;
      if (parsed.bodyType) state.bodyType = parsed.bodyType;
      if (parsed.topStyle) state.topStyle = parsed.topStyle;
      if (parsed.pantsStyle) state.pantsStyle = parsed.pantsStyle;
      if (parsed.shoeStyle) state.shoeStyle = parsed.shoeStyle;
      if (parsed.topColor) state.topColor = parsed.topColor;
      if (parsed.pantsColor) state.pantsColor = parsed.pantsColor;
      if (parsed.shoeColor) state.shoeColor = parsed.shoeColor;
    }
  } catch (e) {
    console.error("Error al cargar el estado:", e);
  }
}

function updateGameHUD() {
  const hud = document.getElementById("hud");
  if (hud) {
    let extras = "";
    if (state.activeEffects.speedBoost && state.activeEffects.speedBoost > Date.now()) {
      const secs = Math.ceil((state.activeEffects.speedBoost - Date.now()) / 1000);
      extras += `<span style="color: #4cd964; font-size: 11px; display: block; margin-top: 2px;">⚡ Caffè attivo: ${secs}s</span>`;
    }
    if (state.activeEffects.doublePoints) {
      extras += `<span style="color: #f2b84b; font-size: 11px; display: block; margin-top: 2px;">🎯 Punti doppi attivi</span>`;
    }
    if (state.activeEffects.streakProtect) {
      extras += `<span style="color: #ff9f43; font-size: 11px; display: block; margin-top: 2px;">🛡️ Protezione striscia</span>`;
    }
    hud.innerHTML = `
      <span class="tag">italgame · v0.1 prototipo</span>
      <h1><span id="scoreDisplay">${state.playerName}: ${state.score} pt</span> | <span id="energyDisplay">Energia: ${state.energy}%</span></h1>
      <p style="margin-top: 6px; font-weight: 500; color: #f2b84b; margin-bottom: 0;">
        <span id="streakDisplay">Striscia (Racha): ${state.streak} 🔥</span>
      </p>
      ${extras}
      <p style="margin-top: 4px; font-size: 12px; color: #a69886; line-height: 1.4; margin-bottom: 0;">
        <kbd>WASD</kbd>/<kbd>Flechas</kbd> moverse ·
        <kbd>Shift</kbd> correr · <kbd>Space</kbd> saltar · <kbd>Ctrl</kbd> agacharse · <kbd>V</kbd> cámara · <kbd>E</kbd> interactuar
      </p>
    `;
  }
}

// --- Text-to-Speech (TTS) de Italiano -----------------------------------------
let ttsVoicesReady = false;
let ttsActive = false;
if (window.speechSynthesis) {
  window.speechSynthesis.addEventListener("voiceschanged", () => {
    ttsVoicesReady = window.speechSynthesis.getVoices().length > 0;
  });
  if (window.speechSynthesis.getVoices().length > 0) ttsVoicesReady = true;
}

function showSubtitle(text) {
  // Desactivado: el diálogo ya muestra todo el texto en pantalla y este cuadro negro es redundante
  return;
}

function speakItalian(text) {
  showSubtitle(text);
  if (!window.speechSynthesis) return;
  try { window.speechSynthesis.cancel(); } catch(e) {}
  ttsActive = false;

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.85;
  utterance.lang = "it-IT";
  utterance.onstart = () => { ttsActive = true; };
  utterance.onend = () => { ttsActive = false; };
  utterance.onerror = () => { ttsActive = false; };

  if (ttsVoicesReady) {
    const voices = window.speechSynthesis.getVoices();
    const itVoice = voices.find(v => v.lang.startsWith("it"));
    if (itVoice) utterance.voice = itVoice;
  }

  try { window.speechSynthesis.speak(utterance); } catch(e) {}
}

function speakItalianSequence(texts) {
  if (!window.speechSynthesis || !Array.isArray(texts)) return;
  const cleanTexts = texts.map(text => String(text || "").trim()).filter(Boolean);
  if (cleanTexts.length === 0) return;

  try { window.speechSynthesis.cancel(); } catch(e) {}
  ttsActive = false;
  let remaining = cleanTexts.length;

  cleanTexts.forEach(text => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.85;
    utterance.lang = "it-IT";
    utterance.onstart = () => { ttsActive = true; };
    const markDone = () => {
      remaining--;
      if (remaining <= 0) ttsActive = false;
    };
    utterance.onend = markDone;
    utterance.onerror = markDone;

    if (ttsVoicesReady) {
      const voices = window.speechSynthesis.getVoices();
      const itVoice = voices.find(v => v.lang.startsWith("it"));
      if (itVoice) utterance.voice = itVoice;
    }

    try { window.speechSynthesis.speak(utterance); } catch(e) {}
  });
}

function stopItalianSpeech() {
  if (!window.speechSynthesis) return false;
  const wasSpeaking = ttsActive || window.speechSynthesis.speaking || window.speechSynthesis.pending;
  try { window.speechSynthesis.cancel(); } catch(e) {}
  ttsActive = false;
  return !!wasSpeaking;
}

// --- Pantalla inicial de perfil/avatar ---------------------------------------
function showProfileSetup() {
  const panel = document.getElementById("dialogue-panel");
  const speaker = document.getElementById("dialogue-speaker");
  const speakerRole = document.getElementById("dialogue-speaker-role");
  const avatarChar = document.getElementById("dialogue-avatar-char");
  const dialogueText = document.getElementById("dialogue-text");
  const optionsContainer = document.getElementById("dialogue-options");
  const feedbackPanel = document.getElementById("dialogue-feedback");
  const playAllBtn = document.getElementById("dialoguePlayAllBtn");
  const translateAllBtn = document.getElementById("dialogueTranslateAllBtn");
  const speakDialogueBtn = document.getElementById("speakDialogueBtn");
  const translateDialogueBtn = document.getElementById("translateDialogueBtn");

  if (!panel || !dialogueText || !optionsContainer) return;

  state.inDialogue = true;
  speaker.textContent = "Crea tu estudiante";
  speakerRole.textContent = "Perfil inicial";
  avatarChar.textContent = (state.playerName || "S").charAt(0).toUpperCase();
  if (feedbackPanel) feedbackPanel.style.display = "none";
  if (playAllBtn) playAllBtn.style.display = "none";
  if (translateAllBtn) translateAllBtn.style.display = "none";
  if (speakDialogueBtn) speakDialogueBtn.style.display = "none";
  if (translateDialogueBtn) translateDialogueBtn.style.display = "none";
  panel.style.display = "flex";

  const presets = [
    { id: "student", label: "Studente", outfit: "#5fa6a7", hair: "#3a2418", skin: "#d8a079", gender: "female" },
    { id: "traveler", label: "Viaggiatore", outfit: "#8f6f3f", hair: "#1f1b18", skin: "#c98b62", gender: "male" },
    { id: "artist", label: "Artista", outfit: "#8b4fb3", hair: "#5a3523", skin: "#e1b28f", gender: "female" }
  ];
  const currentPreset = presets.find(p => p.id === state.avatarPreset) || presets[0];

  dialogueText.innerHTML = `
    <div class="profile-setup">
      <label class="profile-field">
        <span>Nombre</span>
        <input id="profileNameInput" type="text" maxlength="18" value="${escapeHtml(state.playerName || "")}" autocomplete="off">
      </label>
      <div class="profile-avatar-grid" role="group" aria-label="Selecciona avatar">
        ${presets.map(p => `
          <button type="button" class="profile-avatar-choice${p.id === currentPreset.id ? " active" : ""}" data-avatar="${p.id}">
            <span class="profile-avatar-preview" style="background:${p.outfit}; color:${p.skin}; --hair:${p.hair};">${p.label.charAt(0)}</span>
            <span>${p.label}</span>
          </button>
        `).join("")}
      </div>
    </div>
  `;

  optionsContainer.innerHTML = "";
  const beginBtn = document.createElement("button");
  beginBtn.className = "dialogue-option";
  beginBtn.style.opacity = "1";
  beginBtn.style.animation = "none";
  beginBtn.innerHTML = `<span class="option-marker">↵</span><span class="option-text" style="font-weight: 700; color: #f2b84b;">Entrar a Italgame</span>`;
  beginBtn.onclick = () => {
    const input = document.getElementById("profileNameInput");
    const selected = document.querySelector(".profile-avatar-choice.active")?.dataset.avatar || "student";
    const preset = presets.find(p => p.id === selected) || presets[0];
    const name = (input?.value || "").trim();
    state.playerName = name || "Studente";
    state.avatarPreset = preset.id;
    state.gender = preset.gender;
    state.outfit = preset.outfit;
    state.hair = preset.hair;
    state.skin = preset.skin;
    state.profileComplete = true;
    state.inDialogue = false;
    saveState();
    updateGameHUD();
    panel.style.display = "none";
    showWelcome();
  };
  optionsContainer.appendChild(beginBtn);

  document.querySelectorAll(".profile-avatar-choice").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".profile-avatar-choice").forEach(item => item.classList.remove("active"));
      btn.classList.add("active");
      avatarChar.textContent = btn.textContent.trim().charAt(0).toUpperCase();
    });
  });

  const input = document.getElementById("profileNameInput");
  if (input) {
    input.focus();
    input.select();
    input.addEventListener("input", () => {
      avatarChar.textContent = (input.value.trim() || "S").charAt(0).toUpperCase();
    });
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        beginBtn.click();
      }
    });
  }
}

// --- Narrativa de bienvenida ------------------------------------------------
function showWelcome() {
  if (!state.profileComplete) {
    showProfileSetup();
    return;
  }
  if (localStorage.getItem("italgame_welcome_seen")) return;
  localStorage.setItem("italgame_welcome_seen", "1");
  state.inDialogue = true;
  const panel = document.getElementById("dialogue-panel");
  const speaker = document.getElementById("dialogue-speaker");
  const speakerRole = document.getElementById("dialogue-speaker-role");
  const avatarChar = document.getElementById("dialogue-avatar-char");
  const dialogueText = document.getElementById("dialogue-text");
  const optionsContainer = document.getElementById("dialogue-options");
  const feedbackPanel = document.getElementById("dialogue-feedback");
  const playAllBtn = document.getElementById("dialoguePlayAllBtn");
  const translateAllBtn = document.getElementById("dialogueTranslateAllBtn");
  const speakDialogueBtn = document.getElementById("speakDialogueBtn");
  const translateDialogueBtn = document.getElementById("translateDialogueBtn");
  speaker.textContent = "Benvenuto in Italia!";
  speakerRole.textContent = "Guida Turistica";
  avatarChar.textContent = "G";
  feedbackPanel.style.display = "none";
  if (playAllBtn) playAllBtn.style.display = "none";
  if (translateAllBtn) translateAllBtn.style.display = "none";
  if (speakDialogueBtn) speakDialogueBtn.style.display = "none";
  if (translateDialogueBtn) translateDialogueBtn.style.display = "none";
  panel.style.display = "flex";
  dialogueText.innerHTML = `
    <div style="margin-bottom:12px;"><strong style="color:#f2b84b;">Benvenuto a Italgame!</strong></div>
    <div style="color:#d8cdb8; line-height:1.6;">
      Sei appena arrivato in Italia per un viaggio studio. La citt&agrave; &egrave; piena di
      <strong style="color:#f8f1df;">20 missioni</strong> che ti aiuteranno a imparare l'italiano.<br><br>
      Parla con i personaggi che incontri (<kbd>E</kbd>), ordina al caff&egrave;, compra al mercato...
      Ogni conversazione &egrave; una lezione!<br><br>
      <span style="color:#a69886; font-size:13px;">
        🎯 Obiettivo: Completa tutte le missioni!<br>
        ⚡ Energia: si ricarica con le risposte corrette<br>
        🔥 Striscia: mantieni la serie per bonus<br>
        🏃 <kbd>Space</kbd> saltar · <kbd>Ctrl</kbd> agacharse
      </span>
    </div>
  `;
  optionsContainer.innerHTML = "";
  const btn = document.createElement("button");
  btn.className = "dialogue-option";
  btn.style.opacity = "1";
  btn.style.animation = "none";
  btn.innerHTML = "<span class=\"option-marker\">▶</span><span class=\"option-text\" style=\"font-weight:700;\">Inizia l'avventura!</span>";
  btn.onclick = () => {
    panel.style.display = "none";
    state.inDialogue = false;
  };
  optionsContainer.appendChild(btn);
}

window.speakItalian = speakItalian;
window.speakItalianSequence = speakItalianSequence;
window.stopItalianSpeech = stopItalianSpeech;
window.showProfileSetup = showProfileSetup;
window.updateGameHUD = updateGameHUD;
