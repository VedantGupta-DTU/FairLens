import { useRef, useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import { FileText, Search, AlertTriangle, CheckCircle2, XCircle, TrendingUp, Zap, BarChart3, Calendar, Clock, Shield, Globe } from 'lucide-react'
import { cn } from '@/lib/utils'

function Counter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  useEffect(() => {
    if (!inView) return
    let s = 0; const inc = target / 80
    const t = setInterval(() => { s += inc; if (s >= target) { setCount(target); clearInterval(t) } else setCount(Math.floor(s)) }, 16)
    return () => clearInterval(t)
  }, [inView, target])
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>
}

const stats = [
  { icon: FileText, value: 5, label: 'Total Audits', color: '#E07A5F', trend: '+2 this week' },
  { icon: Search, value: 553, suffix: 'K', label: 'Records Analyzed', color: '#3D5A80', trend: '+156K' },
  { icon: AlertTriangle, value: 7, label: 'Biases Found', color: '#f59e0b', trend: '-3 vs last' },
  { icon: TrendingUp, value: 58, label: 'Avg Score', color: '#22c55e', trend: '+12 pts' },
]

const recentAudits = [
  { name: 'UP_Loan_Approvals_2024', score: 34, severity: 'critical' as const, records: '45,230', date: '2h ago', sector: 'Finance' },
  { name: 'NFHS5_Health_Survey_UP', score: 72, severity: 'pass' as const, records: '28,500', date: '1d ago', sector: 'Health' },
  { name: 'AISHE_Education_Data', score: 58, severity: 'warning' as const, records: '156,000', date: '2d ago', sector: 'Education' },
  { name: 'Delhi_Insurance_Claims', score: 41, severity: 'warning' as const, records: '89,700', date: '3d ago', sector: 'Insurance' },
  { name: 'MP_Ration_Distribution', score: 85, severity: 'pass' as const, records: '234,000', date: '4d ago', sector: 'Welfare' },
]

const sev = {
  critical: { icon: XCircle, text: 'text-red-400', bg: 'bg-red-500/10', color: '#ef4444' },
  warning: { icon: AlertTriangle, text: 'text-amber-400', bg: 'bg-amber-500/10', color: '#f59e0b' },
  pass: { icon: CheckCircle2, text: 'text-emerald-400', bg: 'bg-emerald-500/10', color: '#22c55e' },
}

export default function WorkspaceOverview() {
  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="rounded-2xl p-6 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(224,122,95,0.08), rgba(61,90,128,0.05))', border: '1px solid rgba(224,122,95,0.15)' }}>
        <div className="relative z-10">
          <h2 className="font-editorial text-2xl font-bold mb-1">Welcome back, Vedant 👋</h2>
          <p className="text-sm text-[var(--color-text-muted)]">You have <span className="text-amber-400 font-semibold">2 critical findings</span> that need attention.</p>
        </div>
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full blur-[80px] bg-[var(--color-coral)]/10" />
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map(s => (
          <motion.div key={s.label} whileHover={{ y: -2 }} className="rounded-xl p-5 border border-white/[0.06] bg-white/[0.02] group cursor-hover">
            <div className="flex items-center justify-between mb-3">
              <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center')} style={{ background: `${s.color}15` }}>
                <s.icon className="w-4 h-4" style={{ color: s.color }} />
              </div>
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400">{s.trend}</span>
            </div>
            <p className="font-editorial font-bold text-3xl mb-0.5"><Counter target={s.value} suffix={s.suffix} /></p>
            <p className="text-xs text-[var(--color-text-muted)]">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Two-column layout */}
      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        {/* Recent audits */}
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
          <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
            <h3 className="font-semibold text-sm flex items-center gap-2"><Clock className="w-4 h-4 text-[var(--color-text-muted)]" /> Recent Audits</h3>
            <span className="text-[10px] text-[var(--color-coral)] font-medium cursor-hover hover:underline">View All →</span>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {recentAudits.map((a, i) => {
              const sv = sev[a.severity]; const Icon = sv.icon
              return (
                <motion.div key={i} whileHover={{ backgroundColor: 'rgba(255,255,255,0.02)' }} className="flex items-center gap-4 px-5 py-3.5 cursor-hover">
                  <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center', sv.bg)}><Icon className={cn('w-4 h-4', sv.text)} /></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{a.name}</p>
                    <p className="text-[10px] text-[var(--color-text-muted)]">{a.sector} · {a.records} records</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg font-editorial" style={{ color: sv.color }}>{a.score}<span className="text-[10px] text-[var(--color-text-muted)]">/100</span></p>
                    <p className="text-[10px] text-[var(--color-text-muted)]">{a.date}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Right sidebar cards */}
        <div className="space-y-4">
          {/* Quick insights */}
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
            <h3 className="font-semibold text-sm mb-4 flex items-center gap-2"><Zap className="w-4 h-4 text-amber-400" /> Quick Insights</h3>
            <div className="space-y-3">
              {[
                { label: 'Most Common Bias', value: 'Caste-based', sub: '3 of 5 audits', color: '#ef4444' },
                { label: 'Best Dataset', value: 'MP_Ration', sub: 'Score: 85/100', color: '#22c55e' },
                { label: 'Worst Dataset', value: 'UP_Loans', sub: 'Score: 34/100', color: '#ef4444' },
              ].map(ins => (
                <div key={ins.label} className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: ins.color }} />
                  <div className="flex-1">
                    <p className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wider">{ins.label}</p>
                    <p className="text-sm font-semibold" style={{ color: ins.color }}>{ins.value}</p>
                  </div>
                  <span className="text-[10px] text-[var(--color-text-muted)]">{ins.sub}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Activity feed */}
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
            <h3 className="font-semibold text-sm mb-4 flex items-center gap-2"><Calendar className="w-4 h-4 text-[var(--color-text-muted)]" /> Activity</h3>
            <div className="space-y-3">
              {[
                { action: 'Audit completed', target: 'UP_Loan_Approvals', time: '2h ago', dot: '#ef4444' },
                { action: 'Report shared', target: 'NFHS5_Health_Survey', time: '1d ago', dot: '#3D5A80' },
                { action: 'Audit completed', target: 'AISHE_Education', time: '2d ago', dot: '#f59e0b' },
                { action: 'Fix applied', target: 'Delhi_Insurance', time: '3d ago', dot: '#22c55e' },
              ].map((act, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: act.dot }} />
                  <div>
                    <p className="text-xs"><span className="text-[var(--color-text-secondary)]">{act.action}</span> <span className="font-medium text-white">{act.target}</span></p>
                    <p className="text-[10px] text-[var(--color-text-muted)]">{act.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
