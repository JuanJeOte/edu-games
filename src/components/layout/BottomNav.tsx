import { Link, useLocation } from 'react-router'
import { motion } from 'motion/react'

const tabs = [
  { label: 'Inicio', emoji: '🏠', route: '/' },
  { label: 'Letras', emoji: '🔤', route: '/explorar' },
  { label: 'Juegos', emoji: '🎮', route: '/emparejar' },
  { label: 'Sílabas', emoji: '🧩', route: '/silabas' },
]

export default function BottomNav() {
  const { pathname } = useLocation()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-t border-gray-100">
      <ul className="flex items-stretch justify-around max-w-screen-sm md:max-w-2xl mx-auto">
        {tabs.map(({ label, emoji, route }) => {
          const isActive =
            route === '/' ? pathname === '/' : pathname.startsWith(route)

          return (
            <li key={route} className="flex-1">
              <Link
                to={route}
                className="flex flex-col items-center justify-center min-h-16 py-2 gap-0.5 w-full select-none"
                aria-label={label}
              >
                <motion.div
                  animate={isActive ? { scale: 1.2 } : { scale: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  className="text-2xl leading-none"
                >
                  {emoji}
                </motion.div>
                <span
                  className={`text-xs font-semibold tracking-tight transition-colors ${
                    isActive ? 'text-purple-600' : 'text-gray-400'
                  }`}
                >
                  {label}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="bottom-nav-indicator"
                    className="absolute bottom-0 h-1 w-10 rounded-t-full bg-purple-500"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
