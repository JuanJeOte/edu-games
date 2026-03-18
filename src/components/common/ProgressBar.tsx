import { motion } from 'motion/react'

interface ProgressBarProps {
  value: number // 0-100
  color?: string
  height?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
}

const heightClasses = {
  sm: 'h-2',
  md: 'h-4',
  lg: 'h-6',
}

export default function ProgressBar({
  value,
  color = 'bg-purple-500',
  height = 'md',
  showLabel = false,
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value))

  return (
    <div className="flex items-center gap-3 w-full">
      <div
        className={`flex-1 ${heightClasses[height]} bg-gray-100 rounded-full overflow-hidden`}
      >
        <motion.div
          className={`h-full ${color} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${clamped}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </div>
      {showLabel && (
        <span className="text-sm font-bold text-gray-500 tabular-nums w-10 text-right">
          {clamped}%
        </span>
      )}
    </div>
  )
}
