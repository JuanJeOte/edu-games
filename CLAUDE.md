# edu-games — Notas para Claude

## Stack

- **React 19 + TypeScript** via Vite 8
- **Tailwind CSS v4** para estilos
- **Motion (Framer Motion v12)** para animaciones
- **React Router 7** para navegación
- **Web Speech API** (TTS en español `es-ES`)
- **localStorage** para persistencia (prefijo `edu-games-`)

## Comandos clave

```bash
npm run dev      # servidor de desarrollo
npm run build    # build de producción
npm run preview  # previsualizar build
```

## Estructura

```
src/
  data/
    letters.ts      # 27 letras con emoji, color, phonema, orden pedagógico
    syllables.ts    # 35 sílabas (5 vocales × 7 consonantes principales)
    words.ts        # 33 palabras en 3 niveles de dificultad
    achievements.ts # 24 logros con emoji, nombre y condición
  hooks/
    useProgress.ts  # estado central (estrellas, letras, logros, sesiones)
    useSpeech.ts    # wrapper de Web Speech API
  pages/
    HomePage.tsx        # /          – hub principal
    LetterExplorer.tsx  # /explorar  – explorar abecedario
    SoundMatch.tsx      # /emparejar – juego: sonido → letra
    SyllableBuilder.tsx # /silabas   – construir sílabas
    WordBuilder.tsx     # /palabras  – construir palabras
    ParentsPanel.tsx    # /padres    – panel padres con PIN
  components/
    layout/AppShell.tsx   # wrapper con TopBar + BottomNav (max-w-screen-sm md:max-w-2xl)
    layout/TopBar.tsx     # barra superior con estrellas y ajustes
    layout/BottomNav.tsx  # navegación inferior fija
    common/LetterCard.tsx # tarjeta de letra con colores
```

## Diseño responsive (mobile + tablet)

El layout usa **mobile-first**. El contenedor principal está limitado a:
- Móvil: `max-w-screen-sm` (640px)
- Tablet: `md:max-w-2xl` (672px) — ampliado en AppShell, TopBar y BottomNav

Cada página tiene sus propios breakpoints internos:
- `sm:` (640px) — de columna 1 a columna 2 en cards, más gap
- `md:` (768px) — expansión de contenedores para tablet

### Puntos de atención para futuras mejoras responsive
- Las tarjetas de actividad ya usan `grid-cols-1 sm:grid-cols-2`
- La cuadrícula de letras usa `grid-cols-5 sm:grid-cols-7`
- Los targets táctiles mínimos: 64×64px (recomendado para niños)
- En pantallas < 360px los badges de stats se envuelven con `flex-wrap`

## Datos importantes

### Imágenes → son emojis, NO archivos
El campo `imagePath` en `LetterData` y `emoji` en `WordData` contienen emojis Unicode,
**no rutas de archivo**. Renderizar siempre como `<span>`, nunca como `<img src={emoji}>`.

```tsx
// ✅ Correcto
<span className="text-8xl">{letter.imagePath}</span>

// ❌ Incorrecto — no renderiza nada
<img src={letter.imagePath} />
```

### Logros (badges)
`progress.badges` almacena **IDs** de logros (ej. `'explorador_vocales'`), no emojis.
Para mostrar el emoji hay que buscar el logro en `ACHIEVEMENTS`:

```tsx
import { ACHIEVEMENTS } from '@/data/achievements';
const ACHIEVEMENT_MAP = Object.fromEntries(ACHIEVEMENTS.map((a) => [a.id, a]));
// Uso: ACHIEVEMENT_MAP[badgeId]?.emoji
```

### Emoji de mesa (sin emoji estándar en Unicode)
La palabra `mesa` (table) no tiene emoji dedicado en Unicode. Se cambió a `silla` con `🪑`.
Si en el futuro se quiere agregar `mesa`, usar `🍽️` como aproximación visual.

### Orden pedagógico de letras
1. Vocales: A, E, I, O, U (teachOrder 1–5)
2. Consonantes frecuentes: M, P, S, L, T, N, D (6–12)
3. Consonantes medias: R, C, B, F, G, J, H (13–19)
4. Consonantes tardías: V, Z, Q, K, W, X, Y, Ñ (20–27)

Las sílabas y el juego SoundMatch solo se desbloquean para consonantes exploradas.
Las palabras de dificultad 2 requieren 4 palabras completadas; dificultad 3 requiere 10.

## Bugs corregidos

| Bug | Archivo | Fix |
|-----|---------|-----|
| Mis Logros mostraba IDs en vez de emojis | `HomePage.tsx` | Importar `ACHIEVEMENTS` y usar `ACHIEVEMENT_MAP[badgeId].emoji` |
| Modal de letra mostraba `<img>` roto (emoji no es URL) | `LetterExplorer.tsx` | Cambiar `<img src={emoji}>` → `<span>{emoji}</span>` |
| `mesa` mostraba emoji `🪑` (silla) en vez de mesa | `words.ts` | Cambiar palabra a `silla` con sílabas `['si', 'lla']` |
| Overflow en pantallas < 360px en row de stats | `HomePage.tsx` | Agregar `flex-wrap` al contenedor de stats |
| Contenido centrado en banda estrecha en tablets | `AppShell`, `TopBar`, `BottomNav` | Expandir `max-w-screen-sm` → `md:max-w-2xl` |
