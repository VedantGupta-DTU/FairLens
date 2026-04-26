import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface HexData {
  id: string
  label: string
  sector: string
  score: number
  severity: 'critical' | 'warning' | 'fair' | 'neutral'
  icon?: string
}

const defaultData: HexData[] = [
  { id: '1', label: 'UP Loans', sector: 'Finance', score: 34, severity: 'critical', icon: '🏦' },
  { id: '2', label: 'NFHS Health', sector: 'Health', score: 72, severity: 'fair', icon: '🏥' },
  { id: '3', label: 'AISHE Edu', sector: 'Education', score: 58, severity: 'warning', icon: '🎓' },
  { id: '4', label: 'Delhi Insur.', sector: 'Insurance', score: 41, severity: 'warning', icon: '🛡️' },
  { id: '5', label: 'MP Ration', sector: 'Welfare', score: 85, severity: 'fair', icon: '🍚' },
  { id: '6', label: 'TN Jobs', sector: 'Employment', score: 91, severity: 'fair', icon: '💼' },
  { id: '7', label: 'Bihar Edu', sector: 'Education', score: 29, severity: 'critical', icon: '📚' },
  { id: '8', label: 'MH Housing', sector: 'Housing', score: 67, severity: 'fair', icon: '🏠' },
  { id: '9', label: 'KA Health', sector: 'Health', score: 78, severity: 'fair', icon: '⚕️' },
  { id: '10', label: 'RJ Water', sector: 'Welfare', score: 45, severity: 'warning', icon: '💧' },
  { id: '11', label: 'GJ Finance', sector: 'Finance', score: 38, severity: 'critical', icon: '💳' },
  { id: '12', label: 'WB Transport', sector: 'Transport', score: 82, severity: 'fair', icon: '🚌' },
  { id: '13', label: 'AP AgriLoan', sector: 'Finance', score: 52, severity: 'warning', icon: '🌾' },
  { id: '14', label: 'HR Police', sector: 'Justice', score: 31, severity: 'critical', icon: '⚖️' },
  { id: '15', label: 'JH Mining', sector: 'Industry', score: 88, severity: 'fair', icon: '⛏️' },
  { id: '16', label: 'PB Pension', sector: 'Welfare', score: 74, severity: 'fair', icon: '👴' },
  { id: '17', label: 'UK Tourism', sector: 'Services', score: 90, severity: 'fair', icon: '🏔️' },
  { id: '18', label: 'CG Tribal', sector: 'Welfare', score: 25, severity: 'critical', icon: '🏘️' },
  { id: '19', label: 'OR Disaster', sector: 'Emergency', score: 69, severity: 'fair', icon: '🌊' },
]

const severityColors = {
  critical: { bg: '#ef4444', glow: 'rgba(239,68,68,0.3)', border: 'rgba(239,68,68,0.5)' },
  warning: { bg: '#f59e0b', glow: 'rgba(245,158,11,0.3)', border: 'rgba(245,158,11,0.5)' },
  fair: { bg: '#22c55e', glow: 'rgba(34,197,94,0.3)', border: 'rgba(34,197,94,0.5)' },
  neutral: { bg: '#6b7280', glow: 'rgba(107,114,128,0.2)', border: 'rgba(107,114,128,0.3)' },
}

const filterOptions = [
  { id: 'all', label: 'All', color: '#fff' },
  { id: 'critical', label: 'Critical', color: '#ef4444' },
  { id: 'warning', label: 'Warning', color: '#f59e0b' },
  { id: 'fair', label: 'Fair', color: '#22c55e' },
]

export default function HexGrid({ data = defaultData }: { data?: HexData[] }) {
  const [hoveredHex, setHoveredHex] = useState<string | null>(null)
  const [filter, setFilter] = useState('all')

  const filteredData = filter === 'all'
    ? data
    : data.filter(d => d.severity === filter)

  const criticalCount = data.filter(d => d.severity === 'critical').length
  const warningCount = data.filter(d => d.severity === 'warning').length
  const fairCount = data.filter(d => d.severity === 'fair').length

  // Hexagon layout: staggered grid
  const hexSize = 52
  const hexGapX = 6
  const hexGapY = 6
  const cols = 5

  return (
    <div className="relative">
      {/* Stats header */}
      <div className="flex items-center justify-between mb-5 px-2">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-6 text-sm font-mono">
            <div>
              <span className="text-2xl font-bold text-red-400">{criticalCount}</span>
              <span className="text-[10px] text-[var(--color-text-muted)] block uppercase tracking-wider">Critical</span>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div>
              <span className="text-2xl font-bold text-amber-400">{warningCount}</span>
              <span className="text-[10px] text-[var(--color-text-muted)] block uppercase tracking-wider">Warning</span>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div>
              <span className="text-2xl font-bold text-emerald-400">{fairCount}</span>
              <span className="text-[10px] text-[var(--color-text-muted)] block uppercase tracking-wider">Fair</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-semibold text-emerald-400 tracking-wider">LIVE</span>
        </div>
      </div>

      {/* Filter chips */}
      <div className="flex items-center gap-2 mb-5 px-2">
        {filterOptions.map(f => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className="px-3 py-1 rounded-full text-xs font-medium transition-all cursor-hover"
            style={{
              background: filter === f.id ? `${f.color}15` : 'transparent',
              border: `1px solid ${filter === f.id ? `${f.color}40` : 'rgba(255,255,255,0.08)'}`,
              color: filter === f.id ? f.color : 'var(--color-text-muted)',
            }}
          >
            {f.id !== 'all' && <span className="inline-block w-1.5 h-1.5 rounded-full mr-1.5" style={{ backgroundColor: f.color }} />}
            {f.label}
          </button>
        ))}
      </div>

      {/* Hex grid */}
      <div className="relative" style={{ minHeight: Math.ceil(filteredData.length / cols) * (hexSize * 0.87 + hexGapY) + hexSize }}>
        <AnimatePresence mode="popLayout">
          {filteredData.map((hex, i) => {
            const col = i % cols
            const row = Math.floor(i / cols)
            const isOddRow = row % 2 === 1
            const x = col * (hexSize + hexGapX) + (isOddRow ? (hexSize + hexGapX) / 2 : 0)
            const y = row * (hexSize * 0.87 + hexGapY)
            const colors = severityColors[hex.severity]
            const isHovered = hoveredHex === hex.id

            return (
              <motion.div
                key={hex.id}
                layout
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ delay: i * 0.03, type: 'spring', stiffness: 300, damping: 25 }}
                className="absolute cursor-hover"
                style={{ left: x, top: y, width: hexSize, height: hexSize }}
                onMouseEnter={() => setHoveredHex(hex.id)}
                onMouseLeave={() => setHoveredHex(null)}
              >
                {/* Hexagon shape via clip-path */}
                <motion.div
                  animate={{
                    boxShadow: isHovered
                      ? `0 0 20px ${colors.glow}, inset 0 0 15px ${colors.glow}`
                      : `0 0 8px ${colors.glow}`,
                  }}
                  className="w-full h-full flex items-center justify-center text-sm font-bold transition-all duration-300 relative"
                  style={{
                    clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                    background: isHovered
                      ? `linear-gradient(135deg, ${colors.bg}30, ${colors.bg}15)`
                      : `linear-gradient(135deg, ${colors.bg}20, ${colors.bg}08)`,
                    border: 'none',
                  }}
                >
                  {/* Inner border hexagon */}
                  <div
                    className="absolute inset-[2px]"
                    style={{
                      clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                      background: isHovered
                        ? `linear-gradient(135deg, ${colors.bg}25, rgba(15,14,13,0.8))`
                        : 'rgba(15,14,13,0.6)',
                    }}
                  />
                  <span className="relative z-10 text-base">{hex.icon || '✓'}</span>
                </motion.div>

                {/* Hover tooltip */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0, y: 5, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 5, scale: 0.9 }}
                      className="absolute -bottom-16 left-1/2 -translate-x-1/2 z-50 px-3 py-2 rounded-lg whitespace-nowrap"
                      style={{
                        background: 'rgba(15,14,13,0.95)',
                        border: `1px solid ${colors.border}`,
                        backdropFilter: 'blur(10px)',
                        boxShadow: `0 4px 20px rgba(0,0,0,0.5), 0 0 10px ${colors.glow}`,
                      }}
                    >
                      <p className="text-xs font-semibold" style={{ color: colors.bg }}>{hex.label}</p>
                      <p className="text-[10px] text-[var(--color-text-muted)]">{hex.sector} · Score: {hex.score}/100</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  )
}
