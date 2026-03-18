import { motion, useSpring, useTransform, useMotionValue } from 'motion/react'
import { useEffect } from 'react'
import { Link } from 'react-router'

interface TopBarProps {
  stars?: number
}

export default function TopBar({ stars = 0 }: TopBarProps) {
  const motionVal = useMotionValue(stars)
  const springVal = useSpring(motionVal, { stiffness: 200, damping: 20 })
  const displayVal = useTransform(springVal, (v) => Math.round(v).toString())

  useEffect(() => {
    motionVal.set(stars)
  }, [stars, motionVal])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 h-16">
      <div className="flex items-center justify-between h-full px-4 max-w-screen-sm mx-auto">
        {/* Star counter */}
        <div className="flex items-center gap-1.5 bg-yellow-50 border border-yellow-200 rounded-full px-3 py-1.5 min-w-[70px]">
          <span className="text-lg leading-none">⭐</span>
          <motion.span
            className="font-bold text-yellow-700 text-base tabular-nums"
            key={stars}
            initial={{ scale: 1.4 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
          >
            <motion.span>{displayVal}</motion.span>
          </motion.span>
        </div>

        {/* App title */}
        <Link to="/" className="select-none">
          <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-sm">
            edu-games
          </span>
        </Link>

        {/* Settings link */}
        <Link
          to="/padres"
          aria-label="Ajustes"
          className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-6 h-6 text-gray-500"
          >
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </Link>
      </div>
    </header>
  )
}
