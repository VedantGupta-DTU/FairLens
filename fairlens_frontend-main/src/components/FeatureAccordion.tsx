import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface AccordionItem {
  id: string
  number: string
  label: string
  title: string
  color: string
  content: React.ReactNode
}

export default function FeatureAccordion({ items }: { items: AccordionItem[] }) {
  const [activeId, setActiveId] = useState(items[0]?.id || '')

  return (
    <div className="space-y-3">
      {items.map((item) => {
        const isActive = activeId === item.id
        return (
          <motion.div
            key={item.id}
            layout
            onClick={() => setActiveId(item.id)}
            className="rounded-xl overflow-hidden cursor-hover transition-all duration-300"
            style={{
              background: isActive ? `${item.color}08` : 'transparent',
              border: `1px solid ${isActive ? `${item.color}40` : 'rgba(255,255,255,0.06)'}`,
            }}
          >
            <div className="flex items-center gap-3 px-5 py-4">
              <span
                className="text-xs font-bold tracking-wider"
                style={{ color: isActive ? item.color : 'var(--color-text-muted)' }}
              >
                {item.number}
              </span>
              <span
                className="text-sm font-semibold uppercase tracking-wider transition-colors duration-300"
                style={{ color: isActive ? item.color : 'var(--color-text-muted)' }}
              >
                {item.label}
              </span>
              <motion.div
                animate={{ rotate: isActive ? 45 : 0 }}
                className="ml-auto text-sm"
                style={{ color: isActive ? item.color : 'var(--color-text-muted)' }}
              >
                +
              </motion.div>
            </div>

            <AnimatePresence>
              {isActive && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-5">
                    {item.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )
      })}
    </div>
  )
}
