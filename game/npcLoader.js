"use strict";

// ============================================================================
// game/npcLoader.js — NPCs humanoides vía GLB (Babylon.js CDN)
// Modelo: HVGirl.glb (CC-BY 4.0) — jugador + todos los NPCs y peatones
// Patrón: LoadAssetContainerAsync → instantiateModelsToScene por NPC/peatón
// ============================================================================

var NPC_CONTAINERS = {};
var _npcLoaderReady = false;

var NPC_MANIFEST = [
  {
    key:          "hvgirl",
    base:         "https://assets.babylonjs.com/meshes/",
    file:         "HVGirl.glb",
    scale:        0.09,
    rotY180:      true,
    idleAnimName: "idle",
    walkAnimName: "walking",
    sambaAnimName: "samba"
  }
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
  var entry = NPC_CONTAINERS["hvgirl"];
  if (!entry) { console.warn("[npcLoader] Container hvgirl no disponible para " + id); return null; }
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
  glbRoot.scaling.setAll(def.scale);

  if (def.rotY180) {
    var rot180 = BABYLON.Quaternion.RotationYawPitchRoll(Math.PI, 0, 0);
    glbRoot.rotationQuaternion = glbRoot.rotationQuaternion
      ? glbRoot.rotationQuaternion.multiply(rot180)
      : rot180;
  }

  if (shadowFn) glbRoot.getChildMeshes().forEach(function(m) { shadowFn(m); });

  var prefix = "npc_" + id + "_";
  var idleAnim = null, walkAnim = null, sambaAnim = null;

  instances.animationGroups.forEach(function(ag) {
    var base = ag.name.replace(/^Clone of /i, "");
    ag.name = prefix + base;
    var lower = base.toLowerCase();
    if (!idleAnim  && lower === (def.idleAnimName  || "idle"))   idleAnim  = ag;
    if (!walkAnim  && lower === (def.walkAnimName  || "walking")) walkAnim  = ag;
    if (!sambaAnim && lower === (def.sambaAnimName || "samba"))   sambaAnim = ag;
  });

  instances.animationGroups.forEach(function(ag) { ag.stop(); });

  // Misiones festivas usan Samba; peatones y resto usan Idle
  var startAnim = (NPC_SAMBA_IDS[id] && sambaAnim) ? sambaAnim : idleAnim;
  if (startAnim) startAnim.start(true);

  return { root: controlNode, glbRoot: glbRoot, idleAnim: idleAnim || null, walkAnim: walkAnim || null, sambaAnim: sambaAnim || null };
}

window.loadNpcModels    = loadNpcModels;
window.spawnHumanoidNpc = spawnHumanoidNpc;
