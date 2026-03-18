import { motion, AnimatePresence } from 'motion/react'

interface StarCounterProps {
  count: number
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
  sm: { emoji: 'text-lg', text: 'text-sm', wrap: 'px-2 py-1 gap-1' },
  md: { emoji: 'text-2xl', text: 'text-base', wrap: 'px-3 py-1.5 gap-1.5' },
  lg: { emoji: 'text-3xl', text: 'text-xl', wrap: 'px-4 py-2 gap-2' },
}

export default function StarCounter({ count, size = 'md' }: StarCounterProps) {
  const { emoji, text, wrap } = sizeClasses[size]

  return (
    <div
      className={`inline-flex items-center ${wrap} bg-yellow-50 border border-yellow-200 rounded-full`}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={count}
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: [1.3, 1], opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 15 }}
          className={`${emoji} leading-none`}
        >
          ⭐
        </motion.span>
      </AnimatePresence>
      <AnimatePresence mode="wait">
        <motion.span
          key={count}
          initial={{ y: -8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 8, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className={`${text} font-extrabold text-yellow-700 tabular-nums`}
        >
          {count}
        </motion.span>
      </AnimatePresence>
    </div>
  )
}
