import { motion } from 'framer-motion'

interface FlowNode {
  id: string
  label: string
  sublabel?: string
  color?: string
  icon?: string
}

interface FlowDiagramProps {
  nodes: FlowNode[]
  variant?: 'horizontal' | 'triangle'
  animationDelay?: number
}

export default function FlowDiagram({ nodes, variant = 'horizontal', animationDelay = 0 }: FlowDiagramProps) {
  if (variant === 'triangle' && nodes.length >= 3) {
    return <TriangleFlow nodes={nodes} delay={animationDelay} />
  }

  return (
    <div className="flex flex-col gap-6">
      {nodes.map((node, i) => (
        <div key={node.id} className="flex items-center gap-4">
          {/* Node */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: animationDelay + i * 0.2, duration: 0.5 }}
            className="relative flex items-center gap-3 px-5 py-3.5 rounded-xl min-w-[200px]"
            style={{
              background: `linear-gradient(135deg, ${node.color || '#E07A5F'}10, rgba(15,14,13,0.8))`,
              border: `1px solid ${node.color || '#E07A5F'}30`,
            }}
          >
            {node.icon && <span className="text-lg">{node.icon}</span>}
            <div>
              <p className="text-sm font-semibold text-[var(--color-text-primary)]">{node.label}</p>
              {node.sublabel && (
                <p className="text-[10px] text-[var(--color-text-muted)]">{node.sublabel}</p>
              )}
            </div>
          </motion.div>

          {/* Connector line */}
          {i < nodes.length - 1 && (
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ delay: animationDelay + i * 0.2 + 0.3, duration: 0.4 }}
              className="flex-1 h-[1px] origin-left"
              style={{
                background: `linear-gradient(90deg, ${node.color || '#E07A5F'}40, transparent)`,
              }}
            />
          )}

          {/* Alert icon between certain nodes */}
          {i < nodes.length - 1 && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: animationDelay + i * 0.2 + 0.5, type: 'spring' }}
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
              style={{
                background: `${node.color || '#f59e0b'}15`,
                border: `1px solid ${node.color || '#f59e0b'}30`,
              }}
            >
              {node.icon === '⚠️' ? '⚠️' : '→'}
            </motion.div>
          )}
        </div>
      ))}
    </div>
  )
}

function TriangleFlow({ nodes, delay }: { nodes: FlowNode[]; delay: number }) {
  const colors = ['#E07A5F', '#22c55e', '#3D5A80']

  return (
    <div className="relative w-full max-w-[320px] mx-auto" style={{ aspectRatio: '1' }}>
      {/* Center node (the problem/exclamation) */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: delay + 0.5, type: 'spring' }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full flex items-center justify-center z-10"
        style={{
          background: 'linear-gradient(135deg, rgba(245,158,11,0.2), rgba(245,158,11,0.05))',
          border: '2px solid rgba(245,158,11,0.4)',
          boxShadow: '0 0 30px rgba(245,158,11,0.15)',
        }}
      >
        <span className="text-xl">⚠️</span>
      </motion.div>

      {/* SVG connecting lines */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 320 320">
        {/* Dashed lines from corners to center */}
        {[
          { x1: 100, y1: 50, x2: 160, y2: 140 },
          { x1: 260, y1: 150, x2: 185, y2: 160 },
          { x1: 100, y1: 270, x2: 150, y2: 185 },
        ].map((line, i) => (
          <motion.line
            key={i}
            x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2}
            stroke={`${colors[i]}60`}
            strokeWidth="1.5"
            strokeDasharray="6 4"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ delay: delay + 0.2 + i * 0.2, duration: 0.8 }}
          />
        ))}
      </svg>

      {/* Three corner nodes */}
      {nodes.slice(0, 3).map((node, i) => {
        const positions = [
          { top: '5%', left: '15%' },
          { top: '35%', right: '2%' },
          { bottom: '5%', left: '15%' },
        ]

        return (
          <motion.div
            key={node.id}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: delay + i * 0.15, duration: 0.5 }}
            className="absolute px-4 py-3 rounded-xl max-w-[160px]"
            style={{
              ...positions[i],
              background: `linear-gradient(135deg, ${colors[i]}12, rgba(15,14,13,0.8))`,
              border: `1px solid ${colors[i]}30`,
            }}
          >
            <p className="text-xs font-bold text-[var(--color-text-primary)] uppercase tracking-wider">{node.label}</p>
            {node.sublabel && (
              <p className="text-[10px] text-[var(--color-text-muted)] mt-0.5">{node.sublabel}</p>
            )}
          </motion.div>
        )
      })}

      {/* Bottom label */}
      {nodes.length > 3 && (
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: delay + 1 }}
          className="absolute -bottom-6 left-0 right-0 text-center text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-muted)]"
        >
          {nodes[3]?.sublabel || 'Disconnected workflows create response delay'}
        </motion.p>
      )}
    </div>
  )
}
