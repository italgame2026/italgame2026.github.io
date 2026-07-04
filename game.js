"use strict";

// ============================================================================
// italgame v0.5 — Track 1: Identidad italiana auténtica
// Mejoras: Borgo toscano con piazza, campanile, iglesia, vicoli, cipreses,
// pinos paraguas, Vespa, mesas de café, texturas PBR estuco/terracota/travertino
// ============================================================================

const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });

const loadingEl = document.getElementById("loading");
const loadingText = document.getElementById("loadingText");
const shadowToggle = document.getElementById("shadowToggle");
const VISUAL_SETTINGS_KEY = "italgame_visual_settings_v1";

function getDefaultShadowSetting() {
  return !(window.matchMedia && window.matchMedia("(pointer: coarse)").matches);
}

function loadVisualSettings() {
  try {
    const saved = localStorage.getItem(VISUAL_SETTINGS_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return { shadows: parsed.shadows !== undefined ? !!parsed.shadows : getDefaultShadowSetting() };
    }
  } catch (e) {
    console.warn("No se pudo cargar la configuración visual:", e);
  }
  return { shadows: getDefaultShadowSetting() };
}

function saveVisualSettings() {
  try {
    localStorage.setItem(VISUAL_SETTINGS_KEY, JSON.stringify(visualSettings));
  } catch (e) {
    console.warn("No se pudo guardar la configuración visual:", e);
  }
}

const visualSettings = loadVisualSettings();

// Elemento UI de proximidad flotante
const proximityUI = document.createElement("div");
proximityUI.id = "proximityUI";
proximityUI.style.position = "fixed";
proximityUI.style.bottom = "24px";
proximityUI.style.left = "50%";
proximityUI.style.transform = "translateX(-50%)";
proximityUI.style.background = "rgba(26, 20, 16, 0.92)";
proximityUI.style.color = "#f8f1df";
proximityUI.style.padding = "14px 28px";
proximityUI.style.borderRadius = "12px";
proximityUI.style.border = "2px solid #f2b84b";
proximityUI.style.fontFamily = "system-ui, -apple-system, sans-serif";
proximityUI.style.fontSize = "16px";
proximityUI.style.textAlign = "center";
proximityUI.style.pointerEvents = "none";
proximityUI.style.display = "none";
proximityUI.style.boxShadow = "0 8px 30px rgba(0,0,0,0.6)";
proximityUI.style.zIndex = "100";
proximityUI.style.transition = "opacity 0.2s ease";
document.body.appendChild(proximityUI);

// --- Input compartido (teclado + táctil) -----------------------------------
const input = { x: 0, z: 0, run: false, jump: false, crouch: false };
const keys = new Set();
let nearestNpcGlobal = null;
const movementKeys = new Set(["w", "a", "s", "d", "arrowup", "arrowdown", "arrowleft", "arrowright", "shift", " ", "control"]);

function isTypingTarget(target) {
  if (!target || !target.tagName) return false;
  return ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName) || target.isContentEditable;
}

window.addEventListener("keydown", (e) => {
  if (isTypingTarget(e.target)) return;
  const key = e.key.toLowerCase();
  if (movementKeys.has(key)) {
    e.preventDefault();
  }
  keys.add(key);

  if ((key === "e" || key === "enter") && !state.inDialogue && nearestNpcGlobal) {
    openDialogue(nearestNpcGlobal.mission);
  }
  
  // Emotes del jugador (A5)
  if ((key === "1" || key === "2" || key === "3" || key === "4" || key === "f") && !state.inDialogue && !playerState.isJumping && playerState.moveSpeed === 0) {
    if (key === "1" || key === "f") playEmote(emotes.wave);
    if (key === "2") playEmote(emotes.yes);
    if (key === "3") playEmote(emotes.no);
    if (key === "4") playEmote(emotes.cheer);
  }
});
window.addEventListener("keyup", (e) => { keys.delete(e.key.toLowerCase()); });

function readKeyboard() {
  if (state.inDialogue) {
    input.x = 0;
    input.z = 0;
    input.run = false;
    input.jump = false;
    input.crouch = false;
    return;
  }
  let x = 0, z = 0;
  if (keys.has("w") || keys.has("arrowup")) z += 1;
  if (keys.has("s") || keys.has("arrowdown")) z -= 1;
  if (keys.has("d") || keys.has("arrowright")) x += 1;
  if (keys.has("a") || keys.has("arrowleft")) x -= 1;

  if (x !== 0 || z !== 0) {
    input.x = x;
    input.z = z;
    input.run = keys.has("shift");
  } else if (!touchActive) {
    input.x = 0;
    input.z = 0;
    input.run = false;
  }

  input.jump = keys.has(" ");
  input.crouch = keys.has("control");
}

// --- Mando táctil para móvil ------------------------------------------------
let touchActive = false;
(function setupTouch() {
  const pad = document.getElementById("touchPad");
  const nub = document.getElementById("touchNub");
  if (!pad || !nub) {
    console.warn("Mando táctil no encontrado; se omite setupTouch.");
    return;
  }
  let id = null;
  const R = 35;
  function set(cx, cy) {
    if (state.inDialogue) {
      reset();
      return;
    }
    const r = pad.getBoundingClientRect();
    let dx = cx - (r.left + r.width / 2);
    let dy = cy - (r.top + r.height / 2);
    const len = Math.hypot(dx, dy) || 1;
    const cl = Math.min(R, len);
    dx = (dx / len) * cl; dy = (dy / len) * cl;
    nub.style.transform = `translate(${dx}px, ${dy}px)`;
    input.x = dx / R; input.z = -dy / R;
    input.run = (Math.hypot(dx, dy) / R) > 0.85;
  }
  function reset() { touchActive = false; nub.style.transform = "translate(0,0)"; input.x = 0; input.z = 0; input.run = false; }
  pad.addEventListener("pointerdown", (e) => { touchActive = true; id = e.pointerId; pad.setPointerCapture(id); set(e.clientX, e.clientY); });
  pad.addEventListener("pointermove", (e) => { if (touchActive && e.pointerId === id) set(e.clientX, e.clientY); });
  pad.addEventListener("pointerup", reset);
  pad.addEventListener("pointercancel", reset);
})();

// --- Escena -----------------------------------------------------------------
function createScene() {
  const scene = new BABYLON.Scene(engine);

  const playerParent = new BABYLON.TransformNode("playerParent", scene);
  playerParent.position = new BABYLON.Vector3(0, 0.1, -6);

  const cameraTarget = new BABYLON.TransformNode("cameraTarget", scene);
  cameraTarget.position.set(0, 1.2, 0);

  scene.clearColor = BABYLON.Color3.FromHexString("#f1c98d").toColor4(1);
  scene.fogMode = BABYLON.Scene.FOGMODE_LINEAR;
  scene.fogColor = BABYLON.Color3.FromHexString("#edc58d");
  scene.fogStart = 30; scene.fogEnd = 92;

  const hemi = new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(0, 1, 0), scene);
  hemi.intensity = 0.58;
  hemi.groundColor = BABYLON.Color3.FromHexString("#6f6045");
  const sun = new BABYLON.DirectionalLight("sun", new BABYLON.Vector3(-0.65, -1, -0.35), scene);
  sun.position = new BABYLON.Vector3(32, 48, 24);
  sun.intensity = 1.18;
  sun.shadowMinZ = 1;
  sun.shadowMaxZ = 120;
  sun.orthoLeft = -52;
  sun.orthoRight = 52;
  sun.orthoTop = 52;
  sun.orthoBottom = -52;

  const isMobile = window.matchMedia && window.matchMedia("(pointer: coarse)").matches;
  const shadowMapSize = isMobile ? 512 : 1024;
  const shadowGenerator = new BABYLON.ShadowGenerator(shadowMapSize, sun);
  shadowGenerator.useBlurExponentialShadowMap = true;
  shadowGenerator.blurKernel = 18;
  shadowGenerator.bias = 0.0007;
  shadowGenerator.normalBias = 0.02;
  shadowGenerator.setDarkness(0.32);
  const shadowCasters = [];
  const shadowReceivers = [];
  const worldColliders = [];
  const PLAYER_COLLISION_RADIUS = 0.38;

  function addWorldCollider(x, z, w, d) {
    worldColliders.push({ x, z, w, d });
  }

  // AABBs altos que la CÁMARA no debe atravesar (edificios, torres).
  // Regla B1 de brain/reglas-de-oro.md: la cámara nunca queda dentro de
  // geometría (desde dentro, el backface culling hace "transparente" el muro).
  const cameraBlockers = [];
  function addCameraBlocker(x, z, w, d, maxY) {
    cameraBlockers.push({
      minX: x - w / 2 - 0.35, maxX: x + w / 2 + 0.35,
      minZ: z - d / 2 - 0.35, maxZ: z + d / 2 + 0.35,
      maxY: maxY
    });
  }

  function canOccupyPosition(x, z) {
    return !worldColliders.some((collider) =>
      Math.abs(x - collider.x) < collider.w / 2 + PLAYER_COLLISION_RADIUS &&
      Math.abs(z - collider.z) < collider.d / 2 + PLAYER_COLLISION_RADIUS
    );
  }

  function syncShadowUI() {
    if (!shadowToggle) return;
    shadowToggle.classList.toggle("active", visualSettings.shadows);
    shadowToggle.setAttribute("aria-pressed", visualSettings.shadows ? "true" : "false");
    shadowToggle.textContent = visualSettings.shadows ? "Sombras: ON" : "Sombras: OFF";
  }

  function syncShadowState() {
    const shadowMap = shadowGenerator.getShadowMap();
    if (shadowMap) {
      shadowMap.renderList = visualSettings.shadows ? shadowCasters : [];
    }
    shadowReceivers.forEach((mesh) => {
      mesh.receiveShadows = visualSettings.shadows;
    });
    syncShadowUI();
  }

  function registerShadowCaster(mesh) {
    if (!mesh || !mesh.getTotalVertices || mesh.getTotalVertices() === 0) return;
    if (!mesh.getBoundingInfo || !mesh.getBoundingInfo().boundingBox) { shadowCasters.push(mesh); syncShadowState(); return; }
    const extents = mesh.getBoundingInfo().boundingBox.extendSize;
    const size = Math.max(extents.x, extents.y, extents.z) * 2;
    if (size < 0.2) return;
    if (shadowCasters.indexOf(mesh) === -1) shadowCasters.push(mesh);
    syncShadowState();
  }

  function registerShadowReceiver(mesh) {
    if (!mesh) return;
    if (shadowReceivers.indexOf(mesh) === -1) shadowReceivers.push(mesh);
    syncShadowState();
  }

  if (shadowToggle) {
    shadowToggle.addEventListener("click", () => {
      visualSettings.shadows = !visualSettings.shadows;
      saveVisualSettings();
      syncShadowState();
    });
  }

  const musicToggle = document.getElementById("musicToggle");
  if (musicToggle) {
    musicToggle.addEventListener("click", toggleMusicMute);
  }

  function createGradientSky() {
    const skyTexture = new BABYLON.DynamicTexture("sunsetSkyTexture", { width: 16, height: 512 }, scene, false);
    const ctx = skyTexture.getContext();
    const gradient = ctx.createLinearGradient(0, 0, 0, 512);
    gradient.addColorStop(0, "#5e83b9");
    gradient.addColorStop(0.38, "#f3a35f");
    gradient.addColorStop(0.72, "#f2c484");
    gradient.addColorStop(1, "#efe1be");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 16, 512);
    skyTexture.update();

    const sky = BABYLON.MeshBuilder.CreateSphere("skyDome", {
      diameter: 180,
      segments: 32,
      sideOrientation: BABYLON.Mesh.BACKSIDE
    }, scene);
    sky.infiniteDistance = true;
    sky.isPickable = false;
    const skyMat = new BABYLON.StandardMaterial("skyMat", scene);
    skyMat.diffuseTexture = skyTexture;
    skyMat.emissiveTexture = skyTexture;
    skyMat.disableLighting = true;
    skyMat.backFaceCulling = false;
    sky.material = skyMat;
  }

  createGradientSky();

  const ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 140, height: 140 }, scene);
  // Textura de terreno con hierba toscana (tierra ocre con hierba)
  const groundTex = new BABYLON.DynamicTexture("groundTex", { width: 512, height: 512 }, scene, false);
  (function() {
    const gctx = groundTex.getContext();
    // Base tierra ocre toscana
    gctx.fillStyle = "#7a7355";
    gctx.fillRect(0, 0, 512, 512);
    // Variación de hierba con puntos irregulares
    for (let i = 0; i < 3200; i++) {
      const px = Math.random() * 512;
      const py = Math.random() * 512;
      const r = Math.random() * 6 + 2;
      const shade = Math.random();
      gctx.fillStyle = shade > 0.5 ? `rgba(82,97,55,${0.3+Math.random()*0.5})` : `rgba(110,120,75,${0.2+Math.random()*0.4})`;
      gctx.beginPath();
      gctx.ellipse(px, py, r, r * 0.6, Math.random() * Math.PI, 0, Math.PI * 2);
      gctx.fill();
    }
    groundTex.update();
  })();
  groundTex.uScale = 10; groundTex.vScale = 10;
  const gmat = new BABYLON.StandardMaterial("gmat", scene);
  gmat.diffuseTexture = groundTex;
  gmat.specularColor = new BABYLON.Color3(0, 0, 0);
  ground.material = gmat;
  registerShadowReceiver(ground);

  // ============================================================
  // TEXTURAS PBR ITALIANAS — adoquín, estuco, terracota, travertino
  // ============================================================
  function createCobblestoneMaterial() {
    // Adoquín sampietrino romano: piedra oscura casi cuadrada con juntas blancas
    const texture = new BABYLON.DynamicTexture("cobblestoneTexture", { width: 512, height: 512 }, scene, false);
    const ctx = texture.getContext();
    // Base gris pizarra oscuro
    ctx.fillStyle = "#6a6058";
    ctx.fillRect(0, 0, 512, 512);
    // Sampietrini: cuadrados casi uniformes con variación de tono
    const S = 28; // tamaño de sampietrino
    for (let row = 0; row < 512 / S + 1; row++) {
      for (let col = 0; col < 512 / S + 1; col++) {
        const jitter = (Math.sin(row * 7.3 + col * 3.7) * 2.5);
        const shade = 90 + Math.floor(Math.abs(Math.sin(row * 5.1 + col * 8.3)) * 30);
        const r = shade + 8; const g = shade; const b = Math.max(60, shade - 12);
        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.fillRect(col * S + 2 + jitter * 0.3, row * S + 2 + jitter * 0.3, S - 3, S - 3);
        // Junta clara (travertino)
        ctx.fillStyle = "rgba(185,172,152,0.55)";
        ctx.fillRect(col * S, row * S, S, 1.5);
        ctx.fillRect(col * S, row * S, 1.5, S);
      }
    }
    texture.update();
    texture.wrapU = BABYLON.Texture.WRAP_ADDRESSMODE;
    texture.wrapV = BABYLON.Texture.WRAP_ADDRESSMODE;
    const mat = new BABYLON.StandardMaterial("cobblestoneMat", scene);
    mat.diffuseTexture = texture;
    mat.specularColor = new BABYLON.Color3(0.07, 0.065, 0.055);
    mat.specularPower = 16;
    return mat;
  }

  function createStuccoMaterial(hexColor, name) {
    // Estuco mediterráneo: superficie con microtextura ligeramente rugosa
    const w = 256, h = 256;
    const tex = new BABYLON.DynamicTexture("stucco_" + name, { width: w, height: h }, scene, false);
    const ctx = tex.getContext();
    const base = BABYLON.Color3.FromHexString(hexColor);
    ctx.fillStyle = hexColor;
    ctx.fillRect(0, 0, w, h);
    // Ruido de estuco — irregularidades pequeñas
    for (let i = 0; i < 4000; i++) {
      const px = Math.random() * w;
      const py = Math.random() * h;
      const r = Math.random() * 3 + 0.5;
      const bright = (Math.random() - 0.5) * 0.15;
      const br = Math.min(255, Math.max(0, Math.floor((base.r + bright) * 255)));
      const bg = Math.min(255, Math.max(0, Math.floor((base.g + bright * 0.9) * 255)));
      const bb = Math.min(255, Math.max(0, Math.floor((base.b + bright * 0.8) * 255)));
      ctx.fillStyle = `rgba(${br},${bg},${bb},0.6)`;
      ctx.beginPath();
      ctx.arc(px, py, r, 0, Math.PI * 2);
      ctx.fill();
    }
    tex.update();
    tex.uScale = 2; tex.vScale = 2;
    const mat = new BABYLON.StandardMaterial("stuccoMat_" + name, scene);
    mat.diffuseTexture = tex;
    mat.specularColor = new BABYLON.Color3(0.03, 0.028, 0.022);
    return mat;
  }

  function createTerracottaRoofMaterial() {
    // Tegole/coppi: tejas mediterráneas color naranja terracota
    const tex = new BABYLON.DynamicTexture("terracottaTex", { width: 256, height: 256 }, scene, false);
    const ctx = tex.getContext();
    ctx.fillStyle = "#9e4527";
    ctx.fillRect(0, 0, 256, 256);
    // Filas de tejas semicirculares
    const TW = 18, TH = 32;
    for (let row = 0; row < 256 / TH + 1; row++) {
      for (let col = 0; col < 256 / TW + 1; col++) {
        const offset = (row % 2 === 0) ? 0 : TW / 2;
        const shade = 148 + Math.floor(Math.abs(Math.sin(row * 3.7 + col * 2.9)) * 28);
        const rr = Math.min(255, shade + 12); const gg = Math.max(40, shade - 48); const bb = Math.max(20, shade - 72);
        ctx.fillStyle = `rgb(${rr},${gg},${bb})`;
        ctx.beginPath();
        ctx.ellipse(col * TW + offset + TW/2, row * TH + TH * 0.4, TW * 0.38, TH * 0.42, 0, 0, Math.PI * 2);
        ctx.fill();
        // Borde oscuro de cada teja
        ctx.strokeStyle = "rgba(60,20,10,0.35)";
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
    tex.update();
    tex.uScale = 3; tex.vScale = 3;
    const mat = new BABYLON.StandardMaterial("terracottaRoofMat", scene);
    mat.diffuseTexture = tex;
    mat.specularColor = new BABYLON.Color3(0.04, 0.03, 0.02);
    return mat;
  }

  function createTravertineMaterial() {
    // Travertino romano para sócalos, fuente, campanile
    const tex = new BABYLON.DynamicTexture("travertineTex", { width: 256, height: 256 }, scene, false);
    const ctx = tex.getContext();
    ctx.fillStyle = "#d4c4a8";
    ctx.fillRect(0, 0, 256, 256);
    // Venas horizontales características del travertino
    for (let i = 0; i < 40; i++) {
      const y = Math.random() * 256;
      const len = 40 + Math.random() * 120;
      const x = Math.random() * 256;
      ctx.strokeStyle = `rgba(160,140,108,${0.2 + Math.random() * 0.35})`;
      ctx.lineWidth = Math.random() * 1.5 + 0.3;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + len + Math.random() * 30, y + (Math.random() - 0.5) * 4);
      ctx.stroke();
    }
    // Pequeñas oquedades
    for (let i = 0; i < 200; i++) {
      const px = Math.random() * 256; const py = Math.random() * 256;
      const r = Math.random() * 1.5 + 0.3;
      ctx.fillStyle = `rgba(110,95,70,${0.2 + Math.random() * 0.3})`;
      ctx.beginPath(); ctx.arc(px, py, r, 0, Math.PI * 2); ctx.fill();
    }
    tex.update();
    tex.uScale = 2; tex.vScale = 2;
    const mat = new BABYLON.StandardMaterial("travertineMat", scene);
    mat.diffuseTexture = tex;
    mat.specularColor = new BABYLON.Color3(0.05, 0.048, 0.04);
    mat.specularPower = 24;
    return mat;
  }

  const cobbleMat = createCobblestoneMaterial();
  const terracottaRoofMat = createTerracottaRoofMaterial();
  const travertineMat = createTravertineMaterial();

  // ============================================================
  // CALLES E INFRAESTRUCTURA URBANA ITALIANA
  // ============================================================
  // Calle principal N-S (via principale)
  const streetNS = BABYLON.MeshBuilder.CreateGround("streetNS", { width: 9, height: 100 }, scene);
  streetNS.position.y = 0.018;
  streetNS.material = cobbleMat;
  registerShadowReceiver(streetNS);
  // Calle E-O (corso)
  const streetEW = BABYLON.MeshBuilder.CreateGround("streetEW", { width: 100, height: 9 }, scene);
  streetEW.position.y = 0.02;
  streetEW.material = cobbleMat;
  registerShadowReceiver(streetEW);
  // Vicolo nordeste diagonal
  const vicoloNE = BABYLON.MeshBuilder.CreateGround("vicoloNE", { width: 5, height: 30 }, scene);
  vicoloNE.position.set(18, 0.015, 14);
  vicoloNE.rotation.y = Math.PI * 0.18;
  vicoloNE.material = cobbleMat;
  registerShadowReceiver(vicoloNE);
  // Vicolo suroeste
  const vicoloSW = BABYLON.MeshBuilder.CreateGround("vicoloSW", { width: 5, height: 28 }, scene);
  vicoloSW.position.set(-16, 0.015, -16);
  vicoloSW.rotation.y = Math.PI * 0.12;
  vicoloSW.material = cobbleMat;
  registerShadowReceiver(vicoloSW);

  // Piazza central (travertino con adoquín)
  const piazzaBase = BABYLON.MeshBuilder.CreateGround("piazzaBase", { width: 22, height: 22 }, scene);
  piazzaBase.position.y = 0.03;
  piazzaBase.material = travertineMat;
  registerShadowReceiver(piazzaBase);
  const piazzaCircle = BABYLON.MeshBuilder.CreateCylinder("piazzaCircle", { diameter: 16, height: 0.05, tessellation: 48 }, scene);
  piazzaCircle.position.y = 0.052;
  piazzaCircle.material = cobbleMat;
  registerShadowReceiver(piazzaCircle);

  // ============================================================
  // PALETA Y MATERIALES BASE
  // ============================================================
  // Colores de estuco italiano auténtico
  const STUCCO_COLORS = [
    "#c9a96e", // ocre dorado
    "#d4945c", // siena cálido
    "#c2b387", // arena toscana
    "#b8906a", // terracota claro
    "#d6c08a", // amarillo Siena
    "#c0a070", // ocre medio
    "#cca882", // beige cálido
    "#b09070", // marrón arcilla
    "#d8b87a", // amarillo Módena
    "#c4b08c", // piedra clara
  ];

  const stuccoMats = STUCCO_COLORS.map((c, i) => createStuccoMaterial(c, "" + i));

  const bmatCache = {};
  function bmat(hex) {
    if (!bmatCache[hex]) {
      const m = new BABYLON.StandardMaterial("b" + hex, scene);
      m.diffuseColor = BABYLON.Color3.FromHexString(hex);
      m.specularColor = new BABYLON.Color3(0.05, 0.05, 0.05);
      bmatCache[hex] = m;
    }
    return bmatCache[hex];
  }

  // Vidrio mediterráneo — levemente azulado
  const glassMat = new BABYLON.StandardMaterial("windowGlassMat", scene);
  glassMat.diffuseColor = BABYLON.Color3.FromHexString("#a0c8d4");
  glassMat.emissiveColor = BABYLON.Color3.FromHexString("#182c38");
  glassMat.specularColor = BABYLON.Color3.FromHexString("#e0f0f2");
  glassMat.alpha = 0.68;

  // Madera de puerta — caoba oscura
  const doorMat = bmat("#5c3418");
  // Travertino para molduras y cornisas
  const trimMat = travertineMat;
  // Persiane verdes (contraventanas características italianas)
  const shutterMat = bmat("#3a6845");
  // Hierro forjado para balcones
  const balconyMat = bmat("#2a2520");
  // Toldo a rayas terracota/crema
  const awningMat = bmat("#c76f45");
  const awningStripeMat = bmat("#f0e8d0");

  // ============================================================
  // PLANTILLAS DE VENTANA (thin instances) — OPTIMIZACIÓN DE RENDIMIENTO
  // Las dimensiones de ventana son constantes en todo el juego, así que
  // una sola malla por pieza sirve para TODAS las ventanas de TODOS los
  // edificios. Antes: ~15 meshes nuevos por ventana × cientos de ventanas
  // = 7630 meshes (82% de la escena, medido). Ahora: 6 mallas plantilla,
  // instanciadas por GPU (thinInstanceAdd) — 1 draw call por plantilla
  // sin importar cuántas ventanas haya. Ver brain/knowledge/03-rendimiento.md
  // ============================================================
  const WIN_FRAME_W = 0.76, WIN_FRAME_H = 0.96;
  const WIN_SHUT_W = 0.42, WIN_SHUT_H = WIN_FRAME_H + 0.04;
  const winSlatMat = bmat("#2f5835");

  // Los flags cast/receive deben COINCIDIR con los de las piezas que la
  // plantilla reemplaza (regla C4 de brain/reglas-de-oro.md) — no "mejorar"
  // sombras de pasada: cambia el aspecto y encarece el shadow map.
  function makeThinTemplate(mesh, material, castShadow, receiveShadow) {
    mesh.material = material;
    mesh.position.setAll(0);
    mesh.rotationQuaternion = BABYLON.Quaternion.Identity();
    mesh.thinInstanceEnablePicking = false;
    mesh.freezeWorldMatrix();
    if (castShadow) registerShadowCaster(mesh);
    if (receiveShadow) registerShadowReceiver(mesh);
    return mesh;
  }

  // Las piezas de ventana originales NO proyectaban ni recibían sombra:
  // las plantillas tampoco (regla C4).
  const winFrameTpl = makeThinTemplate(
    BABYLON.MeshBuilder.CreateBox("winFrameTpl", { width: WIN_FRAME_W + 0.14, height: WIN_FRAME_H + 0.14, depth: 0.1 }, scene),
    travertineMat, false, false);
  const winGlassTpl = makeThinTemplate(
    BABYLON.MeshBuilder.CreateBox("winGlassTpl", { width: WIN_FRAME_W, height: WIN_FRAME_H, depth: 0.06 }, scene),
    glassMat, false, false);
  const winSillTpl = makeThinTemplate(
    BABYLON.MeshBuilder.CreateBox("winSillTpl", { width: WIN_FRAME_W + 0.32, height: 0.1, depth: 0.2 }, scene),
    travertineMat, false, false);
  const winShutterZTpl = makeThinTemplate(
    BABYLON.MeshBuilder.CreateBox("winShutterZTpl", { width: WIN_SHUT_W, height: WIN_SHUT_H, depth: 0.06 }, scene),
    shutterMat, false, false);
  const winShutterXTpl = makeThinTemplate(
    BABYLON.MeshBuilder.CreateBox("winShutterXTpl", { width: 0.06, height: WIN_SHUT_H, depth: WIN_SHUT_W - 0.04 }, scene),
    shutterMat, false, false);
  const winSlatTpl = makeThinTemplate(
    BABYLON.MeshBuilder.CreateBox("winSlatTpl", { width: WIN_SHUT_W - 0.04, height: 0.04, depth: 0.08 }, scene),
    winSlatMat, false, false);
  const winThinTemplates = [winFrameTpl, winGlassTpl, winSillTpl, winShutterZTpl, winShutterXTpl, winSlatTpl];

  const ROT_Y_90 = BABYLON.Quaternion.RotationYawPitchRoll(Math.PI / 2, 0, 0);
  const ROT_IDENTITY = BABYLON.Quaternion.Identity();
  function addWinInstance(tpl, x, y, z, rotated90) {
    const m = BABYLON.Matrix.Compose(BABYLON.Vector3.One(), rotated90 ? ROT_Y_90 : ROT_IDENTITY, new BABYLON.Vector3(x, y, z));
    tpl.thinInstanceAdd(m, false);
  }

  // PLANTILLA DE BALAUSTRE DE BALCÓN (thin instance) — dimensiones fijas
  const balusterTpl = makeThinTemplate(
    BABYLON.MeshBuilder.CreateCylinder("balusterTpl", { height: 0.44, diameter: 0.05, tessellation: 6 }, scene),
    balconyMat, false, false);
  function addBalusterInstance(x, y, z) {
    const m = BABYLON.Matrix.Compose(BABYLON.Vector3.One(), ROT_IDENTITY, new BABYLON.Vector3(x, y, z));
    balusterTpl.thinInstanceAdd(m, false);
  }

  // Helper genérico: instancia con escala no uniforme y rotación yaw/pitch.
  // Una caja/cilindro unitario escalado reproduce cualquier caja/cilindro con
  // la misma proporción top/bottom — mismos UVs por cara, mismo aspecto.
  const _thinScale = new BABYLON.Vector3(1, 1, 1);
  const _thinPos = new BABYLON.Vector3(0, 0, 0);
  function thinAdd(tpl, x, y, z, sx, sy, sz, yaw, pitch) {
    const rot = (yaw || pitch)
      ? BABYLON.Quaternion.RotationYawPitchRoll(yaw || 0, pitch || 0, 0)
      : ROT_IDENTITY;
    _thinScale.set(sx, sy, sz);
    _thinPos.set(x, y, z);
    tpl.thinInstanceAdd(BABYLON.Matrix.Compose(_thinScale, rot, _thinPos), false);
  }

  // PLANTILLAS DE TRIM DE EDIFICIO — cajas unitarias escaladas por instancia.
  // Agrupadas por (material, flags de sombra) para preservar EXACTAMENTE el
  // comportamiento de las piezas que reemplazan (regla C4):
  const travCastRecvTpl = makeThinTemplate(   // zócalos (caster + receiver)
    BABYLON.MeshBuilder.CreateBox("travCastRecvTpl", { size: 1 }, scene), travertineMat, true, true);
  const travCastTpl = makeThinTemplate(       // cornisas, pilares de arco (caster)
    BABYLON.MeshBuilder.CreateBox("travCastTpl", { size: 1 }, scene), travertineMat, true, false);
  const travPlainTpl = makeThinTemplate(      // subcornisas, capiteles, claves, entablamentos
    BABYLON.MeshBuilder.CreateBox("travPlainTpl", { size: 1 }, scene), travertineMat, false, false);
  const roofCastTpl = makeThinTemplate(       // vertientes y cumbreras de teja (caster)
    BABYLON.MeshBuilder.CreateBox("roofCastTpl", { size: 1 }, scene), terracottaRoofMat, true, false);
  const trimThinTemplates = [travCastRecvTpl, travCastTpl, travPlainTpl, roofCastTpl];

  // PLANTILLAS DE ÁRBOLES — cipreses y pinos paraguas. La proporción
  // top/bottom de cada cilindro es constante; solo varían diámetro/altura
  // por capa y la escala del árbol → escala por matriz de instancia.
  const cypTrunkTpl = makeThinTemplate(
    BABYLON.MeshBuilder.CreateCylinder("cypTrunkTpl", { height: 0.8, diameterTop: 0.18, diameterBottom: 0.26, tessellation: 7 }, scene),
    bmat("#3d2710"), true, false);
  const cypLayerTpl = makeThinTemplate(
    BABYLON.MeshBuilder.CreateCylinder("cypLayerTpl", { height: 1, diameterTop: 0.62, diameterBottom: 1, tessellation: 7 }, scene),
    bmat("#243d1a"), true, false);
  const pineTrunkTpl = makeThinTemplate(
    BABYLON.MeshBuilder.CreateCylinder("pineTrunkTpl", { height: 4.5, diameterTop: 0.22, diameterBottom: 0.38, tessellation: 8 }, scene),
    bmat("#5a3318"), true, false);
  const pineKnotTpl = makeThinTemplate(
    BABYLON.MeshBuilder.CreateSphere("pineKnotTpl", { diameter: 0.5, segments: 7 }, scene),
    bmat("#3a2010"), false, false);
  const pineCopaTplA = makeThinTemplate(
    BABYLON.MeshBuilder.CreateCylinder("pineCopaTplA", { height: 1, diameterTop: 0.5, diameterBottom: 1, tessellation: 10 }, scene),
    bmat("#2d5c1e"), true, false);
  const pineCopaTplB = makeThinTemplate(
    BABYLON.MeshBuilder.CreateCylinder("pineCopaTplB", { height: 1, diameterTop: 0.5, diameterBottom: 1, tessellation: 10 }, scene),
    bmat("#3a7528"), true, false);
  const treeThinTemplates = [cypTrunkTpl, cypLayerTpl, pineTrunkTpl, pineKnotTpl, pineCopaTplA, pineCopaTplB];

  function makeBox(name, options, position, material, castShadow, receiveShadow) {
    const mesh = BABYLON.MeshBuilder.CreateBox(name, options, scene);
    mesh.position.copyFrom(position);
    mesh.material = material;
    if (castShadow) registerShadowCaster(mesh);
    if (receiveShadow) registerShadowReceiver(mesh);
    mesh.freezeWorldMatrix();
    return mesh;
  }

  // ============================================================
  // EDIFICIOS ITALIANOS AUTÉNTICOS CON IDENTIDAD TOSCANA
  // ============================================================
  // Tipos de edificio por variante (0=residenziale, 1=negozio/portici, 2=palazzo)
  function createItalianBuilding(x, z, w, h, d, stuccoIndex, index) {
    // MANTENER COLISIONADOR — el movimiento depende de él
    addWorldCollider(x, z, w + 0.6, d + 0.6);
    addCameraBlocker(x, z, w, d, h + 1.5); // +1.5 cubre tejado/cumbrera

    const wallMat = stuccoMats[stuccoIndex % stuccoMats.length];
    const variant = index % 3; // variante arquitectónica

    // Muro principal con estuco auténtico
    const wall = BABYLON.MeshBuilder.CreateBox("bldgWall" + index, { width: w, height: h, depth: d }, scene);
    wall.position.set(x, h / 2, z);
    wall.material = wallMat;
    registerShadowCaster(wall);
    registerShadowReceiver(wall);
    wall.freezeWorldMatrix();

    // Zócalo de travertino con relieve (thin instance)
    thinAdd(travCastRecvTpl, x, 0.25, z, w + 0.5, 0.5, d + 0.5);

    // Cornisa superior italiana (grande, pronunciada) (thin instance)
    thinAdd(travCastTpl, x, h + 0.18, z, w + 0.7, 0.35, d + 0.7);

    // Sub-cornisa (doble cornisa italiana) (thin instance)
    thinAdd(travPlainTpl, x, h - 0.2, z, w + 0.4, 0.18, d + 0.4);

    // TEJADO DE TEJA TERRACOTA — baja pendiente (italiano, NO cónico genérico)
    // Forma de tejado a dos aguas bajo (poca pendiente, muy mediterráneo)
    const roofPitch = Math.max(0.9, h * 0.16); // muy baja pendiente
    const roofW = w + 0.9;
    const roofD = d + 0.9;
    // Vertientes y cumbrera de teja (thin instances)
    const roofRotX = Math.atan2(roofPitch, roofD / 2) * 0.9;
    thinAdd(roofCastTpl, x, h + 0.35 + roofPitch / 2, z - roofD / 4, roofW, 0.12, roofD / 2 + 0.15, 0, roofRotX);
    thinAdd(roofCastTpl, x, h + 0.35 + roofPitch / 2, z + roofD / 4, roofW, 0.12, roofD / 2 + 0.15, 0, -roofRotX);
    thinAdd(roofCastTpl, x, h + 0.38 + roofPitch, z, roofW + 0.15, 0.22, 0.38);
    // Hastiales triangulares (frontones)
    const gableH = roofPitch + 0.15;
    const gableL = BABYLON.MeshBuilder.CreateCylinder("gableL" + index,
      { diameterTop: 0, diameterBottom: roofD * 0.6, height: gableH, tessellation: 3 }, scene);
    gableL.position.set(x - roofW / 2 + 0.1, h + 0.35 + gableH / 2, z);
    gableL.rotation.y = Math.PI / 2;
    gableL.rotation.z = Math.PI / 2;
    gableL.material = wallMat;
    registerShadowCaster(gableL);
    gableL.freezeWorldMatrix();
    const gableR = gableL.clone("gableR" + index);
    gableR.position.set(x + roofW / 2 - 0.1, h + 0.35 + gableH / 2, z);
    gableR.freezeWorldMatrix();

    // PORTICI / ARCOS en planta baja (variante negozio)
    if (variant === 1 && w >= 5) {
      const archCount = Math.max(2, Math.floor(w / 2.6));
      const archSpan = w * 0.82;
      for (let ai = 0; ai < archCount; ai++) {
        const aT = archCount === 1 ? 0.5 : ai / (archCount - 1);
        const ax = x - archSpan / 2 + archSpan * aT;
        // Pilar de arco + capitel decorativo (thin instances)
        thinAdd(travCastTpl, ax, 1.35, z + d / 2 + 0.18, 0.35, 2.7, 0.35);
        thinAdd(travPlainTpl, ax, 2.8, z + d / 2 + 0.18, 0.48, 0.2, 0.48);
      }
      // Entablamento sobre los arcos (thin instance)
      thinAdd(travPlainTpl, x, 2.9, z + d / 2 + 0.18, archSpan + 0.6, 0.22, 0.45);
    }

    // PUERTA ITALIANA — arco de medio punto
    const doorW = Math.min(1.4, w * 0.28);
    const doorH = 2.2;
    const door = BABYLON.MeshBuilder.CreateBox("door" + index,
      { width: doorW, height: doorH, depth: 0.14 }, scene);
    door.position.set(x, doorH / 2, z + d / 2 + 0.08);
    door.material = doorMat;
    registerShadowCaster(door);
    door.freezeWorldMatrix();
    // Arco sobre la puerta (semicircular)
    const archR = doorW * 0.52;
    const arch = BABYLON.MeshBuilder.CreateCylinder("doorArch" + index,
      { height: 0.14, diameter: doorW + 0.18, tessellation: 16 }, scene);
    arch.position.set(x, doorH + 0.04, z + d / 2 + 0.08);
    arch.rotation.x = Math.PI / 2;
    arch.material = travertineMat;
    arch.freezeWorldMatrix();
    // Clave del arco (keystone) (thin instance)
    thinAdd(travPlainTpl, x, doorH + 0.14, z + d / 2 + 0.08, 0.22, 0.28, 0.16);

    // VENTANAS ITALIANAS con persiane verdes (thin instances — ver plantillas arriba)
    function addItalianWindow(prefix, wx, wy, wz, faceZ, faceDirSign) {
      const frameW = WIN_FRAME_W, frameH = WIN_FRAME_H;
      addWinInstance(winFrameTpl, wx, wy, wz + faceDirSign * 0.02, false);
      addWinInstance(winGlassTpl, wx, wy, wz, false);
      addWinInstance(winSillTpl, wx, wy - frameH / 2 - 0.08, wz + faceDirSign * 0.08, false);
      // PERSIANA IZQUIERDA (verde, característica italiana)
      const shutW = WIN_SHUT_W, shutH = WIN_SHUT_H;
      addWinInstance(winShutterZTpl, wx - frameW / 2 - shutW / 2 - 0.04, wy, wz + faceDirSign * 0.04, false);
      for (let s = 0; s < 5; s++) {
        addWinInstance(winSlatTpl, wx - frameW / 2 - shutW / 2 - 0.04, wy - shutH / 2 + 0.12 + s * (shutH - 0.24) / 4, wz + faceDirSign * 0.07, false);
      }
      // PERSIANA DERECHA
      addWinInstance(winShutterZTpl, wx + frameW / 2 + shutW / 2 + 0.04, wy, wz + faceDirSign * 0.04, false);
      for (let s = 0; s < 5; s++) {
        addWinInstance(winSlatTpl, wx + frameW / 2 + shutW / 2 + 0.04, wy - shutH / 2 + 0.12 + s * (shutH - 0.24) / 4, wz + faceDirSign * 0.07, false);
      }
    }

    function addItalianWindowX(prefix, wx, wy, wz, faceDirSign) {
      const frameW = WIN_FRAME_W, frameH = WIN_FRAME_H;
      addWinInstance(winFrameTpl, wx + faceDirSign * 0.02, wy, wz, true);
      addWinInstance(winGlassTpl, wx, wy, wz, true);
      addWinInstance(winSillTpl, wx + faceDirSign * 0.08, wy - frameH / 2 - 0.08, wz, true);
      addWinInstance(winShutterXTpl, wx + faceDirSign * 0.04, wy, wz - frameW / 2 - 0.22, false);
      addWinInstance(winShutterXTpl, wx + faceDirSign * 0.04, wy, wz + frameW / 2 + 0.22, false);
    }

    // Añadir BALCÓN DE HIERRO FORJADO (primer piso, fachada)
    function addIronBalcony(prefix, bx, by, bz, bw, dirSign) {
      // Suelo del balcón
      const floor = BABYLON.MeshBuilder.CreateBox("balcFloor" + prefix,
        { width: bw + 0.1, height: 0.1, depth: 0.58 }, scene);
      floor.position.set(bx, by - 0.52, bz + dirSign * 0.32);
      floor.material = bmat("#2a2520");
      registerShadowCaster(floor);
      floor.freezeWorldMatrix();
      // Barandilla delantera (hierro forjado)
      const rail = BABYLON.MeshBuilder.CreateBox("balcRail" + prefix,
        { width: bw + 0.1, height: 0.48, depth: 0.04 }, scene);
      rail.position.set(bx, by - 0.28, bz + dirSign * 0.6);
      rail.material = balconyMat;
      registerShadowCaster(rail);
      rail.freezeWorldMatrix();
      // Balaustres (thin instances — ver plantilla balusterTpl arriba)
      const numBal = Math.max(3, Math.floor(bw * 2));
      for (let bi = 0; bi < numBal; bi++) {
        const bt = numBal === 1 ? 0.5 : bi / (numBal - 1);
        addBalusterInstance(bx - bw / 2 + bw * bt, by - 0.28, bz + dirSign * 0.6);
      }
      // Maceta de geranio en el balcón
      if (index % 3 !== 2) {
        const pot = BABYLON.MeshBuilder.CreateCylinder("geranPot" + prefix,
          { diameterTop: 0.18, diameterBottom: 0.22, height: 0.16, tessellation: 8 }, scene);
        pot.position.set(bx + bw * 0.28, by - 0.46, bz + dirSign * 0.5);
        pot.material = bmat("#8b4a28");
        pot.freezeWorldMatrix();
        const flower = BABYLON.MeshBuilder.CreateSphere("geranFlower" + prefix,
          { diameter: 0.22, segments: 6 }, scene);
        flower.position.set(bx + bw * 0.28, by - 0.3, bz + dirSign * 0.5);
        flower.material = bmat(index % 2 === 0 ? "#cc3333" : "#cc6677");
        flower.freezeWorldMatrix();
      }
    }

    // TOLDO RAYADO sobre la puerta
    if (variant !== 2) {
      const awnW = Math.min(2.2, w * 0.42);
      const awning = BABYLON.MeshBuilder.CreateBox("awning" + index,
        { width: awnW, height: 0.06, depth: 1.0 }, scene);
      awning.position.set(x, doorH + 0.12, z + d / 2 + 0.56);
      awning.rotation.x = -0.32;
      awning.material = index % 2 === 0 ? awningMat : bmat("#5a7d9a");
      registerShadowCaster(awning);
      awning.freezeWorldMatrix();
      // Cenefa del toldo
      const fringe = BABYLON.MeshBuilder.CreateBox("awnFringe" + index,
        { width: awnW + 0.1, height: 0.16, depth: 0.06 }, scene);
      fringe.position.set(x, doorH - 0.12, z + d / 2 + 0.98);
      fringe.material = bmat("#e8d8b0");
      fringe.freezeWorldMatrix();
    }

    // DISTRIBUCIÓN DE VENTANAS Y BALCONES
    const windowCols = Math.max(1, Math.floor(w / 2.4));
    const sideWindowCols = Math.max(1, Math.floor(d / 2.4));
    const floors = Math.max(2, Math.floor((h - 1.4) / 1.3));
    const spanW = w * 0.72;
    const spanD = d * 0.62;
    const faceZ = z + d / 2;
    const backZ = z - d / 2;

    for (let floor = 0; floor < floors; floor++) {
      const wy = 2.1 + floor * 1.3;
      if (wy > h - 0.7) continue;
      const isFirst = floor === 0;
      for (let col = 0; col < windowCols; col++) {
        const cT = windowCols === 1 ? 0.5 : col / (windowCols - 1);
        const wx = x - spanW / 2 + spanW * cT;
        // Evitar ventana sobre la puerta
        if (isFirst && Math.abs(wx - x) < doorW * 0.7) continue;
        addItalianWindow(index + "_f" + floor + "c" + col, wx, wy, faceZ + 0.07, true, 1);
        addItalianWindow(index + "_b" + floor + "c" + col, wx, wy, backZ - 0.07, false, -1);
        // Balcón en primer piso en cada 2 ventanas
        if (isFirst && col % 2 === 0) {
          addIronBalcony(index + "_balc" + floor + col, wx, wy, faceZ + 0.07, 0.86, 1);
        }
      }
      for (let col = 0; col < sideWindowCols; col++) {
        const cT = sideWindowCols === 1 ? 0.5 : col / (sideWindowCols - 1);
        const wz = z - spanD / 2 + spanD * cT;
        addItalianWindowX(index + "_l" + floor + "c" + col, x - w / 2 - 0.07, wy, wz, -1);
        addItalianWindowX(index + "_r" + floor + "c" + col, x + w / 2 + 0.07, wy, wz, 1);
      }
    }
  }

  // ============================================================
  // TRAZADO URBANO — BORGO TOSCANO CON PIAZZA CENTRAL
  // Formato: {x, z, w, h, d, stucco, variant}
  // Posiciones forman anillo alrededor de piazza (0,0)
  // Dejando aberturas para 4 vicoli cardinales
  // ============================================================
  const BUILDINGS = [
    // LADO NORTE de la piazza (con iglesia y campanile a la derecha)
    { x: -8,   z: 16,  w: 7.5, h: 9,   d: 6,   s: 0, v: 0 }, // casa grande norte-O
    { x:  6,   z: 17,  w: 6,   h: 7,   d: 5.5, s: 1, v: 0 }, // casa norte-E
    // LADO SUR de la piazza
    { x: -10,  z:-16,  w: 7,   h: 8,   d: 5.5, s: 2, v: 1 }, // bottega portici S-O
    { x:  3,   z:-17,  w: 8,   h: 10,  d: 6,   s: 3, v: 1 }, // palazzo portici S-E
    // LADO ESTE de la piazza
    { x: 17,   z:  4,  w: 5.5, h: 11,  d: 7,   s: 4, v: 2 }, // palazzo alto E
    { x: 17,   z: -7,  w: 5.5, h: 7,   d: 5.5, s: 5, v: 0 }, // casa E-S
    // LADO OESTE de la piazza
    { x:-17,   z:  3,  w: 5.5, h: 8,   d: 6,   s: 6, v: 1 }, // bottega portici O-N
    { x:-17,   z: -8,  w: 6,   h: 9,   d: 5.5, s: 7, v: 0 }, // casa O-S
    // PROFUNDIDAD (detrás del primer anillo)
    { x:-26,   z: 10,  w: 6,   h: 7.5, d: 5,   s: 8, v: 0 }, // barrio O
    { x:-28,   z: -5,  w: 5.5, h: 8.5, d: 5,   s: 9, v: 1 }, // barrio O-S
    { x: 26,   z:  8,  w: 5.5, h: 7,   d: 5,   s: 0, v: 0 }, // barrio E-N
    { x: 27,   z: -9,  w: 6,   h: 9.5, d: 5.5, s: 2, v: 2 }, // palazzo E-S
    { x:-12,   z: 28,  w: 7,   h: 8,   d: 5.5, s: 3, v: 0 }, // barrio N-O
    { x:  6,   z: 29,  w: 6.5, h: 7,   d: 5,   s: 5, v: 1 }, // barrio N-E
    { x: -4,   z:-28,  w: 7,   h: 8.5, d: 5.5, s: 6, v: 0 }, // barrio S-centro
    { x: 14,   z:-26,  w: 6,   h: 7,   d: 5,   s: 7, v: 1 }, // barrio S-E
    // ESQUINAS lejanas
    { x:-30,   z: 24,  w: 5.5, h: 7,   d: 5,   s: 1, v: 0 }, // NE
    { x: 28,   z: 22,  w: 6,   h: 8,   d: 5,   s: 4, v: 2 }, // NO
    { x:-22,   z:-22,  w: 5.5, h: 7.5, d: 5,   s: 8, v: 0 }, // SE
    { x: 22,   z:-24,  w: 6,   h: 9,   d: 5.5, s: 0, v: 1 }, // SO
  ];
  BUILDINGS.forEach((b, i) => {
    createItalianBuilding(b.x, b.z, b.w, b.h, b.d, b.s, i);
  });

  // Recalcular bounding info de las plantillas thin-instanced ahora que
  // tienen todas sus instancias (si no, el frustum culling puede recortar
  // instancias fuera del bounding box original de la plantilla).
  winThinTemplates.forEach(tpl => tpl.thinInstanceRefreshBoundingInfo(true));
  trimThinTemplates.forEach(tpl => tpl.thinInstanceRefreshBoundingInfo(true));
  balusterTpl.thinInstanceRefreshBoundingInfo(true);

  // ============================================================
  // VEGETACIÓN ITALIANA FIRMA — CIPRESES Y PINOS PARAGUAS
  // ============================================================

  // CIPRÉS ITALIANO — silueta columnar alta, muy oscura (Cupressus sempervirens)
  // (thin instances — plantillas cypTrunkTpl/cypLayerTpl, misma matemática)
  function createItalianCypress(x, z, scale) {
    addWorldCollider(x, z, 0.7 * scale, 0.7 * scale);
    const trunkH = 0.8 * scale;
    thinAdd(cypTrunkTpl, x, trunkH / 2, z, scale, scale, scale);
    // Silueta columnar: capas apretadas de forma elíptica muy vertical
    const totalH = 7.5 * scale;
    const layers = 14;
    for (let li = 0; li < layers; li++) {
      const t = li / (layers - 1);
      const layerY = trunkH + t * totalH;
      const maxDiam = 1.1 * scale;
      // Forma elíptica: máximo diámetro en la mitad, muy estrecho arriba y abajo
      const diam = maxDiam * Math.sin(Math.PI * (t * 0.85 + 0.05)) * (1 - t * 0.4);
      const layerH = totalH / layers * 1.4;
      thinAdd(cypLayerTpl, x, layerY, z, diam, layerH, diam, li * 0.18);
    }
  }

  // PINO PARAGUAS (Pinus pinea) — copa plana y ancha, tronco alto y desnudo
  // (thin instances — plantillas pineTrunk/Knot/CopaA/CopaB, misma matemática)
  function createPinoParaguas(x, z, scale) {
    addWorldCollider(x, z, 0.85 * scale, 0.85 * scale);
    // Tronco alto y recto (el más icónico de Italia)
    const trunkH = 4.5 * scale;
    thinAdd(pineTrunkTpl, x, trunkH / 2, z, scale, scale, scale);
    // Nodo de unión tronco-copa
    thinAdd(pineKnotTpl, x, trunkH, z, scale, scale, scale);
    // Copa plana tipo paraguas (varias capas superpuestas y anchas)
    const umbrellaDiam = 4.2 * scale;
    const copaLayers = [
      { dy: 0.0,  d: umbrellaDiam,       h: 0.7 * scale },
      { dy: 0.6,  d: umbrellaDiam * 0.82, h: 0.6 * scale },
      { dy: 1.1,  d: umbrellaDiam * 0.58, h: 0.5 * scale },
      { dy: 1.5,  d: umbrellaDiam * 0.30, h: 0.4 * scale },
    ];
    copaLayers.forEach((layer, li) => {
      thinAdd(li % 2 === 0 ? pineCopaTplA : pineCopaTplB,
        x, trunkH + 0.2 + layer.dy * scale, z, layer.d, layer.h, layer.d, li * 0.4);
    });
  }

  // Árbol genérico lowpoly (para zonas sin personalidad específica)
  function createLowPolyTree(x, z, scale, variant) {
    addWorldCollider(x, z, 0.85 * scale, 0.85 * scale);
    const trunk = BABYLON.MeshBuilder.CreateCylinder("treeTrunk" + variant,
      { height: 0.9 * scale, diameterTop: 0.18 * scale, diameterBottom: 0.26 * scale, tessellation: 6 }, scene);
    trunk.position.set(x, 0.45 * scale, z);
    trunk.material = bmat("#6b4328");
    registerShadowCaster(trunk);
    trunk.freezeWorldMatrix();
    const foliageMat = bmat(variant % 3 === 0 ? "#4a6b34" : variant % 3 === 1 ? "#5c8044" : "#3a5e2a");
    const layers = [{ y: 1.25, h: 1.2, d: 1.85 }, { y: 1.82, h: 1.0, d: 1.48 }, { y: 2.32, h: 0.82, d: 1.08 }];
    layers.forEach((layer, li) => {
      const cone = BABYLON.MeshBuilder.CreateCylinder("treeFoliage" + variant + "_" + li,
        { diameterTop: 0, diameterBottom: layer.d * scale, height: layer.h * scale, tessellation: 7 }, scene);
      cone.position.set(x, layer.y * scale, z);
      cone.rotation.y = (variant * 0.33) + li * 0.2;
      cone.material = foliageMat;
      registerShadowCaster(cone);
      cone.freezeWorldMatrix();
    });
  }

  // CIPRESES — viales y márgenes de la ciudad (muy italianos)
  [
    [-11, -28, 1.0], [-5, -30, 0.9], [5, -30, 0.95], [12, -28, 1.05],
    [-33, -8,  1.1], [-33,  4,  0.95], [-30, 16,  1.0],
    [ 30, -10, 1.0], [ 32,  4,  1.1], [ 28, 17,  0.9],
    [-14, 30,  1.0], [ -3, 32,  0.92], [ 9, 30,  1.08], [ 18, 30, 0.95],
  ].forEach(([x, z, scale]) => createItalianCypress(x, z, scale));

  // PINOS PARAGUAS — en la periferia y junto a la piazza (icono Roma/Toscana)
  [
    [-22, -14, 0.82], [ 24, -18, 0.88], [-20, 20, 0.80], [ 22, 20, 0.86],
    [  0, -34, 0.90], [ -36, 0, 0.84], [ 36, 0, 0.88],
  ].forEach(([x, z, scale]) => createPinoParaguas(x, z, scale));

  // Árboles decorativos en la piazza (pequeños, en macetas)
  [
    [-7.5, -7.5, 0.7], [7.5, -7.5, 0.72], [-7.5, 7.5, 0.68], [7.5, 7.5, 0.74]
  ].forEach(([x, z, scale], i) => createLowPolyTree(x, z, scale, i + 40));

  // Bounding info de las plantillas de árbol, ya con todas sus instancias
  treeThinTemplates.forEach(tpl => tpl.thinInstanceRefreshBoundingInfo(true));

  syncShadowState();

  // --- Props urbanos --------------------------------------------------------
  const lampMat = bmat("#3a3530");
  const lampGlowMat = (() => {
    const m = new BABYLON.StandardMaterial("lampGlow", scene);
    m.diffuseColor = BABYLON.Color3.FromHexString("#ffe8a0");
    m.emissiveColor = BABYLON.Color3.FromHexString("#f0c040");
    return m;
  })();

  function createLampPost(x, z) {
    const pole = BABYLON.MeshBuilder.CreateCylinder("lampPole", { height: 2.4, diameter: 0.08, tessellation: 8 }, scene);
    pole.position.set(x, 1.2, z);
    pole.material = lampMat;
    registerShadowCaster(pole);
    const arm = BABYLON.MeshBuilder.CreateBox("lampArm", { width: 0.04, height: 0.25, depth: 0.04 }, scene);
    arm.position.set(x, 2.55, z + 0.2);
    arm.material = lampMat;
    const bulb = BABYLON.MeshBuilder.CreateSphere("lampBulb", { diameter: 0.14, segments: 8 }, scene);
    bulb.position.set(x, 2.65, z + 0.38);
    bulb.material = lampGlowMat;
    addWorldCollider(x, z, 0.3, 0.3);
  }

  function createBench(x, z, rotY) {
    const seat = BABYLON.MeshBuilder.CreateBox("benchSeat", { width: 0.9, height: 0.08, depth: 0.3 }, scene);
    seat.position.set(x, 0.35, z);
    seat.rotation.y = rotY;
    seat.material = bmat("#6b4328");
    registerShadowCaster(seat);
    const legMat = bmat("#3a3530");
    [-0.38, 0.38].forEach(ox => {
      const leg = BABYLON.MeshBuilder.CreateBox("benchLeg", { width: 0.05, height: 0.3, depth: 0.05 }, scene);
      leg.position.set(x + ox * Math.cos(rotY), 0.15, z + ox * Math.sin(rotY));
      leg.material = legMat;
    });
    const back = BABYLON.MeshBuilder.CreateBox("benchBack", { width: 0.9, height: 0.22, depth: 0.04 }, scene);
    back.position.set(x + 0.16 * Math.sin(rotY), 0.55, z + 0.16 * Math.cos(rotY));
    back.rotation.y = rotY;
    back.material = bmat("#6b4328");
    registerShadowCaster(back);
  }

  function createPlanter(x, z) {
    const pot = BABYLON.MeshBuilder.CreateCylinder("planterPot", { diameterTop: 0.5, diameterBottom: 0.6, height: 0.35, tessellation: 12 }, scene);
    pot.position.set(x, 0.175, z);
    pot.material = bmat("#8f7a68");
    registerShadowCaster(pot);
    const foliage = BABYLON.MeshBuilder.CreateSphere("planterFoliage", { diameter: 0.44, segments: 8 }, scene);
    foliage.position.set(x, 0.48, z);
    foliage.material = bmat("#536f3c");
    registerShadowCaster(foliage);
    addWorldCollider(x, z, 0.5, 0.5);
  }

  function createFountain() {
    const base = BABYLON.MeshBuilder.CreateCylinder("fountainBase", { diameterTop: 3.2, diameterBottom: 3.6, height: 0.5, tessellation: 24 }, scene);
    base.position.set(0, 0.25, 0);
    base.material = bmat("#b8a88a");
    registerShadowCaster(base);
    registerShadowReceiver(base);
    const basin = BABYLON.MeshBuilder.CreateCylinder("fountainBasin", { diameterTop: 2.4, diameterBottom: 2.8, height: 0.3, tessellation: 24 }, scene);
    basin.position.set(0, 0.6, 0);
    basin.material = bmat("#c8b89a");
    registerShadowCaster(basin);
    const pillar = BABYLON.MeshBuilder.CreateCylinder("fountainPillar", { diameterTop: 0.2, diameterBottom: 0.3, height: 1.2, tessellation: 12 }, scene);
    pillar.position.set(0, 1.2, 0);
    pillar.material = bmat("#b8a88a");
    registerShadowCaster(pillar);
    const top = BABYLON.MeshBuilder.CreateSphere("fountainTop", { diameter: 0.35, segments: 8 }, scene);
    top.position.set(0, 1.85, 0);
    top.material = bmat("#c8b89a");
    registerShadowCaster(top);
    addWorldCollider(0, 0, 2.8, 2.8);
  }

  // FUENTE DE TRAVERTINO MEJORADA (Fontana della Piazza)
  function createItalianFountain() {
    // Escalinata circular base
    const steps = [
      { d: 5.4, h: 0.18 }, { d: 4.6, h: 0.18 }, { d: 3.8, h: 0.18 }
    ];
    steps.forEach((step, i) => {
      const s = BABYLON.MeshBuilder.CreateCylinder("fountainStep" + i,
        { diameter: step.d, height: step.h, tessellation: 32 }, scene);
      s.position.set(0, 0.18 * i + 0.09, 0);
      s.material = travertineMat;
      registerShadowCaster(s);
      registerShadowReceiver(s);
    });
    // Tazón principal
    const bowl = BABYLON.MeshBuilder.CreateCylinder("fountainBowl",
      { diameterTop: 3.0, diameterBottom: 2.6, height: 0.5, tessellation: 32 }, scene);
    bowl.position.set(0, 0.72, 0);
    bowl.material = travertineMat;
    registerShadowCaster(bowl);
    registerShadowReceiver(bowl);
    // Agua (superficie azulada semitransparente)
    const water = BABYLON.MeshBuilder.CreateCylinder("fountainWater",
      { diameter: 2.7, height: 0.05, tessellation: 32 }, scene);
    water.position.set(0, 0.98, 0);
    const waterMat = new BABYLON.StandardMaterial("waterMat", scene);
    waterMat.diffuseColor = BABYLON.Color3.FromHexString("#4a8fa8");
    waterMat.emissiveColor = BABYLON.Color3.FromHexString("#0a2030");
    waterMat.alpha = 0.75;
    waterMat.specularColor = BABYLON.Color3.FromHexString("#a0d8e8");
    water.material = waterMat;
    // Fuste central (columnita)
    const shaft = BABYLON.MeshBuilder.CreateCylinder("fountainShaft",
      { diameterTop: 0.28, diameterBottom: 0.38, height: 1.4, tessellation: 12 }, scene);
    shaft.position.set(0, 1.18, 0);
    shaft.material = travertineMat;
    registerShadowCaster(shaft);
    // Tazón superior pequeño
    const bowl2 = BABYLON.MeshBuilder.CreateCylinder("fountainBowl2",
      { diameterTop: 1.1, diameterBottom: 0.9, height: 0.28, tessellation: 24 }, scene);
    bowl2.position.set(0, 1.92, 0);
    bowl2.material = travertineMat;
    registerShadowCaster(bowl2);
    // Remate esférico
    const top = BABYLON.MeshBuilder.CreateSphere("fountainTop", { diameter: 0.28, segments: 10 }, scene);
    top.position.set(0, 2.2, 0);
    top.material = travertineMat;
    registerShadowCaster(top);
    // Cabezas de león estilizadas (4 puntos cardinales)
    const lionMat = bmat("#c8b090");
    [0, Math.PI / 2, Math.PI, Math.PI * 1.5].forEach((angle, i) => {
      const lion = BABYLON.MeshBuilder.CreateBox("lion" + i, { width: 0.22, height: 0.18, depth: 0.26 }, scene);
      lion.position.set(Math.sin(angle) * 1.52, 0.96, Math.cos(angle) * 1.52);
      lion.rotation.y = angle;
      lion.material = lionMat;
    });
    addWorldCollider(0, 0, 3.2, 3.2);
  }

  // ============================================================
  // CAMPANILE — Torre campanario italiana (elemento dominante)
  // Posición: lado norte de la piazza, domina el horizonte
  // ============================================================
  function createCampanile(cx, cz) {
    addWorldCollider(cx, cz, 4.5, 4.5);
    addCameraBlocker(cx, cz, 4.2, 4.2, 19); // base 1.8 + fuste 14 + campanario/techo
    // BASE del campanile (cuadrada, travertino)
    const base = BABYLON.MeshBuilder.CreateBox("campBase",
      { width: 4.2, height: 1.8, depth: 4.2 }, scene);
    base.position.set(cx, 0.9, cz);
    base.material = travertineMat;
    registerShadowCaster(base);
    registerShadowReceiver(base);
    base.freezeWorldMatrix();
    // FUSTE principal (cuerpo cuadrado alto)
    const shaft = BABYLON.MeshBuilder.CreateBox("campShaft",
      { width: 3.4, height: 14, depth: 3.4 }, scene);
    shaft.position.set(cx, 1.8 + 7, cz);
    shaft.material = createStuccoMaterial("#d8c8a8", "camp");
    registerShadowCaster(shaft);
    shaft.freezeWorldMatrix();
    // Bandas horizontales decorativas cada ~3 metros
    [4, 7, 10, 13].forEach((y, bi) => {
      const band = BABYLON.MeshBuilder.CreateBox("campBand" + bi,
        { width: 3.7, height: 0.28, depth: 3.7 }, scene);
      band.position.set(cx, y, cz);
      band.material = travertineMat;
      band.freezeWorldMatrix();
    });
    // CÁMARA de las campanas (arcos abiertos, parte alta)
    const belfryH = 3.5;
    const belfryY = 16.8;
    const belfry = BABYLON.MeshBuilder.CreateBox("campBelfry",
      { width: 3.8, height: belfryH, depth: 3.8 }, scene);
    belfry.position.set(cx, belfryY + belfryH / 2, cz);
    belfry.material = travertineMat;
    registerShadowCaster(belfry);
    belfry.freezeWorldMatrix();
    // Arcos del campanile (2 en cada fachada = 8)
    const archOpenMat = bmat("#3a2810"); // vano oscuro
    [0, Math.PI / 2, Math.PI, Math.PI * 1.5].forEach((angle, fi) => {
      const archOpen = BABYLON.MeshBuilder.CreateBox("campArch" + fi,
        { width: 0.88, height: 1.8, depth: 0.5 }, scene);
      archOpen.position.set(
        cx + Math.sin(angle) * 1.9,
        belfryY + belfryH * 0.5,
        cz + Math.cos(angle) * 1.9
      );
      archOpen.rotation.y = angle;
      archOpen.material = archOpenMat;
      archOpen.freezeWorldMatrix();
    });
    // CORNISA del campanario
    const cornice = BABYLON.MeshBuilder.CreateBox("campCornice",
      { width: 4.3, height: 0.4, depth: 4.3 }, scene);
    cornice.position.set(cx, belfryY + belfryH + 0.2, cz);
    cornice.material = travertineMat;
    cornice.freezeWorldMatrix();
    // CÚPULA piramidal (remate típico toscano)
    const pyramid = BABYLON.MeshBuilder.CreateCylinder("campPyramid",
      { diameterTop: 0, diameterBottom: 3.6, height: 3.2, tessellation: 4 }, scene);
    pyramid.position.set(cx, belfryY + belfryH + 2, cz);
    pyramid.rotation.y = Math.PI / 4;
    pyramid.material = terracottaRoofMat;
    registerShadowCaster(pyramid);
    pyramid.freezeWorldMatrix();
    // Aguja y cruz
    const spire = BABYLON.MeshBuilder.CreateCylinder("campSpire",
      { diameterTop: 0.04, diameterBottom: 0.22, height: 1.6, tessellation: 8 }, scene);
    spire.position.set(cx, belfryY + belfryH + 3.8, cz);
    spire.material = bmat("#8a7560");
    registerShadowCaster(spire);
    spire.freezeWorldMatrix();
    // Cruz en la cima
    const crossV = BABYLON.MeshBuilder.CreateBox("crossV",
      { width: 0.07, height: 0.6, depth: 0.07 }, scene);
    crossV.position.set(cx, belfryY + belfryH + 5.2, cz);
    crossV.material = bmat("#c8a060");
    crossV.freezeWorldMatrix();
    const crossH = BABYLON.MeshBuilder.CreateBox("crossH",
      { width: 0.38, height: 0.07, depth: 0.07 }, scene);
    crossH.position.set(cx, belfryY + belfryH + 5.1, cz);
    crossH.material = bmat("#c8a060");
    crossH.freezeWorldMatrix();
    // Campana (esfera en la cámara)
    const bell = BABYLON.MeshBuilder.CreateSphere("campBell",
      { diameter: 0.55, segments: 10 }, scene);
    bell.position.set(cx, belfryY + belfryH * 0.45, cz);
    bell.material = bmat("#c8a020");
    bell.freezeWorldMatrix();
  }

  // ============================================================
  // IGLESIA ROMÁNICA (adyacente al campanile)
  // ============================================================
  function createChiesa(cx, cz) {
    addWorldCollider(cx, cz, 9, 14);
    addCameraBlocker(cx, cz, 8, 13, 11.5); // nave 7.5 + tejado 2.8 + margen
    const churchMat = createStuccoMaterial("#d0c0a0", "chiesa");
    // Nave principal
    const nave = BABYLON.MeshBuilder.CreateBox("churchNave",
      { width: 8, height: 7.5, depth: 13 }, scene);
    nave.position.set(cx, 3.75, cz);
    nave.material = churchMat;
    registerShadowCaster(nave);
    registerShadowReceiver(nave);
    nave.freezeWorldMatrix();
    // Tejado de teja terracota (a dos aguas pronunciado)
    const roofPitch = 2.8;
    const rF = BABYLON.MeshBuilder.CreateBox("churchRoofF",
      { width: 8.8, height: 0.14, depth: 7 }, scene);
    rF.position.set(cx, 7.5 + roofPitch * 0.55, cz - 3.2);
    rF.rotation.x = Math.atan2(roofPitch, 6.5) * 0.85;
    rF.material = terracottaRoofMat;
    registerShadowCaster(rF);
    rF.freezeWorldMatrix();
    const rB = BABYLON.MeshBuilder.CreateBox("churchRoofB",
      { width: 8.8, height: 0.14, depth: 7 }, scene);
    rB.position.set(cx, 7.5 + roofPitch * 0.55, cz + 3.2);
    rB.rotation.x = -Math.atan2(roofPitch, 6.5) * 0.85;
    rB.material = terracottaRoofMat;
    registerShadowCaster(rB);
    rB.freezeWorldMatrix();
    const ridge = BABYLON.MeshBuilder.CreateBox("churchRidge",
      { width: 9, height: 0.26, depth: 0.45 }, scene);
    ridge.position.set(cx, 7.5 + roofPitch * 1.05, cz);
    ridge.material = terracottaRoofMat;
    ridge.freezeWorldMatrix();
    // FACHADA — frontón triangular
    const gable = BABYLON.MeshBuilder.CreateCylinder("churchGable",
      { diameterTop: 0, diameterBottom: 13 * 0.55, height: roofPitch + 0.2, tessellation: 3 }, scene);
    gable.position.set(cx - 4.2, 7.5 + (roofPitch + 0.2) / 2, cz);
    gable.rotation.y = Math.PI / 2;
    gable.rotation.z = Math.PI / 2;
    gable.material = churchMat;
    gable.freezeWorldMatrix();
    const gableR = gable.clone("churchGableR");
    gableR.position.set(cx + 4.2, 7.5 + (roofPitch + 0.2) / 2, cz);
    gableR.freezeWorldMatrix();
    // Pórtico de entrada (3 arcos)
    const porticoMat = travertineMat;
    [-2.2, 0, 2.2].forEach((ox, pi) => {
      const col = BABYLON.MeshBuilder.CreateBox("churchCol" + pi,
        { width: 0.42, height: 3.5, depth: 0.42 }, scene);
      col.position.set(cx + ox, 1.75, cz - 6.5 - 0.22);
      col.material = porticoMat;
      registerShadowCaster(col);
      col.freezeWorldMatrix();
    });
    const archBar = BABYLON.MeshBuilder.CreateBox("churchArchBar",
      { width: 7.2, height: 0.32, depth: 0.55 }, scene);
    archBar.position.set(cx, 3.65, cz - 6.5 - 0.22);
    archBar.material = porticoMat;
    archBar.freezeWorldMatrix();
    // Puerta principal (arco de medio punto)
    const door = BABYLON.MeshBuilder.CreateBox("churchDoor",
      { width: 1.6, height: 3.1, depth: 0.18 }, scene);
    door.position.set(cx, 1.55, cz - 6.52);
    door.material = bmat("#3a1e0a");
    registerShadowCaster(door);
    door.freezeWorldMatrix();
    const doorArch = BABYLON.MeshBuilder.CreateCylinder("churchDoorArch",
      { height: 0.18, diameter: 1.78, tessellation: 16 }, scene);
    doorArch.position.set(cx, 3.16, cz - 6.52);
    doorArch.rotation.x = Math.PI / 2;
    doorArch.material = porticoMat;
    doorArch.freezeWorldMatrix();
    // Óculo (ventana circular en el frontón)
    const oculus = BABYLON.MeshBuilder.CreateCylinder("churchOculus",
      { height: 0.22, diameter: 1.0, tessellation: 20 }, scene);
    oculus.position.set(cx, 7.9, cz - 4.1);
    oculus.rotation.x = Math.PI / 2;
    const oclMat = new BABYLON.StandardMaterial("oclMat", scene);
    oclMat.diffuseColor = BABYLON.Color3.FromHexString("#5080a0");
    oclMat.emissiveColor = BABYLON.Color3.FromHexString("#102040");
    oclMat.alpha = 0.8;
    oculus.material = oclMat;
    oculus.freezeWorldMatrix();
    // Ábside (parte trasera semicircular)
    const apse = BABYLON.MeshBuilder.CreateCylinder("churchApse",
      { diameterTop: 5.5, diameterBottom: 5.5, height: 6, tessellation: 12 }, scene);
    apse.position.set(cx, 3, cz + 7.8);
    apse.material = churchMat;
    registerShadowCaster(apse);
    registerShadowReceiver(apse);
    apse.freezeWorldMatrix();
    const apseRoof = BABYLON.MeshBuilder.CreateCylinder("churchApseRoof",
      { diameterTop: 0.5, diameterBottom: 6, height: 3, tessellation: 12 }, scene);
    apseRoof.position.set(cx, 7.5, cz + 7.8);
    apseRoof.material = terracottaRoofMat;
    registerShadowCaster(apseRoof);
    apseRoof.freezeWorldMatrix();
  }

  // ============================================================
  // VESPA — Símbolo italiano por excelencia
  // ============================================================
  function createVespa(x, z, rotY) {
    const metalMat = bmat("#8a8070");
    const chromeMat = bmat("#c8c0b0");
    // Cuerpo principal (scooter body)
    const body = BABYLON.MeshBuilder.CreateBox("vespBody",
      { width: 0.55, height: 0.65, depth: 1.4 }, scene);
    body.position.set(x, 0.55, z);
    body.rotation.y = rotY;
    body.material = bmat("#cc3322");
    registerShadowCaster(body);
    body.freezeWorldMatrix();
    // Escudo frontal
    const shield = BABYLON.MeshBuilder.CreateBox("vespShield",
      { width: 0.52, height: 0.48, depth: 0.18 }, scene);
    shield.position.set(x + Math.sin(rotY) * 0.62, 0.72, z + Math.cos(rotY) * 0.62);
    shield.rotation.y = rotY;
    shield.material = bmat("#cc3322");
    shield.freezeWorldMatrix();
    // Asiento
    const seat = BABYLON.MeshBuilder.CreateBox("vespSeat",
      { width: 0.38, height: 0.12, depth: 0.62 }, scene);
    seat.position.set(x, 0.88, z - Math.cos(rotY) * 0.06);
    seat.rotation.y = rotY;
    seat.material = bmat("#1a1410");
    seat.freezeWorldMatrix();
    // Rueda delantera
    const wF = BABYLON.MeshBuilder.CreateCylinder("vespWheelF",
      { height: 0.12, diameter: 0.36, tessellation: 16 }, scene);
    wF.position.set(x + Math.sin(rotY) * 0.68, 0.22, z + Math.cos(rotY) * 0.68);
    wF.rotation.x = Math.PI / 2;
    wF.rotation.y = rotY;
    wF.material = metalMat;
    wF.freezeWorldMatrix();
    // Rueda trasera
    const wR = BABYLON.MeshBuilder.CreateCylinder("vespWheelR",
      { height: 0.12, diameter: 0.36, tessellation: 16 }, scene);
    wR.position.set(x - Math.sin(rotY) * 0.56, 0.22, z - Math.cos(rotY) * 0.56);
    wR.rotation.x = Math.PI / 2;
    wR.rotation.y = rotY;
    wR.material = metalMat;
    wR.freezeWorldMatrix();
    // Manillar
    const handlebar = BABYLON.MeshBuilder.CreateBox("vespHandle",
      { width: 0.5, height: 0.06, depth: 0.06 }, scene);
    handlebar.position.set(x + Math.sin(rotY) * 0.55, 0.88, z + Math.cos(rotY) * 0.55);
    handlebar.rotation.y = rotY;
    handlebar.material = chromeMat;
    handlebar.freezeWorldMatrix();
    // Espejos
    [-0.25, 0.25].forEach(dx => {
      const mirror = BABYLON.MeshBuilder.CreateBox("vespMirror",
        { width: 0.08, height: 0.12, depth: 0.04 }, scene);
      mirror.position.set(
        x + Math.sin(rotY) * 0.55 + Math.cos(rotY) * dx,
        0.94, z + Math.cos(rotY) * 0.55 - Math.sin(rotY) * dx
      );
      mirror.material = chromeMat;
      mirror.freezeWorldMatrix();
    });
    addWorldCollider(x, z, 0.6, 1.5);
  }

  // ============================================================
  // MESA DE CAFÉ CON SOMBRILLA (Tavolino da Bar)
  // ============================================================
  function createCafeTable(x, z, rotY) {
    // Sombrilla
    const poleH = 2.2;
    const umbrellaPole = BABYLON.MeshBuilder.CreateCylinder("umbPole_" + x + z,
      { height: poleH, diameter: 0.06, tessellation: 8 }, scene);
    umbrellaPole.position.set(x, poleH / 2, z);
    umbrellaPole.material = bmat("#c8b080");
    // Copa de sombrilla (2 capas para efecto de faldón)
    const umbrella = BABYLON.MeshBuilder.CreateCylinder("umb_" + x + z,
      { diameterTop: 0.3, diameterBottom: 2.2, height: 0.35, tessellation: 10 }, scene);
    umbrella.position.set(x, poleH - 0.05, z);
    umbrella.material = bmat("#c76f45"); // terracota
    registerShadowCaster(umbrella);
    umbrella.freezeWorldMatrix();
    const umbrellaSkirt = BABYLON.MeshBuilder.CreateCylinder("umbSkirt_" + x + z,
      { diameterTop: 2.15, diameterBottom: 2.35, height: 0.12, tessellation: 10 }, scene);
    umbrellaSkirt.position.set(x, poleH - 0.38, z);
    umbrellaSkirt.material = bmat("#e8d8b0");
    umbrellaSkirt.freezeWorldMatrix();
    // Mesa redonda
    const tableTop = BABYLON.MeshBuilder.CreateCylinder("tableTop_" + x + z,
      { diameter: 0.72, height: 0.06, tessellation: 24 }, scene);
    tableTop.position.set(x, 0.74, z);
    tableTop.material = bmat("#e8dcc8");
    registerShadowCaster(tableTop);
    tableTop.freezeWorldMatrix();
    // Pie de la mesa
    const tableLeg = BABYLON.MeshBuilder.CreateCylinder("tableLeg_" + x + z,
      { diameterTop: 0.06, diameterBottom: 0.28, height: 0.74, tessellation: 8 }, scene);
    tableLeg.position.set(x, 0.37, z);
    tableLeg.material = bmat("#3a3530");
    tableLeg.freezeWorldMatrix();
    // 2 sillas rústicas alrededor
    [-0.54, 0.54].forEach((offset, ci) => {
      const chairAngle = rotY + (ci === 0 ? 0.55 : -0.55);
      const cx2 = x + Math.sin(chairAngle) * 0.54;
      const cz2 = z + Math.cos(chairAngle) * 0.54;
      // Asiento silla
      const chairSeat = BABYLON.MeshBuilder.CreateBox("chairSeat_" + x + z + ci,
        { width: 0.34, height: 0.04, depth: 0.34 }, scene);
      chairSeat.position.set(cx2, 0.44, cz2);
      chairSeat.rotation.y = chairAngle;
      chairSeat.material = bmat("#9a6838");
      chairSeat.freezeWorldMatrix();
      // Respaldo silla
      const chairBack = BABYLON.MeshBuilder.CreateBox("chairBack_" + x + z + ci,
        { width: 0.32, height: 0.34, depth: 0.04 }, scene);
      chairBack.position.set(
        cx2 + Math.sin(chairAngle) * 0.17,
        0.64, cz2 + Math.cos(chairAngle) * 0.17
      );
      chairBack.rotation.y = chairAngle;
      chairBack.material = bmat("#9a6838");
      chairBack.freezeWorldMatrix();
      // Patas
      const chairLeg = BABYLON.MeshBuilder.CreateBox("chairLeg_" + x + z + ci,
        { width: 0.05, height: 0.42, depth: 0.05 }, scene);
      chairLeg.position.set(cx2, 0.21, cz2);
      chairLeg.material = bmat("#3a3530");
      chairLeg.freezeWorldMatrix();
    });
  }

  // ============================================================
  // MACETAS GRANDES DE TERRACOTA (Vasi di Terracotta)
  // ============================================================
  function createTerracottaVase(x, z, scale) {
    const vase = BABYLON.MeshBuilder.CreateCylinder("terVase_" + x + z,
      { diameterTop: 0.55 * scale, diameterBottom: 0.42 * scale, height: 0.6 * scale, tessellation: 12 }, scene);
    vase.position.set(x, 0.3 * scale, z);
    vase.material = bmat("#a05030");
    registerShadowCaster(vase);
    vase.freezeWorldMatrix();
    // Borde superior
    const rim = BABYLON.MeshBuilder.CreateCylinder("terRim_" + x + z,
      { diameterTop: 0.62 * scale, diameterBottom: 0.57 * scale, height: 0.1 * scale, tessellation: 12 }, scene);
    rim.position.set(x, 0.61 * scale, z);
    rim.material = bmat("#883820");
    rim.freezeWorldMatrix();
    // Planta
    const plant = BABYLON.MeshBuilder.CreateSphere("terPlant_" + x + z,
      { diameter: 0.5 * scale, segments: 8 }, scene);
    plant.position.set(x, 0.78 * scale, z);
    plant.scaling.y = 0.65;
    plant.material = bmat("#4a7a30");
    registerShadowCaster(plant);
    plant.freezeWorldMatrix();
    addWorldCollider(x, z, 0.65 * scale, 0.65 * scale);
  }

  createItalianFountain();

  // Campanile al norte-noroeste de la piazza
  createCampanile(14, 24);

  // Iglesia adyacente al campanile
  createChiesa(-2, 28);

  // Vespa frente al caffè
  createVespa(11, -12, Math.PI * 0.15);
  createVespa(-6, -14, Math.PI * -0.08);

  // Mesas de café bajo los pórticos (zona sur de la piazza)
  createCafeTable(-10.5, -10.5, Math.PI * 0.1);
  createCafeTable(-8, -10, Math.PI * 0.05);
  createCafeTable(-5.5, -10.5, Math.PI * -0.05);
  createCafeTable(3, -11, Math.PI * 0.12);
  createCafeTable(5.5, -11.5, Math.PI * -0.08);

  // Macetas de terracota en la piazza y calles
  createTerracottaVase(-5, -7.5, 1.1);
  createTerracottaVase(5, -7.5, 1.0);
  createTerracottaVase(-5, 7.5, 1.15);
  createTerracottaVase(5, 7.5, 1.05);
  createTerracottaVase(-9, 2, 0.9);
  createTerracottaVase(9, -2, 0.95);

  // Farolas de hierro forjado mejoradas (Lampione)
  createLampPost(-7, -7);
  createLampPost(7, -7);
  createLampPost(-7, 7);
  createLampPost(7, 7);
  createLampPost(-22, -12);
  createLampPost(20, -16);
  createLampPost(-26, 8);
  createLampPost(24, 14);
  createLampPost(0, -12);
  createLampPost(0, 12);

  // Bancos en la piazza (alrededor de la fuente)
  createBench(-5, -9, 0);
  createBench(5, -9, 0);
  createBench(-5, 9, Math.PI);
  createBench(5, 9, Math.PI);
  createBench(-9, -4, Math.PI / 2);
  createBench(9, -4, -Math.PI / 2);
  createBench(-9, 4, Math.PI / 2);
  createBench(9, 4, -Math.PI / 2);

  // Planters en esquinas de la piazza
  createPlanter(-4, -4);
  createPlanter(4, -4);
  createPlanter(-4, 4);
  createPlanter(4, 4);

  // --- Señalética italiana --------------------------------------------------
  function createStreetSign(x, z, rotY, text, subtext) {
    const tex = new BABYLON.DynamicTexture("signTex", { width: 256, height: 64 }, scene, true);
    const ctx = tex.getContext();
    ctx.fillStyle = "#1a3a5c";
    ctx.fillRect(0, 0, 256, 64);
    ctx.strokeStyle = "#f2b84b";
    ctx.lineWidth = 4;
    ctx.strokeRect(2, 2, 252, 60);
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 28px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, 128, subtext ? 22 : 34);
    if (subtext) {
      ctx.fillStyle = "#f2b84b";
      ctx.font = "14px Arial";
      ctx.fillText(subtext, 128, 48);
    }
    tex.update();

    const pole = BABYLON.MeshBuilder.CreateCylinder("signPole", { height: 2.8, diameter: 0.06, tessellation: 6 }, scene);
    pole.position.set(x, 1.4, z);
    pole.material = bmat("#3a3530");
    const sign = BABYLON.MeshBuilder.CreatePlane("signPlane", { width: 1.6, height: 0.4 }, scene);
    sign.position.set(x, 2.9, z);
    sign.rotation.y = rotY;
    const mat = new BABYLON.StandardMaterial("signMat", scene);
    mat.diffuseTexture = tex;
    mat.specularColor = new BABYLON.Color3(0, 0, 0);
    mat.emissiveColor = new BABYLON.Color3(0.3, 0.3, 0.3);
    mat.backFaceCulling = false;
    sign.material = mat;
    addWorldCollider(x, z, 0.2, 0.2);
  }

  function createShopSign(x, z, rotY, text) {
    const tex = new BABYLON.DynamicTexture("shopSignTex", { width: 256, height: 64 }, scene, true);
    const ctx = tex.getContext();
    ctx.fillStyle = "#2b1b16";
    ctx.fillRect(0, 0, 256, 64);
    ctx.strokeStyle = "#f2b84b";
    ctx.lineWidth = 3;
    ctx.strokeRect(2, 2, 252, 60);
    ctx.fillStyle = "#f2b84b";
    ctx.font = "bold 26px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, 128, 34);
    tex.update();

    const sign = BABYLON.MeshBuilder.CreatePlane("shopSign", { width: 1.8, height: 0.45 }, scene);
    sign.position.set(x, 3.2, z);
    sign.rotation.y = rotY;
    const mat = new BABYLON.StandardMaterial("shopSignMat", scene);
    mat.diffuseTexture = tex;
    mat.specularColor = new BABYLON.Color3(0, 0, 0);
    mat.emissiveColor = new BABYLON.Color3(0.4, 0.4, 0.4);
    mat.backFaceCulling = false;
    sign.material = mat;
  }

  createStreetSign(-6.5, -6.5, 0, "VIA ROMA", "centro storico");
  createStreetSign(6.5, -6.5, Math.PI/2, "CORSO VITTORIO", "Emanuele II");
  createStreetSign(-6.5, 6.5, -Math.PI/2, "PIAZZA NAVONA", "zona pedonale");
  createStreetSign(6.5, 6.5, Math.PI, "VILLA MEDICI", "giardini");
  createStreetSign(-24, -2, Math.PI/2, "BORGO PIO", "Rione XIV");
  createStreetSign(22, -2, -Math.PI/2, "LUNGOTEVERE", "Lungotevere Flaminio");
  createStreetSign(0, -26, 0, "VIALE GIULIO", "Cesare");
  createStreetSign(0, 26, Math.PI, "PONTE MILVIO", "Ponte Milvio");

  createShopSign(-14, -9.5, 0, "PANETTERIA");
  createShopSign(12, -13.5, 0, "CAFFÈ");
  createShopSign(-15, 2, Math.PI/2, "MERCATO");
  createShopSign(22, -1.5, -Math.PI/2, "RISTORANTE");
  createShopSign(17, 9.5, Math.PI, "BARBERIA");
  createShopSign(-18, -15.5, Math.PI/2, "NEGOZIO");
  createShopSign(20, 14.5, Math.PI, "MUSEO");
  createShopSign(0, 19, Math.PI/2, "FARMACIA");

  // --- NPCs PULIDOS CON MÁS VARIEDAD ---
  const npcList = [];

  // Accesorios adicionales por rol
  const NPC_ACCESSORIES = {
    barista: ["glasses", "apron_white"],
    cameriere: ["apron_black", "bowtie"],
    panettiere: ["apron_white", "hat_chef"],
    gelataio: ["apron_blue", "hat_straw"],
    medico: ["glasses", "coat_white"],
    farmacista: ["glasses", "coat_white"],
    barbiere: ["apron_white", "scissors"],
    edicolante: ["glasses", "cap"],
    vigile: ["hat_vigile", "whistle"],
    professore: ["glasses", "book"],
    turista: ["hat_straw", "camera"],
    studente: ["backpack", "headphones"],
    nonna: ["glasses", "scarf"],
    musicista: ["hat_beret", "instrument"],
    artista: ["hat_beret", "scarf"],
    sportivo: ["headband", "bottle"],
    bancario: ["tie", "glasses"],
    avvocato: ["tie", "briefcase"],
    commessa: ["apron_pink", "earrings"],
    pescivendolo: ["apron_blue", "hat_paper"]
  };

  function drawNpcTag(npcInfo, isNear) {
    const texture = npcInfo.tagTexture;
    const context = texture.getContext();
    context.clearRect(0, 0, 512, 256);

    if (isNear) {
      context.fillStyle = npcInfo.mission.color || "#c76f45";
      context.fillRect(0, 0, 512, 256);
      context.strokeStyle = "#f2b84b";
      context.lineWidth = 14;
      context.strokeRect(7, 7, 498, 242);
      context.fillStyle = "#ffffff";
      context.font = "bold 44px Arial";
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillText(npcInfo.mission.npc, 256, 100);
      context.fillStyle = "#f2b84b";
      context.font = "italic 32px Arial";
      context.fillText("¡Cerca! Hablar", 256, 175);
    } else {
      context.fillStyle = "rgba(26, 20, 16, 0.78)";
      context.fillRect(0, 0, 512, 256);
      context.strokeStyle = "rgba(248, 241, 223, 0.25)";
      context.lineWidth = 6;
      context.strokeRect(3, 3, 506, 250);
      context.fillStyle = "#f8f1df";
      context.font = "bold 44px Arial";
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillText(npcInfo.mission.npc, 256, 128);
    }

    texture.update();
  }

  // --- Spawn de NPCs humanoides (async: espera a que cargue el GLB) -----------
  function spawnAllNpcs() {
    if (typeof missions === "undefined" || !Array.isArray(missions)) return;
    missions.forEach(function(m, index) {
      var rotY = ((index % 8) / 8) * Math.PI * 2;
      var npcResult = (typeof spawnHumanoidNpc === "function")
        ? spawnHumanoidNpc(scene, m.id, m.pos, rotY, registerShadowCaster)
        : null;
      if (!npcResult) return;
      var npc = npcResult.root;

      const dynamicTexture = new BABYLON.DynamicTexture("dynTex_" + m.id, { width: 512, height: 256 }, scene, true);
      dynamicTexture.hasAlpha = true;

      const plane = BABYLON.MeshBuilder.CreatePlane("nameTag_" + m.id, { width: 2.2, height: 1.1 }, scene);
      plane.position.set(0, 2.35, 0);
      plane.parent = npc;
      plane.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;

      const planeMat = new BABYLON.StandardMaterial("tagMat_" + m.id, scene);
      planeMat.diffuseTexture = dynamicTexture;
      planeMat.specularColor = new BABYLON.Color3(0, 0, 0);
      planeMat.emissiveColor = new BABYLON.Color3(1, 1, 1);
      planeMat.backFaceCulling = false;
      plane.material = planeMat;

      const npcInfo = {
        mesh: npc,
        tagPlane: plane,
        tagTexture: dynamicTexture,
        mission: m,
        isNear: false,
        baseRotationY: npc.rotation.y
      };

      drawNpcTag(npcInfo, false);
      npcList.push(npcInfo);
    });

    // Mundo vivo dentro del callback: peatones tambien pueden usar GLBs cargados
    if (typeof initLivingWorld === "function") {
      initLivingWorld(scene, registerShadowCaster, canOccupyPosition);
    }
  }

  if (typeof loadNpcModels === "function") {
    var npcsLoaded = false;
    var worldLoaded = false;
    function checkReady() {
      if (npcsLoaded && worldLoaded) {
        spawnAllNpcs();
      }
    }
    loadNpcModels(scene, function() {
      npcsLoaded = true;
      checkReady();
    });
    if (typeof loadWorldAssets === "function") {
      loadWorldAssets(scene, function() {
        worldLoaded = true;
        checkReady();
      });
    } else {
      worldLoaded = true;
      checkReady();
    }
  } else {
    console.warn("[game.js] npcLoader.js no disponible — NPCs omitidos");
    if (typeof initLivingWorld === "function") {
      initLivingWorld(scene, registerShadowCaster, canOccupyPosition);
    }
  }


  // --- Cámaras: una ArcRotate (3ª persona y cenital) + una Universal (1ª) ----
  const arcCam = new BABYLON.ArcRotateCamera("arc", -Math.PI / 2, Math.PI / 2.4, 11, cameraTarget, scene);
  arcCam.wheelPrecision = 30;
  arcCam.panningSensibility = 0;
  if (arcCam.inputs && arcCam.inputs.removeByType) {
    arcCam.inputs.removeByType("ArcRotateCameraKeyboardMoveInput");
  }
  arcCam.lowerBetaLimit = 0.4;
  arcCam.upperBetaLimit = Math.PI / 2.15;
  arcCam.lowerRadiusLimit = 5;
  arcCam.upperRadiusLimit = 22;

  const fpsCam = new BABYLON.UniversalCamera("fps", new BABYLON.Vector3(0, 1.6, 0), scene);
  fpsCam.minZ = 0.05;
  fpsCam.fov = 0.95;
  fpsCam.inertia = 0.5;
  fpsCam.keysUp = []; fpsCam.keysDown = []; fpsCam.keysLeft = []; fpsCam.keysRight = [];
  fpsCam.speed = 0;

  // --- Estado del jugador y animaciones --------------------------------------
  function getEffectiveSpeed() {
    let s = PLAYER_SPEED;
    if (state.activeEffects && state.activeEffects.speedBoost && state.activeEffects.speedBoost > Date.now()) s *= 1.5;
    return s;
  }
  const PLAYER_SPEED = 6, RUN_MULT = 1.9, TURN_LERP = 0.18;
  const MODEL_YAW_OFFSET = 0;
  let hero = null;
  let anims = { idle: null, walk: null, run: null };
  let emotes = { wave: null, yes: null, no: null, cheer: null };
  let current = null;
  let feel = "tps";
  let lastCameraDragTime = -Infinity;

  // --- Sistema de movimiento avanzado --------------------------------------
  const playerState = {
    velocity: new BABYLON.Vector3(0, 0, 0),
    verticalVelocity: 0,
    isGrounded: true,
    isJumping: false,
    isCrouching: false,
    targetHeight: 1.0,
    currentHeight: 1.0,
    lastMoveDirection: new BABYLON.Vector3(0, 0, 0),
    moveSpeed: 0
  };

  const GRAVITY = -25;
  const JUMP_FORCE = 9;
  const CROUCH_HEIGHT = 0.6;
  const STAND_HEIGHT = 1.0;
  const CROUCH_SPEED_MULT = 0.5;

  function moveHeroWithCollision(delta) {
    if (!hero || delta.lengthSquared() < 0.000001) return;
    const nextX = hero.position.x + delta.x;
    const nextZ = hero.position.z + delta.z;

    if (canOccupyPosition(nextX, nextZ)) {
      hero.position.x = nextX;
      hero.position.z = nextZ;
      return;
    }

    if (canOccupyPosition(nextX, hero.position.z)) {
      hero.position.x = nextX;
    }
    if (canOccupyPosition(hero.position.x, nextZ)) {
      hero.position.z = nextZ;
    }
  }

  function play(group) {
    if (group === current && !emoteActive) return;
    if (emoteActive && (group === anims.walk || group === anims.run)) {
      emoteActive = false;
    }
    if (emoteActive) return;
    if (current) current.stop();
    if (group) group.start(true, 1.0, group.from, group.to, false);
    current = group;
  }

  let emoteActive = false;
  function playEmote(group) {
    if (!group) return;
    if (current) current.stop();
    emoteActive = true;
    current = group;
    group.start(false, 1.0, group.from, group.to, false);
    group.onAnimationEndObservable.addOnce(() => {
      emoteActive = false;
      play(anims.idle);
    });
  }

  function setFeel(mode) {
    feel = mode;
    arcCam.detachControl();
    fpsCam.detachControl();
    if (mode === "fov") {
      scene.activeCamera = fpsCam;
      fpsCam.attachControl(canvas, true);
      if (hero) hero.setEnabled(false);
    } else {
      scene.activeCamera = arcCam;
      arcCam.attachControl(canvas, true);
      if (hero) { hero.setEnabled(true); arcCam.lockedTarget = cameraTarget; }
    }
    document.querySelectorAll("#feelSwitch button").forEach((b) => {
      b.classList.toggle("active", b.dataset.feel === mode);
    });
  }

  function lerpAngle(current, target, step) {
    const diff = ((target - current + Math.PI) % (2 * Math.PI)) - Math.PI;
    return current + Math.min(step, Math.abs(diff)) * Math.sign(diff);
  }

  document.querySelectorAll("#feelSwitch button").forEach((b) => {
    b.addEventListener("click", () => setFeel(b.dataset.feel));
  });
  canvas.addEventListener("pointerdown", () => { lastCameraDragTime = Date.now(); });
  window.addEventListener("keydown", (e) => {
    if (e.key.toLowerCase() === "v") {
      if (feel === "fov") setFeel("tps");
      else if (feel === "tps") setFeel("follow");
      else setFeel("fov");
    }
  });

  // --- Carga del héroe -------------------------------------------------------
  loadingText.textContent = "Cargando personaje 3D…";
  
  const selectedModel = state.playerModel || "female-a";
  const modelInfo = window.CHARACTER_MODELS[selectedModel] || window.CHARACTER_MODELS["female-a"];
  const modelBase = "game/models/characters/kenney-mini-people/";
  const modelFile = modelInfo.file;

  BABYLON.SceneLoader.ImportMeshAsync("", modelBase, modelFile, scene)
    .then((res) => {
      const glbRoot = res.meshes[0];
      glbRoot.parent = playerParent;
      
      // Normalizar escala para que mida ~1.8 unidades de alto
      glbRoot.scaling.set(1, 1, 1);
      const bounds = glbRoot.getHierarchyBoundingVectors();
      const h = bounds.max.y - bounds.min.y;
      const scale = 1.8 / (h || 1.0);
      glbRoot.scaling.set(scale, scale, scale);

      // Rotar Y para mirar en la dirección correcta (hacia +Z)
      if (glbRoot.rotationQuaternion) {
        glbRoot.rotationQuaternion = glbRoot.rotationQuaternion.multiply(BABYLON.Quaternion.RotationYawPitchRoll(Math.PI, 0, 0));
      } else {
        glbRoot.rotation = new BABYLON.Vector3(0, Math.PI, 0);
      }

      res.meshes.forEach((mesh) => registerShadowCaster(mesh));
      hero = playerParent;

      // Usar res.animationGroups y mapear robustamente las animaciones
      anims.idle = res.animationGroups.find(g => g.name.toLowerCase().includes("idle")) || res.animationGroups[0] || null;
      anims.walk = res.animationGroups.find(g => g.name.toLowerCase().includes("walk")) || res.animationGroups[1] || null;
      anims.run = res.animationGroups.find(g => g.name.toLowerCase().includes("sprint")) || res.animationGroups.find(g => g.name.toLowerCase().includes("run")) || anims.walk;

      // Mapear los emotes del jugador
      emotes.wave = res.animationGroups.find(g => g.name.toLowerCase().includes("wave")) || null;
      emotes.yes = res.animationGroups.find(g => g.name.toLowerCase().includes("yes")) || null;
      emotes.no = res.animationGroups.find(g => g.name.toLowerCase().includes("no")) || null;
      emotes.cheer = res.animationGroups.find(g => g.name.toLowerCase().includes("cheer")) || res.animationGroups.find(g => g.name.toLowerCase().includes("jump")) || null;

      res.animationGroups.forEach((g) => g.stop());
      play(anims.idle);
      setFeel("tps");
      hideLoading();

      // Conectar botones táctiles de la UI (A5)
      document.querySelectorAll(".emote-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          if (state.inDialogue || playerState.isJumping || playerState.moveSpeed > 0) return;
          const emoteType = btn.dataset.emote;
          if (emoteType && emotes[emoteType]) {
            playEmote(emotes[emoteType]);
          }
        });
      });
    })
    .catch((err) => {
      console.warn("No se pudo cargar el modelo, usando cápsula:", err);
      const capsule = BABYLON.MeshBuilder.CreateCapsule("hero", { height: 1.8, radius: 0.4 }, scene);
      capsule.position.y = 0.9;
      const hm = new BABYLON.StandardMaterial("hm", scene);
      hm.diffuseColor = BABYLON.Color3.FromHexString(state.topColor || state.outfit || "#5fa6a7");
      capsule.material = hm;
      const nose = BABYLON.MeshBuilder.CreateBox("nose", { size: 0.18 }, scene);
      nose.parent = capsule; nose.position.set(0, 0.3, 0.42);
      const nm = new BABYLON.StandardMaterial("nm", scene);
      nm.diffuseColor = BABYLON.Color3.FromHexString(state.skin || "#d8a079");
      nose.material = nm;
      capsule.parent = playerParent;
      registerShadowCaster(capsule);
      registerShadowCaster(nose);
      hero = playerParent;
      setFeel("tps");
      hideLoading();
    });

  // --- Bucle de actualización ------------------------------------------------
  const EYE_HEIGHT = 1.55;
  const EYE_HEIGHT_CROUCH = 0.9;
  let lastStepTime = 0;
  scene.onBeforeRenderObservable.add(() => {
    if (!hero) return;
    const dt = engine.getDeltaTime() / 1000;
    readKeyboard();

    // Actualizar altura del jugador (agacharse/levantarse)
    const targetHeight = input.crouch ? CROUCH_HEIGHT : STAND_HEIGHT;
    playerState.currentHeight = BABYLON.Scalar.Lerp(playerState.currentHeight, targetHeight, dt * 8);
    playerState.isCrouching = playerState.currentHeight < STAND_HEIGHT * 0.9;

    // Física de salto
    if (input.jump && playerState.isGrounded && !playerState.isCrouching) {
      playerState.verticalVelocity = JUMP_FORCE;
      playerState.isGrounded = false;
      playerState.isJumping = true;
    }

    if (!playerState.isGrounded) {
      playerState.verticalVelocity += GRAVITY * dt;
      hero.position.y += playerState.verticalVelocity * dt;

      if (hero.position.y <= 0.1) {
        hero.position.y = 0.1;
        playerState.verticalVelocity = 0;
        playerState.isGrounded = true;
        playerState.isJumping = false;
      }
    }

    cameraTarget.position.copyFrom(hero.position);
    cameraTarget.position.y += 1.2 * playerState.currentHeight;

    let sway = 0;
    if (state.activeEffects && state.activeEffects.dizzy && state.activeEffects.dizzy > Date.now()) {
      sway = Math.sin(Date.now() * 0.006) * 0.4;
      cameraTarget.position.x += sway;
    }

    const dirCam = (feel === "fov") ? fpsCam : arcCam;
    const mag = Math.hypot(input.x, input.z);
    let desiredFollowAlpha = null;

    if (mag > 0.05) {
      if (feel === "fov") {
        const FPS_TURN_SPEED = 2.0;
        fpsCam.rotation.y += input.x * FPS_TURN_SPEED * dt;
        const fwd = fpsCam.getDirection(BABYLON.Axis.Z);
        fwd.y = 0; fwd.normalize();
        const move = fwd.scale(input.z);
        const speedMult = playerState.isCrouching ? CROUCH_SPEED_MULT : 1;
        const speed = getEffectiveSpeed() * (input.run ? RUN_MULT : 1) * Math.min(1, Math.abs(input.z)) * speedMult;
        moveHeroWithCollision(move.scale(speed * dt));
        const targetYaw = fpsCam.rotation.y + MODEL_YAW_OFFSET;
        const targetQ = BABYLON.Quaternion.RotationYawPitchRoll(targetYaw, 0, 0);
        if (!hero.rotationQuaternion) hero.rotationQuaternion = targetQ.clone();
        BABYLON.Quaternion.SlerpToRef(hero.rotationQuaternion, targetQ, TURN_LERP, hero.rotationQuaternion);

        if (playerState.isJumping) {
          play(anims.run);
        } else if (input.run && !playerState.isCrouching) {
          play(anims.run);
        } else {
          play(anims.walk);
        }
      } else {
        const a = arcCam.alpha;
        const fwd = new BABYLON.Vector3(-Math.cos(a), 0, -Math.sin(a));
        const right = new BABYLON.Vector3(-Math.sin(a), 0, Math.cos(a));
        const move = fwd.scale(input.z).add(right.scale(input.x));
        if (move.lengthSquared() > 0.0001) {
          move.normalize();
          const speedMult = playerState.isCrouching ? CROUCH_SPEED_MULT : 1;
          const speed = getEffectiveSpeed() * (input.run ? RUN_MULT : 1) * Math.min(1, mag) * speedMult;
          moveHeroWithCollision(move.scale(speed * dt));
          const targetYaw = Math.atan2(move.x, move.z) + MODEL_YAW_OFFSET;
          desiredFollowAlpha = Math.atan2(-move.z, -move.x);
          const targetQ = BABYLON.Quaternion.RotationYawPitchRoll(targetYaw, 0, 0);
          if (!hero.rotationQuaternion) hero.rotationQuaternion = targetQ.clone();
          BABYLON.Quaternion.SlerpToRef(hero.rotationQuaternion, targetQ, TURN_LERP, hero.rotationQuaternion);

          playerState.lastMoveDirection.copyFrom(move);
          playerState.moveSpeed = speed;

          if (playerState.isJumping) {
            play(anims.run);
          } else if (input.run && !playerState.isCrouching) {
            play(anims.run);
          } else {
            play(anims.walk);
          }
        }
        const stepNow = Date.now();
        if (stepNow - lastStepTime > 380) {
          lastStepTime = stepNow;
          if (typeof sfxStep === "function") sfxStep();
        }
      }
      if (feel !== "fov" && desiredFollowAlpha !== null && (Date.now() - lastCameraDragTime) > 800) {
        arcCam.alpha = lerpAngle(arcCam.alpha, desiredFollowAlpha, 0.055);
      }
    } else {
      if (playerState.isJumping) {
        play(anims.run);
      } else {
        play(anims.idle);
      }
      playerState.moveSpeed = 0;
    }

    if (feel === "fov") {
      const eyeH = playerState.isCrouching ? EYE_HEIGHT_CROUCH : EYE_HEIGHT;
      fpsCam.position.set(hero.position.x + sway, hero.position.y + eyeH * playerState.currentHeight, hero.position.z);
    }

    // --- Actualizar mundo vivo ----------------------------------------------
    if (typeof updateLivingWorld === "function") {
      updateLivingWorld(dt, hero.position);
    }

    // --- Loop de proximidad para NPCs -----------------------------------------
    let nearestNpc = null;
    let minNpcDist = Infinity;

    npcList.forEach((npcInfo) => {
      const dx = hero.position.x - npcInfo.mesh.position.x;
      const dz = hero.position.z - npcInfo.mesh.position.z;
      const dist = Math.hypot(dx, dz);

      const isNear = dist < 3.5;

      if (isNear && dist < minNpcDist) {
        minNpcDist = dist;
        nearestNpc = npcInfo;
      }

      if (npcInfo.isNear !== isNear) {
        npcInfo.isNear = isNear;
        drawNpcTag(npcInfo, isNear);
      }

      npcInfo.mesh.position.y = Math.sin(Date.now() * 0.002 + npcInfo.mission.id.length) * 0.025;

      if (isNear) {
        const npcAngle = Math.atan2(hero.position.x - npcInfo.mesh.position.x, hero.position.z - npcInfo.mesh.position.z);
        npcInfo.mesh.rotation.y = lerpAngle(npcInfo.mesh.rotation.y, npcAngle, 0.05);
      } else {
        npcInfo.mesh.rotation.y = lerpAngle(npcInfo.mesh.rotation.y, npcInfo.baseRotationY, 0.02);
      }

      if (state.inDialogue && state.activeMission && npcInfo.mission.id === state.activeMission.id) {
        npcInfo.mesh.rotation.z = Math.sin(Date.now() * 0.005) * 0.06;
      } else if (Math.abs(npcInfo.mesh.rotation.z) > 0.001) {
        npcInfo.mesh.rotation.z *= 0.9;
      }
    });

    nearestNpcGlobal = nearestNpc;

    if (nearestNpc && !state.inDialogue) {
      proximityUI.style.display = "block";
      proximityUI.style.opacity = "1";
      proximityUI.innerHTML = `Personaggio Vicino **${nearestNpc.mission.npc}**

${nearestNpc.mission.place} (${nearestNpc.mission.level})

Presiona E para hablar`;
    } else {
      proximityUI.style.display = "none";
      proximityUI.style.opacity = "0";
    }

    if (audioInitDone && typeof playZoneSound === "function") {
      playZoneSound(hero.position.x, hero.position.z);
    }
  });

  // --- Anti-clip de cámara (regla B1) ---------------------------------------
  // Cada frame: si el segmento cameraTarget→posición ideal de la ArcRotateCamera
  // atraviesa un cameraBlocker, se acorta el radio para dejar la cámara delante
  // de la fachada. Registrado DESPUÉS del update principal para leer el
  // cameraTarget ya actualizado. Sin allocations por frame.
  const CAM_CLIP_MARGIN = 0.45;
  let camBaseRadius = arcCam.radius;
  let camLastSetRadius = arcCam.radius;
  const camIdealPos = { x: 0, y: 0, z: 0 };

  // Primer t∈(0,1) donde el segmento o→e entra en el AABB b (slab method).
  // Devuelve 1 si no lo cruza. minY implícito = 0 (los edificios tocan suelo).
  function segmentAabbEntryT(o, e, b) {
    let tMin = 0, tMax = 1;
    for (let axis = 0; axis < 3; axis++) {
      const k = axis === 0 ? "x" : axis === 1 ? "y" : "z";
      const lo = axis === 0 ? b.minX : axis === 1 ? 0 : b.minZ;
      const hi = axis === 0 ? b.maxX : axis === 1 ? b.maxY : b.maxZ;
      const ov = o[k], dv = e[k] - ov;
      if (Math.abs(dv) < 1e-9) {
        if (ov < lo || ov > hi) return 1;
        continue;
      }
      let t1 = (lo - ov) / dv, t2 = (hi - ov) / dv;
      if (t1 > t2) { const tmp = t1; t1 = t2; t2 = tmp; }
      if (t1 > tMin) tMin = t1;
      if (t2 < tMax) tMax = t2;
      if (tMin > tMax) return 1;
    }
    // tMin <= 0 significa que el origen ya está dentro (imposible para el
    // jugador por los worldColliders) — no acortar.
    return tMin > 0 ? tMin : 1;
  }

  scene.onBeforeRenderObservable.add(() => {
    if (scene.activeCamera !== arcCam) {
      camLastSetRadius = arcCam.radius; // no acumular deltas mientras está la 1ª persona
      return;
    }
    // Zoom del usuario desde el último frame (rueda/pinch) → mover el radio base
    const userDelta = arcCam.radius - camLastSetRadius;
    if (Math.abs(userDelta) > 0.0001) {
      camBaseRadius = Math.min(arcCam.upperRadiusLimit || 22, Math.max(5, camBaseRadius + userDelta));
    }
    const tp = cameraTarget.position;
    const sinBeta = Math.sin(arcCam.beta);
    camIdealPos.x = tp.x + camBaseRadius * Math.cos(arcCam.alpha) * sinBeta;
    camIdealPos.y = tp.y + camBaseRadius * Math.cos(arcCam.beta);
    camIdealPos.z = tp.z + camBaseRadius * Math.sin(arcCam.alpha) * sinBeta;

    let bestT = 1;
    for (let i = 0; i < cameraBlockers.length; i++) {
      const t = segmentAabbEntryT(tp, camIdealPos, cameraBlockers[i]);
      if (t < bestT) bestT = t;
    }
    const radius = bestT < 1
      ? Math.max(1.8, camBaseRadius * bestT - CAM_CLIP_MARGIN)
      : camBaseRadius;
    arcCam.lowerRadiusLimit = Math.min(5, radius);
    arcCam.radius = radius;
    camLastSetRadius = radius;
  });
  // Solo para tests/debug (playbooks del brain): verificar que la cámara
  // nunca queda dentro de un blocker.
  window.__cameraBlockers = cameraBlockers;

  return scene;
}

// --- Arranque ---------------------------------------------------------------
function hideLoading() { loadingEl.classList.add("hidden"); setTimeout(() => { loadingEl.remove(); showWelcome(); }, 600); }

let audioInitDone = false;
function tryInitAudio() {
  if (audioInitDone) return;
  audioInitDone = true;
  initAudio();
  document.removeEventListener("pointerdown", tryInitAudio);
  document.removeEventListener("keydown", tryInitAudio);
}
document.addEventListener("pointerdown", tryInitAudio);
document.addEventListener("keydown", tryInitAudio);

loadState();
updateGameHUD();

const scene = createScene();
engine.runRenderLoop(() => scene.render());
window.addEventListener("resize", () => engine.resize());
