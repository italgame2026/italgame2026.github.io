# Créditos y Atribuciones

## Assets 3D

### Modelos y Geometría (v0.5 — Track 1)

Todos los modelos 3D del juego son **generados proceduralmente mediante código Babylon.js** (geometría original del proyecto). Esto incluye:

- **Edificios italianos** — borgo toscano con estuco ocre/siena, tejados de teja terracota a dos aguas de baja pendiente, persianas verdes (persiane), balcones de hierro forjado con geranios, pórticos con arcos y capiteles, cornisas de travertino, zócalos
- **Campanile** — torre campanario con cámara de campanas, arcos, cúpula piramidal de terracota, aguja y cruz dorada (~25m altura)
- **Iglesia románica** — nave, ábside semicircular, pórtico de tres columnas, óculo circular, frontón triangular, tejado de teja
- **Cipreses italianos** (Cupressus sempervirens) — silueta columnar de 14 capas graduales
- **Pinos paraguas** (Pinus pinea) — tronco alto + copa plana en 4 capas tipo sombrilla
- **Vespa** — scooter icónico italiano (rojo) con manillar, espejos, asiento, ruedas
- **Mesas de café** con sombrillas terracota, sillas rústicas y vino del borgo
- **Fuente de travertino** (Fontana della Piazza) con escalinata, tazón, fuste, tazón superior y cabezas de león
- **NPCs** con accesorios por rol (barista, nonna, turista, artista, etc.)
- **Props urbanos** — farolas, bancos, macetas de terracota, macetas de geranio en balcones

**Licencia del código procedural:** MIT (parte del proyecto italgame)

### Texturas PBR (procedurales DynamicTexture)
Todas las texturas son generadas in-engine con canvas 2D:
- **Adoquín sampietrino** — piedra cuadrada oscura con juntas de travertino
- **Estuco mediterráneo** — 10 variantes (ocre, siena, arena, terracota, amarillo Siena, beige, marrón arcilla, Módena, piedra clara)
- **Teja terracota** (tegole/coppi) — patrón semicircular con variación tonal
- **Travertino romano** — venas horizontales y pequeñas oquedades características
- **Hierba toscana** — tierra ocre con puntos de hierba variados

---

### Personajes (Jugador y NPCs)

**Jugador + NPCs femeninos (9 misiones):**
- **Modelo:** HVGirl.glb
- **Fuente:** Babylon.js official assets (BabylonJS/Assets repository)
- **URL:** https://assets.babylonjs.com/meshes/HVGirl.glb
- **Licencia:** Creative Commons Attribution 4.0 International (CC-BY 4.0)
- **Uso:** Jugador principal + NPCs femeninos (Sofia, Livia, Elena, Giulia, Alba, Anna, Carla, Helena, Laura)
- **Autor:** Equipo Babylon.js (The Khronos Group / Microsoft)

**NPCs masculinos (11 misiones):**
- **Modelo:** CesiumMan.glb
- **Fuente:** KhronosGroup glTF Sample Models
- **URL:** https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/main/2.0/CesiumMan/glTF-Binary/CesiumMan.glb
- **Licencia:** Creative Commons Attribution 4.0 International (CC-BY 4.0)
- **Uso:** NPCs masculinos (Marco, Toni, Ricci, Paolo, Nico, Mario, Bruno, Davide, Franco, Gianni, Igor)
- **Autor:** Cesium GS, Inc.

### Próximos Assets (Track 2+)
Según el plan en `todov2.md`, para más diversidad de NPCs:

#### Track 2.1 — NPCs Humanoides adicionales
- **Fuente preferida:** Quaternius Modular Men/Women (CC0) — https://quaternius.com/
- **Alternativa:** Mixamo (Adobe) — Uso libre, no redistribuir raw; los GLBs van en .gitignore

#### Track 3 — Animales y Vehículos
- **Fuente:** Kenney Animal Pack Redux (CC0)
- **URL:** https://kenney.nl/assets/animal-pack-redux

---

## Música

### Pistas MP3
Las pistas de música italiana se cargan desde `audio/tracks/`. Créditos específicos de cada pista se documentarán cuando se integren.

### Música Procedural
El sistema de música procedural (Web Audio API) es código original del proyecto.

---

## Fuentes

### Google Fonts
- **Inter:** https://fonts.google.com/specimen/Inter
- **Outfit:** https://fonts.google.com/specimen/Outfit
- **Licencia:** Open Font License (OFL)

---

## Motor y Librerías

### Babylon.js
- **Versión:** CDN (última estable)
- **URL:** https://www.babylonjs.com/
- **Licencia:** Apache 2.0

---

## Desarrollo

### Equipo
- **Desarrollo principal:** ccreator-261
- **Asistencia IA:** Claude (Anthropic), Qwen (Alibaba)

### Herramientas
- GitHub Pages para hosting
- Babylon.js para renderizado 3D
- Web Audio API para audio
- Web Speech API para TTS italiano

---

## Licencia del Proyecto

El código fuente de italgame está disponible bajo licencia MIT. Ver archivo LICENSE para más detalles.

---

**Última actualización:** 20 de junio de 2026 · Track 1 completado (v0.5)
