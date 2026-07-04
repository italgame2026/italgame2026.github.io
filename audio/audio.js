"use strict";

var audioCtx = null;
var bgAudio = null, bgIndex = 0, bgFileActive = false;
var ambientGainNode = null, ambientTimeout = null, currentTrackId = null;
var zoneSoundTimer = 0;
var isFirstTrack = true;

var MUSIC_TRACKS = [
  {name:"Passeggiata Tranquilla",tempo:3000,type:"sine",chords:[[220,261.6,329.6],[261.6,329.6,392],[196,246.9,293.7],[174.6,220,261.6]],volume:0.08},
  {name:"Tarantella del Sud",tempo:1800,type:"triangle",chords:[[146.8,174.6,220],[220,277.2,329.6],[196,233.1,293.7],[146.8,174.6,220]],volume:0.10},
  {name:"Serenata Veneziana",tempo:2800,type:"sine",chords:[[261.6,329.6,392,493.9],[349.2,440,523.3,659.3],[392,493.9,587.3,698.5],[261.6,329.6,392,493.9]],volume:0.08},
  {name:"Mattina a Firenze",tempo:2500,type:"sine",chords:[[261.6,329.6,392],[220,261.6,329.6],[174.6,220,261.6],[196,246.9,293.7]],volume:0.08},
  {name:"Notte Romana",tempo:3500,type:"sine",chords:[[261.6,311.1,392],[349.2,415.3,523.3],[392,466.2,587.3],[415.3,523.3,659.3]],volume:0.06},
  {name:"Festa Napoletana",tempo:2000,type:"triangle",chords:[[196,246.9,293.7],[261.6,329.6,392],[293.7,370,440,523.3],[196,246.9,293.7]],volume:0.10},
  {name:"Valzer Siciliano",tempo:2500,type:"sine",chords:[[146.8,174.6,220],[220,277.2,329.6],[196,233.1,293.7],[220,277.2,329.6]],volume:0.07},
  {name:"Tramonto Toscano",tempo:4000,type:"sine",chords:[[261.6,293.7,392],[196,261.6,293.7],[293.7,392,440],[261.6,293.7,392]],volume:0.05}
];

var FILE_TRACKS = [
  {name:"Tramonto sulla Piazza", src:"audio/tracks/tramonto.mp3"},
  {name:"Caffè al Sole", src:"audio/tracks/caffe.mp3"},
  {name:"Sunlight on Terracotta", src:"audio/tracks/terracotta.mp3"},
  {name:"Steps on Cobblestone", src:"audio/tracks/steps.mp3"},
  {name:"Bella Ciao", src:"audio/musica/bella-ciao.mp3"},
  {name:"L'Italiano — Toto Cutugno", src:"audio/musica/litaliano-toto-cutugno.mp3"},
  {name:"Che La Luna Mezzo Mare", src:"audio/musica/che-la-luna-mezzo-mare.mp3"},
  {name:"Tarantella Tradizionale", src:"audio/musica/tarantella-tradizionale.mp3"},
  {name:"Tu Vuò Fà L'Americano", src:"audio/musica/tu-vuo-fa-lamericano.mp3"},
  {name:"Volare (Nel Blu Dipinto Di Blu)", src:"audio/musica/volare.mp3"}
];

function getAudioCtx() {
  if (!audioCtx) try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {}
  return audioCtx;
}

function resumeAudioCtx() {
  if (audioCtx && audioCtx.state === "suspended") audioCtx.resume();
}

function playTone(freq, duration, type, volume) {
  type = type || "sine";
  volume = volume || 0.3;
  var ctx = getAudioCtx();
  if (!ctx) return;
  resumeAudioCtx();
  var osc = ctx.createOscillator(), gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(volume, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + duration);
}

function sfxCorrect() { playTone(523, 0.12); setTimeout(function() { playTone(659, 0.12); }, 100); setTimeout(function() { playTone(784, 0.2); }, 200); }
function sfxWrong() { playTone(311, 0.3, "sawtooth", 0.2); setTimeout(function() { playTone(233, 0.4, "sawtooth", 0.15); }, 150); }
function sfxStep() { playTone(80 + Math.random() * 40, 0.08, "triangle", 0.1); }
function sfxReward() { [523, 659, 784, 1047].forEach(function(f, i) { setTimeout(function() { playTone(f, 0.15, "sine", 0.25); }, i * 120); }); }
function sfxLevelUp() { [440, 494, 523, 587, 659, 698, 784, 880].forEach(function(f, i) { setTimeout(function() { playTone(f, 0.12, "sine", 0.2); }, i * 80); }); }

function getTargetVolume() {
  if (!window.state || state.musicMuted) return 0;
  var base = state.musicVolume !== undefined ? state.musicVolume : 0.15;
  return state.musicDucked ? base * 0.22 : base;
}

function updateMusicVolume() {
  var duck = (window.state && state.musicDucked) ? 0.22 : 1;
  if (bgAudio) {
    if (isFirstTrack && !state.musicMuted) {
      bgAudio.volume = 0.35 * duck;
    } else {
      bgAudio.volume = getTargetVolume();
    }
  }
  if (ambientGainNode) {
    var ti = window.state ? (state.musicTrack || 0) : 0;
    var baseVol = (MUSIC_TRACKS[ti] || {volume:0.08}).volume;
    var userVol = getTargetVolume();
    var scale = userVol / 0.15;
    if (isFirstTrack && !state.musicMuted) {
      ambientGainNode.gain.value = baseVol * (0.35 / 0.15) * duck;
    } else {
      ambientGainNode.gain.value = baseVol * scale;
    }
  }
}

// Atenúa (duck) la música mientras hay un diálogo abierto y la restaura al cerrar.
function setMusicDucked(on) {
  if (window.state) state.musicDucked = !!on;
  updateMusicVolume();
}
window.setMusicDucked = setMusicDucked;

function fileVolume() {
  if (window.state && state.musicMuted) return 0;
  var duck = (window.state && state.musicDucked) ? 0.22 : 1;
  if (isFirstTrack) return 0.35 * duck;
  return getTargetVolume();
}

function startBackgroundMusic() {
  try {
    if (!bgAudio) {
      bgAudio = new Audio();
      bgAudio.addEventListener("ended", function() {
        isFirstTrack = false;
        bgIndex = (bgIndex + 1) % FILE_TRACKS.length;
        bgAudio.src = FILE_TRACKS[bgIndex].src;
        updateMusicVolume();
        bgAudio.play().catch(function(){});
      });
      bgAudio.addEventListener("timeupdate", function() {
        if (isFirstTrack && bgAudio.duration && bgAudio.currentTime > bgAudio.duration - 8) {
          var remaining = bgAudio.duration - bgAudio.currentTime;
          var targetVol = getTargetVolume();
          if (remaining > 0 && remaining <= 8) {
            var factor = remaining / 8; // 1 to 0
            var currentVolRange = 0.35 - targetVol;
            bgAudio.volume = targetVol + (currentVolRange * factor);
          } else {
            bgAudio.volume = targetVol;
            isFirstTrack = false;
          }
        }
      });
      bgAudio.addEventListener("error", function() {
        if (!bgFileActive) startAmbientMusic();
      });
      bgAudio.src = FILE_TRACKS[bgIndex].src;
    }
    bgAudio.volume = fileVolume();
    var pr = bgAudio.play();
    if (pr && pr.then) pr.then(function(){bgFileActive=true;}).catch(function(){});
    else bgFileActive = true;
  } catch(e) { startAmbientMusic(); }
}

function startAmbientMusic() {
  var ctx = getAudioCtx();
  if (!ctx) return;
  resumeAudioCtx();
  if (ambientGainNode) { ambientGainNode = null; clearTimeout(ambientTimeout); }
  var ti = window.state ? (state.musicTrack || 0) : 0;
  var track = MUSIC_TRACKS[ti];
  if (!track) return;
  currentTrackId = ti;
  ambientGainNode = ctx.createGain();
  var userVol = getTargetVolume();
  var scale = userVol / 0.15;
  ambientGainNode.gain.value = (window.state && state.musicMuted) ? 0 : (isFirstTrack ? track.volume * (0.35 / 0.15) : track.volume * scale);
  ambientGainNode.connect(ctx.destination);
  var chordIdx = 0;
  function playChord() {
    if (!ambientGainNode || currentTrackId !== ti) return;
    var chord = track.chords[chordIdx % track.chords.length];
    chord.forEach(function(freq) {
      var o = ctx.createOscillator(), g = ctx.createGain();
      o.type = track.type;
      o.frequency.value = freq;
      g.gain.setValueAtTime(0.3, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + (track.tempo - 200) / 1000);
      o.connect(g);
      g.connect(ambientGainNode);
      o.start();
      o.stop(ctx.currentTime + track.tempo / 1000 + 0.05);
    });
    chordIdx++;
    ambientTimeout = setTimeout(playChord, track.tempo);
  }
  playChord();
}

function playTrackByIndex(idx) {
  if (idx < 0 || idx >= FILE_TRACKS.length) return;
  bgIndex = idx;
  isFirstTrack = false;
  if (window.state) {
    state.selectedTrack = idx;
    state.musicMuted = false;
    if (typeof saveState === "function") saveState();
  }
  if (!bgAudio) {
    startBackgroundMusic();
  }
  bgAudio.src = FILE_TRACKS[idx].src;
  bgAudio.volume = getTargetVolume();
  bgAudio.play().catch(function(){});
  bgFileActive = true;
  var btn = document.getElementById("musicToggle");
  if (btn) btn.textContent = "🎵";
  updateMusicSelectorUI();
}

function updateMusicSelectorUI() {
  var items = document.querySelectorAll(".music-track-item");
  items.forEach(function(item) {
    var idx = parseInt(item.getAttribute("data-track-idx"));
    if (idx === bgIndex && bgFileActive && bgAudio && !bgAudio.paused) {
      item.classList.add("playing");
    } else {
      item.classList.remove("playing");
    }
  });
}

function initAudio() {
  var ctx = getAudioCtx();
  if (!ctx) return;
  resumeAudioCtx();
  if (window.state && state.selectedTrack !== undefined && state.selectedTrack >= 0 && state.selectedTrack < FILE_TRACKS.length) {
    bgIndex = state.selectedTrack;
  }
  try { startBackgroundMusic(); } catch(e) { startAmbientMusic(); }
}

function toggleMusicMute() {
  if (!window.state) return;
  state.musicMuted = !state.musicMuted;
  if (typeof saveState === "function") saveState();
  updateMusicVolume();
  var btn = document.getElementById("musicToggle");
  if (btn) btn.textContent = state.musicMuted ? "🔇" : "🎵";
  var slider = document.getElementById("volumeSlider");
  if (slider) {
    slider.value = state.musicMuted ? 0 : (state.musicVolume !== undefined ? state.musicVolume : 0.15);
  }
}

// Inicialización de la interfaz del deslizador de volumen
(function initVolumeUI() {
  var onStart = function() {
    var volumeBtn = document.getElementById("volumeBtn");
    var volumeSliderContainer = document.getElementById("volumeSliderContainer");
    var volumeSlider = document.getElementById("volumeSlider");
    if (!volumeBtn || !volumeSlider) return;

    volumeBtn.addEventListener("click", function(e) {
      e.stopPropagation();
      var isNone = volumeSliderContainer.style.display === "none" || volumeSliderContainer.style.display === "";
      volumeSliderContainer.style.display = isNone ? "flex" : "none";
    });

    document.addEventListener("click", function(e) {
      if (volumeSliderContainer.style.display === "flex" && !volumeSliderContainer.contains(e.target) && e.target !== volumeBtn) {
        volumeSliderContainer.style.display = "none";
      }
    });

    volumeSlider.addEventListener("input", function() {
      var val = parseFloat(volumeSlider.value);
      if (window.state) {
        state.musicVolume = val;
        if (val > 0) {
          state.musicMuted = false;
        } else {
          state.musicMuted = true;
        }
        if (typeof saveState === "function") saveState();
        var btn = document.getElementById("musicToggle");
        if (btn) btn.textContent = state.musicMuted ? "🔇" : "🎵";
      }
      isFirstTrack = false; // El usuario toma control, cancelamos la excepción de la primera pista
      updateMusicVolume();
    });

    if (window.state && state.musicVolume !== undefined) {
      volumeSlider.value = state.musicVolume;
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", onStart);
  } else {
    onStart();
  }
})();

// --- Music Selector UI ---
(function initMusicSelector() {
  function setup() {
    var btn = document.getElementById("musicSelectBtn");
    var panel = document.getElementById("musicSelector");
    var overlay = document.getElementById("musicSelectorOverlay");
    var closeBtn = document.getElementById("musicSelectorClose");
    var list = document.getElementById("musicTrackList");
    if (!btn || !panel || !list) return;

    function buildList() {
      list.innerHTML = "";
      FILE_TRACKS.forEach(function(t, i) {
        var item = document.createElement("div");
        item.className = "music-track-item";
        item.setAttribute("data-track-idx", i);
        var playing = (i === bgIndex && bgFileActive && bgAudio && !bgAudio.paused);
        if (playing) item.classList.add("playing");
        item.innerHTML = '<span class="track-num">' + (playing ? "♪" : (i + 1)) + '</span>' +
          '<span class="track-name">' + t.name + '</span>';
        item.addEventListener("click", function() {
          playTrackByIndex(i);
          buildList();
        });
        list.appendChild(item);
      });
    }

    function openSelector() {
      buildList();
      panel.style.display = "block";
      overlay.style.display = "block";
      if (typeof window.registerModal === "function") window.registerModal("music", closeSelector);
    }

    function closeSelector() {
      panel.style.display = "none";
      overlay.style.display = "none";
      if (typeof window.unregisterModal === "function") window.unregisterModal("music");
    }

    btn.addEventListener("click", openSelector);
    if (closeBtn) closeBtn.addEventListener("click", closeSelector);
    if (overlay) overlay.addEventListener("click", closeSelector);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setup);
  } else {
    setup();
  }
})();

function getPlayerZone(px, pz) {
  if (Math.abs(px) < 6 && Math.abs(pz) < 6) return "plaza";
  if (Math.hypot(px - 8.2, pz + 9.4) < 6) return "cafe";
  if (Math.hypot(px + 8.5, pz + 11.6) < 6) return "panetteria";
  if (Math.hypot(px + 15.6, pz - 1.4) < 6) return "mercato";
  if (Math.hypot(px + 19.8, pz - 16.2) < 6) return "stazione";
  if (Math.hypot(px - 22.5, pz + 18.2) < 6) return "ristorante";
  if (Math.hypot(px + 3.2, pz + 24.5) < 6) return "parco";
  if (Math.hypot(px - 30, pz - 24) < 6) return "spiaggia";
  return "strada";
}

function playZoneSound(px, pz) {
  var ctx = getAudioCtx();
  if (!ctx || zoneSoundTimer > performance.now()) return;
  resumeAudioCtx();
  var zone = getPlayerZone(px, pz);
  if (zone === "plaza") {
    playTone(220 + Math.random() * 80, 0.8, "triangle", 0.04);
    zoneSoundTimer = performance.now() + 3000;
  } else if (zone === "cafe") {
    playTone(1800 + Math.random() * 200, 0.15, "square", 0.02);
    zoneSoundTimer = performance.now() + 2500;
  } else if (zone === "parco") {
    playTone(800 + Math.random() * 600, 0.2, "sine", 0.03);
    zoneSoundTimer = performance.now() + 2000;
  } else if (zone === "spiaggia") {
    playTone(100 + Math.random() * 100, 0.6, "triangle", 0.05);
    zoneSoundTimer = performance.now() + 3500;
  } else if (zone === "ristorante") {
    playTone(300 + Math.random() * 100, 0.12, "square", 0.02);
    zoneSoundTimer = performance.now() + 2800;
  } else if (zone === "stazione") {
    playTone(440, 0.3, "square", 0.03);
    zoneSoundTimer = performance.now() + 4000;
  } else if (zone === "mercato") {
    playTone(200 + Math.random() * 100, 0.1, "triangle", 0.03);
    zoneSoundTimer = performance.now() + 3000;
  } else if (zone === "panetteria") {
    playTone(160 + Math.random() * 40, 0.5, "sine", 0.03);
    zoneSoundTimer = performance.now() + 3500;
  } else if (zone === "strada") {
    playTone(300 + Math.random() * 200, 0.15, "triangle", 0.015);
    zoneSoundTimer = performance.now() + 5000;
  }
}
