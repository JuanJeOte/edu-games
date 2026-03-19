import { motion } from 'motion/react'

interface LetterCardProps {
  letter: string
  color: string // hex color
  explored?: boolean
  onClick?: () => void
  size?: 'sm' | 'md' | 'lg' | 'auto'
}

const sizeClasses = {
  sm: { card: 'w-16 h-16', letter: 'text-2xl', check: 'text-sm' },
  md: { card: 'w-24 h-24', letter: 'text-4xl', check: 'text-base' },
  lg: { card: 'w-32 h-32', letter: 'text-5xl', check: 'text-xl' },
  auto: { card: 'w-full aspect-square min-h-[48px]', letter: 'text-xl sm:text-2xl', check: 'text-xs' },
}

export default function LetterCard({
  letter,
  color,
  explored = false,
  onClick,
  size = 'md',
}: LetterCardProps) {
  const { card, letter: letterSize, check } = sizeClasses[size]

  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.9, rotate: -3 }}
      whileHover={{ scale: 1.08 }}
      transition={{ type: 'spring', stiffness: 500, damping: 18 }}
      className={`${card} rounded-2xl shadow-md flex flex-col items-center justify-center relative select-none cursor-pointer`}
      style={{ backgroundColor: `${color}22`, borderWidth: 2, borderColor: color }}
      aria-label={`Letra ${letter}${explored ? ', explorada' : ''}`}
    >
      <span className={`${letterSize} font-extrabold leading-none`} style={{ color }}>
        {letter}
      </span>
      {explored && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 600, damping: 20 }}
          className={`${check} absolute top-1 right-1.5 leading-none`}
        >
          ✅
        </motion.span>
      )}
    </motion.button>
  )
}
