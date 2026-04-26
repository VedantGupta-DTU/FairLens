import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'
import { CheckCircle2, Loader2, Database, Eye, Shield, FileText, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { analyzeDataset } from '@/lib/api'

const steps = [
  { id: 1, label: 'Parsing data', icon: Database },
  { id: 2, label: 'Detecting columns', icon: Eye },
  { id: 3, label: 'Finding protected attributes', icon: Shield },
  { id: 4, label: 'Running fairness tests', icon: Shield },
  { id: 5, label: 'Generating report', icon: FileText },
]

export default function Analysis() {
  const [currentStep, setCurrentStep] = useState(0)
  const [stepDetails, setStepDetails] = useState<string[]>([])
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const hasStarted = useRef(false)

  const { sessionId, description, filename } = (location.state as any) || {}

  useEffect(() => {
    if (hasStarted.current) return
    hasStarted.current = true

    if (!sessionId) {
      // No session — demo mode (fallback to hardcoded flow)
      runDemoMode()
      return
    }

    // Real mode — call backend
    runRealAnalysis()
  }, [])

  const runDemoMode = () => {
    const demoDetails = [
      '45,230 records found',
      '18 columns identified',
      'gender, caste, religion, location, income',
      '4 tests in progress...',
      'Grok analyzing results...',
    ]
    let i = 0
    const interval = setInterval(() => {
      if (i < steps.length) {
        setStepDetails(prev => [...prev, demoDetails[i]])
        setCurrentStep(i + 1)
        i++
      } else {
        clearInterval(interval)
        setTimeout(() => navigate('/report'), 1000)
      }
    }, 1500)
  }

  const runRealAnalysis = async () => {
    // Simulate step progression while waiting for backend
    setCurrentStep(1)
    setStepDetails(['Uploading complete, parsing...'])

    const stepInterval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < 4) return prev + 1
        return prev
      })
    }, 2000)

    try {
      setStepDetails(prev => [...prev, 'Auto-detecting columns...'])
      const report = await analyzeDataset(sessionId, description || '')

      clearInterval(stepInterval)
      setCurrentStep(5)
      setStepDetails(prev => [
        ...prev,
        `Found: ${report.protected_attributes.join(', ')}`,
        `${report.total_tests} tests completed`,
        `Score: ${report.score}/100 — Redirecting...`,
      ])

      setTimeout(() => {
        navigate('/report', { state: { report } })
      }, 1500)
    } catch (e: any) {
      clearInterval(stepInterval)
      setError(e.message || 'Analysis failed')
    }
  }

  const progress = (currentStep / steps.length) * 100

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      {/* Background aurora */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[120px] animate-[aurora-shift_10s_ease-in-out_infinite]" style={{ background: 'radial-gradient(circle, rgba(224,122,95,0.12) 0%, transparent 70%)' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative max-w-lg w-full"
      >
        {/* Card */}
        <div className="rounded-3xl border border-[var(--glass-border)] bg-[var(--color-bg-secondary)] p-8 md:p-10">
          {/* Title */}
          <div className="text-center mb-10">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--color-coral)]/20 to-[var(--color-steel)]/20 flex items-center justify-center mx-auto mb-4">
              <Loader2 className="w-8 h-8 text-[var(--color-coral)] animate-spin" />
            </div>
            <h2 className="font-['Clash_Display',system-ui,sans-serif] font-bold text-2xl mb-2">
              Analyzing Your Data
            </h2>
            <p className="text-sm text-[var(--color-text-muted)]">
              {filename ? `${filename} — ` : ''}Powered by Grok AI
            </p>
          </div>

          {/* Progress bar */}
          <div className="w-full h-1.5 rounded-full bg-[var(--color-bg-elevated)] mb-8 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-[var(--color-coral)] to-[var(--color-coral-light)]"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>

          {/* Steps */}
          <div className="space-y-3">
            <AnimatePresence>
              {steps.map((step, i) => {
                const isDone = i < currentStep
                const isActive = i === currentStep
                const isPending = i > currentStep

                return (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1, duration: 0.4 }}
                    className={cn(
                      'flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300',
                      isDone && 'bg-emerald-500/5',
                      isActive && 'border',
                      isPending && 'opacity-40'
                    )}
                    style={isActive ? { backgroundColor: 'rgba(224,122,95,0.05)', borderColor: 'rgba(224,122,95,0.2)' } : {}}
                  >
                    <div className={cn(
                      'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
                      isDone && 'bg-emerald-500/10',
                    )}
                    style={isActive ? { backgroundColor: 'rgba(224,122,95,0.1)' } : isPending ? { backgroundColor: 'var(--color-bg-elevated)' } : {}}
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      ) : isActive ? (
                        <Loader2 className="w-5 h-5 text-[var(--color-coral)] animate-spin" />
                      ) : (
                        <step.icon className="w-4 h-4 text-[var(--color-text-muted)]" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className={cn(
                        'text-sm font-medium',
                        isDone && 'text-emerald-400',
                        isActive && 'text-[var(--color-text-primary)]',
                        isPending && 'text-[var(--color-text-muted)]'
                      )}>
                        {step.label}
                      </p>
                      {(isDone || isActive) && stepDetails[i] && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="text-xs text-[var(--color-text-muted)] mt-0.5"
                        >
                          {stepDetails[i]}
                        </motion.p>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 rounded-xl flex items-center gap-3"
              style={{ backgroundColor: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}
            >
              <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <div>
                <p className="text-sm text-red-400 font-medium">Analysis Failed</p>
                <p className="text-xs text-[var(--color-text-muted)]">{error}</p>
              </div>
            </motion.div>
          )}

          {/* Complete message */}
          <AnimatePresence>
            {currentStep >= steps.length && !error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 text-center"
              >
                <p className="text-emerald-400 font-medium">Analysis complete! Redirecting to report...</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}
