# Personajes — modelos CC0 (Quaternius + Kenney)

Modelos de personaje para diversidad del jugador y de los NPCs. Añadidos 2026-07-04.
Relacionado con la **Tarea 7 (Opción B)** de [`handoff-pendientes.md`](../../../handoff-pendientes.md).

## Qué hay aquí

| Carpeta | Contenido | ¿Encaja con Italgame? |
|---|---|---|
| `universal-base/` | **2 cuerpos base rigged**: `Superhero_Male_FullBody.gltf` y `Superhero_Female_FullBody.gltf` (+ texturas) | ✅ Sí — hombre y mujer base, neutros, para colorear/vestir |
| `kenney-mini-people/` ⭐ | **12 personajes COMPLETOS** (6 mujeres + 6 hombres) con **ropa moderna real** ya puesta (casual, uniforme, traje de oficina, chaquetas) + 4 sillas de ruedas (diseño inclusivo) | ✅ **El mejor match para "ropa moderna"** — ver detalle abajo |
| `fantasy-outfits/` | 4 trajes (`Male/Female_Peasant`, `Male/Female_Ranger`) + partes modulares (`Modular Parts/`) | ⚠️ Medieval/fantasía — NO encaja con la ciudad italiana moderna. Guardado como referencia/futuro |

**Fuentes:**
- [Quaternius](https://quaternius.com) — "Universal Base Characters", "Modular Character Outfits - Fantasy". CC0.
- [Kenney](https://kenney.nl/assets/mini-characters) — "Mini Characters". CC0.

## ⭐ `kenney-mini-people/` — la respuesta a "ropa moderna" (2026-07-04)
Se buscó un pack de **ropa** para vestir los `universal-base/`, pero ni Quaternius
ni Kenney venden piezas de ropa moderna sueltas — en su lugar, Kenney ofrece
**personajes completos ya vestidos** con estética casual/urbana:

- **Formato: GLB puro** (no glTF multiarchivo) — 1 archivo por personaje, más simple
  que Quaternius. Solo referencian una **textura compartida** (`Textures/colormap.png`,
  8.7 KB — nada que ver con los 4 MB por personaje de Quaternius).
- **31 animaciones por personaje** (verificado leyendo el GLB): `idle, walk, sprint,
  jump, fall, crouch, sit, drive, die, pick-up, emote-yes/no, holding-*, attack-*,
  interact-left/right, wheelchair-*`. Mucho más rico que HVGirl (solo idle/walking/samba).
- **Estilo visual:** "mini/blocky" (chibi, cabezón, cuerpo simple) — **distinto** al
  estilo más realista de HVGirl/Quaternius. Encaja perfecto para **peatones de fondo**
  (que es justo lo que proponía el brief original de Track 2); para el jugador
  principal habría que decidir si se mezcla el estilo o se usa consistente.
- Trae también **wheelchair / wheelchair-power / wheelchair-deluxe / power-deluxe**
  (accesorios de accesibilidad — diseño inclusivo, no forzosamente para usar en
  Italgame pero ahí están).

**Licencia:** CC0 1.0 — sin necesidad de permiso ni atribución (se da igual, por cortesía).

## Formato glTF multiarchivo (`universal-base/`, `fantasy-outfits/`) — no GLB
Cada modelo son **3 piezas que van juntas**: `.gltf` (JSON) + `.bin` (geometría) +
`.png` (texturas, en la misma carpeta o en `../Modular Parts/`). **No separes ni
renombres** los archivos de un modelo o dejará de cargar. Babylon carga `.gltf`
nativo (los loaders ya están incluidos en `index.html`).

## Formato: glTF multiarchivo (no GLB)
Cada modelo son **3 piezas que van juntas**: `.gltf` (JSON) + `.bin` (geometría) +
`.png` (texturas, en la misma carpeta o en `../Modular Parts/`). **No separes ni
renombres** los archivos de un modelo o dejará de cargar. Babylon carga `.gltf`
nativo (los loaders ya están incluidos en `index.html`).

✅ **Texturas eliminadas (decisión 2026-07-04):** se quitaron las texturas 4K
(177 MB) y se dejó **solo geometría** (`.gltf` + `.bin`, 13 MB). Los modelos cargan
en color sólido, que es justo lo que queremos para teñirlos por código.
⚠️ Al cargar, Babylon **advertirá** que faltan las texturas referenciadas en el
`.gltf` (404) — es **inofensivo**: la geometría carga igual. Al integrar (Tarea 7)
conviene aplicar material propio por submesh (paso 5) y/o limpiar esas referencias
del `.gltf`. Los ZIP con texturas siguen en `Descargas` si algún día se necesitan.

## Cómo incluirlos en el juego (instrucciones)

El objetivo es que el jugador (y a futuro los NPCs) puedan usar estos modelos en vez
de solo `HVGirl.glb`. Se hace con **un registro de modelos** (ver Tarea 1 del handoff).

### 1. Definir el registro de modelos
En un punto único (p. ej. arriba de `game/npcLoader.js` o `game.js`):
```js
const CHARACTER_MODELS = {
  hvgirl: { base: "https://assets.babylonjs.com/meshes/", file: "HVGirl.glb",
            scale: 0.09, rotY180: true, idle: "idle", walk: "walking" },
  base_m: { base: "game/models/characters/universal-base/", file: "Superhero_Male_FullBody.gltf",
            scale: null /* medir, ver paso 3 */, rotY180: false, idle: null, walk: null },
  base_f: { base: "game/models/characters/universal-base/", file: "Superhero_Female_FullBody.gltf",
            scale: null, rotY180: false, idle: null, walk: null },
};
```
- `state.playerModel` (default `"hvgirl"`) elige cuál. Tanto el creador de personaje
  como el `hero` del juego (`game.js` `ImportMeshAsync`) leen de este registro.

### 2. Cargar por ruta local
Igual que HVGirl pero con ruta relativa del repo:
```js
BABYLON.SceneLoader.ImportMeshAsync("", "game/models/characters/universal-base/",
  "Superhero_Male_FullBody.gltf", scene).then(res => { /* res.meshes, res.animationGroups */ });
```
(Funciona servido por HTTP — que es como ya corre el juego; abrir por `file://` puede
bloquear la carga del `.bin`, usar el servidor local.)

### 3. Normalizar escala y orientación (IMPORTANTE — medir, no adivinar)
Estos modelos NO vienen a la misma escala que HVGirl (que usa 0.09). Hay que medir:
```js
res.meshes[0].scaling.setAll(1);
const {min, max} = res.meshes[0].getHierarchyBoundingVectors();
const h = max.y - min.y;                 // altura real del modelo
const scale = 1.8 / h;                   // que mida ~1.8 unidades (como el jugador)
```
- Ajustar `rotY180`/rotación para que **mire a +Z** (dirección de avance), igual que
  se hizo con HVGirl.
- Confirmar que los **pies quedan en Y=0** (offset si hace falta).

### 4. Animaciones
Verificar los nombres reales de `res.animationGroups` (pueden no llamarse
`idle`/`walking`). Mapear idle/walk en el registro tras inspeccionarlos. Si un modelo
no trae animaciones, se le pueden aplicar las de otro (comparten esqueleto Quaternius).

### 5. Colores por instancia (diversidad)
Para cientos de variantes: clonar el modelo y **teñir el material por submesh**
(piel/ropa/pelo) por instancia, en vez de usar las texturas 4K. Ese es el punto de
tener bases neutras.

### 6. Cache-buster y verificación
- Si tocas `game.js`/`npcLoader.js`, sube su `?v=N` en `index.html` (regla D1).
- Verificar: consola limpia, el personaje se ve completo y a escala, camina bien.

## Optimización aplicada ✅
Se conservó **solo geometría** (`.gltf`+`.bin`, 13 MB); texturas 4K eliminadas. Se
colorea por código al integrar. Respaldo con texturas: los ZIP en `Descargas`.

## Un tercer pack NO añadido: "Knight Character Animated" (Quaternius)
Descargado también, pero **queda en `Descargas`, no en el proyecto**, porque:
- **Solo trae `.obj` / `.fbx` / `.blend` — ningún glTF/GLB.** Babylon **no** carga
  FBX de forma nativa; habría que **convertir FBX→GLB** (Blender o FBX2glTF, no
  instalados) para poder usarlo, y el `.obj` pierde el rig/animaciones.
- Contenido: `KnightCharacter` + armas (Club, Katana, Sword, ShortSword) + cascos y
  hombreras. Temática **medieval**, no encaja con la ciudad italiana moderna.
- Si algún día se quiere: convertir el FBX→GLB y añadirlo aquí como los demás.

## Nota temática (actualizada 2026-07-04)
`fantasy-outfits/` (Peasant/Ranger) y el Knight son **medievales/fantasía** — no
encajan con la ciudad italiana moderna. **`kenney-mini-people/` sí resuelve la ropa
moderna** (12 civiles ya vestidos: casual, uniforme, oficina). Quedan dos caminos
para NPCs italianos, a decidir en la Tarea 7:
1. **Usar Kenney tal cual** para peatones de fondo (estilo mini/blocky, contraste
   deliberado con el jugador realista — es un look válido, muchos juegos lo hacen).
2. **Vestir `universal-base/`** con ropa moderna — pero eso requiere modelar/buscar
   piezas de ropa sueltas separadas del cuerpo, que ni Quaternius ni Kenney venden
   listas; sería trabajo de retexturizado o un pack adicional aún no localizado.
