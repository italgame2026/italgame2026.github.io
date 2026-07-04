"use strict";
(function () {
  // 1. CSS
  const style = document.createElement('style');
  style.textContent = `
    #char-creator { font-family: system-ui,-apple-system,sans-serif; color:#d8cdb8; }
    .cc-inner { max-width:920px; margin:0 auto; padding:24px 20px; }
    .cc-header { margin-bottom:20px; }
    .cc-header h2 { color:#f2b84b; margin:0 0 12px; font-size:22px; }
    .cc-body { display:grid; grid-template-columns:300px 1fr; gap:24px; }
    @media(max-width:700px) { .cc-body { grid-template-columns:1fr; } }
    .cc-preview-col { display:flex; flex-direction:column; align-items:center; gap:10px; }
    .cc-options-col { overflow-y:auto; max-height:460px; }
    .cc-tabs { display:flex; gap:4px; margin-bottom:12px; flex-wrap:wrap; }
    .cc-tab { min-height:40px; background:transparent; border:1px solid rgba(248,241,223,.22);
      color:#d8cdb8; cursor:pointer; border-radius:8px 8px 0 0; padding:7px 14px;
      font-size:13px; font-weight:600; transition:all .15s; }
    .cc-tab:hover { color:#f8f1df; border-color:rgba(248,241,223,.5); }
    .cc-tab.active { color:#1a1410; background:#f2b84b; border-color:#f2b84b; }
    .cc-panel { display:none; padding:12px 0; }
    .cc-panel.active { display:block; }
    .cc-section { margin-bottom:16px; }
    .cc-section-label { font-size:12px; color:#a69886; text-transform:uppercase; letter-spacing:.1em; margin-bottom:8px; }
    .cc-swatches { display:flex; flex-wrap:wrap; gap:8px; }
    .cc-swatch { width:34px; height:34px; border-radius:50%; border:2px solid transparent;
      cursor:pointer; transition:all .15s; flex-shrink:0; }
    .cc-swatch:hover { transform:scale(1.12); }
    .cc-swatch.active { border-color:#f2b84b; box-shadow:0 0 7px rgba(242,184,75,.6); }
    .cc-style-grid { display:flex; flex-wrap:wrap; gap:7px; }
    .cc-style-btn { min-height:44px; border-radius:8px; border:1px solid rgba(248,241,223,.22);
      color:#d8cdb8; background:transparent; cursor:pointer; padding:6px 13px;
      font-size:13px; transition:all .15s; }
    .cc-style-btn:hover { color:#f8f1df; border-color:rgba(248,241,223,.5); }
    .cc-style-btn.active { background:#f2b84b; color:#1a1410; border-color:#f2b84b; }
    .cc-gender-row { display:flex; gap:8px; margin-bottom:14px; }
    .cc-gender-row .cc-style-btn { flex:1; }
    .cc-color-part-row { display:flex; gap:6px; margin-top:10px; }
    .cc-color-part-btn { flex:1; min-height:34px; font-size:12px; border-radius:6px;
      border:1px solid rgba(248,241,223,.22); color:#d8cdb8; background:transparent; cursor:pointer; }
    .cc-color-part-btn.active { background:rgba(242,184,75,.2); border-color:#f2b84b; color:#f2b84b; }
    #cc-canvas { border-radius:12px; background:#2a2520; display:block; }
    #cc-name { background:rgba(248,241,223,.08); border:1px solid rgba(248,241,223,.25);
      color:#f8f1df; border-radius:8px; padding:10px 14px; font-size:15px;
      width:100%; max-width:280px; box-sizing:border-box; }
    #cc-name::placeholder { color:#6b6055; }
    #cc-confirm { width:100%; margin-top:20px; min-height:52px; font-size:16px; font-weight:700;
      background:#f2b84b; color:#1a1410; border:none; border-radius:12px; cursor:pointer;
      transition:opacity .15s; }
    #cc-confirm:hover { opacity:.9; }
  `;
  document.head.appendChild(style);

  // 2. HTML
  const SKIN_COLORS = ['#fde0c0','#ecc99b','#d8a079','#c98b62','#b87656','#9d6a4b','#7a4f38','#5c3620'];
  const HAIR_COLORS = ['#1a1410','#3a2418','#5a3523','#7a5235','#a67c52','#c8b060','#e8d8c0','#f8f8f8'];
  const CLOTH_COLORS = ['#5fa6a7','#8f6f3f','#8b4fb3','#c76f45','#6f9465','#d0a14b','#5a7d9a','#9e5a7d','#2f3740','#f8f1df','#d8cdb8','#1a1410'];
  const HAIR_STYLES = [
    { label:'Corto', icon:'✂', value:'short' },
    { label:'Largo', icon:'⬇', value:'long' },
    { label:'Rizado', icon:'〰', value:'curly' },
    { label:'Coleta', icon:'🎀', value:'ponytail' },
    { label:'Rapado', icon:'▣', value:'buzz' },
    { label:'Afro', icon:'⊙', value:'afro' },
  ];
  const TOP_STYLES = ['tshirt','shirt','jacket','sweater'];
  const TOP_LABELS = ['Camiseta','Camisa','Chaqueta','Suéter'];
  const PANTS_STYLES = ['jeans','trousers','skirt','shorts'];
  const PANTS_LABELS = ['Jeans','Pantalón','Falda','Shorts'];
  const SHOE_STYLES = ['sneakers','boots','sandals'];
  const SHOE_LABELS = ['Zapatillas','Botas','Sandalias'];
  const BODY_TYPES = ['slim','average','athletic','stocky'];
  const BODY_LABELS = ['Delgado','Promedio','Atlético','Robusto'];

  function swatchHtml(id, colors) {
    return `<div class="cc-swatches" id="${id}">${colors.map(c =>
      `<div class="cc-swatch" data-color="${c}" style="background:${c}"></div>`).join('')}</div>`;
  }

  document.body.insertAdjacentHTML('beforeend', `
    <div id="char-creator" style="display:none; position:fixed; inset:0; z-index:9000;
         background:rgba(20,16,10,0.96); backdrop-filter:blur(8px); overflow-y:auto;">
      <div class="cc-inner">
        <div class="cc-header">
          <h2>Crea tu personaje</h2>
          <input id="cc-name" type="text" maxlength="18" placeholder="Tu nombre" autocomplete="off">
        </div>
        <div class="cc-body">
          <div class="cc-preview-col">
            <canvas id="cc-canvas" width="280" height="380"></canvas>
            <div style="font-size:11px; color:#6b6055;">Arrastra para girar</div>
          </div>
          <div class="cc-options-col">
            <div class="cc-tabs">
              <button class="cc-tab active" data-tab="aspecto">Aspecto</button>
              <button class="cc-tab" data-tab="cabello">Cabello</button>
              <button class="cc-tab" data-tab="ropa">Ropa</button>
              <button class="cc-tab" data-tab="cuerpo">Cuerpo</button>
            </div>

            <div id="cc-panel-aspecto" class="cc-panel active">
              <div class="cc-section">
                <div class="cc-section-label">Género</div>
                <div class="cc-gender-row">
                  <button id="cc-gender-male" class="cc-style-btn" data-gender="male">♂ Hombre</button>
                  <button id="cc-gender-female" class="cc-style-btn" data-gender="female">♀ Mujer</button>
                </div>
              </div>
              <div class="cc-section">
                <div class="cc-section-label">Tono de piel</div>
                ${swatchHtml('cc-skin-swatches', SKIN_COLORS)}
              </div>
            </div>

            <div id="cc-panel-cabello" class="cc-panel">
              <div class="cc-section">
                <div class="cc-section-label">Estilo</div>
                <div class="cc-style-grid" id="cc-hair-styles">
                  ${HAIR_STYLES.map(h =>
                    `<button class="cc-style-btn" data-hair-style="${h.value}">${h.icon} ${h.label}</button>`
                  ).join('')}
                </div>
              </div>
              <div class="cc-section">
                <div class="cc-section-label">Color</div>
                ${swatchHtml('cc-hair-color-swatches', HAIR_COLORS)}
              </div>
            </div>

            <div id="cc-panel-ropa" class="cc-panel">
              <div class="cc-section">
                <div class="cc-section-label">Top</div>
                <div class="cc-style-grid" id="cc-top-styles">
                  ${TOP_STYLES.map((v,i) =>
                    `<button class="cc-style-btn" data-top-style="${v}">${TOP_LABELS[i]}</button>`
                  ).join('')}
                </div>
              </div>
              <div class="cc-section">
                <div class="cc-section-label">Pantalón</div>
                <div class="cc-style-grid" id="cc-pants-styles">
                  ${PANTS_STYLES.map((v,i) =>
                    `<button class="cc-style-btn" data-pants-style="${v}">${PANTS_LABELS[i]}</button>`
                  ).join('')}
                </div>
              </div>
              <div class="cc-section">
                <div class="cc-section-label">Zapatos</div>
                <div class="cc-style-grid" id="cc-shoe-styles">
                  ${SHOE_STYLES.map((v,i) =>
                    `<button class="cc-style-btn" data-shoe-style="${v}">${SHOE_LABELS[i]}</button>`
                  ).join('')}
                </div>
              </div>
              <div class="cc-section">
                <div class="cc-section-label">Color (selecciona parte → color)</div>
                <div class="cc-color-part-row">
                  <button class="cc-color-part-btn active" data-part="topColor">Top</button>
                  <button class="cc-color-part-btn" data-part="pantsColor">Pantalón</button>
                  <button class="cc-color-part-btn" data-part="shoeColor">Zapatos</button>
                </div>
                ${swatchHtml('cc-cloth-swatches', CLOTH_COLORS)}
              </div>
            </div>

            <div id="cc-panel-cuerpo" class="cc-panel">
              <div class="cc-section">
                <div class="cc-section-label">Contextura</div>
                <div class="cc-style-grid" id="cc-body-types">
                  ${BODY_TYPES.map((v,i) =>
                    `<button class="cc-style-btn" data-body-type="${v}">${BODY_LABELS[i]}</button>`
                  ).join('')}
                </div>
              </div>
            </div>
          </div>
        </div>
        <button id="cc-confirm">Entrar a Italgame →</button>
      </div>
    </div>
  `);

  // 3. Estado interno
  let _previewEngine = null, _previewScene = null;
  let _avatarMeshes = [];
  let _activeColorPart = 'topColor';
  let _clothColors = { topColor: '#5fa6a7', pantsColor: '#2f3740', shoeColor: '#3a2b25' };

  // 4. buildPreviewAvatar
  function buildPreviewAvatar(scene, opts) {
    const root = new BABYLON.TransformNode("avatarRoot", scene);
    _avatarMeshes.push(root);
    const bScale = { slim: 0.85, average: 1.0, athletic: 1.1, stocky: 1.2 }[opts.bodyType] || 1.0;
    const isFemale = opts.gender === 'female';

    function mat(hex) {
      const m = new BABYLON.StandardMaterial("m_" + Math.random(), scene);
      m.diffuseColor = BABYLON.Color3.FromHexString(hex && hex.startsWith('#') ? hex : '#888888');
      return m;
    }
    function add(mesh) { mesh.parent = root; _avatarMeshes.push(mesh); return mesh; }

    // Pies
    [-0.15, 0.15].forEach(x => {
      const f = BABYLON.MeshBuilder.CreateBox("foot", { width: 0.22, height: 0.09, depth: 0.38 }, scene);
      f.position.set(x, 0.06, 0.08); f.material = mat(opts.shoeColor); add(f);
    });

    // Piernas
    [-0.15, 0.15].forEach(x => {
      const l = BABYLON.MeshBuilder.CreateCylinder("leg", { height: 0.64, diameter: 0.16, tessellation: 8 }, scene);
      l.position.set(x, 0.35, 0); l.material = mat(opts.pantsColor); add(l);
    });

    // Cadera
    const hip = BABYLON.MeshBuilder.CreateBox("hip", {
      width: (isFemale ? 0.48 : 0.38) * bScale, height: 0.18, depth: 0.30
    }, scene);
    hip.position.set(0, 0.68, 0); hip.material = mat(opts.pantsColor); add(hip);

    // Torso
    const torso = BABYLON.MeshBuilder.CreateCylinder("torso", {
      height: 0.72,
      diameterTop: isFemale ? 0.46 : 0.52,
      diameterBottom: isFemale ? 0.38 : 0.44,
      tessellation: 8
    }, scene);
    torso.position.set(0, 1.08, 0);
    torso.scaling.x = bScale; torso.scaling.z = bScale;
    torso.material = mat(opts.topColor); add(torso);

    // Hombros
    const sh = BABYLON.MeshBuilder.CreateBox("shoulders", {
      width: (isFemale ? 0.60 : 0.68) * bScale, height: 0.12, depth: 0.26
    }, scene);
    sh.position.set(0, 1.38, 0); sh.material = mat(opts.topColor); add(sh);

    // Cuello
    const neck = BABYLON.MeshBuilder.CreateCylinder("neck", { height: 0.18, diameter: 0.16, tessellation: 8 }, scene);
    neck.position.set(0, 1.42, 0); neck.material = mat(opts.skin); add(neck);

    // Brazos + manos
    [-1, 1].forEach(side => {
      const arm = BABYLON.MeshBuilder.CreateCylinder("arm", { height: 0.58, diameter: 0.12, tessellation: 8 }, scene);
      arm.position.set(side * 0.42, 1.06, 0);
      arm.rotation.z = side * 0.18; arm.material = mat(opts.skin); add(arm);

      const hand = BABYLON.MeshBuilder.CreateSphere("hand", { diameter: 0.13, segments: 6 }, scene);
      hand.position.set(side * 0.47, 0.76, 0); hand.material = mat(opts.skin); add(hand);
    });

    // Cabeza
    const head = BABYLON.MeshBuilder.CreateSphere("head", { diameter: 0.52, segments: 12 }, scene);
    head.position.set(0, 1.62, 0);
    head.scaling.set(0.82, 1.05, 0.76); head.material = mat(opts.skin); add(head);

    // Ojos
    [-0.09, 0.09].forEach(x => {
      const eye = BABYLON.MeshBuilder.CreateSphere("eye", { diameter: 0.045, segments: 6 }, scene);
      eye.position.set(x, 1.66, 0.22); eye.material = mat('#1b1a18'); add(eye);
    });

    // Cabello
    const hc = opts.hairColor;
    if (opts.hairStyle === 'short') {
      const h = BABYLON.MeshBuilder.CreateSphere("hair", { diameter: 0.54, segments: 10 }, scene);
      h.position.set(0, 1.77, 0); h.scaling.set(0.82, 0.42, 0.76); h.material = mat(hc); add(h);
    } else if (opts.hairStyle === 'long') {
      const h = BABYLON.MeshBuilder.CreateSphere("hair", { diameter: 0.54, segments: 10 }, scene);
      h.position.set(0, 1.77, 0); h.scaling.set(0.82, 0.42, 0.76); h.material = mat(hc); add(h);
      const ht = BABYLON.MeshBuilder.CreateBox("hairtail", { width: 0.40, height: 0.60, depth: 0.08 }, scene);
      ht.position.set(0, 1.52, -0.24); ht.material = mat(hc); add(ht);
    } else if (opts.hairStyle === 'curly') {
      [{ x: -0.18, z: 0 }, { x: 0, z: 0 }, { x: 0.18, z: 0 }].forEach(p => {
        const h = BABYLON.MeshBuilder.CreateSphere("hair", { diameter: 0.28, segments: 8 }, scene);
        h.position.set(p.x, 1.80, p.z); h.material = mat(hc); add(h);
      });
    } else if (opts.hairStyle === 'ponytail') {
      const h = BABYLON.MeshBuilder.CreateSphere("hair", { diameter: 0.54, segments: 10 }, scene);
      h.position.set(0, 1.77, 0); h.scaling.set(0.82, 0.42, 0.76); h.material = mat(hc); add(h);
      const pt = BABYLON.MeshBuilder.CreateCylinder("ponytail", { height: 0.32, diameter: 0.10, tessellation: 8 }, scene);
      pt.position.set(0, 1.63, -0.28); pt.rotation.x = 0.4; pt.material = mat(hc); add(pt);
    } else if (opts.hairStyle === 'buzz') {
      const h = BABYLON.MeshBuilder.CreateSphere("hair", { diameter: 0.54, segments: 10 }, scene);
      h.position.set(0, 1.77, 0); h.scaling.set(0.82, 0.18, 0.76); h.material = mat(hc); add(h);
    } else if (opts.hairStyle === 'afro') {
      const h = BABYLON.MeshBuilder.CreateSphere("hair", { diameter: 0.70, segments: 10 }, scene);
      h.position.set(0, 1.86, 0); h.material = mat(hc); add(h);
    }

    return _avatarMeshes;
  }

  function disposePreviewAvatar() {
    _avatarMeshes.forEach(m => { try { m.dispose(); } catch(e) {} });
    _avatarMeshes = [];
  }

  // 5. Preview engine
  function startPreviewEngine() {
    const canvas = document.getElementById("cc-canvas");
    if (!canvas || !window.BABYLON) return;
    _previewEngine = new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });
    _previewScene = new BABYLON.Scene(_previewEngine);
    _previewScene.clearColor = new BABYLON.Color4(0.16, 0.14, 0.12, 1);

    const cam = new BABYLON.ArcRotateCamera("cam", -Math.PI / 2, Math.PI / 3.2, 3.8,
      new BABYLON.Vector3(0, 0.9, 0), _previewScene);
    cam.attachControl(canvas, true);
    cam.lowerRadiusLimit = 2.5; cam.upperRadiusLimit = 6;

    new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(0, 1, 0), _previewScene).intensity = 1.0;
    const pl = new BABYLON.PointLight("pt", new BABYLON.Vector3(2, 3, 2), _previewScene);
    pl.intensity = 0.6;

    const ground = BABYLON.MeshBuilder.CreateDisc("ground", { radius: 1.0, tessellation: 32 }, _previewScene);
    ground.rotation.x = Math.PI / 2;
    ground.position.y = 0;
    const gm = new BABYLON.StandardMaterial("gm", _previewScene);
    gm.diffuseColor = BABYLON.Color3.FromHexString("#2f2b27");
    ground.material = gm;

    buildPreviewAvatar(_previewScene, getCurrentOpts());
    _previewEngine.runRenderLoop(() => { if (_previewScene) _previewScene.render(); });
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

  // 6. getCurrentOpts
  function getCurrentOpts() {
    const genderBtn = document.querySelector('#cc-panel-aspecto .cc-style-btn.active');
    const skinSwatch = document.querySelector('#cc-skin-swatches .cc-swatch.active');
    const hairColorSwatch = document.querySelector('#cc-hair-color-swatches .cc-swatch.active');
    const hairStyleBtn = document.querySelector('#cc-hair-styles .cc-style-btn.active');
    const bodyBtn = document.querySelector('#cc-body-types .cc-style-btn.active');
    return {
      gender: genderBtn ? genderBtn.dataset.gender : (window.state.gender || 'female'),
      skin: skinSwatch ? skinSwatch.dataset.color : (window.state.skin || '#d8a079'),
      hairColor: hairColorSwatch ? hairColorSwatch.dataset.color : (window.state.hair || '#3a2418'),
      hairStyle: hairStyleBtn ? hairStyleBtn.dataset.hairStyle : (window.state.hairStyle || 'short'),
      bodyType: bodyBtn ? bodyBtn.dataset.bodyType : (window.state.bodyType || 'average'),
      topColor: _clothColors.topColor,
      pantsColor: _clothColors.pantsColor,
      shoeColor: _clothColors.shoeColor,
    };
  }

  // 7. refreshPreview (debounce)
  let _refreshT = null;
  function refreshPreview() {
    clearTimeout(_refreshT);
    _refreshT = setTimeout(() => {
      if (!_previewScene) return;
      disposePreviewAvatar();
      buildPreviewAvatar(_previewScene, getCurrentOpts());
    }, 80);
  }

  // 8. Handlers
  function activateSingle(container, clickedEl) {
    container.querySelectorAll('.cc-style-btn').forEach(b => b.classList.remove('active'));
    clickedEl.classList.add('active');
  }

  function initHandlers() {
    // Tabs
    document.querySelectorAll('.cc-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.cc-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        document.querySelectorAll('.cc-panel').forEach(p => p.classList.remove('active'));
        const panel = document.getElementById('cc-panel-' + tab.dataset.tab);
        if (panel) panel.classList.add('active');
      });
    });

    // Género
    document.querySelectorAll('#cc-panel-aspecto .cc-style-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        activateSingle(document.getElementById('cc-panel-aspecto'), btn);
        refreshPreview();
      });
    });

    // Skin swatches
    document.querySelectorAll('#cc-skin-swatches .cc-swatch').forEach(sw => {
      sw.addEventListener('click', () => {
        document.querySelectorAll('#cc-skin-swatches .cc-swatch').forEach(s => s.classList.remove('active'));
        sw.classList.add('active'); refreshPreview();
      });
    });

    // Hair styles
    document.querySelectorAll('#cc-hair-styles .cc-style-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        activateSingle(document.getElementById('cc-hair-styles'), btn); refreshPreview();
      });
    });

    // Hair colors
    document.querySelectorAll('#cc-hair-color-swatches .cc-swatch').forEach(sw => {
      sw.addEventListener('click', () => {
        document.querySelectorAll('#cc-hair-color-swatches .cc-swatch').forEach(s => s.classList.remove('active'));
        sw.classList.add('active'); refreshPreview();
      });
    });

    // Ropa styles
    ['top','pants','shoe'].forEach(part => {
      document.querySelectorAll(`#cc-${part}-styles .cc-style-btn`).forEach(btn => {
        btn.addEventListener('click', () => {
          activateSingle(document.getElementById(`cc-${part}-styles`), btn);
        });
      });
    });

    // Color part selector
    document.querySelectorAll('.cc-color-part-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.cc-color-part-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        _activeColorPart = btn.dataset.part;
      });
    });

    // Cloth color swatches
    document.querySelectorAll('#cc-cloth-swatches .cc-swatch').forEach(sw => {
      sw.addEventListener('click', () => {
        _clothColors[_activeColorPart] = sw.dataset.color;
        // Visual feedback: highlight the swatch for the active part
        document.querySelectorAll('#cc-cloth-swatches .cc-swatch').forEach(s => s.classList.remove('active'));
        sw.classList.add('active');
        refreshPreview();
      });
    });

    // Body types
    document.querySelectorAll('#cc-body-types .cc-style-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        activateSingle(document.getElementById('cc-body-types'), btn); refreshPreview();
      });
    });

    // Confirm
    document.getElementById('cc-confirm').addEventListener('click', handleConfirm);
  }

  // 9. Pre-fill helpers
  function activateByValue(container, attrName, value) {
    if (!container) return;
    const btn = container.querySelector(`[${attrName}="${value}"]`);
    if (btn) { container.querySelectorAll('.cc-style-btn').forEach(b => b.classList.remove('active')); btn.classList.add('active'); }
    else { const first = container.querySelector('.cc-style-btn'); if (first) first.classList.add('active'); }
  }

  function activateSwatchByColor(container, color) {
    if (!container || !color) return;
    const sw = container.querySelector(`[data-color="${color}"]`);
    if (sw) { container.querySelectorAll('.cc-swatch').forEach(s => s.classList.remove('active')); sw.classList.add('active'); }
    else { const first = container.querySelector('.cc-swatch'); if (first) first.classList.add('active'); }
  }

  // 10. showCharacterCreator
  function showCharacterCreator() {
    const el = document.getElementById('char-creator');
    if (!el) return;
    el.style.display = 'flex';

    // Resetear siempre al tab Aspecto al abrir
    document.querySelectorAll('.cc-tab').forEach(t => t.classList.remove('active'));
    const aspectoTab = document.querySelector('.cc-tab[data-tab="aspecto"]');
    if (aspectoTab) aspectoTab.classList.add('active');
    document.querySelectorAll('.cc-panel').forEach(p => p.classList.remove('active'));
    const aspectoPanel = document.getElementById('cc-panel-aspecto');
    if (aspectoPanel) aspectoPanel.classList.add('active');

    const s = window.state;
    document.getElementById('cc-name').value = s.playerName || '';

    // Pre-fill gender
    const genderBtn = document.getElementById(s.gender === 'female' ? 'cc-gender-female' : 'cc-gender-male');
    document.querySelectorAll('#cc-panel-aspecto .cc-style-btn').forEach(b => b.classList.remove('active'));
    if (genderBtn) genderBtn.classList.add('active');

    // Pre-fill skin/hair colors
    activateSwatchByColor(document.getElementById('cc-skin-swatches'), s.skin);
    activateSwatchByColor(document.getElementById('cc-hair-color-swatches'), s.hair);

    // Pre-fill styles
    activateByValue(document.getElementById('cc-hair-styles'), 'data-hair-style', s.hairStyle);
    activateByValue(document.getElementById('cc-top-styles'), 'data-top-style', s.topStyle);
    activateByValue(document.getElementById('cc-pants-styles'), 'data-pants-style', s.pantsStyle);
    activateByValue(document.getElementById('cc-shoe-styles'), 'data-shoe-style', s.shoeStyle);
    activateByValue(document.getElementById('cc-body-types'), 'data-body-type', s.bodyType);

    // Pre-fill cloth colors
    _clothColors = { topColor: s.topColor || '#5fa6a7', pantsColor: s.pantsColor || '#2f3740', shoeColor: s.shoeColor || '#3a2b25' };
    activateSwatchByColor(document.getElementById('cc-cloth-swatches'), _clothColors.topColor);

    startPreviewEngine();
  }

  // 11. Confirm
  function handleConfirm() {
    const opts = getCurrentOpts();
    const s = window.state;
    const nameVal = document.getElementById('cc-name').value.trim();

    s.playerName = nameVal || 'Studente';
    s.gender = opts.gender;
    s.skin = opts.skin;
    s.hair = opts.hairColor;
    s.hairStyle = opts.hairStyle;
    s.bodyType = opts.bodyType;

    const topBtn = document.querySelector('#cc-top-styles .cc-style-btn.active');
    s.topStyle = topBtn ? topBtn.dataset.topStyle : 'tshirt';
    const pantsBtn = document.querySelector('#cc-pants-styles .cc-style-btn.active');
    s.pantsStyle = pantsBtn ? pantsBtn.dataset.pantsStyle : 'jeans';
    const shoeBtn = document.querySelector('#cc-shoe-styles .cc-style-btn.active');
    s.shoeStyle = shoeBtn ? shoeBtn.dataset.shoeStyle : 'sneakers';

    s.topColor = _clothColors.topColor;
    s.pantsColor = _clothColors.pantsColor;
    s.shoeColor = _clothColors.shoeColor;
    s.outfit = s.topColor;
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

  // 12. Exports
  window.showCharacterCreator = showCharacterCreator;
  window.buildPreviewAvatar = buildPreviewAvatar;
  window.disposePreviewAvatar = disposePreviewAvatar;
  window.showProfileSetup = showCharacterCreator;
})();
