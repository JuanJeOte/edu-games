# Skill: Diseño UI para Niños (4-7 años)

Guía de diseño de interfaces infantiles para edu-games. Aplicar siempre que se creen o modifiquen componentes de UI.

## Principios Fundamentales

### 1. Tamaño y Áreas de Toque
- **Botones mínimo**: 64x64px (`min-w-16 min-h-16`)
- **Áreas de toque**: mínimo 48x48px (WCAG), ideal 64px+ para motricidad fina en desarrollo
- **Espaciado entre elementos interactivos**: mínimo 12px para evitar toques accidentales
- **Textos**: mínimo 18px base, títulos 24-32px
- **Iconos**: mínimo 32x32px, ideal 48px

### 2. Tipografía
- **Fuente principal**: Nunito (redondeada, amigable)
- **Pesos**: 400 (cuerpo), 600 (subtítulos), 700 (títulos), 800 (destacados)
- **Fallbacks**: Comic Neue → system sans-serif
- **Interlineado**: 1.5+ para legibilidad
- **NUNCA**: fuentes serif, cursivas, o con trazos finos

### 3. Feedback Visual y Emocional
- **Correcto**: Flash verde + escala up + sonido positivo + estrellas
- **Incorrecto**: Wobble naranja (NUNCA rojo para errores) + pausa suave
- **Exploración**: Escala + rotación leve al tocar
- **Progreso**: Barras de color, contadores con animación spring
- **NUNCA**: mensajes negativos, textos de error, sonidos de fallo agresivos

### 4. Animaciones (Motion/Framer Motion)
```tsx
// Toque en botón
whileTap={{ scale: 0.95 }}

// Hover (desktop)
whileHover={{ scale: 1.05 }}

// Spring para elementos que aparecen
transition={{ type: "spring", stiffness: 400, damping: 20 }}

// Entrada de página
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}

// Celebración: partículas con rotación y colores aleatorios
```

### 5. Colores seguros para niños
- Usar la paleta definida en `src/index.css`
- Colores brillantes pero no estridentes
- Contraste mínimo 4.5:1 (WCAG AA)
- Fondo: gradientes suaves (sky → blue → indigo)
- **NUNCA**: negro puro como fondo, grises oscuros, combinaciones de bajo contraste

### 6. Navegación
- **100% basada en iconos/emojis** en menús
- Máximo 4-5 opciones visibles
- Indicador visual claro del estado activo
- Botón de "volver" siempre visible y grande
- Sin menús desplegables ni navegación anidada profunda

### 7. Estados de los Componentes
- **Bloqueado**: Gris con candado 🔒, sin interacción
- **Disponible**: Color vibrante, leve bounce idle
- **Completado**: Checkmark verde ✅, color atenuado
- **Activo**: Borde/sombra destacado, escala ligeramente mayor

### 8. Accesibilidad Infantil
- Keyboard navigation completa (Tab, Enter, Escape)
- No depender solo de color (siempre icono + color)
- No límites de tiempo en actividades
- Audio + visual siempre juntos (nunca solo audio)
- `aria-label` descriptivos en español
- `role="button"` en elementos clickeables no-button

### 9. Patrones de Componente
```tsx
// Patrón estándar de botón infantil
<motion.button
  className="min-w-16 min-h-16 rounded-2xl text-xl font-bold
             shadow-md active:shadow-sm select-none"
  whileTap={{ scale: 0.95 }}
  whileHover={{ scale: 1.05 }}
  transition={{ type: "spring", stiffness: 400, damping: 20 }}
  aria-label="Descripción clara"
>
  <span className="text-3xl">🎯</span>
  <span>Texto Grande</span>
</motion.button>

// Patrón de tarjeta de actividad
<motion.div
  className="bg-white rounded-3xl p-6 shadow-lg border-l-4 border-[color]"
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
>
  {/* Emoji grande + título + barra de progreso */}
</motion.div>
```

### 10. Anti-patrones (EVITAR)
- ❌ Texto pequeño (<16px)
- ❌ Botones pequeños (<48px)
- ❌ Color rojo para errores
- ❌ Mensajes negativos ("¡Mal!", "Incorrecto!")
- ❌ Temporizadores con presión
- ❌ Scroll infinito
- ❌ Pop-ups modales que bloqueen
- ❌ Formularios con campos de texto (los niños no escriben)
- ❌ Navegación compleja/profunda
- ❌ Sonidos fuertes o repentinos
