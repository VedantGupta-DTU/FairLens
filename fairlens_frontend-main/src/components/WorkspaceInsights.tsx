import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Shield, Globe, BarChart3, Users, MapPin } from 'lucide-react'

const biasBreakdown = [
  { type: 'Caste-based', count: 3, total: 5, color: '#ef4444', trend: 'up' },
  { type: 'Gender', count: 2, total: 5, color: '#f59e0b', trend: 'down' },
  { type: 'Regional', count: 1, total: 5, color: '#3D5A80', trend: 'down' },
  { type: 'Age', count: 0, total: 5, color: '#22c55e', trend: 'stable' },
]

const sectorScores = [
  { sector: 'Finance', score: 37, count: 2, icon: '🏦' },
  { sector: 'Health', score: 72, count: 1, icon: '🏥' },
  { sector: 'Education', score: 44, count: 2, icon: '🎓' },
  { sector: 'Insurance', score: 41, count: 1, icon: '🛡️' },
  { sector: 'Welfare', score: 85, count: 1, icon: '🍚' },
]

export default function WorkspaceInsights() {
  return (
    <div className="space-y-6">
      <h2 className="font-editorial font-bold text-xl">Insights & Analytics</h2>

      {/* Bias type breakdown */}
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6">
        <h3 className="font-semibold text-sm mb-5 flex items-center gap-2"><Shield className="w-4 h-4 text-[var(--color-coral)]" /> Bias Type Breakdown</h3>
        <div className="space-y-4">
          {biasBreakdown.map(b => (
            <div key={b.type}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-medium">{b.type}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono" style={{ color: b.color }}>{b.count}/{b.total} audits</span>
                  {b.trend === 'up' ? <TrendingUp className="w-3 h-3 text-red-400" /> : b.trend === 'down' ? <TrendingDown className="w-3 h-3 text-emerald-400" /> : <span className="text-[10px] text-[var(--color-text-muted)]">—</span>}
                </div>
              </div>
              <div className="w-full h-2 rounded-full bg-white/[0.05]">
                <motion.div initial={{ width: 0 }} animate={{ width: `${(b.count / b.total) * 100}%` }} transition={{ duration: 1, delay: 0.2 }} className="h-full rounded-full" style={{ backgroundColor: b.color, boxShadow: `0 0 8px ${b.color}40` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sector performance */}
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6">
        <h3 className="font-semibold text-sm mb-5 flex items-center gap-2"><Globe className="w-4 h-4 text-[var(--color-steel)]" /> Sector Fairness Scores</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {sectorScores.map(s => {
            const col = s.score < 40 ? '#ef4444' : s.score < 70 ? '#f59e0b' : '#22c55e'
            return (
              <motion.div key={s.sector} whileHover={{ y: -2 }} className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] cursor-hover">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{s.icon}</span>
                  <div>
                    <p className="text-sm font-semibold">{s.sector}</p>
                    <p className="text-[10px] text-[var(--color-text-muted)]">{s.count} audit{s.count > 1 ? 's' : ''}</p>
                  </div>
                </div>
                <div className="flex items-end justify-between">
                  <p className="font-editorial font-bold text-3xl" style={{ color: col }}>{s.score}</p>
                  <div className="w-16 h-1.5 rounded-full bg-white/[0.05]">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${s.score}%` }} transition={{ duration: 1 }} className="h-full rounded-full" style={{ backgroundColor: col }} />
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Recommendations */}
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6">
        <h3 className="font-semibold text-sm mb-4 flex items-center gap-2"><BarChart3 className="w-4 h-4 text-amber-400" /> AI Recommendations</h3>
        <div className="space-y-3">
          {[
            { priority: 'HIGH', text: 'Apply re-weighting to UP_Loan_Approvals caste column to improve DI from 0.39 to 0.82+', color: '#ef4444' },
            { priority: 'MED', text: 'Run intersectional analysis on AISHE data — gender × region cross may reveal hidden bias', color: '#f59e0b' },
            { priority: 'LOW', text: 'Schedule quarterly re-audit of MP_Ration to maintain compliance', color: '#22c55e' },
          ].map((r, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full mt-0.5 flex-shrink-0" style={{ background: `${r.color}15`, color: r.color }}>{r.priority}</span>
              <p className="text-sm text-[var(--color-text-secondary)]">{r.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
