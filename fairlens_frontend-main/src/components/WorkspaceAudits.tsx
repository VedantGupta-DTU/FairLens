import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileText, AlertTriangle, CheckCircle2, XCircle, Search, Filter, ChevronDown, Eye, Trash2, Download, MoreHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'

const audits = [
  { id: 1, name: 'UP_Loan_Approvals_2024', score: 34, severity: 'critical' as const, records: 45230, cols: 18, protected: 5, date: 'Apr 25, 2026', sector: 'Finance', status: 'complete' },
  { id: 2, name: 'NFHS5_Health_Survey_UP', score: 72, severity: 'pass' as const, records: 28500, cols: 24, protected: 3, date: 'Apr 24, 2026', sector: 'Health', status: 'complete' },
  { id: 3, name: 'AISHE_Education_Data', score: 58, severity: 'warning' as const, records: 156000, cols: 32, protected: 4, date: 'Apr 23, 2026', sector: 'Education', status: 'complete' },
  { id: 4, name: 'Delhi_Insurance_Claims', score: 41, severity: 'warning' as const, records: 89700, cols: 15, protected: 3, date: 'Apr 22, 2026', sector: 'Insurance', status: 'complete' },
  { id: 5, name: 'MP_Ration_Distribution', score: 85, severity: 'pass' as const, records: 234000, cols: 12, protected: 4, date: 'Apr 21, 2026', sector: 'Welfare', status: 'complete' },
  { id: 6, name: 'TN_Employment_Portal', score: 91, severity: 'pass' as const, records: 67400, cols: 20, protected: 3, date: 'Apr 20, 2026', sector: 'Employment', status: 'complete' },
  { id: 7, name: 'Bihar_Education_Grants', score: 29, severity: 'critical' as const, records: 12300, cols: 14, protected: 5, date: 'Apr 19, 2026', sector: 'Education', status: 'complete' },
]

const svCfg = {
  critical: { icon: XCircle, text: 'text-red-400', bg: 'bg-red-500/10', color: '#ef4444', label: 'Critical' },
  warning: { icon: AlertTriangle, text: 'text-amber-400', bg: 'bg-amber-500/10', color: '#f59e0b', label: 'Warning' },
  pass: { icon: CheckCircle2, text: 'text-emerald-400', bg: 'bg-emerald-500/10', color: '#22c55e', label: 'Pass' },
}

export default function WorkspaceAudits() {
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [expandedId, setExpandedId] = useState<number | null>(null)

  const filtered = audits.filter(a => {
    if (filter !== 'all' && a.severity !== filter) return false
    if (search && !a.name.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <div className="space-y-5">
      {/* Header row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <h2 className="font-editorial font-bold text-xl">All Audits <span className="text-[var(--color-text-muted)] text-sm font-normal">({audits.length})</span></h2>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-xs">
            <Search className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Filter audits..." className="bg-transparent outline-none text-white w-32 placeholder:text-[var(--color-text-muted)]" />
          </div>
          <div className="flex gap-1 p-0.5 rounded-lg bg-white/[0.03] border border-white/[0.06]">
            {['all','critical','warning','pass'].map(f => (
              <button key={f} onClick={() => setFilter(f)} className={cn('px-2.5 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wider transition-all cursor-hover', filter === f ? 'bg-[var(--color-coral)]/15 text-[var(--color-coral)]' : 'text-[var(--color-text-muted)]')}>
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
        <div className="hidden md:grid grid-cols-[1fr_90px_90px_80px_90px_40px] gap-3 px-5 py-3 text-[10px] uppercase tracking-widest text-[var(--color-text-muted)] border-b border-white/[0.04] font-semibold">
          <span>Dataset</span><span>Sector</span><span>Records</span><span>Score</span><span>Status</span><span></span>
        </div>
        <AnimatePresence>
          {filtered.map((a, i) => {
            const sv = svCfg[a.severity]; const Icon = sv.icon; const expanded = expandedId === a.id
            return (
              <motion.div key={a.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ delay: i * 0.03 }}>
                <div onClick={() => setExpandedId(expanded ? null : a.id)} className="grid grid-cols-1 md:grid-cols-[1fr_90px_90px_80px_90px_40px] gap-2 md:gap-3 items-center px-5 py-4 cursor-hover hover:bg-white/[0.02] transition-colors border-b border-white/[0.03]">
                  <div className="flex items-center gap-3">
                    <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center', sv.bg)}><Icon className={cn('w-4 h-4', sv.text)} /></div>
                    <div><p className="text-sm font-medium truncate">{a.name}</p><p className="text-[10px] text-[var(--color-text-muted)] md:hidden">{a.sector} · {a.records.toLocaleString()}</p></div>
                  </div>
                  <span className="hidden md:block text-xs text-[var(--color-text-muted)]">{a.sector}</span>
                  <span className="hidden md:block text-xs font-mono text-[var(--color-text-muted)]">{a.records.toLocaleString()}</span>
                  <span className="hidden md:block font-bold font-editorial text-lg" style={{ color: sv.color }}>{a.score}</span>
                  <span className={cn('hidden md:inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full w-fit', sv.bg, sv.text)}><Icon className="w-3 h-3" />{sv.label}</span>
                  <MoreHorizontal className="hidden md:block w-4 h-4 text-[var(--color-text-muted)]" />
                </div>
                <AnimatePresence>
                  {expanded && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-b border-white/[0.06]">
                      <div className="px-5 py-4 bg-white/[0.01] grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div><p className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wider">Columns</p><p className="text-sm font-semibold">{a.cols}</p></div>
                        <div><p className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wider">Protected Attrs</p><p className="text-sm font-semibold">{a.protected}</p></div>
                        <div><p className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wider">Date</p><p className="text-sm font-semibold">{a.date}</p></div>
                        <div className="flex items-end gap-2">
                          <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[var(--color-coral)]/10 text-[var(--color-coral)] text-xs font-medium cursor-hover"><Eye className="w-3 h-3" />View</button>
                          <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/[0.04] text-[var(--color-text-muted)] text-xs font-medium cursor-hover"><Download className="w-3 h-3" />PDF</button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </AnimatePresence>
        {filtered.length === 0 && <p className="px-5 py-8 text-center text-sm text-[var(--color-text-muted)]">No audits match your filter.</p>}
      </div>
    </div>
  )
}
