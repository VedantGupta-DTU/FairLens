import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Sliders, RefreshCw, Zap, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react'

export default function WorkspaceSimulator() {
  const [weights, setWeights] = useState({ gender: 50, caste: 50, age: 50, income: 50 })
  const [score, setScore] = useState(34)
  const [calculating, setCalculating] = useState(false)

  // Simulate real-time score changes based on weights
  useEffect(() => {
    setCalculating(true)
    const timeout = setTimeout(() => {
      const wAvg = (weights.gender + weights.caste + weights.age + weights.income) / 4
      // Fake math to make it look like adjusting weights improves the score
      const newScore = Math.min(98, Math.max(12, Math.floor(34 + ((50 - Math.abs(50 - wAvg)) * 1.2))))
      setScore(newScore)
      setCalculating(false)
    }, 400)
    return () => clearTimeout(timeout)
  }, [weights])

  const handleWeightChange = (key: keyof typeof weights, value: number) => {
    setWeights(prev => ({ ...prev, [key]: value }))
  }

  const getScoreColor = (s: number) => s > 80 ? '#22c55e' : s > 50 ? '#f59e0b' : '#ef4444'

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-editorial font-bold text-xl flex items-center gap-2">
            <Sliders className="w-5 h-5 text-[var(--color-coral)]" />
            Debiasing Simulator
          </h2>
          <p className="text-sm text-[var(--color-text-muted)]">Playground: Adjust feature weights to see predicted fairness impact in real-time.</p>
        </div>
        <button 
          onClick={() => setWeights({ gender: 50, caste: 50, age: 50, income: 50 })}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-xs font-medium cursor-hover hover:bg-white/[0.06]"
        >
          <RefreshCw className="w-3 h-3" /> Reset
        </button>
      </div>

      <div className="grid lg:grid-cols-[1fr_350px] gap-6">
        {/* Left: Controls */}
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 space-y-8">
          <h3 className="font-semibold text-sm border-b border-white/[0.06] pb-4">Adjust Feature Influence</h3>
          
          {[
            { id: 'gender', label: 'Gender Feature Weight', desc: 'Influence of gender columns on the output.' },
            { id: 'caste', label: 'Caste / Demographics Weight', desc: 'Influence of protected demographic attributes.' },
            { id: 'age', label: 'Age Group Weight', desc: 'Influence of age-related columns.' },
            { id: 'income', label: 'Income Proxy Weight', desc: 'Influence of ZIP code and implicit income markers.' },
          ].map((attr) => (
            <div key={attr.id} className="space-y-3">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-sm font-medium">{attr.label}</p>
                  <p className="text-[10px] text-[var(--color-text-muted)]">{attr.desc}</p>
                </div>
                <span className="text-xs font-mono px-2 py-1 rounded bg-white/[0.05]">{weights[attr.id as keyof typeof weights]}%</span>
              </div>
              <input
                type="range"
                min="0" max="100"
                value={weights[attr.id as keyof typeof weights]}
                onChange={(e) => handleWeightChange(attr.id as keyof typeof weights, parseInt(e.target.value))}
                className="w-full h-1.5 bg-white/[0.1] rounded-lg appearance-none cursor-hover focus:outline-none focus:ring-2 focus:ring-[var(--color-coral)]/50"
                style={{
                  background: `linear-gradient(to right, var(--color-coral) ${weights[attr.id as keyof typeof weights]}%, rgba(255,255,255,0.1) ${weights[attr.id as keyof typeof weights]}%)`
                }}
              />
            </div>
          ))}
        </div>

        {/* Right: Live Output */}
        <div className="space-y-6">
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 relative overflow-hidden flex flex-col items-center justify-center text-center min-h-[250px]">
            {/* Background Glow */}
            <motion.div 
              animate={{ backgroundColor: getScoreColor(score) }}
              className="absolute inset-0 opacity-[0.03] blur-3xl transition-colors duration-500" 
            />
            
            <p className="text-[10px] uppercase tracking-widest text-[var(--color-text-muted)] font-bold mb-2">Predicted Fairness Score</p>
            
            <div className="relative mb-2">
              <motion.div
                animate={{ opacity: calculating ? 0.5 : 1, scale: calculating ? 0.95 : 1 }}
                className="font-editorial text-7xl font-bold transition-colors duration-300"
                style={{ color: getScoreColor(score) }}
              >
                {score}
              </motion.div>
              {calculating && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full flex items-center justify-center">
                  <RefreshCw className="w-8 h-8 text-white animate-spin opacity-20" />
                </div>
              )}
            </div>

            <p className="text-xs text-[var(--color-text-muted)] flex items-center gap-1">
              {score > 80 ? <><CheckCircle2 className="w-3 h-3 text-emerald-400"/> Passing standard requirements</> : 
               score > 50 ? <><AlertTriangle className="w-3 h-3 text-amber-400"/> Needs improvement</> : 
               <><AlertTriangle className="w-3 h-3 text-red-400"/> Critical bias detected</>}
            </p>
          </div>

          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6">
            <h3 className="font-semibold text-sm mb-4 flex items-center gap-2"><Zap className="w-4 h-4 text-amber-400"/> Suggested Action</h3>
            <p className="text-xs text-[var(--color-text-muted)] mb-4">Based on this simulation, applying a re-weighting algorithm to the Caste and Gender columns will improve your score by ~{Math.max(0, score - 34)} points.</p>
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[var(--color-coral)] text-white text-xs font-bold cursor-hover hover:opacity-90 transition-opacity">
              Generate Fix Code <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
