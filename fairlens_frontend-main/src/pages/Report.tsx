import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'
import { Link } from 'react-router-dom'
import {
  AlertTriangle, CheckCircle2, XCircle, MessageSquare,
  Wrench, Share2, Download, ChevronDown, ChevronUp,
  Sparkles, TrendingDown, TrendingUp, BarChart3, Shield
} from 'lucide-react'
import { cn } from '@/lib/utils'

/* ═══════════════════════════════════════════════════════════
   21ST.DEV-INSPIRED ANIMATED RADIAL CHART
   ═══════════════════════════════════════════════════════════ */
function AnimatedRadialChart({ score, size = 200 }: { score: number; size?: number }) {
  const [animatedScore, setAnimatedScore] = useState(0)
  const radius = (size - 20) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference

  const scoreColor = score < 40 ? '#ef4444' : score < 70 ? '#f59e0b' : '#22c55e'
  const scoreLabel = score < 40 ? 'High Risk' : score < 70 ? 'Moderate' : 'Fair'
  const scoreBg = score < 40 ? 'rgba(239,68,68,0.08)' : score < 70 ? 'rgba(245,158,11,0.08)' : 'rgba(34,197,94,0.08)'

  useEffect(() => {
    let start = 0
    const step = score / 60
    const timer = setInterval(() => {
      start += step
      if (start >= score) {
        setAnimatedScore(score)
        clearInterval(timer)
      } else {
        setAnimatedScore(Math.floor(start))
      }
    }, 16)
    return () => clearInterval(timer)
  }, [score])

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      className="relative flex items-center justify-center"
    >
      {/* Outer glow ring */}
      <div className="absolute rounded-full" style={{
        width: size + 40,
        height: size + 40,
        background: `radial-gradient(circle, ${scoreColor}10 0%, transparent 70%)`,
      }} />

      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background track */}
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8"
        />
        {/* Animated progress with glow */}
        <motion.circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none"
          stroke={scoreColor}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeOut" as const }}
          style={{ filter: `drop-shadow(0 0 8px ${scoreColor}60)` }}
        />
        {/* Tick marks */}
        {Array.from({ length: 20 }).map((_, i) => {
          const angle = (i / 20) * 360
          const r1 = radius + 8
          const r2 = radius + (i % 5 === 0 ? 14 : 11)
          const rad = (angle - 90) * (Math.PI / 180)
          return (
            <line
              key={i}
              x1={size / 2 + Math.cos(rad) * r1}
              y1={size / 2 + Math.sin(rad) * r1}
              x2={size / 2 + Math.cos(rad) * r2}
              y2={size / 2 + Math.sin(rad) * r2}
              stroke="rgba(255,255,255,0.1)"
              strokeWidth={i % 5 === 0 ? 1.5 : 0.5}
            />
          )
        })}
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="font-['Clash_Display',system-ui,sans-serif] font-bold text-5xl"
          style={{ color: scoreColor }}
        >
          {animatedScore}
        </motion.span>
        <span className="text-xs text-[var(--color-text-muted)] mt-0.5">/100</span>
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-2 px-3 py-1 rounded-full text-xs font-semibold"
          style={{ backgroundColor: scoreBg, color: scoreColor }}
        >
          {scoreLabel}
        </motion.div>
      </div>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════════════
   FINDING CARD — 21st.dev Dashboard Card Style
   ═══════════════════════════════════════════════════════════ */
const findings = [
  {
    severity: 'critical' as const,
    title: 'Caste-Based Discrimination',
    metric: 'SC/ST approval: 28% vs General: 71%',
    disparateImpact: 0.39,
    threshold: 0.80,
    group1: { name: 'SC/ST', value: 28 },
    group2: { name: 'General', value: 71 },
    aiAnalysis: 'The model shows systematic caste-based bias. SC/ST applicants with income above ₹5L have the same rejection rate as General category applicants with income below ₹2L. This indicates the model learned proxy discrimination that goes beyond economic factors.',
  },
  {
    severity: 'warning' as const,
    title: 'Gender Disparity',
    metric: 'Female approval: 45% vs Male: 62%',
    disparateImpact: 0.73,
    threshold: 0.80,
    group1: { name: 'Female', value: 45 },
    group2: { name: 'Male', value: 62 },
    aiAnalysis: 'Moderate gender bias detected. Rural women aged 25-35 with income < ₹3L/yr face only 22% approval. Intersection with caste makes it worse: rural SC/ST women = 14% approval rate.',
  },
  {
    severity: 'pass' as const,
    title: 'Age Distribution',
    metric: 'Consistent across age groups',
    disparateImpact: 0.95,
    threshold: 0.80,
    group1: { name: 'Youth (18-30)', value: 58 },
    group2: { name: 'Senior (50+)', value: 55 },
    aiAnalysis: 'Age-based outcomes are within acceptable fairness thresholds. No significant disparity detected across age groups. The DI ratio of 0.95 is well above the 0.80 threshold.',
  },
]

const severityConfig = {
  critical: { icon: XCircle, color: '#ef4444', bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.2)', label: 'Critical' },
  warning: { icon: AlertTriangle, color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)', label: 'Warning' },
  pass: { icon: CheckCircle2, color: '#22c55e', bg: 'rgba(34,197,94,0.08)', border: 'rgba(34,197,94,0.2)', label: 'Pass' },
}

function FindingCard({ finding, index }: { finding: typeof findings[0]; index: number }) {
  const [expanded, setExpanded] = useState(false)
  const config = severityConfig[finding.severity]
  const SvIcon = config.icon
  const diPass = finding.disparateImpact >= finding.threshold

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 + index * 0.15, duration: 0.5 }}
      className="rounded-2xl overflow-hidden cursor-pointer group"
      style={{ border: `1px solid ${config.border}` }}
      onClick={() => setExpanded(!expanded)}
    >
      {/* Top gradient accent line */}
      <div className="h-[2px]" style={{ background: `linear-gradient(90deg, transparent 0%, ${config.color} 50%, transparent 100%)` }} />

      <div className="p-5" style={{ background: config.bg }}>
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${config.color}15` }}
            >
              <SvIcon className="w-5 h-5" style={{ color: config.color }} />
            </motion.div>
            <div>
              <h3 className="font-semibold text-[var(--color-text-primary)]">{finding.title}</h3>
              <p className="text-xs text-[var(--color-text-muted)]">{finding.metric}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ backgroundColor: `${config.color}15`, color: config.color }}>
              {config.label}
            </span>
            <motion.div animate={{ rotate: expanded ? 180 : 0 }}>
              <ChevronDown className="w-4 h-4 text-[var(--color-text-muted)]" />
            </motion.div>
          </div>
        </div>

        {/* Comparison bars */}
        <div className="space-y-2.5 mb-4">
          {[finding.group1, finding.group2].map((group, gi) => (
            <div key={gi}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-[var(--color-text-muted)]">{group.name}</span>
                <span className="font-mono font-medium" style={{ color: gi === 0 && finding.severity !== 'pass' ? config.color : 'var(--color-text-secondary)' }}>
                  {group.value}%
                </span>
              </div>
              <div className="w-full h-2 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    backgroundColor: gi === 0 && finding.severity !== 'pass' ? config.color : 'var(--color-steel)',
                    boxShadow: `0 0 8px ${gi === 0 && finding.severity !== 'pass' ? config.color : 'var(--color-steel)'}40`,
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${group.value}%` }}
                  transition={{ duration: 1, delay: 0.5 + gi * 0.2, ease: "easeOut" as const }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Disparate Impact */}
        <div className="flex items-center justify-between py-2.5 px-3 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}>
          <span className="text-xs text-[var(--color-text-muted)]">Disparate Impact Ratio</span>
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-bold" style={{ color: diPass ? '#22c55e' : config.color }}>
              {finding.disparateImpact.toFixed(2)}
            </span>
            <span className="text-[10px] text-[var(--color-text-muted)]">/ {finding.threshold}</span>
            {diPass ? (
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5" style={{ color: config.color }} />
            )}
          </div>
        </div>

        {/* Expandable AI Analysis */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="mt-4 p-4 rounded-xl" style={{ backgroundColor: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-[var(--color-coral)]" />
                  <span className="text-xs font-semibold text-[var(--color-coral)]">Gemini Analysis</span>
                </div>
                <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">{finding.aiAnalysis}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════════════
   MAIN REPORT PAGE
   ═══════════════════════════════════════════════════════════ */
export default function Report() {
  const location = useLocation()
  const reportData = (location.state as any)?.report

  // Use real data from backend or fallback to demo
  const score = reportData?.score ?? 34
  const filename = reportData?.filename ?? 'UP_Loan_Approvals_2024'
  const rowCount = reportData?.row_count ?? 45230
  const colCount = reportData?.column_count ?? 18
  const protectedCount = reportData?.protected_attributes?.length ?? 5
  const criticalCount = reportData?.critical_count ?? 1
  const warningCount = reportData?.warning_count ?? 1
  const passCount = reportData?.pass_count ?? 1
  const aiExplanation = reportData?.ai_explanation ?? ''
  const sessionId = reportData?.session_id ?? ''

  // Map backend findings to display format
  const displayFindings = reportData?.findings?.length
    ? reportData.findings.map((f: any) => ({
        severity: f.severity as 'critical' | 'warning' | 'pass',
        title: f.title || f.attribute,
        metric: f.metric || '',
        disparateImpact: f.disparate_impact ?? 0,
        threshold: f.threshold ?? 0.80,
        group1: f.group1 || { name: 'Group A', value: 50 },
        group2: f.group2 || { name: 'Group B', value: 50 },
        aiAnalysis: aiExplanation || 'Click to expand for AI analysis.',
      }))
    : findings  // fallback to hardcoded demo

  return (
    <div className="min-h-screen section-padding relative">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[-10%] w-[45%] h-[45%] rounded-full blur-[120px]" style={{ background: 'radial-gradient(circle, rgba(239,68,68,0.08) 0%, transparent 70%)' }} />
        <div className="absolute bottom-[20%] right-[-10%] w-[40%] h-[40%] rounded-full blur-[100px]" style={{ background: 'radial-gradient(circle, rgba(61,90,128,0.06) 0%, transparent 70%)' }} />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
            style={{ border: '1px solid rgba(239,68,68,0.2)', backgroundColor: 'rgba(239,68,68,0.05)' }}
          >
            <Shield className="w-4 h-4 text-red-400" />
            <span className="text-sm font-medium text-red-400">Bias Report Card</span>
          </motion.div>
          <h1 className="font-['Clash_Display',system-ui,sans-serif] font-bold text-3xl sm:text-4xl mb-2">
            {filename.replace(/\.[^.]+$/, '').replace(/_/g, ' ')}
          </h1>
          <p className="text-sm text-[var(--color-text-muted)]">
            {rowCount.toLocaleString()} records • {colCount} columns • {protectedCount} protected attributes detected
          </p>
        </motion.div>

        {/* Score Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="rounded-3xl p-8 mb-8 overflow-hidden relative"
          style={{ border: '1px solid var(--glass-border)', backgroundColor: 'var(--color-bg-secondary)' }}
        >
          {/* Top shimmer */}
          <div className="absolute top-0 inset-x-0 h-[1px]" style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)' }} />

          <div className="flex flex-col md:flex-row items-center gap-8">
            <AnimatedRadialChart score={score} size={200} />

            <div className="flex-1 text-center md:text-left">
              <h2 className="font-['Clash_Display',system-ui,sans-serif] font-bold text-2xl mb-3">
                Fairness Assessment
              </h2>
              <p className="text-[var(--color-text-muted)] text-sm leading-relaxed mb-5">
                This dataset shows <span className="text-red-400 font-semibold">significant bias</span> in loan approvals.
                SC/ST and female applicants face disproportionately lower approval rates.
              </p>

              {/* Quick stats */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Critical', value: String(criticalCount), color: '#ef4444' },
                  { label: 'Warning', value: String(warningCount), color: '#f59e0b' },
                  { label: 'Pass', value: String(passCount), color: '#22c55e' },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-xl p-3 text-center" style={{ backgroundColor: `${stat.color}08`, border: `1px solid ${stat.color}20` }}>
                    <p className="font-['Clash_Display',system-ui,sans-serif] font-bold text-xl" style={{ color: stat.color }}>{stat.value}</p>
                    <p className="text-[10px] text-[var(--color-text-muted)]">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Findings */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <h2 className="font-['Clash_Display',system-ui,sans-serif] font-semibold text-xl mb-5 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[var(--color-text-muted)]" />
            Detailed Findings
          </h2>
          <div className="space-y-4">
            {displayFindings.map((finding: any, i: number) => (
              <FindingCard key={i} finding={finding} index={i} />
            ))}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3"
        >
          {[
            { icon: MessageSquare, label: 'Ask Questions', href: '/chat', color: 'var(--color-coral)', state: { sessionId } },
            { icon: Wrench, label: 'Get Fix Code', href: '#', color: 'var(--color-steel)' },
            { icon: Share2, label: 'Share Report', href: '#', color: 'var(--color-sage)' },
            { icon: Download, label: 'Download PDF', href: '#', color: 'var(--color-text-muted)' },
          ].map((action, i) => (
            <Link key={i} to={action.href}>
              <motion.div
                whileHover={{ y: -2, borderColor: `${action.color}40` }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer"
                style={{ border: '1px solid var(--glass-border)', backgroundColor: 'var(--color-bg-secondary)' }}
              >
                <action.icon className="w-4 h-4" style={{ color: action.color }} />
                <span className="text-[var(--color-text-secondary)]">{action.label}</span>
              </motion.div>
            </Link>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
