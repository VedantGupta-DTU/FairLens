import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import WorkspaceSidebar from '@/components/WorkspaceSidebar'
import WorkspaceOverview from '@/components/WorkspaceOverview'
import WorkspaceAudits from '@/components/WorkspaceAudits'
import WorkspaceInsights from '@/components/WorkspaceInsights'
import WorkspaceSimulator from '@/components/WorkspaceSimulator'
import WorkspaceAPI from '@/components/WorkspaceAPI'

const tabContent: Record<string, React.ReactNode> = {
  overview: <WorkspaceOverview />,
  audits: <WorkspaceAudits />,
  insights: <WorkspaceInsights />,
  simulator: <WorkspaceSimulator />,
  api: <WorkspaceAPI />,
  chat: (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-2xl bg-[var(--color-coral)]/10 flex items-center justify-center mb-4">
        <span className="text-3xl">💬</span>
      </div>
      <h3 className="font-editorial font-bold text-xl mb-2">AI Chat Explorer</h3>
      <p className="text-sm text-[var(--color-text-muted)] max-w-sm mb-6">Ask questions about your datasets in Hindi or English. Get AI-powered insights and debiasing code.</p>
      <a href="/chat" className="px-6 py-3 rounded-xl bg-[var(--color-coral)] text-white font-semibold text-sm cursor-hover hover:opacity-90 transition-opacity">Open Chat →</a>
    </div>
  ),
  settings: (
    <div className="space-y-6">
      <h2 className="font-editorial font-bold text-xl">Settings</h2>
      <div className="space-y-4">
        {[
          { label: 'API Configuration', desc: 'Grok AI API key and endpoint settings', value: 'gsk_bNlK...KE7m' },
          { label: 'Default Thresholds', desc: 'Disparate impact ratio threshold', value: '0.80' },
          { label: 'Auto-detect Columns', desc: 'Automatically identify protected attributes', value: 'Enabled' },
          { label: 'Export Format', desc: 'Default report export format', value: 'PDF' },
        ].map(s => (
          <div key={s.label} className="flex items-center justify-between p-4 rounded-xl border border-white/[0.06] bg-white/[0.02]">
            <div><p className="text-sm font-semibold">{s.label}</p><p className="text-[10px] text-[var(--color-text-muted)]">{s.desc}</p></div>
            <span className="text-xs font-mono px-3 py-1.5 rounded-lg bg-white/[0.04] text-[var(--color-text-muted)]">{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  ),
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <WorkspaceSidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {tabContent[activeTab] || <p>Coming soon...</p>}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}
