"use strict";
(function () {
  // 1. CSS
  const style = document.createElement('style');
  style.textContent = `
    #char-creator { font-family: system-ui,-apple-system,sans-serif; color:#d8cdb8; }
    .cc-inner { max-width:500px; margin:10vh auto; padding:30px 24px; background: rgba(26, 20, 16, 0.95); border: 1px solid rgba(242, 184, 75, 0.3); border-radius: 20px; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6); }
    .cc-header { margin-bottom:20px; text-align:center; }
    .cc-header h2 { color:#f2b84b; margin:0 0 16px; font-size:24px; font-family:'Outfit',sans-serif; }
    .cc-body { display:flex; flex-direction:column; align-items:center; gap:20px; }
    #cc-canvas { border-radius:12px; background:#2a2520; display:block; box-shadow: inset 0 0 10px rgba(0,0,0,0.5); }
    #cc-name { background:rgba(248,241,223,.08); border:1px solid rgba(248,241,223,.25);
      color:#f8f1df; border-radius:8px; padding:10px 14px; font-size:15px;
      width:100%; max-width:280px; box-sizing:border-box; text-align:center; }
    #cc-name::placeholder { color:#6b6055; }
    #cc-confirm { width:100%; max-width:280px; margin-top:10px; min-height:50px; font-size:16px; font-weight:700;
      background:#f2b84b; color:#1a1410; border:none; border-radius:12px; cursor:pointer;
      transition:opacity .15s; font-family:'Inter',sans-serif; }
    #cc-confirm:hover { opacity:.9; }
    .cc-selector-row { display:flex; align-items:center; justify-content:center; gap:20px; width:100%; }
    .cc-selector-btn { min-height:40px; min-width:40px; border-radius:8px; border:1px solid rgba(248,241,223,.22);
      color:#d8cdb8; background:transparent; cursor:pointer; font-size:20px; transition:all .15s; display:flex; align-items:center; justify-content:center; }
    .cc-selector-btn:hover { color:#f8f1df; border-color:rgba(248,241,223,.5); background:rgba(248,241,223,.05); }
    #cc-char-name { font-size:18px; font-weight:700; color:#f2b84b; min-width:140px; text-align:center; font-family:'Outfit',sans-serif; }
  `;
  document.head.appendChild(style);

  // 2. HTML Injection
  document.body.insertAdjacentHTML('beforeend', `
    <div id="char-creator" style="display:none; position:fixed; inset:0; z-index:9000;
         background:rgba(20,16,10,0.96); backdrop-filter:blur(8px); overflow-y:auto;">
      <div class="cc-inner">
        <div class="cc-header">
          <h2>Crea tu estudiante</h2>
          <input id="cc-name" type="text" maxlength="18" placeholder="Tu nombre" autocomplete="off">
        </div>
        <div class="cc-body">
          <canvas id="cc-canvas" width="280" height="320"></canvas>
          <div style="font-size:11px; color:#6b6055; margin-top:-10px;">Arrastra para girar</div>
          
          <div class="cc-selector-row">
            <button id="cc-prev-btn" class="cc-selector-btn">‹</button>
            <div id="cc-char-name">Sofia</div>
            <button id="cc-next-btn" class="cc-selector-btn">›</button>
          </div>
          
          <button id="cc-confirm">Entrar a Italgame →</button>
        </div>
      </div>
    </div>
  `);

  let _previewEngine = null, _previewScene = null;
  let _loadedAssetContainer = null;
  let _currentModelKey = "female-a";

  function loadPreviewModel(modelKey) {
    if (!_previewScene) return;

    // Clean up previous meshes/animationGroups loaded
    disposePreviewAvatar();

    const modelInfo = window.CHARACTER_MODELS[modelKey];
    if (!modelInfo) return;

    document.getElementById('cc-char-name').textContent = modelInfo.name;

    const base = "game/models/characters/kenney-mini-people/";
    const file = modelInfo.file;

    BABYLON.SceneLoader.LoadAssetContainer(base, file, _previewScene, function (container) {
      if (!_previewScene) {
        container.dispose();
        return;
      }
      _loadedAssetContainer = container;
      container.addAllToScene();

      // Normalization of scaling and height
      const rootMesh = container.meshes[0];
      rootMesh.scaling.set(1, 1, 1);
      
      const bounds = rootMesh.getHierarchyBoundingVectors();
      const h = bounds.max.y - bounds.min.y;
      const targetHeight = 1.6;
      const scale = targetHeight / (h || 1.0);
      rootMesh.scaling.set(scale, scale, scale);

      // Center pivot at ground level
      rootMesh.position.set(0, 0, 0);

      // Facing the camera
      if (rootMesh.rotationQuaternion) {
        rootMesh.rotationQuaternion = rootMesh.rotationQuaternion.multiply(BABYLON.Quaternion.RotationYawPitchRoll(Math.PI, 0, 0));
      } else {
        rootMesh.rotation = new BABYLON.Vector3(0, Math.PI, 0);
      }

      // Play default idle animation
      const idleGroup = container.animationGroups.find(g => g.name.toLowerCase().includes("idle"));
      if (idleGroup) {
        idleGroup.play(true);
      } else if (container.animationGroups.length > 0) {
        container.animationGroups[0].play(true);
      }
    });
  }

  function disposePreviewAvatar() {
    if (_loadedAssetContainer) {
      _loadedAssetContainer.dispose();
      _loadedAssetContainer = null;
    }
  }

  function startPreviewEngine() {
    const canvas = document.getElementById("cc-canvas");
    if (!canvas || !window.BABYLON) return;
    
    _previewEngine = new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });
    _previewScene = new BABYLON.Scene(_previewEngine);
    _previewScene.clearColor = new BABYLON.Color4(0.16, 0.14, 0.12, 1);

    const cam = new BABYLON.ArcRotateCamera("cam", -Math.PI / 2, Math.PI / 3.0, 3.2,
      new BABYLON.Vector3(0, 0.8, 0), _previewScene);
    cam.attachControl(canvas, true);
    cam.lowerRadiusLimit = 2.0; cam.upperRadiusLimit = 5.0;

    new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(0, 1, 0), _previewScene).intensity = 1.2;
    const pl = new BABYLON.PointLight("pt", new BABYLON.Vector3(2, 3, 2), _previewScene);
    pl.intensity = 0.5;

    const ground = BABYLON.MeshBuilder.CreateDisc("ground", { radius: 1.0, tessellation: 32 }, _previewScene);
    ground.rotation.x = Math.PI / 2;
    ground.position.y = 0;
    const gm = new BABYLON.StandardMaterial("gm", _previewScene);
    gm.diffuseColor = BABYLON.Color3.FromHexString("#25201b");
    ground.material = gm;

    loadPreviewModel(_currentModelKey);

    _previewEngine.runRenderLoop(() => {
      if (_previewScene) _previewScene.render();
    });
  }

  function stopPreviewEngine() {
    if (_previewEngine) {
      _previewEngine.stopRenderLoop();
      disposePreviewAvatar();
      _previewEngine.dispose();
    }
    _previewEngine = null;
    _previewScene = null;
  }

  function initHandlers() {
    // Prev / Next button
    const keys = Object.keys(window.CHARACTER_MODELS);

    document.getElementById('cc-prev-btn').addEventListener('click', () => {
      let idx = keys.indexOf(_currentModelKey);
      idx = (idx - 1 + keys.length) % keys.length;
      _currentModelKey = keys[idx];
      loadPreviewModel(_currentModelKey);
    });

    document.getElementById('cc-next-btn').addEventListener('click', () => {
      let idx = keys.indexOf(_currentModelKey);
      idx = (idx + 1) % keys.length;
      _currentModelKey = keys[idx];
      loadPreviewModel(_currentModelKey);
    });

    document.getElementById('cc-confirm').addEventListener('click', handleConfirm);
  }

  function showCharacterCreator() {
    const el = document.getElementById('char-creator');
    if (!el) return;
    el.style.display = 'flex';

    const s = window.state;
    document.getElementById('cc-name').value = s.playerName || '';
    
    // Set current active model key based on saved state
    if (s.playerModel && window.CHARACTER_MODELS[s.playerModel]) {
      _currentModelKey = s.playerModel;
    } else {
      _currentModelKey = "female-a";
    }

    startPreviewEngine();
  }

  function handleConfirm() {
    const s = window.state;
    const nameVal = document.getElementById('cc-name').value.trim();

    s.playerName = nameVal || 'Studente';
    s.playerModel = _currentModelKey;
    s.gender = window.CHARACTER_MODELS[_currentModelKey].gender;
    s.profileComplete = true;

    window.saveState();
    window.updateGameHUD();

    document.getElementById('char-creator').style.display = 'none';
    stopPreviewEngine();

    if (typeof window.showWelcome === 'function') window.showWelcome();
  }

  // Init handlers once DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHandlers);
  } else {
    initHandlers();
  }

  // Exports
  window.showCharacterCreator = showCharacterCreator;
  window.showProfileSetup = showCharacterCreator;
})();
