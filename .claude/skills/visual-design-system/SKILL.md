# Skill: Sistema de Diseño Visual

Guía del design system de edu-games. Referencia para mantener consistencia visual en todos los componentes.

## Paleta de Colores

### Colores Principales (definidos en `src/index.css`)
| Token | Hex | Uso |
|-------|-----|-----|
| `--color-primary` | `#4F46E5` | Botones principales, navegación activa, acentos |
| `--color-secondary` | `#F59E0B` | Estrellas, logros, highlights |
| `--color-success` | `#10B981` | Respuesta correcta, progreso completado |
| `--color-danger` | `#EF4444` | Solo para padres (reset, eliminar). NUNCA para errores del niño |

### Colores Fun (para tarjetas y categorías)
| Token | Hex | Uso |
|-------|-----|-----|
| `--color-sky-light` | `#7DD3FC` | Letras, explorador |
| `--color-pink` | `#F472B6` | Sílabas, musical |
| `--color-lime` | `#A3E635` | Naturaleza, ciencias |
| `--color-fun-orange` | `#FB923C` | Matemáticas, números |
| `--color-fun-purple` | `#C084FC` | Palabras, juegos |
| `--color-fun-cyan` | `#22D3EE` | Conocimiento, mundo |

### Fondos
- **App**: `bg-gradient-to-b from-sky-100 via-blue-50 to-indigo-100`
- **Tarjetas**: `bg-white` con `shadow-lg`
- **Modales**: `bg-black/40` overlay + `bg-white` contenido

### Colores por Letra
Cada letra tiene un color único asignado en `src/data/letters.ts`. Respetar estos colores siempre que se muestre una letra individual.

## Tipografía

```css
font-family: 'Nunito', 'Comic Neue', system-ui, sans-serif;
```

| Elemento | Tamaño | Peso | Clase Tailwind |
|----------|--------|------|----------------|
| Título principal | 32px | 800 | `text-3xl font-extrabold` |
| Título sección | 24px | 700 | `text-2xl font-bold` |
| Subtítulo | 20px | 600 | `text-xl font-semibold` |
| Cuerpo | 18px | 400 | `text-lg` |
| Etiqueta | 16px | 600 | `text-base font-semibold` |
| Letra grande (explorer) | 72-96px | 800 | `text-7xl font-extrabold` |
| Emoji decorativo | 48-64px | - | `text-5xl` / `text-6xl` |

## Componentes Base

### BigButton
```
Variantes: md (48px), lg (64px), xl (80px)
Bordes: rounded-2xl
Sombra: shadow-md → active:shadow-sm
Animación: whileTap scale 0.95, whileHover scale 1.05
Spring: stiffness 400, damping 20
```

### LetterCard
```
Tamaño: min 64x64px
Borde: rounded-xl con borde de color de la letra
Estado explorado: checkmark ✅ superpuesto
Animación: tap → scale + rotate
Color de fondo: blanco con borde lateral del color de la letra
```

### ProgressBar
```
Altura: 8-12px
Bordes: rounded-full
Fondo: gray-200
Relleno: gradiente del color de la actividad
Animación: width transition con spring
```

### StarCounter
```
Icono: ⭐ emoji
Número: font-bold text-xl
Animación: spring pop-in cuando cambia el valor
Badge de racha: 🔥 con días
```

### Tarjeta de Actividad (HomePage)
```
Layout: flex horizontal
Borde izquierdo: 4px del color de la actividad
Bordes: rounded-3xl
Padding: p-6
Sombra: shadow-lg
Contenido: emoji (text-4xl) + título + descripción + ProgressBar
```

## Layout

### AppShell
```
TopBar: fijo arriba, h-14, bg-white/80 backdrop-blur
Contenido: flex-1, overflow-y-auto, pb-20 (espacio para BottomNav)
BottomNav: fijo abajo, h-16, bg-white, border-t
```

### BottomNav
```
4 tabs: 🏠 Inicio, 🔤 Letras, 🎮 Juegos, 🧩 Sílabas
Activo: text-primary + underline animado
Inactivo: text-gray-400
Animación: spring en cambio de tab
```

### Grid Responsivo
```
Letras: grid-cols-5 (mobile) → grid-cols-7 (tablet+)
Actividades: grid-cols-1 (mobile) → grid-cols-2 (tablet+)
Gap: gap-3 (compacto) → gap-4 (espacioso)
```

## Animaciones

### Transiciones de Página
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -20 }}
  transition={{ duration: 0.3 }}
>
```

### Feedback de Respuesta
```tsx
// Correcto
animate={{ scale: [1, 1.2, 1], backgroundColor: ["#fff", "#D1FAE5", "#fff"] }}
transition={{ duration: 0.5 }}

// Incorrecto (wobble naranja, NUNCA rojo)
animate={{ x: [0, -10, 10, -10, 10, 0], backgroundColor: ["#fff", "#FED7AA", "#fff"] }}
transition={{ duration: 0.5 }}
```

### Celebración (Partículas de Estrellas)
```tsx
// Overlay fullscreen con partículas
// 15-20 estrellas ⭐ con:
//   - Posición X aleatoria
//   - Rotación 0 → 360°
//   - Scale 0 → 1 → 0
//   - Colores: amber, yellow, orange aleatorio
//   - Duración: 1.5-2s
//   - Ease: easeOut
```

### Micro-interacciones
| Acción | Animación |
|--------|-----------|
| Tap botón | `scale: 0.95` (100ms spring) |
| Hover tarjeta | `scale: 1.02` (200ms) |
| Nuevo badge | `scale: [0, 1.3, 1]` + rotate |
| Suma de estrellas | Counter slides up + pop |
| Letra pronunciada | `scale: [1, 1.15, 1]` pulse |
| Sílaba formada | Merge animation (2 → 1) |

## Iconografía

### Emojis como Iconos
Este proyecto usa **emojis nativos** como sistema de iconos:

| Contexto | Emojis |
|----------|--------|
| Navegación | 🏠 🔤 🎮 🧩 |
| Logros | ⭐ 🏆 🎯 🔥 🌟 |
| Letras | 📝 🔤 🔡 🅰️ |
| Feedback | ✅ ✨ 🎉 👏 |
| Padres | 👨‍👩‍👧 ⚙️ 📊 🔒 |
| Actividades | 📖 🎵 🎨 🔢 🌍 🔬 |

### Reglas de Emoji
- Tamaño mínimo: `text-2xl` (24px)
- Decorativos: `text-4xl` a `text-6xl`
- Un emoji por concepto (no mezclar)
- Consistentes a lo largo de la app (mismo emoji = mismo concepto)

## Espaciado

### Sistema de Spacing (Tailwind)
| Token | Valor | Uso |
|-------|-------|-----|
| `p-2` | 8px | Padding interno mínimo |
| `p-4` | 16px | Padding estándar |
| `p-6` | 24px | Padding de tarjetas |
| `gap-2` | 8px | Espacio entre items compactos |
| `gap-3` | 12px | Espacio entre items normal |
| `gap-4` | 16px | Espacio entre secciones |
| `gap-6` | 24px | Espacio entre bloques |
| `mb-4` | 16px | Margen entre secciones |
| `mb-8` | 32px | Margen entre bloques grandes |

## Responsive Breakpoints

| Breakpoint | Ancho | Dispositivo |
|------------|-------|-------------|
| Default | 0-639px | Móvil |
| `sm:` | 640px+ | Móvil grande |
| `md:` | 768px+ | Tablet |
| `lg:` | 1024px+ | Desktop |

**Prioridad**: Tablet-first. La experiencia principal es en tablet, con adaptaciones para móvil y desktop.

## Sombras

| Clase | Uso |
|-------|-----|
| `shadow-sm` | Botones presionados |
| `shadow-md` | Botones en reposo |
| `shadow-lg` | Tarjetas, modales |
| `shadow-xl` | Elementos flotantes destacados |

## Bordes

| Clase | Uso |
|-------|-----|
| `rounded-lg` | Botones secundarios |
| `rounded-xl` | Tarjetas de letra |
| `rounded-2xl` | Botones principales |
| `rounded-3xl` | Tarjetas de actividad |
| `rounded-full` | Avatares, badges, progress bars |
