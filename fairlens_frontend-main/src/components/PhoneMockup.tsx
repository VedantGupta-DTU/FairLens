import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ChatMsg { role: 'user' | 'ai'; text: string }

const convos: Record<string, ChatMsg[]> = {
  hindi: [
    { role: 'ai', text: 'क्या आपने bias audit की ज़रूरत report की?' },
    { role: 'user', text: 'हाँ' },
    { role: 'ai', text: '✅ SC/ST women: 14% approval vs General men: 76%' },
  ],
  english: [
    { role: 'user', text: 'Is this data biased against women?' },
    { role: 'ai', text: 'Yes — Female approval: 45% vs Male: 62%. Rural SC women face only 14%.' },
  ],
  code: [
    { role: 'user', text: 'Generate fix code' },
    { role: 'ai', text: '🛠️ weights = compute_sample_weight(\n  class_weight=\'balanced\',\n  y=df[\'caste\']\n)' },
  ],
}

const tabs = [
  { id: 'hindi', label: 'HINDI', color: '#E07A5F' },
  { id: 'english', label: 'ENGLISH', color: '#3D5A80' },
  { id: 'code', label: 'CODE GEN', color: '#22c55e' },
]

export default function PhoneMockup() {
  const [activeTab, setActiveTab] = useState('hindi')
  const [visible, setVisible] = useState(0)
  const msgs = convos[activeTab] || []

  useEffect(() => {
    setVisible(0)
    let i = 0
    const iv = setInterval(() => { i++; if (i <= msgs.length) setVisible(i); else clearInterval(iv) }, 800)
    return () => clearInterval(iv)
  }, [activeTab, msgs.length])

  return (
    <div className="relative mx-auto" style={{ width: 280 }}>
      <div className="rounded-[2.5rem] overflow-hidden" style={{
        background: 'linear-gradient(180deg, #1a1816, #0f0e0d)',
        border: '2px solid rgba(255,255,255,0.08)',
        boxShadow: '0 25px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)',
        padding: 12,
      }}>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 rounded-b-2xl" style={{ background: '#0f0e0d' }} />
        <div className="rounded-[2rem] overflow-hidden" style={{ background: '#0a0908', minHeight: 420 }}>
          <div className="flex items-center justify-between px-6 pt-8 pb-3">
            <span className="text-[10px] text-[var(--color-text-muted)]">FairLens AI</span>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="text-[10px] text-emerald-400">Online</span>
            </div>
          </div>
          <div className="px-4 py-3 space-y-3" style={{ minHeight: 280 }}>
            <AnimatePresence mode="wait">
              <motion.div key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
                {msgs.slice(0, visible).map((m, i) => (
                  <motion.div key={`${activeTab}-${i}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className="max-w-[85%] px-3.5 py-2.5 text-xs leading-relaxed" style={{
                      background: m.role === 'user' ? 'rgba(255,255,255,0.08)' : 'rgba(224,122,95,0.1)',
                      border: `1px solid ${m.role === 'user' ? 'rgba(255,255,255,0.1)' : 'rgba(224,122,95,0.2)'}`,
                      color: 'var(--color-text-secondary)',
                      borderRadius: m.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                      whiteSpace: 'pre-wrap',
                    }}>{m.text}</div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
            {visible < msgs.length && (
              <div className="flex gap-1 px-4 py-2">
                {[0,1,2].map(i => <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-[var(--color-coral)]" animate={{ opacity: [0.3,1,0.3] }} transition={{ duration: 0.8, repeat: Infinity, delay: i*0.15 }} />)}
              </div>
            )}
          </div>
          <div className="px-4 pb-4">
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-full" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <span className="text-[10px] text-[var(--color-text-muted)] flex-1">Ask about bias...</span>
              <div className="w-6 h-6 rounded-full bg-[var(--color-coral)] flex items-center justify-center"><span className="text-[10px] text-white">↑</span></div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center gap-2 mt-5">
        {tabs.map(t => (
          <motion.button key={t.id} onClick={() => setActiveTab(t.id)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            className="px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all cursor-hover"
            style={{ background: activeTab === t.id ? `${t.color}20` : 'transparent', border: `1px solid ${activeTab === t.id ? `${t.color}50` : 'rgba(255,255,255,0.08)'}`, color: activeTab === t.id ? t.color : 'var(--color-text-muted)' }}>
            {t.label}
          </motion.button>
        ))}
      </div>
    </div>
  )
}
