"use strict";

// ============================================================================
// game/npcLoader.js — NPCs humanoides vía GLB locales (Kenney Mini)
// ============================================================================

var NPC_CONTAINERS = {};
var _npcLoaderReady = false;

var NPC_MANIFEST = [
  { key: "female-a", base: "game/models/characters/kenney-mini-people/", file: "character-female-a.glb" },
  { key: "female-b", base: "game/models/characters/kenney-mini-people/", file: "character-female-b.glb" },
  { key: "female-c", base: "game/models/characters/kenney-mini-people/", file: "character-female-c.glb" },
  { key: "female-d", base: "game/models/characters/kenney-mini-people/", file: "character-female-d.glb" },
  { key: "female-e", base: "game/models/characters/kenney-mini-people/", file: "character-female-e.glb" },
  { key: "female-f", base: "game/models/characters/kenney-mini-people/", file: "character-female-f.glb" },
  { key: "male-a", base: "game/models/characters/kenney-mini-people/", file: "character-male-a.glb" },
  { key: "male-b", base: "game/models/characters/kenney-mini-people/", file: "character-male-b.glb" },
  { key: "male-c", base: "game/models/characters/kenney-mini-people/", file: "character-male-c.glb" },
  { key: "male-d", base: "game/models/characters/kenney-mini-people/", file: "character-male-d.glb" },
  { key: "male-e", base: "game/models/characters/kenney-mini-people/", file: "character-male-e.glb" },
  { key: "male-f", base: "game/models/characters/kenney-mini-people/", file: "character-male-f.glb" }
];

// IDs de misión que arrancan con animación Samba (variedad visual italiana)
var NPC_SAMBA_IDS = { "festa": true, "parco": true, "gelateria": true };

function loadNpcModels(scene, onReady) {
  var total = NPC_MANIFEST.length;
  var loaded = 0;
  NPC_MANIFEST.forEach(function(def) {
    BABYLON.SceneLoader.LoadAssetContainerAsync(def.base, def.file, scene)
      .then(function(container) {
        NPC_CONTAINERS[def.key] = { container: container, def: def };
        if (++loaded === total) {
          _npcLoaderReady = true;
          setTimeout(onReady, 0);
        }
      })
      .catch(function(err) {
        console.error("[npcLoader] Error cargando " + def.file + ":", err);
        if (++loaded === total) setTimeout(onReady, 0);
      });
  });
}

// Instancia un humanoid GLB y devuelve { root, glbRoot, idleAnim, walkAnim, sambaAnim }
// id puede ser un ID de misión ("caffe") o de peatón ("ped_0", "ped_1"…)
function spawnHumanoidNpc(scene, id, pos, rotY, shadowFn) {
  var modelKey = "female-a";
  if (id.startsWith("ped_")) {
    var idx = parseInt(id.replace("ped_", ""), 10) || 0;
    var keys = ["female-a", "female-b", "female-c", "female-d", "female-e", "female-f", "male-a", "male-b", "male-c", "male-d", "male-e", "male-f"];
    modelKey = keys[idx % keys.length];
  } else {
    var roleMap = {
      caffe: "female-a",
      panetteria: "male-a",
      mercato: "female-b",
      parrucchiere: "male-b",
      stazione: "male-c",
      farmacia: "female-c",
      negozio: "female-d",
      ristorante: "male-d",
      parco: "male-e",
      festa: "female-e",
      hotel: "female-f",
      gelateria: "male-f",
      taxi: "male-b",
      museo: "female-b",
      supermercato: "male-a",
      banca: "male-c",
      spiaggia: "male-d",
      cinema: "female-c",
      ospedale: "male-e",
      libreria: "female-d"
    };
    modelKey = roleMap[id] || "female-a";
  }

  var entry = NPC_CONTAINERS[modelKey];
  if (!entry) {
    console.warn("[npcLoader] Container " + modelKey + " no disponible para " + id + ", usando placeholder.");
    var controlNode = new BABYLON.TransformNode("npcCtrl_" + id, scene);
    controlNode.position.set(pos.x, 0, pos.z);
    controlNode.rotation.y = rotY;
    
    var placeholder = BABYLON.MeshBuilder.CreateCylinder("npcPlaceholder_" + id, { height: 1.8, diameter: 0.8 }, scene);
    placeholder.position.y = 0.9;
    placeholder.parent = controlNode;
    
    var mat = new BABYLON.StandardMaterial("npcMat_" + id, scene);
    mat.diffuseColor = new BABYLON.Color3(0.8, 0.4, 0.2);
    placeholder.material = mat;
    
    var dummyAnim = {
      start: function() {},
      stop: function() {},
      onAnimationEndObservable: { addOnce: function() {} }
    };
    
    return {
      root: controlNode,
      glbRoot: placeholder,
      idleAnim: dummyAnim,
      walkAnim: dummyAnim,
      sambaAnim: dummyAnim
    };
  }
  var def = entry.def;

  var controlNode = new BABYLON.TransformNode("npcCtrl_" + id, scene);
  controlNode.position.set(pos.x, 0, pos.z);
  controlNode.rotation.y = rotY;

  var instances = entry.container.instantiateModelsToScene();
  if (!instances.rootNodes || !instances.rootNodes.length) {
    controlNode.dispose();
    console.warn("[npcLoader] instantiateModelsToScene vacío para " + id);
    return null;
  }

  var glbRoot = instances.rootNodes[0];
  glbRoot.parent = controlNode;
  
  // Normalizar escala para que mida ~1.8 unidades de alto
  glbRoot.scaling.set(1, 1, 1);
  var bounds = glbRoot.getHierarchyBoundingVectors();
  var h = bounds.max.y - bounds.min.y;
  var scale = 1.8 / (h || 1.0);
  glbRoot.scaling.set(scale, scale, scale);

  // Rotar Y para mirar en la dirección correcta (hacia +Z)
  if (glbRoot.rotationQuaternion) {
    glbRoot.rotationQuaternion = glbRoot.rotationQuaternion.multiply(BABYLON.Quaternion.RotationYawPitchRoll(Math.PI, 0, 0));
  } else {
    glbRoot.rotation = new BABYLON.Vector3(0, Math.PI, 0);
  }

  if (shadowFn) glbRoot.getChildMeshes().forEach(function(m) { shadowFn(m); });

  var prefix = "npc_" + id + "_";
  var idleAnim = null, walkAnim = null, sambaAnim = null;

  instances.animationGroups.forEach(function(ag) {
    var base = ag.name.replace(/^Clone of /i, "");
    ag.name = prefix + base;
    var lower = base.toLowerCase();
    if (!idleAnim  && lower.indexOf("idle") !== -1)   idleAnim  = ag;
    if (!walkAnim  && lower.indexOf("walk") !== -1)   walkAnim  = ag;
    if (!sambaAnim && lower.indexOf("cheer") !== -1)  sambaAnim = ag;
    if (!sambaAnim && lower.indexOf("dance") !== -1)  sambaAnim = ag;
  });

  if (!idleAnim) idleAnim = instances.animationGroups[0] || null;
  if (!walkAnim) walkAnim = instances.animationGroups[1] || idleAnim;
  if (!sambaAnim) sambaAnim = instances.animationGroups[2] || idleAnim;

  instances.animationGroups.forEach(function(ag) { ag.stop(); });

  // Misiones festivas usan Samba/Cheer; peatones y resto usan Idle
  var startAnim = (NPC_SAMBA_IDS[id] && sambaAnim) ? sambaAnim : idleAnim;
  if (startAnim) startAnim.start(true);

  return { root: controlNode, glbRoot: glbRoot, idleAnim: idleAnim || null, walkAnim: walkAnim || null, sambaAnim: sambaAnim || null };
}

window.loadNpcModels    = loadNpcModels;
window.spawnHumanoidNpc = spawnHumanoidNpc;
