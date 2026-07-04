# Italgame 🇮🇹

Juego educativo 3D para aprender **italiano** (niveles A1–B1), hecho con
[Babylon.js](https://www.babylonjs.com/). Recorres una ciudad italiana, hablas con
los personajes y cada conversación es una lección: pides un café, compras en el
mercato, sacas un billete… aprendiendo vocabulario y gramática por el camino.

## 🎮 Jugar

- **En línea:** abre la web publicada (GitHub Pages).
- **Local:** clona el repo y abre `index.html`. Para evitar problemas de carga,
  sírvelo por HTTP:
  ```bash
  python -m http.server 8000
  # luego abre http://localhost:8000
  ```

## 🕹️ Controles

| Tecla | Acción |
|---|---|
| `WASD` / Flechas | Moverse |
| `Shift` | Correr |
| `Space` | Saltar · `Ctrl` Agacharse |
| `V` | Cambiar cámara (3ª / 1ª persona) |
| `E` / `Enter` | Hablar con un personaje cercano |
| `A` `B` `C` | Elegir respuesta en el diálogo |
| `Esc` | Cerrar el diálogo |

## ✨ Características

- 20 misiones con situaciones cotidianas (bar, panadería, museo, farmacia, playa…).
- Diagnóstico de error lingüístico: el feedback explica *por qué* una respuesta no es correcta.
- Pronunciación en italiano (text-to-speech) y traducciones bajo demanda.
- Ciudad italiana con piazza, campanile, cipreses y pinos paraguas.
- Creador de personaje y música italiana.

## 🛠️ Tecnología

Babylon.js por CDN, **sin build step**: son archivos estáticos que corren en
cualquier navegador moderno. Sin dependencias que instalar.

## 📄 Créditos y licencias

Ver [CREDITS.md](CREDITS.md) para la atribución de modelos, texturas y audio.
