import { motion } from 'framer-motion'
import {
  LayoutDashboard, FileText, BarChart3, MessageSquare,
  Settings, Bell, Shield, Search, Plus, ChevronRight,
  Sliders, Terminal
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Link } from 'react-router-dom'

const tabs = [
  { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
  { id: 'audits', icon: FileText, label: 'All Audits' },
  { id: 'insights', icon: BarChart3, label: 'Insights' },
  { id: 'simulator', icon: Sliders, label: 'Debias Simulator' },
  { id: 'chat', icon: MessageSquare, label: 'AI Chat' },
  { id: 'api', icon: Terminal, label: 'Developer API' },
  { id: 'settings', icon: Settings, label: 'Settings' },
]

interface Props {
  activeTab: string
  onTabChange: (id: string) => void
}

export default function WorkspaceSidebar({ activeTab, onTabChange }: Props) {
  return (
    <aside className="w-64 flex-shrink-0 h-[calc(100vh-4rem)] sticky top-16 border-r border-white/[0.06] flex flex-col" style={{ background: 'rgba(10,9,8,0.6)' }}>
      {/* Workspace header */}
      <div className="px-5 py-5 border-b border-white/[0.06]">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-coral)] to-[#D15A3C] flex items-center justify-center shadow-lg shadow-[var(--color-coral)]/20">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-semibold text-sm text-white">FairLens</p>
            <p className="text-[10px] text-[var(--color-text-muted)]">Bias Audit Workspace</p>
          </div>
        </div>
        <Link to="/upload">
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[var(--color-coral)] to-[#D15A3C] text-white text-sm font-semibold cursor-hover shadow-lg shadow-[var(--color-coral)]/20">
            <Plus className="w-4 h-4" /> New Audit
          </motion.button>
        </Link>
      </div>

      {/* Search */}
      <div className="px-4 py-3">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-xs text-[var(--color-text-muted)]">
          <Search className="w-3.5 h-3.5" />
          <span>Search audits...</span>
          <span className="ml-auto px-1.5 py-0.5 rounded bg-white/[0.06] text-[10px]">⌘K</span>
        </div>
      </div>

      {/* Navigation tabs */}
      <nav className="flex-1 px-3 py-2 space-y-1">
        <p className="px-3 text-[10px] uppercase tracking-widest text-[var(--color-text-muted)] mb-2 font-semibold">Workspace</p>
        {tabs.map(({ id, icon: Icon, label }) => {
          const isActive = activeTab === id
          return (
            <motion.button key={id} onClick={() => onTabChange(id)}
              whileHover={{ x: 2 }}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-hover',
                isActive ? 'text-white' : 'text-[var(--color-text-muted)] hover:text-white/80'
              )}
              style={isActive ? {
                background: 'rgba(224,122,95,0.1)',
                border: '1px solid rgba(224,122,95,0.2)',
              } : { border: '1px solid transparent' }}
            >
              <Icon className="w-4 h-4" style={{ color: isActive ? '#E07A5F' : undefined }} />
              {label}
              {isActive && <ChevronRight className="w-3 h-3 ml-auto text-[var(--color-coral)]" />}
            </motion.button>
          )
        })}
      </nav>

      {/* Bottom section */}
      <div className="px-4 py-4 border-t border-white/[0.06]">
        <div className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/[0.03] transition-colors cursor-hover">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-xs font-bold text-white">VG</div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-white truncate">Vedant Gupta</p>
            <p className="text-[10px] text-[var(--color-text-muted)]">Pro Plan</p>
          </div>
          <Bell className="w-4 h-4 text-[var(--color-text-muted)]" />
        </div>
      </div>
    </aside>
  )
}
