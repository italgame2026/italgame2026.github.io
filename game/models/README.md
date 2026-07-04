# `game/models/` — assets 3D y su integración

Inventario de modelos CC0 añadidos al proyecto y **la forma más viable de
integrarlos**. Revisado 2026-07-04.

## Inventario

| Carpeta | Qué | Estado |
|---|---|---|
| `characters/` | Personas (Kenney mini + Quaternius base + fantasy) | Ver [su README](characters/README.md) |
| `animals/` | 7 animales GLB (paloma, perros, gaviota, gallina) | ✅ organizados |
| `vehicles/kenney-car-kit/` | 14 vehículos GLB (sedan, taxi, van, suv, police…) + textura compartida | ✅ organizados |

**Todo CC0** (Kenney + Poly Pizza). Créditos en `CREDITS.md`.

## La forma más viable de integrarlos (patrón único)

Los tres tipos (personajes, animales, autos) se integran con **el mismo patrón**, que
es también el del registro de personajes (Tarea 1/7 del handoff):

1. **Registro de modelos** `{ key → { file, scale, rotY, anims, collider } }`.
2. **Cargar cada GLB una vez** (`LoadAssetContainerAsync`) → **instanciar** por
   colocación (`instantiateModelsToScene`). Nunca recargar por instancia.
3. **Normalizar escala midiendo** el bounding box (cada modelo viene a distinta
   escala): `scale = alturaObjetivo / (max.y - min.y)`. Ajustar `rotY` para que mire a +Z.
4. **Conducir con la lógica que YA existe en `world.js`** (spawns + máquina de estados
   de IA de peatones/animales/vehículos). La IA opera sobre el nodo raíz → es
   **agnóstica al modelo**: cambiar procedural→GLB no toca la IA.
5. Reproducir la animación (`walk`/`idle`/`fly`) si el modelo la trae.

**Clave:** esto reemplaza geometría procedural de `world.js` por GLBs **sin reescribir
la IA** — solo cambia *qué se dibuja*, no *cómo se mueve*.

### Animales → reemplazan la geometría procedural de `world.js`
Autocontenidos (drop-in, textura/vértices embebidos). Mapeo sugerido:
| Uso en el juego | Modelo | Nota |
|---|---|---|
| Paloma de piazza | `animals/dove.glb` (1.3k verts) | Ligero, ideal |
| Perro (paseado) | `animals/dog-shiba.glb` **o** `dog-husky.glb` | ⭐ **24 animaciones** (camina de verdad) |
| Gaviota (playa) | `animals/seagull.glb` (0.7k verts) | Ligero |
| Perros extra | `dog-beagle.glb`, `dog-simple.glb` | Estáticos, ligeros |
| Corral (opcional) | `hen.glb` | Estático |
- ⚠️ **Gato: NO se descargó** ninguno → mantener el **gato procedural** de `world.js`, o
  bajar uno (Poly Pizza `cat`).
- Solo `dog-shiba`/`dog-husky` traen animación; el resto son estáticos (se deslizan
  suave con la IA — aceptable, o se les da una micro-animación procedural).

### Autos → reemplazan los coches procedurales de `world.js`
GLBs comparten `Textures/colormap.png` (**no separar** el .glb de su carpeta `Textures/`).
- De ciudad: `sedan.glb`, `taxi.glb`, `van.glb`, `suv.glb`, `police.glb`, `ambulance.glb`,
  `delivery.glb`, `hatchback-sports.glb`, `garbage-truck.glb`, `firetruck.glb`, `truck.glb`.
- ~3k verts cada uno, self-contained salvo la textura compartida. Registrar 2–4 para variedad.

## Qué se DESCARTÓ (y por qué)
- **City Kits de Kenney** (edificios modernos): chocan con el **borgo toscano** hecho a
  mano (identidad italiana del Track 1). Usarlos sería rehacer la ciudad → **no**.
- **"Realistic Car Pack"**: solo OBJ/FBX/Blend, **sin GLB** → requiere conversión. Descartado.
- **Animales pesados** `Pug` (1.7MB), `Rooster`, `Mourning dove` (realistas, sin
  animación, 1MB+): pesan y su estilo realista choca con el low-poly. Quedan en Descargas.

## Rendimiento
Animales (0.3–4k verts) + unos autos (~3k) × pocas instancias → **holgado** dentro del
presupuesto (regla C1: ≤2000 meshes / ≤900 activos). Preferir los modelos ligeros de
bajo poly; evitar meter los pesados descartados.
