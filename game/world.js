"use strict";

// ============================================================================
// game/world.js — Mundo vivo mejorado: NPCs con rutinas, peatones, animales, vehículos
// Versión 0.4: Animales y vehículos con más detalle procedural
// ============================================================================

var VEHICLE_CONTAINERS = {};
var ANIMAL_CONTAINERS = {};
var _worldAssetsReady = false;

var VEHICLE_MANIFEST = [
  "ambulance", "delivery-flat", "delivery", "firetruck", "garbage-truck",
  "hatchback-sports", "police", "sedan-sports", "sedan", "suv-luxury",
  "suv", "taxi", "truck", "van"
];

var ANIMAL_MANIFEST = [
  { key: "dog-beagle", file: "dog-beagle.glb" },
  { key: "dog-husky", file: "dog-husky.glb" },
  { key: "dog-shiba", file: "dog-shiba.glb" },
  { key: "dog-simple", file: "dog-simple.glb" },
  { key: "dove", file: "dove.glb" },
  { key: "hen", file: "hen.glb" },
  { key: "seagull", file: "seagull.glb" }
];

function loadWorldAssets(scene, onReady) {
  var total = VEHICLE_MANIFEST.length + ANIMAL_MANIFEST.length;
  var loaded = 0;
  
  function checkDone() {
    if (++loaded === total) {
      _worldAssetsReady = true;
      if (typeof onReady === "function") onReady();
    }
  }

  VEHICLE_MANIFEST.forEach(function(name) {
    BABYLON.SceneLoader.LoadAssetContainerAsync("game/models/vehicles/kenney-car-kit/", name + ".glb", scene)
      .then(function(container) {
        VEHICLE_CONTAINERS[name] = container;
        checkDone();
      })
      .catch(function(err) {
        console.error("[world] Error cargando vehículo " + name + ":", err);
        checkDone();
      });
  });

  ANIMAL_MANIFEST.forEach(function(def) {
    BABYLON.SceneLoader.LoadAssetContainerAsync("game/models/animals/", def.file, scene)
      .then(function(container) {
        ANIMAL_CONTAINERS[def.key] = container;
        checkDone();
      })
      .catch(function(err) {
        console.error("[world] Error cargando animal " + def.file + ":", err);
        checkDone();
      });
  });
}


// --- Red de waypoints para peatones ----------------------------------------
const WALK_NETWORK = [
  { id: 0, x: -15, z: -20 }, { id: 1, x: 0, z: -25 }, { id: 2, x: 15, z: -20 },
  { id: 3, x: 25, z: 0 }, { id: 4, x: 15, z: 20 }, { id: 5, x: 0, z: 25 },
  { id: 6, x: -15, z: 20 }, { id: 7, x: -25, z: 0 },
  { id: 8, x: 0, z: 7, type: "plaza" },
  { id: 9, x: -8, z: -8, type: "plaza" }, { id: 10, x: 8, z: -8, type: "plaza" },
  { id: 11, x: -8, z: 8, type: "bench" }, { id: 12, x: 8, z: 8, type: "bench" }
];
const WALK_EDGES = [
  [0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,0],
  [0,8],[2,8],[4,8],[6,8],[8,9],[8,10],[8,11],[8,12]
];
function getNodeNeighbors(nodeId) {
  return WALK_EDGES.filter(e => e.includes(nodeId)).flatMap(e => e.filter(id => id !== nodeId));
}

// --- Peatones genéricos con IA básica --------------------------------------
const pedestrians = [];
const PEDESTRIAN_COLORS = ["#c76f45", "#6f9465", "#d0a14b", "#a4573c", "#8c7b68", "#5a7d9a", "#9e5a7d", "#2f3740", "#8b4fb3"];
const SKIN_TONES = ["#fde0c0", "#ecc99b", "#d8a079", "#c98b62", "#b87656", "#9d6a4b", "#7a4f38", "#5c3620"];
const HAIR_COLORS = ["#1a1410", "#3a2418", "#5a3523", "#7a5235", "#a67c52", "#c8b060", "#e8d8c0", "#f8f8f8"];

function createPedestrian(scene, shadowCasterFn, colliderCheckFn) {
  if (typeof spawnHumanoidNpc !== "function") return null;
  const idx = pedestrians.length;
  const nodeIdx = Math.floor(Math.random() * WALK_NETWORK.length);
  const spawn = WALK_NETWORK[nodeIdx];
  const pos = { x: spawn.x + (Math.random() - 0.5) * 3, z: spawn.z + (Math.random() - 0.5) * 3 };

  const npcResult = spawnHumanoidNpc(scene, "ped_" + idx, pos, Math.random() * Math.PI * 2, shadowCasterFn);
  if (!npcResult) return null;

  const ped = {
    mesh:            npcResult.root,
    idleAnim:        npcResult.idleAnim,
    walkAnim:        npcResult.walkAnim,
    currentAnim:     "idle",
    currentNodeId:   nodeIdx,
    targetNodeId:    nodeIdx,
    targetX:         pos.x,
    targetZ:         pos.z,
    speed:           1.2 + Math.random() * 0.8,
    state:           "walking",
    stateTimer:      0,
    socializeTarget: null
  };
  pickNewDestinationNode(ped);
  pedestrians.push(ped);
  return ped;
}

function pickNewDestinationNode(ped) {
  const neighbors = getNodeNeighbors(ped.currentNodeId);
  const targetNodeId = neighbors[Math.floor(Math.random() * neighbors.length)];
  ped.targetNodeId = targetNodeId;
  const targetNode = WALK_NETWORK[targetNodeId];
  ped.targetX = targetNode.x + (Math.random() - 0.5) * 1.6;
  ped.targetZ = targetNode.z + (Math.random() - 0.5) * 1.6;
}

function _setPedAnim(ped, animName) {
  if (ped.currentAnim === animName) return;
  if (animName === "walk") {
    if (ped.idleAnim) ped.idleAnim.stop();
    if (ped.walkAnim) ped.walkAnim.start(true);
  } else {
    if (ped.walkAnim) ped.walkAnim.stop();
    if (ped.idleAnim) ped.idleAnim.start(true);
  }
  ped.currentAnim = animName;
}

function updatePedestrians(dt, heroPos) {
  pedestrians.forEach(ped => {
    const playerDist = Math.hypot(ped.mesh.position.x - heroPos.x, ped.mesh.position.z - heroPos.z);
    if (playerDist < 2.5) {
      const awayX = ped.mesh.position.x - heroPos.x;
      const awayZ = ped.mesh.position.z - heroPos.z;
      const awayLen = Math.hypot(awayX, awayZ) || 1;
      ped.mesh.position.x += (awayX / awayLen) * ped.speed * dt * 1.5;
      ped.mesh.position.z += (awayZ / awayLen) * ped.speed * dt * 1.5;
      if (ped.socializeTarget) {
        ped.socializeTarget.state = "walking";
        ped.socializeTarget.socializeTarget = null;
        pickNewDestinationNode(ped.socializeTarget);
        ped.socializeTarget = null;
      }
      ped.state = "walking";
      pickNewDestinationNode(ped);
    }

    switch (ped.state) {
      case "walking": {
        const dx = ped.targetX - ped.mesh.position.x;
        const dz = ped.targetZ - ped.mesh.position.z;
        const dist = Math.hypot(dx, dz);
        if (dist < 0.5) {
          _setPedAnim(ped, "idle");
          ped.currentNodeId = ped.targetNodeId;
          const targetNode = WALK_NETWORK[ped.targetNodeId];
          const r = Math.random();
          if (r < 0.40) {
            pickNewDestinationNode(ped);
          } else if (r < 0.60) {
            ped.state = "idle"; ped.stateTimer = 2 + Math.random() * 3;
          } else if (r < 0.75 && targetNode && targetNode.type === "bench") {
            ped.state = "sitting"; ped.stateTimer = 8 + Math.random() * 8;
          } else if (r < 0.90) {
            const otherPed = pedestrians.find(o => o !== ped &&
              (o.state === "idle" || o.state === "looking") && !o.socializeTarget &&
              Math.hypot(o.mesh.position.x - ped.mesh.position.x, o.mesh.position.z - ped.mesh.position.z) < 5);
            if (otherPed) {
              ped.state = "socializing"; ped.stateTimer = 4 + Math.random() * 5;
              ped.socializeTarget = otherPed;
              otherPed.state = "socializing"; otherPed.stateTimer = ped.stateTimer;
              otherPed.socializeTarget = ped;
            } else {
              ped.state = "idle"; ped.stateTimer = 2 + Math.random() * 3;
            }
          } else {
            ped.state = "window_shopping"; ped.stateTimer = 3 + Math.random() * 4;
            ped.mesh.rotation.y += Math.PI / 2;
          }
        } else {
          const dir = Math.atan2(dx, dz);
          const diff = ((dir - ped.mesh.rotation.y + Math.PI) % (2 * Math.PI)) - Math.PI;
          ped.mesh.rotation.y += Math.min(0.08, Math.abs(diff)) * Math.sign(diff);
          ped.mesh.position.x += Math.sin(dir) * ped.speed * dt;
          ped.mesh.position.z += Math.cos(dir) * ped.speed * dt;
          _setPedAnim(ped, "walk");
        }
        break;
      }
      case "idle":
        _setPedAnim(ped, "idle");
        ped.stateTimer -= dt;
        if (ped.stateTimer <= 0) { pickNewDestinationNode(ped); ped.state = "walking"; }
        break;
      case "looking":
        _setPedAnim(ped, "idle");
        ped.stateTimer -= dt;
        if (ped.stateTimer <= 0) { pickNewDestinationNode(ped); ped.state = "walking"; }
        break;
      case "socializing":
        _setPedAnim(ped, "idle");
        ped.stateTimer -= dt;
        if (ped.stateTimer <= 0) {
          if (ped.socializeTarget) {
            ped.socializeTarget.state = "walking";
            ped.socializeTarget.socializeTarget = null;
            pickNewDestinationNode(ped.socializeTarget);
          }
          ped.socializeTarget = null;
          ped.state = "walking"; pickNewDestinationNode(ped);
        } else if (ped.socializeTarget) {
          const tx = ped.socializeTarget.mesh.position.x - ped.mesh.position.x;
          const tz = ped.socializeTarget.mesh.position.z - ped.mesh.position.z;
          ped.mesh.rotation.y = Math.atan2(tx, tz);
        }
        break;
      case "sitting":
        _setPedAnim(ped, "idle");
        ped.stateTimer -= dt;
        if (ped.stateTimer <= 0) {
          ped.state = "idle"; ped.stateTimer = 1;
        }
        break;
      case "window_shopping":
        _setPedAnim(ped, "idle");
        ped.stateTimer -= dt;
        if (ped.stateTimer <= 0) { ped.state = "idle"; ped.stateTimer = 1; }
        break;
    }
  });
}

// --- ANIMALES MEJORADOS CON MÁS DETALLE ---
const animals = [];

function createGlbAnimal(scene, shadowCasterFn, type, x, z) {
  var key = "";
  if (type === "dog") {
    var dogKeys = ["dog-beagle", "dog-husky", "dog-shiba", "dog-simple"];
    key = dogKeys[Math.floor(Math.random() * dogKeys.length)];
  } else if (type === "pigeon") {
    var birdKeys = ["dove", "seagull", "hen"];
    key = birdKeys[Math.floor(Math.random() * birdKeys.length)];
  }

  var container = ANIMAL_CONTAINERS[key];
  if (!container) return null;

  var root = new BABYLON.TransformNode(type + "_" + animals.length, scene);
  root.position.set(x, 0, z);

  var instances = container.instantiateModelsToScene();
  var glbRoot = instances.rootNodes[0];
  glbRoot.parent = root;

  glbRoot.scaling.set(1, 1, 1);
  var bounds = glbRoot.getHierarchyBoundingVectors();
  var h = bounds.max.y - bounds.min.y;
  var targetHeight = type === "dog" ? 0.55 : 0.3;
  var scale = targetHeight / (h || 1.0);
  glbRoot.scaling.set(scale, scale, scale);

  if (shadowCasterFn) {
    glbRoot.getChildMeshes().forEach(function(m) { shadowCasterFn(m); });
  }

  var idleAnim = null, walkAnim = null, runAnim = null;
  var prefix = "anim_" + type + "_" + animals.length + "_";
  instances.animationGroups.forEach(function(ag) {
    var base = ag.name.replace(/^Clone of /i, "");
    ag.name = prefix + base;
    var lower = base.toLowerCase();
    if (!idleAnim && (lower.includes("idle") || lower.includes("sit"))) idleAnim = ag;
    if (!walkAnim && lower.includes("walk")) walkAnim = ag;
    if (!runAnim && (lower.includes("run") || lower.includes("sprint") || lower.includes("fly") || lower.includes("flap"))) runAnim = ag;
  });

  if (!idleAnim) idleAnim = instances.animationGroups[0] || null;
  if (!walkAnim) walkAnim = instances.animationGroups[1] || idleAnim;
  if (!runAnim) runAnim = instances.animationGroups[2] || walkAnim;

  instances.animationGroups.forEach(function(ag) { ag.stop(); });
  if (idleAnim) idleAnim.start(true);

  var animal = {
    mesh: root,
    type: type,
    isGlb: true,
    targetX: x + (Math.random() - 0.5) * 8,
    targetZ: z + (Math.random() - 0.5) * 8,
    speed: type === "pigeon" ? 1.8 : 1.2 + Math.random() * 0.8,
    state: "wandering",
    stateTimer: 3 + Math.random() * 4,
    walkPhase: Math.random() * Math.PI * 2,
    homeX: x,
    homeZ: z,
    idleAnim: idleAnim,
    walkAnim: walkAnim,
    runAnim: runAnim,
    currentAnimGroup: idleAnim
  };

  animals.push(animal);
  return animal;
}

function createDog(scene, shadowCasterFn, x, z) {
  var glbDog = createGlbAnimal(scene, shadowCasterFn, "dog", x, z);
  if (glbDog) return glbDog;

  const root = new BABYLON.TransformNode("dog_" + animals.length, scene);
  root.position.set(x, 0, z);

  const dogColors = ["#8b6f47", "#5a4a3a", "#d4a574", "#2b2b2b", "#f5f5dc"];
  const bodyColor = dogColors[Math.floor(Math.random() * dogColors.length)];
  
  const bodyMat = new BABYLON.StandardMaterial("dogBody_" + animals.length, scene);
  bodyMat.diffuseColor = BABYLON.Color3.FromHexString(bodyColor);

  // Cuerpo más detallado
  const body = BABYLON.MeshBuilder.CreateBox("dogBody", { width: 0.32, height: 0.28, depth: 0.65 }, scene);
  body.position.set(0, 0.32, 0);
  body.material = bodyMat;
  body.parent = root;
  shadowCasterFn(body);

  // Pecho
  const chest = BABYLON.MeshBuilder.CreateSphere("dogChest", { diameter: 0.3, segments: 8 }, scene);
  chest.position.set(0, 0.32, 0.25);
  chest.scaling.set(1, 0.9, 1.1);
  chest.material = bodyMat;
  chest.parent = root;

  // Cabeza más detallada
  const head = BABYLON.MeshBuilder.CreateBox("dogHead", { width: 0.24, height: 0.22, depth: 0.26 }, scene);
  head.position.set(0, 0.4, 0.35);
  head.material = bodyMat;
  head.parent = root;
  shadowCasterFn(head);

  // Hocico
  const snout = BABYLON.MeshBuilder.CreateBox("dogSnout", { width: 0.14, height: 0.12, depth: 0.16 }, scene);
  snout.position.set(0, 0.36, 0.48);
  snout.material = bodyMat;
  snout.parent = root;

  // Nariz
  const nose = BABYLON.MeshBuilder.CreateSphere("dogNose", { diameter: 0.05, segments: 6 }, scene);
  nose.position.set(0, 0.38, 0.56);
  const noseMat = new BABYLON.StandardMaterial("dogNoseMat_" + animals.length, scene);
  noseMat.diffuseColor = BABYLON.Color3.FromHexString("#1a1a1a");
  nose.material = noseMat;
  nose.parent = root;

  // Orejas
  const earL = BABYLON.MeshBuilder.CreateBox("dogEarL", { width: 0.08, height: 0.14, depth: 0.06 }, scene);
  earL.position.set(-0.1, 0.5, 0.32);
  earL.rotation.z = -0.3;
  earL.material = bodyMat;
  earL.parent = root;

  const earR = BABYLON.MeshBuilder.CreateBox("dogEarR", { width: 0.08, height: 0.14, depth: 0.06 }, scene);
  earR.position.set(0.1, 0.5, 0.32);
  earR.rotation.z = 0.3;
  earR.material = bodyMat;
  earR.parent = root;

  // Patas más detalladas
  const legFL = BABYLON.MeshBuilder.CreateCylinder("dogLegFL", { height: 0.28, diameter: 0.07, tessellation: 6 }, scene);
  legFL.position.set(-0.11, 0.14, 0.22);
  legFL.material = bodyMat;
  legFL.parent = root;

  const legFR = BABYLON.MeshBuilder.CreateCylinder("dogLegFR", { height: 0.28, diameter: 0.07, tessellation: 6 }, scene);
  legFR.position.set(0.11, 0.14, 0.22);
  legFR.material = bodyMat;
  legFR.parent = root;

  const legBL = BABYLON.MeshBuilder.CreateCylinder("dogLegBL", { height: 0.28, diameter: 0.07, tessellation: 6 }, scene);
  legBL.position.set(-0.11, 0.14, -0.22);
  legBL.material = bodyMat;
  legBL.parent = root;

  const legBR = BABYLON.MeshBuilder.CreateCylinder("dogLegBR", { height: 0.28, diameter: 0.07, tessellation: 6 }, scene);
  legBR.position.set(0.11, 0.14, -0.22);
  legBR.material = bodyMat;
  legBR.parent = root;

  // Cola más larga y animada
  const tail = BABYLON.MeshBuilder.CreateCylinder("dogTail", { height: 0.25, diameterTop: 0.03, diameterBottom: 0.05, tessellation: 6 }, scene);
  tail.position.set(0, 0.42, -0.35);
  tail.rotation.x = -0.6;
  tail.material = bodyMat;
  tail.parent = root;

  const animal = {
    mesh: root,
    type: "dog",
    targetX: x + (Math.random() - 0.5) * 8,
    targetZ: z + (Math.random() - 0.5) * 8,
    speed: 1.2 + Math.random() * 0.8,
    state: "wandering",
    stateTimer: 3 + Math.random() * 4,
    walkPhase: Math.random() * Math.PI * 2,
    legFL, legFR, legBL, legBR, tail,
    homeX: x,
    homeZ: z
  };

  animals.push(animal);
  return animal;
}

function createCat(scene, shadowCasterFn, x, z) {
  const root = new BABYLON.TransformNode("cat_" + animals.length, scene);
  root.position.set(x, 0, z);

  const bodyMat = new BABYLON.StandardMaterial("catBody_" + animals.length, scene);
  const catColors = ["#4a4a4a", "#d4a574", "#8b6f47", "#2b2b2b", "#e8d4b8", "#f5f5dc", "#ff8c42"];
  bodyMat.diffuseColor = BABYLON.Color3.FromHexString(catColors[Math.floor(Math.random() * catColors.length)]);

  // Cuerpo más esbelto
  const body = BABYLON.MeshBuilder.CreateBox("catBody", { width: 0.22, height: 0.2, depth: 0.5 }, scene);
  body.position.set(0, 0.24, 0);
  body.material = bodyMat;
  body.parent = root;
  shadowCasterFn(body);

  // Pecho
  const chest = BABYLON.MeshBuilder.CreateSphere("catChest", { diameter: 0.22, segments: 8 }, scene);
  chest.position.set(0, 0.24, 0.2);
  chest.scaling.set(1, 0.9, 1.1);
  chest.material = bodyMat;
  chest.parent = root;

  // Cabeza más redonda
  const head = BABYLON.MeshBuilder.CreateSphere("catHead", { diameter: 0.2, segments: 8 }, scene);
  head.position.set(0, 0.3, 0.26);
  head.material = bodyMat;
  head.parent = root;
  shadowCasterFn(head);

  // Orejas puntiagudas
  const earL = BABYLON.MeshBuilder.CreateCylinder("catEarL", { height: 0.1, diameterTop: 0, diameterBottom: 0.07, tessellation: 3 }, scene);
  earL.position.set(-0.07, 0.42, 0.26);
  earL.material = bodyMat;
  earL.parent = root;

  const earR = BABYLON.MeshBuilder.CreateCylinder("catEarR", { height: 0.1, diameterTop: 0, diameterBottom: 0.07, tessellation: 3 }, scene);
  earR.position.set(0.07, 0.42, 0.26);
  earR.material = bodyMat;
  earR.parent = root;

  // Ojos
  const eyeMat = new BABYLON.StandardMaterial("catEyeMat_" + animals.length, scene);
  eyeMat.diffuseColor = BABYLON.Color3.FromHexString("#4cd964");
  eyeMat.emissiveColor = BABYLON.Color3.FromHexString("#2a8a3a");
  
  const eyeL = BABYLON.MeshBuilder.CreateSphere("catEyeL", { diameter: 0.04, segments: 6 }, scene);
  eyeL.position.set(-0.06, 0.32, 0.35);
  eyeL.material = eyeMat;
  eyeL.parent = root;

  const eyeR = BABYLON.MeshBuilder.CreateSphere("catEyeR", { diameter: 0.04, segments: 6 }, scene);
  eyeR.position.set(0.06, 0.32, 0.35);
  eyeR.material = eyeMat;
  eyeR.parent = root;

  // Nariz
  const nose = BABYLON.MeshBuilder.CreateSphere("catNose", { diameter: 0.03, segments: 4 }, scene);
  nose.position.set(0, 0.28, 0.36);
  const noseMat = new BABYLON.StandardMaterial("catNoseMat_" + animals.length, scene);
  noseMat.diffuseColor = BABYLON.Color3.FromHexString("#ff6b9d");
  nose.material = noseMat;
  nose.parent = root;

  // Patas
  const legFL = BABYLON.MeshBuilder.CreateCylinder("catLegFL", { height: 0.2, diameter: 0.05, tessellation: 6 }, scene);
  legFL.position.set(-0.08, 0.1, 0.18);
  legFL.material = bodyMat;
  legFL.parent = root;

  const legFR = BABYLON.MeshBuilder.CreateCylinder("catLegFR", { height: 0.2, diameter: 0.05, tessellation: 6 }, scene);
  legFR.position.set(0.08, 0.1, 0.18);
  legFR.material = bodyMat;
  legFR.parent = root;

  const legBL = BABYLON.MeshBuilder.CreateCylinder("catLegBL", { height: 0.2, diameter: 0.05, tessellation: 6 }, scene);
  legBL.position.set(-0.08, 0.1, -0.18);
  legBL.material = bodyMat;
  legBL.parent = root;

  const legBR = BABYLON.MeshBuilder.CreateCylinder("catLegBR", { height: 0.2, diameter: 0.05, tessellation: 6 }, scene);
  legBR.position.set(0.08, 0.1, -0.18);
  legBR.material = bodyMat;
  legBR.parent = root;

  // Cola larga y curva
  const tail = BABYLON.MeshBuilder.CreateCylinder("catTail", { height: 0.35, diameterTop: 0.03, diameterBottom: 0.05, tessellation: 6 }, scene);
  tail.position.set(0, 0.32, -0.28);
  tail.rotation.x = -0.9;
  tail.material = bodyMat;
  tail.parent = root;

  const animal = {
    mesh: root,
    type: "cat",
    targetX: x + (Math.random() - 0.5) * 6,
    targetZ: z + (Math.random() - 0.5) * 6,
    speed: 0.8 + Math.random() * 0.6,
    state: "wandering",
    stateTimer: 4 + Math.random() * 5,
    walkPhase: Math.random() * Math.PI * 2,
    tail,
    homeX: x,
    homeZ: z
  };

  animals.push(animal);
  return animal;
}

function createPigeon(scene, shadowCasterFn, x, z) {
  var glbPigeon = createGlbAnimal(scene, shadowCasterFn, "pigeon", x, z);
  if (glbPigeon) return glbPigeon;

  const root = new BABYLON.TransformNode("pigeon_" + animals.length, scene);
  root.position.set(x, 0, z);

  const pigeonColors = ["#8a8a8a", "#6a6a6a", "#9a9a9a", "#7a7a7a"];
  const bodyMat = new BABYLON.StandardMaterial("pigeonBody_" + animals.length, scene);
  bodyMat.diffuseColor = BABYLON.Color3.FromHexString(pigeonColors[Math.floor(Math.random() * pigeonColors.length)]);

  // Cuerpo más redondeado
  const body = BABYLON.MeshBuilder.CreateSphere("pigeonBody", { diameter: 0.16, segments: 6 }, scene);
  body.position.set(0, 0.11, 0);
  body.scaling.set(1, 0.85, 1.4);
  body.material = bodyMat;
  body.parent = root;
  shadowCasterFn(body);

  // Pecho
  const chest = BABYLON.MeshBuilder.CreateSphere("pigeonChest", { diameter: 0.14, segments: 6 }, scene);
  chest.position.set(0, 0.1, 0.08);
  chest.scaling.set(1, 0.9, 1.1);
  chest.material = bodyMat;
  chest.parent = root;

  // Cabeza
  const head = BABYLON.MeshBuilder.CreateSphere("pigeonHead", { diameter: 0.09, segments: 5 }, scene);
  head.position.set(0, 0.18, 0.12);
  head.material = bodyMat;
  head.parent = root;

  // Ojos
  const eyeMat = new BABYLON.StandardMaterial("pigeonEyeMat_" + animals.length, scene);
  eyeMat.diffuseColor = BABYLON.Color3.FromHexString("#ff6b35");
  
  const eyeL = BABYLON.MeshBuilder.CreateSphere("pigeonEyeL", { diameter: 0.02, segments: 4 }, scene);
  eyeL.position.set(-0.03, 0.19, 0.16);
  eyeL.material = eyeMat;
  eyeL.parent = root;

  const eyeR = BABYLON.MeshBuilder.CreateSphere("pigeonEyeR", { diameter: 0.02, segments: 4 }, scene);
  eyeR.position.set(0.03, 0.19, 0.16);
  eyeR.material = eyeMat;
  eyeR.parent = root;

  // Pico
  const beak = BABYLON.MeshBuilder.CreateCylinder("pigeonBeak", { height: 0.04, diameterTop: 0, diameterBottom: 0.025, tessellation: 4 }, scene);
  beak.position.set(0, 0.16, 0.18);
  beak.rotation.x = Math.PI / 2;
  const beakMat = new BABYLON.StandardMaterial("beakMat_" + animals.length, scene);
  beakMat.diffuseColor = BABYLON.Color3.FromHexString("#d4a017");
  beak.material = beakMat;
  beak.parent = root;

  // Alas
  const wingL = BABYLON.MeshBuilder.CreateBox("pigeonWingL", { width: 0.04, height: 0.08, depth: 0.14 }, scene);
  wingL.position.set(-0.1, 0.12, 0);
  wingL.rotation.z = 0.2;
  wingL.material = bodyMat;
  wingL.parent = root;

  const wingR = BABYLON.MeshBuilder.CreateBox("pigeonWingR", { width: 0.04, height: 0.08, depth: 0.14 }, scene);
  wingR.position.set(0.1, 0.12, 0);
  wingR.rotation.z = -0.2;
  wingR.material = bodyMat;
  wingR.parent = root;

  // Patas
  const legL = BABYLON.MeshBuilder.CreateCylinder("pigeonLegL", { height: 0.08, diameter: 0.015, tessellation: 4 }, scene);
  legL.position.set(-0.03, 0.04, 0.02);
  const legMat = new BABYLON.StandardMaterial("pigeonLegMat_" + animals.length, scene);
  legMat.diffuseColor = BABYLON.Color3.FromHexString("#d4a017");
  legL.material = legMat;
  legL.parent = root;

  const legR = BABYLON.MeshBuilder.CreateCylinder("pigeonLegR", { height: 0.08, diameter: 0.015, tessellation: 4 }, scene);
  legR.position.set(0.03, 0.04, 0.02);
  legR.material = legMat;
  legR.parent = root;

  // Cola
  const tail = BABYLON.MeshBuilder.CreateBox("pigeonTail", { width: 0.06, height: 0.02, depth: 0.08 }, scene);
  tail.position.set(0, 0.1, -0.1);
  tail.rotation.x = 0.3;
  tail.material = bodyMat;
  tail.parent = root;

  const animal = {
    mesh: root,
    type: "pigeon",
    targetX: x + (Math.random() - 0.5) * 4,
    targetZ: z + (Math.random() - 0.5) * 4,
    speed: 0.4 + Math.random() * 0.3,
    state: "pecking",
    stateTimer: 2 + Math.random() * 3,
    walkPhase: Math.random() * Math.PI * 2,
    head,
    wingL,
    wingR,
    homeX: x,
    homeZ: z
  };

  animals.push(animal);
  return animal;
}

function updateAnimals(dt, heroPos) {
  animals.forEach(animal => {
    const dx = animal.targetX - animal.mesh.position.x;
    const dz = animal.targetZ - animal.mesh.position.z;
    const dist = Math.hypot(dx, dz);

    // Los animales huyen si el jugador se acerca mucho
    const playerDist = Math.hypot(heroPos.x - animal.mesh.position.x, heroPos.z - animal.mesh.position.z);
    const fleeDistance = animal.type === "pigeon" ? 3 : 2;

    if (playerDist < fleeDistance && animal.type !== "pigeon") {
      // Huir
      const awayX = animal.mesh.position.x - heroPos.x;
      const awayZ = animal.mesh.position.z - heroPos.z;
      const awayLen = Math.hypot(awayX, awayZ) || 1;
      animal.mesh.position.x += (awayX / awayLen) * animal.speed * 3 * dt;
      animal.mesh.position.z += (awayZ / awayLen) * animal.speed * 3 * dt;
      animal.state = "fleeing";
      animal.stateTimer = 2;
    } else if (playerDist < fleeDistance && animal.type === "pigeon") {
      // Las palomas vuelan (saltan hacia arriba y lejos)
      animal.mesh.position.y += dt * 3;
      const awayX = animal.mesh.position.x - heroPos.x;
      const awayZ = animal.mesh.position.z - heroPos.z;
      const awayLen = Math.hypot(awayX, awayZ) || 1;
      animal.mesh.position.x += (awayX / awayLen) * animal.speed * 4 * dt;
      animal.mesh.position.z += (awayZ / awayLen) * animal.speed * 4 * dt;
      // Animar alas al volar
      if (animal.wingL && animal.wingR) {
        const wingFlap = Math.sin(Date.now() * 0.02) * 0.5;
        animal.wingL.rotation.z = 0.2 + wingFlap;
        animal.wingR.rotation.z = -0.2 - wingFlap;
      }
      if (animal.mesh.position.y > 3) {
        // Teletransportar lejos
        animal.mesh.position.set(animal.homeX + (Math.random() - 0.5) * 8, 0, animal.homeZ + (Math.random() - 0.5) * 8);
        animal.state = "pecking";
        animal.stateTimer = 3;
        if (animal.wingL && animal.wingR) {
          animal.wingL.rotation.z = 0.2;
          animal.wingR.rotation.z = -0.2;
        }
      }
    } else if (animal.state === "wandering" || animal.state === "pecking") {
      if (dist > 0.3) {
        const moveX = (dx / dist) * animal.speed * dt;
        const moveZ = (dz / dist) * animal.speed * dt;
        animal.mesh.position.x += moveX;
        animal.mesh.position.z += moveZ;

        // Rotar hacia el movimiento
        const targetRot = Math.atan2(dx, dz);
        const diff = ((targetRot - animal.mesh.rotation.y + Math.PI) % (2 * Math.PI)) - Math.PI;
        animal.mesh.rotation.y += Math.min(0.1, Math.abs(diff)) * Math.sign(diff);

        // Animación de patas
        animal.walkPhase += dt * 10;
        if (!animal.isGlb) {
          if (animal.type === "dog") {
            animal.legFL.rotation.x = Math.sin(animal.walkPhase) * 0.4;
            animal.legFR.rotation.x = -Math.sin(animal.walkPhase) * 0.4;
            animal.legBL.rotation.x = -Math.sin(animal.walkPhase) * 0.4;
            animal.legBR.rotation.x = Math.sin(animal.walkPhase) * 0.4;
            animal.tail.rotation.z = Math.sin(animal.walkPhase * 2) * 0.4;
          } else if (animal.type === "cat") {
            animal.tail.rotation.z = Math.sin(animal.walkPhase) * 0.5;
          } else if (animal.type === "pigeon") {
            // Movimiento de cabeza al caminar
            animal.head.position.y = 0.17 + Math.sin(animal.walkPhase * 2) * 0.01;
          }
        }

        animal.state = "wandering";
      } else {
        animal.stateTimer -= dt;
        if (animal.stateTimer <= 0) {
          animal.state = animal.type === "pigeon" ? "pecking" : "idle";
          animal.stateTimer = 2 + Math.random() * 4;
        }
      }
    } else {
      // idle o pecking
      animal.stateTimer -= dt;
      if (animal.stateTimer <= 0) {
        animal.state = "wandering";
        // Nuevo destino cerca de casa
        animal.targetX = animal.homeX + (Math.random() - 0.5) * 8;
        animal.targetZ = animal.homeZ + (Math.random() - 0.5) * 8;
      }
      if (animal.type === "pigeon" && animal.state === "pecking" && !animal.isGlb) {
        // Movimiento de cabeza al picotear
        animal.head.position.y = 0.15 + Math.sin(Date.now() * 0.012) * 0.025;
        animal.head.position.z = 0.12 + Math.sin(Date.now() * 0.012) * 0.025;
      }
    }

    // Actualizar animaciones GLB
    if (animal.isGlb) {
      var targetAnim = animal.idleAnim;
      if (animal.state === "fleeing") {
        targetAnim = animal.runAnim || animal.walkAnim;
      } else if (animal.state === "wandering") {
        targetAnim = animal.walkAnim;
      }
      if (targetAnim) {
        if (animal.currentAnimGroup !== targetAnim) {
          if (animal.currentAnimGroup) animal.currentAnimGroup.stop();
          targetAnim.start(true);
          animal.currentAnimGroup = targetAnim;
        }
      }
    }

    // Mantener en el suelo (excepto palomas volando)
    if (animal.type !== "pigeon" || animal.mesh.position.y === 0) {
      animal.mesh.position.y = Math.sin(Date.now() * 0.004 + animal.walkPhase) * 0.01;
    }
  });
}

// --- VEHÍCULOS MEJORADOS CON MÁS DETALLE ---
function createParkedCar(scene, shadowCasterFn, x, z, rotation, color) {
  var idx = Math.floor(Math.abs(x + z)) % VEHICLE_MANIFEST.length;
  var modelName = VEHICLE_MANIFEST[idx];
  
  if (x === 18 && z === -22) modelName = "taxi";
  if (x === -22 && z === 12) modelName = "police";
  if (x === 10 && z === 25) modelName = "suv-luxury";
  
  var container = VEHICLE_CONTAINERS[modelName];
  if (!container) {
    console.warn("[world] Vehículo " + modelName + " no cargado. Usando fallback.");
    const root = new BABYLON.TransformNode("carFallback_" + x + "_" + z, scene);
    root.position.set(x, 0, z);
    root.rotation.y = rotation;
    var box = BABYLON.MeshBuilder.CreateBox("carBox", { width: 1.7, height: 0.8, depth: 3.8 }, scene);
    box.position.y = 0.4;
    box.parent = root;
    var mat = new BABYLON.StandardMaterial("carMat_" + x + "_" + z, scene);
    mat.diffuseColor = BABYLON.Color3.FromHexString(color);
    box.material = mat;
    return root;
  }

  var root = new BABYLON.TransformNode("car_" + modelName + "_" + x + "_" + z, scene);
  root.position.set(x, 0, z);
  root.rotation.y = rotation;

  var instances = container.instantiateModelsToScene();
  var glbRoot = instances.rootNodes[0];
  glbRoot.parent = root;

  glbRoot.scaling.set(1, 1, 1);
  var bounds = glbRoot.getHierarchyBoundingVectors();
  var h = bounds.max.y - bounds.min.y;
  var scale = 1.35 / (h || 1.0);
  glbRoot.scaling.set(scale, scale, scale);

  if (shadowCasterFn) {
    glbRoot.getChildMeshes().forEach(function(m) { shadowCasterFn(m); });
  }

  return root;
}

function createVespa(scene, shadowCasterFn, x, z, rotation, color) {
  const root = new BABYLON.TransformNode("vespa_" + x + "_" + z, scene);
  root.position.set(x, 0, z);
  root.rotation.y = rotation;

  const bodyMat = new BABYLON.StandardMaterial("vespaBody_" + x + "_" + z, scene);
  bodyMat.diffuseColor = BABYLON.Color3.FromHexString(color);
  bodyMat.specularColor = new BABYLON.Color3(0.5, 0.5, 0.5);

  // Cuerpo principal más detallado
  const body = BABYLON.MeshBuilder.CreateBox("vespaBody", { width: 0.52, height: 0.62, depth: 1.7 }, scene);
  body.position.set(0, 0.52, 0);
  body.material = bodyMat;
  body.parent = root;
  shadowCasterFn(body);

  // Parte delantera curva
  const frontPanel = BABYLON.MeshBuilder.CreateBox("vespaFront", { width: 0.48, height: 0.7, depth: 0.3 }, scene);
  frontPanel.position.set(0, 0.7, 0.7);
  frontPanel.rotation.x = -0.2;
  frontPanel.material = bodyMat;
  frontPanel.parent = root;

  // Escudo frontal
  const legShield = BABYLON.MeshBuilder.CreateBox("vespaShield", { width: 0.44, height: 0.5, depth: 0.08 }, scene);
  legShield.position.set(0, 0.85, 0.55);
  legShield.rotation.x = -0.15;
  legShield.material = bodyMat;
  legShield.parent = root;

  // Asiento más cómodo
  const seat = BABYLON.MeshBuilder.CreateBox("vespaSeat", { width: 0.42, height: 0.12, depth: 0.65 }, scene);
  seat.position.set(0, 0.88, -0.2);
  const seatMat = new BABYLON.StandardMaterial("vespaSeatMat_" + x + "_" + z, scene);
  seatMat.diffuseColor = BABYLON.Color3.FromHexString("#2b2b2b");
  seat.material = seatMat;
  seat.parent = root;

  // Respaldo del asiento
  const seatBack = BABYLON.MeshBuilder.CreateBox("vespaSeatBack", { width: 0.38, height: 0.15, depth: 0.08 }, scene);
  seatBack.position.set(0, 0.95, -0.5);
  seatBack.material = seatMat;
  seatBack.parent = root;

  // Manillar más detallado
  const handlebar = BABYLON.MeshBuilder.CreateCylinder("vespaHandle", { height: 0.55, diameter: 0.04, tessellation: 8 }, scene);
  handlebar.position.set(0, 1.0, 0.65);
  handlebar.rotation.z = Math.PI / 2;
  const handleMat = new BABYLON.StandardMaterial("vespaHandleMat_" + x + "_" + z, scene);
  handleMat.diffuseColor = BABYLON.Color3.FromHexString("#c0c0c0");
  handleMat.specularColor = new BABYLON.Color3(0.6, 0.6, 0.6);
  handlebar.material = handleMat;
  handlebar.parent = root;

  // Puños del manillar
  const gripMat = new BABYLON.StandardMaterial("vespaGripMat_" + x + "_" + z, scene);
  gripMat.diffuseColor = BABYLON.Color3.FromHexString("#1a1a1a");
  
  const gripL = BABYLON.MeshBuilder.CreateCylinder("vespaGripL", { height: 0.1, diameter: 0.05, tessellation: 8 }, scene);
  gripL.position.set(-0.3, 1.0, 0.65);
  gripL.rotation.z = Math.PI / 2;
  gripL.material = gripMat;
  gripL.parent = root;

  const gripR = BABYLON.MeshBuilder.CreateCylinder("vespaGripR", { height: 0.1, diameter: 0.05, tessellation: 8 }, scene);
  gripR.position.set(0.3, 1.0, 0.65);
  gripR.rotation.z = Math.PI / 2;
  gripR.material = gripMat;
  gripR.parent = root;

  // Espejos retrovisores
  const mirrorMat = new BABYLON.StandardMaterial("vespaMirrorMat_" + x + "_" + z, scene);
  mirrorMat.diffuseColor = BABYLON.Color3.FromHexString("#7eb4c1");
  mirrorMat.specularColor = new BABYLON.Color3(0.8, 0.8, 0.8);

  const mirrorL = BABYLON.MeshBuilder.CreateSphere("vespaMirrorL", { diameter: 0.08, segments: 6 }, scene);
  mirrorL.position.set(-0.28, 1.1, 0.65);
  mirrorL.scaling.set(1, 1, 0.3);
  mirrorL.material = mirrorMat;
  mirrorL.parent = root;

  const mirrorR = BABYLON.MeshBuilder.CreateSphere("vespaMirrorR", { diameter: 0.08, segments: 6 }, scene);
  mirrorR.position.set(0.28, 1.1, 0.65);
  mirrorR.scaling.set(1, 1, 0.3);
  mirrorR.material = mirrorMat;
  mirrorR.parent = root;

  // Faro delantero
  const headlightMat = new BABYLON.StandardMaterial("vespaHeadlight_" + x + "_" + z, scene);
  headlightMat.diffuseColor = BABYLON.Color3.FromHexString("#fff8dc");
  headlightMat.emissiveColor = BABYLON.Color3.FromHexString("#606040");

  const headlight = BABYLON.MeshBuilder.CreateSphere("vespaHeadlight", { diameter: 0.14, segments: 8 }, scene);
  headlight.position.set(0, 0.9, 0.86);
  headlight.material = headlightMat;
  headlight.parent = root;

  // Luz trasera
  const taillightMat = new BABYLON.StandardMaterial("vespaTaillight_" + x + "_" + z, scene);
  taillightMat.diffuseColor = BABYLON.Color3.FromHexString("#ff3333");
  taillightMat.emissiveColor = BABYLON.Color3.FromHexString("#801010");

  const taillight = BABYLON.MeshBuilder.CreateBox("vespaTaillight", { width: 0.1, height: 0.08, depth: 0.04 }, scene);
  taillight.position.set(0, 0.7, -0.86);
  taillight.material = taillightMat;
  taillight.parent = root;

  // Ruedas más detalladas
  const wheelMat = new BABYLON.StandardMaterial("vespaWheel_" + x + "_" + z, scene);
  wheelMat.diffuseColor = BABYLON.Color3.FromHexString("#1a1a1a");
  
  const rimMat = new BABYLON.StandardMaterial("vespaRim_" + x + "_" + z, scene);
  rimMat.diffuseColor = BABYLON.Color3.FromHexString("#c0c0c0");
  rimMat.specularColor = new BABYLON.Color3(0.6, 0.6, 0.6);

  const wheelF = BABYLON.MeshBuilder.CreateCylinder("vespaWheelF", { height: 0.12, diameter: 0.42, tessellation: 12 }, scene);
  wheelF.position.set(0, 0.21, 0.7);
  wheelF.rotation.z = Math.PI / 2;
  wheelF.material = wheelMat;
  wheelF.parent = root;

  const rimF = BABYLON.MeshBuilder.CreateCylinder("vespaRimF", { height: 0.13, diameter: 0.24, tessellation: 8 }, scene);
  rimF.position.set(0, 0.21, 0.7);
  rimF.rotation.z = Math.PI / 2;
  rimF.material = rimMat;
  rimF.parent = root;

  const wheelB = BABYLON.MeshBuilder.CreateCylinder("vespaWheelB", { height: 0.12, diameter: 0.42, tessellation: 12 }, scene);
  wheelB.position.set(0, 0.21, -0.7);
  wheelB.rotation.z = Math.PI / 2;
  wheelB.material = wheelMat;
  wheelB.parent = root;

  const rimB = BABYLON.MeshBuilder.CreateCylinder("vespaRimB", { height: 0.13, diameter: 0.24, tessellation: 8 }, scene);
  rimB.position.set(0, 0.21, -0.7);
  rimB.rotation.z = Math.PI / 2;
  rimB.material = rimMat;
  rimB.parent = root;

  // Escape
  const exhaustMat = new BABYLON.StandardMaterial("vespaExhaust_" + x + "_" + z, scene);
  exhaustMat.diffuseColor = BABYLON.Color3.FromHexString("#4a4a4a");
  
  const exhaust = BABYLON.MeshBuilder.CreateCylinder("vespaExhaust", { height: 0.3, diameter: 0.06, tessellation: 8 }, scene);
  exhaust.position.set(0.28, 0.25, -0.5);
  exhaust.rotation.z = Math.PI / 2;
  exhaust.material = exhaustMat;
  exhaust.parent = root;

  return root;
}

// --- Inicialización del mundo vivo ------------------------------------------
function initLivingWorld(scene, shadowCasterFn, canOccupyFn) {
  // Crear peatones (14 con IA expandida y red de waypoints)
  for (let i = 0; i < 8; i++) {
    createPedestrian(scene, shadowCasterFn, canOccupyFn);
  }

  // Crear perros
  createDog(scene, shadowCasterFn, -8, -12);
  createDog(scene, shadowCasterFn, 12, 8);

  // Crear gatos (procedurales)
  createCat(scene, shadowCasterFn, -5, 15);
  createCat(scene, shadowCasterFn, 18, -8);
  createCat(scene, shadowCasterFn, -20, -5);

  // Crear palomas en la plaza — en anillo alrededor de la fuente (evita (0,0))
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2 + Math.random() * 0.8;
    const r = 2.8 + Math.random() * 3.0;
    createPigeon(scene, shadowCasterFn, Math.sin(angle) * r, Math.cos(angle) * r);
  }

  // Crear vehículos estacionados
  const carColors = ["#c76f45", "#6f9465", "#d0a14b", "#5a7d9a", "#8c7b68", "#9e5a7d", "#2f3740", "#8b4fb3"];
  const vespaColors = ["#c76f45", "#6f9465", "#d0a14b", "#e8e8e8", "#ff6b6b", "#5a7d9a"];

  // Coches estacionados en las calles
  createParkedCar(scene, shadowCasterFn, -18, -22, 0, carColors[0]);
  createParkedCar(scene, shadowCasterFn, 18, -22, 0, carColors[1]);
  createParkedCar(scene, shadowCasterFn, -22, 12, Math.PI / 2, carColors[2]);
  createParkedCar(scene, shadowCasterFn, 22, -8, -Math.PI / 2, carColors[3]);
  createParkedCar(scene, shadowCasterFn, -10, 25, Math.PI, carColors[4]);
  createParkedCar(scene, shadowCasterFn, 10, 25, Math.PI, carColors[5]);

  // Vespas estacionadas
  createVespa(scene, shadowCasterFn, -12, -18, 0.3, vespaColors[0]);
  createVespa(scene, shadowCasterFn, 14, -18, -0.2, vespaColors[1]);
  createVespa(scene, shadowCasterFn, -20, 5, Math.PI / 2 + 0.1, vespaColors[2]);
  createVespa(scene, shadowCasterFn, 20, 12, -Math.PI / 2, vespaColors[3]);
  createVespa(scene, shadowCasterFn, -5, 22, Math.PI + 0.2, vespaColors[4]);
}

// Actualizar mundo vivo (llamar desde el bucle principal)
function updateLivingWorld(dt, heroPos) {
  updatePedestrians(dt, heroPos);
  updateAnimals(dt, heroPos);
}

window.loadWorldAssets = loadWorldAssets;
window.initLivingWorld = initLivingWorld;
window.updateLivingWorld = updateLivingWorld;
