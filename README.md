# edu-games

**Plataforma educativa web para niños de 4-7 años** - Aprender jugando, sin presión, con refuerzo positivo.

Proyecto open source diseñado para que los peques aprendan a su ritmo, empezando por lectura y fonética, y creciendo con módulos de matemáticas, ciencias, colores, música y mucho más.

> Creado con cariño para los pequeños exploradores del conocimiento.

---

## Stack Tecnológico

| Tecnología | Uso |
|---|---|
| **React 18 + TypeScript** | Framework principal |
| **Vite** | Build tool (rápido, moderno) |
| **Tailwind CSS v4** | Estilos (tema personalizado kid-friendly) |
| **Motion (Framer Motion v12+)** | Animaciones atractivas para niños |
| **Web Speech API** | Pronunciación de letras, sílabas y palabras en español (nativo del navegador) |
| **localStorage + IndexedDB** | Persistencia de progreso (sin necesidad de backend) |
| **React Router v7** | Navegación SPA |
| **Vitest + React Testing Library** | Testing |
| **Docker + nginx** | Despliegue en VPS (multi-stage build) |

---

## Features

### 📚 Módulo: Lectura y Fonética *(primera implementación)*

#### Explorador de Letras
- Pantalla con el abecedario completo (A-Z + Ñ) en cuadrícula colorida
- Al tocar cada letra: se reproduce su **sonido fonético** en español mediante Web Speech API
- Cada letra tiene una **imagen asociada** (A = Abeja, B = Ballena, C = Casa...)
- Animación de la letra al tocarla (escala con rebote usando Motion `whileTap`)
- Modo **mayúsculas y minúsculas**
- Indicador visual de letras ya exploradas (check verde en la esquina)
- **Orden pedagógico**: vocales primero, luego consonantes por frecuencia de uso
- Orden de enseñanza: Vocales (A,E,I,O,U) → Consonantes frecuentes (M,P,S,L,T,N,D) → Consonantes medias (R,RR,C,B,F,G,J,H) → Consonantes tardías (V,Z,LL,CH,Q,K,W,X,Y,Ñ)

#### Asociación Sonido → Letra
- Se reproduce un sonido fonético y el niño debe **elegir la letra correcta**
- 3 opciones por pregunta (una correcta, dos distractores con sonidos diferentes)
- **Dificultad adaptativa**: empieza con vocales, va añadiendo consonantes según progreso
- Feedback inmediato:
  - **Acierto**: destello verde, animación de estrella, sonido de celebración, +1 estrella
  - **Fallo**: wobble naranja suave (nunca rojo/miedo), el botón correcto pulsa para guiar, opción de reintentar
- Registro de aciertos/fallos por letra para medir dominio
- Rondas de 5 preguntas con resumen al final

#### Constructor de Sílabas
- Interfaz visual: consonante arriba + 5 vocales como botones grandes abajo
- Al tocar una vocal: **animación de merge** (consonante se desliza a la derecha, vocal a la izquierda, se encuentran en el centro)
- La sílaba formada se **pronuncia automáticamente** (ma, me, mi, mo, mu...)
- Aparece una palabra ejemplo con su imagen (ma → mamá)
- **Progresión por niveles**:
  - Sílabas directas (CV): ma, pa, sa...
  - Sílabas inversas (VC): am, an, as...
  - Sílabas trabadas (CCV): bra, cla, fle...
- Solo se desbloquean consonantes ya exploradas en el Explorador
- Completar las 5 sílabas de una consonante = +3 estrellas

#### Mis Primeras Palabras
- Palabras simples de 2 sílabas (mamá, papá, casa, mesa, gato, luna, sol...)
- El niño **arrastra sílabas** para formar la palabra
- **Imagen de la palabra** como pista visual
- Se pronuncia la palabra completa al completarla
- **Diccionario visual** con todas las palabras aprendidas

---

### 🔢 Módulo: Números y Matemáticas *(futuro)*

- Reconocimiento de números (0-20, luego hasta 100)
- **Contar objetos** interactivamente (tocar para contar)
- Sumas y restas simples con **objetos visuales** (manzanas, estrellas...)
- Mayor/menor, ordenar números arrastrando
- **Formas geométricas** básicas (círculo, cuadrado, triángulo, rectángulo)
- Patrones y secuencias (completa la serie)
- Concepto de cantidades (mucho/poco, más/menos)

---

### 🎨 Módulo: Colores y Formas *(futuro)*

- Identificar colores **primarios y secundarios**
- **Mezclar colores** interactivamente (arrastrar dos colores = ver resultado)
- Reconocer formas en el **mundo real** (fotos con formas destacadas)
- **Clasificar** por color, forma y tamaño (drag-and-drop en categorías)
- Pintar y colorear con paleta simple

---

### 🌿 Módulo: Naturaleza y Ciencias *(futuro)*

- **Animales**: nombres, sonidos, hábitats (granja, selva, mar)
- **Estaciones del año**: características, ropa, actividades
- **El clima**: sol, lluvia, nieve, nubes (interactivo)
- **Partes del cuerpo**: tocar y nombrar
- **Los 5 sentidos**: actividades por sentido
- **Plantas**: ciclo de vida animado (semilla → planta → flor)

---

### 🌍 Módulo: Conocimiento del Entorno *(futuro)*

- **Días de la semana y meses** del año
- **La familia**: miembros y relaciones
- **Profesiones**: qué hacen, herramientas que usan
- **Medios de transporte**: tierra, mar, aire
- **Alimentos y nutrición**: grupos de alimentos, plato saludable
- **Emociones**: reconocer y nombrar emociones básicas

---

### 🎵 Módulo: Música y Ritmo *(futuro)*

- **Instrumentos musicales**: imágenes, nombres y sonidos reales
- **Ritmos simples**: repetir patrones rítmicos tocando
- **Canciones educativas** interactivas (con letra destacada)
- Diferencia entre sonidos: grave/agudo, fuerte/suave

---

### 🎮 Minijuegos Transversales

Minijuegos que funcionan con contenido de **cualquier módulo**:

| Minijuego | Descripción |
|---|---|
| **Lluvia de Objetos** | Elementos caen por la pantalla, tocar el que se pide (letra, número, color...) |
| **Memory Fonético** | Emparejar conceptos en cartas boca abajo (letra↔sonido, número↔cantidad, animal↔sonido) |
| **Sopa de Letras/Números** | Encontrar elementos específicos en cuadrícula 4x4 |
| **Colorea y Traza** | Seguir puntos guía con el dedo/ratón para dibujar letras, números, formas |
| **Quiz con Imágenes** | Preguntas con 3-4 opciones visuales grandes |

---

### ⭐ Sistema de Progreso y Gamificación

#### Estrellas
- Explorar una letra nueva: **+1 estrella**
- Respuesta correcta en juegos: **+1 estrella**
- Completar set de sílabas (5 vocales x 1 consonante): **+3 estrellas**
- Completar sesión completa (5 rondas): **+2 estrellas bonus**

#### Medallas e Insignias
| Medalla | Requisito |
|---|---|
| `vocales-exploradas` | Explorar las 5 vocales |
| `primera-silaba` | Construir la primera sílaba |
| `racha-3` | 3 días seguidos jugando |
| `10-estrellas` | Acumular 10 estrellas |
| `maestro-m` | Dominar todas las sílabas con M |
| `abecedario-completo` | Explorar todas las letras |
| *(y más por cada módulo futuro)* | |

#### Progresión
- **Avatar personalizable**: el niño elige y desbloquea accesorios con estrellas
- **Racha diaria**: bonus por jugar cada día consecutivo
- **Mapa de progreso visual**: camino tipo "mundo" con niveles desbloqueables
- **Solo refuerzo positivo**: NUNCA castigos, penalizaciones ni mensajes negativos
- **Niveles de dominio por letra**: Nuevo (gris) → Visto (amarillo) → Practicado (verde) → Dominado (dorado)

---

### 👨‍👩‍👦 Panel de Padres

- **Acceso protegido**: "parent gate" - mostrar 3 números y pedir tocarlos en orden (evita acceso accidental del niño)
- **Resumen de actividad**: tiempo aproximado, actividades completadas, estrellas ganadas
- **Cuadrícula de dominio**: cada letra/número coloreada por nivel de dominio
- **Gráfico de progreso**: evolución por módulo
- **Áreas fuertes vs. áreas a mejorar**: destacar dónde necesita más práctica
- **Historial de sesiones**: fechas, puntuaciones, contenido trabajado
- **Configuración**:
  - Límite de tiempo de juego
  - Nivel de dificultad
  - Módulos activos/inactivos
  - Velocidad de voz
- **Botón de reset** (con confirmación doble)

---

### 🎨 Diseño UI/UX para Niños

| Aspecto | Especificación |
|---|---|
| **Botones** | Mínimo 64x64px, bordes redondeados (`rounded-2xl`), sombra suave |
| **Navegación** | 100% por iconos, sin texto en menús |
| **Tipografía** | Nunito (redondeada, amigable), mínimo 18px base, títulos 24-32px |
| **Colores** | Paleta brillante y alegre (sky, pink, lime, orange, amber) |
| **Fondo** | Degradado suave (azul claro → blanco) |
| **Cards** | Blancas, corners grandes, borde lateral de color |
| **Personaje guía** | Animado, da instrucciones por voz (el niño no necesita leer) |
| **Transiciones** | Suaves entre pantallas (Motion AnimatePresence) |
| **Sin publicidad** | Cero distracciones |
| **Responsive** | Optimizado para tablet (principal) y desktop |
| **Pantalla completa** | Opción de fullscreen |

---

### 🔊 Sistema de Audio

- **Web Speech API** para pronunciación en español (preferencia `es-ES`)
- **Velocidad reducida** (`rate: 0.8`) para mejor comprensión infantil
- **Tono amigable** (`pitch: 1.1`) ligeramente más alto
- **Instrucciones habladas**: el niño NO necesita leer para navegar
- **Efectos de sonido**: feedback en cada interacción (tocar, acertar, logro)
- **Música de fondo**: suave, opcional, desactivable desde panel de padres
- **Fallback gracioso**: si no hay voz española disponible, muestra mensaje para pedir ayuda a un adulto

---

### 💾 Sistema de Persistencia

- **localStorage**: estado rápido (nivel actual, estrellas, configuración, streak)
- **IndexedDB**: historial detallado (intentos por letra, timestamps, sesiones completas)
- **Múltiples perfiles**: soporte para varios niños en el mismo dispositivo
- **Exportar/importar**: progreso en formato JSON
- **Sin registro ni cuenta**: todo 100% local, privacidad total
- **Versionado del schema**: campo `version` para migraciones futuras
- **Manejo de errores**: `QuotaExceededError` handled gracefully

---

### 🐳 Despliegue Docker

```dockerfile
# Multi-stage build
FROM node:20-alpine AS build    # Build con Node.js
FROM nginx:alpine               # Serve con nginx (ligero)
```

- **docker-compose.yml** listo para producción
- **nginx.conf** con SPA fallback (`try_files $uri /index.html`)
- **Cache de assets** estáticos (1 año con `immutable`)
- **Health checks** configurados
- Puerto configurable (default: 8080)
- `restart: unless-stopped`

```bash
# Desplegar
docker compose up -d

# Acceder
http://tu-vps:8080
```

---

### ♿ Accesibilidad

- **WCAG 2.1 Level AA**
- Navegación por teclado completa
- Alto contraste en elementos interactivos
- **Sin límites de tiempo** en actividades
- Feedback **visual + auditivo** simultáneo (nunca solo uno)
- Touch targets grandes para motricidad fina en desarrollo

---

## Arquitectura del Proyecto

```
edu-games/
├── public/
│   ├── images/
│   │   └── letters/           # Imagen por letra (SVG/emoji inicial)
│   ├── sounds/                # Efectos de sonido (celebración, click...)
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── common/            # BigButton, Card, Modal, ProgressBar, Badge
│   │   ├── layout/            # AppShell, TopBar, BottomNav
│   │   ├── modules/
│   │   │   ├── reading/       # LetterExplorer, LetterMatch, SyllableBuilder, WordBuilder
│   │   │   ├── math/          # (futuro) NumberExplorer, Counter, SimpleMath
│   │   │   ├── colors/        # (futuro) ColorMixer, ShapeSorter
│   │   │   ├── nature/        # (futuro) AnimalExplorer, SeasonWheel
│   │   │   ├── world/         # (futuro) DayWeek, FamilyTree
│   │   │   └── music/         # (futuro) InstrumentExplorer, RhythmGame
│   │   ├── games/             # LetterRain, PhoneticMemory, LetterSoup, TraceGame, ImageQuiz
│   │   ├── progress/          # StarCounter, BadgeList, ProgressMap, CelebrationOverlay
│   │   └── parent/            # ParentDashboard, ProgressChart, Settings, ParentGate
│   ├── hooks/
│   │   ├── useSpeech.ts       # Web Speech API wrapper (español)
│   │   ├── useAudio.ts        # Efectos de sonido
│   │   ├── useProgress.ts     # Lectura/escritura de progreso
│   │   ├── useGameState.ts    # Estado de juego/actividad
│   │   └── useProfiles.ts     # Gestión de perfiles de niños
│   ├── context/
│   │   └── ProgressContext.tsx # React Context para progreso global
│   ├── data/
│   │   ├── letters.ts         # Abecedario español (letra, fonema, palabra, imagen, color, grupo)
│   │   ├── syllables.ts       # Combinaciones de sílabas por consonante
│   │   ├── words.ts           # Vocabulario por nivel de dificultad
│   │   └── achievements.ts    # Definición de medallas e hitos
│   ├── stores/
│   │   └── progressStore.ts   # Abstracción localStorage/IndexedDB
│   ├── types/
│   │   ├── letters.ts         # LetterData, SyllableData, WordData
│   │   └── progress.ts        # UserProgress, LetterProgress, ActivitySession
│   ├── utils/
│   │   ├── speech.ts          # Utilidades TTS de bajo nivel
│   │   └── storage.ts         # Helpers de localStorage con manejo de errores
│   ├── styles/
│   │   └── theme.css          # @theme de Tailwind v4 (colores, fuentes, radii)
│   ├── App.tsx                # Rutas (/, /explorar, /emparejar, /silabas, /palabras, /padres)
│   ├── main.tsx               # Entry point (BrowserRouter + ProgressProvider)
│   └── index.css              # @import "tailwindcss" + theme
├── Dockerfile
├── docker-compose.yml
├── nginx.conf
├── package.json
├── tsconfig.json
├── vite.config.ts
├── LICENSE
└── README.md
```

---

## Roadmap

| Versión | Contenido |
|---|---|
| **v0.1** | Base del proyecto + Módulo Lectura completo (Explorador, Asociación, Sílabas, Palabras) |
| **v0.2** | Minijuegos transversales + Sistema de gamificación completo |
| **v0.3** | Módulo Números y Matemáticas |
| **v0.4** | Módulo Colores y Formas |
| **v0.5** | Panel de Padres completo con gráficos |
| **v0.6** | Módulo Naturaleza y Ciencias |
| **v0.7** | Módulo Conocimiento del Entorno |
| **v0.8** | Módulo Música y Ritmo |
| **v1.0** | PWA (Progressive Web App) para uso offline |
| **Futuro** | Backend opcional para sync entre dispositivos, modo multijugador (hermanos/amigos), más idiomas |

---

## Licencia

Este proyecto está bajo la [MIT License](./LICENSE).

© 2026 Juan Jesús. Eres libre de usar, modificar y distribuir este proyecto,
siempre que mantengas el crédito al autor original.
