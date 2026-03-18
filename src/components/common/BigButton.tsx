import { motion } from 'motion/react'

interface BigButtonProps {
  children: React.ReactNode
  onClick?: () => void
  color?: string
  disabled?: boolean
  size?: 'md' | 'lg' | 'xl'
  className?: string
}

const sizeClasses = {
  md: 'min-w-16 min-h-16 px-6 py-3 text-lg',
  lg: 'min-w-20 min-h-20 px-8 py-4 text-xl',
  xl: 'min-w-24 min-h-24 px-10 py-5 text-2xl',
}

export default function BigButton({
  children,
  onClick,
  color = 'bg-purple-500',
  disabled = false,
  size = 'lg',
  className = '',
}: BigButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileTap={disabled ? {} : { scale: 0.95 }}
      whileHover={disabled ? {} : { scale: 1.05 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      className={[
        color,
        sizeClasses[size],
        'rounded-2xl font-extrabold text-white shadow-lg',
        'flex items-center justify-center gap-2',
        'select-none cursor-pointer',
        disabled ? 'opacity-40 cursor-not-allowed' : 'active:shadow-md',
        className,
      ].join(' ')}
    >
      {children}
    </motion.button>
  )
}
