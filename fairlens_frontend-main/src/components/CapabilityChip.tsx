import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'

interface CapabilityChipProps {
  icon: LucideIcon
  label: string
  active?: boolean
  onClick?: () => void
  color?: string
}

export default function CapabilityChip({
  icon: Icon,
  label,
  active = false,
  onClick,
  color = '#E07A5F',
}: CapabilityChipProps) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05, y: -1 }}
      whileTap={{ scale: 0.95 }}
      className="cursor-hover flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-medium transition-all duration-300 whitespace-nowrap"
      style={{
        background: active ? `${color}12` : 'rgba(255,255,255,0.03)',
        border: `1px solid ${active ? `${color}40` : 'rgba(255,255,255,0.08)'}`,
        color: active ? color : 'var(--color-text-muted)',
        boxShadow: active ? `0 0 20px ${color}10` : 'none',
      }}
    >
      <Icon className="w-3.5 h-3.5" />
      {label}
    </motion.button>
  )
}
