import { useState, useCallback, useRef } from 'react'
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  FileSpreadsheet, Camera, Link2, Upload as UploadIcon,
  FileText, X, CheckCircle2, ArrowRight, Sparkles, Shield,
  Database, Cpu, BarChart3, Loader2
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { uploadFile } from '@/lib/api'

const tabs = [
  { id: 'csv', label: 'CSV / JSON', icon: FileSpreadsheet, desc: 'Upload structured data files' },
  { id: 'screenshot', label: 'Screenshot', icon: Camera, desc: 'Gemini Vision extracts tables' },
  { id: 'api', label: 'API URL', icon: Link2, desc: 'Fetch data from endpoints' },
] as const

type TabId = typeof tabs[number]['id']

/* ── Stagger variants ── */
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
}
const staggerItem = {
  hidden: { opacity: 0, y: 25, filter: 'blur(4px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.5, ease: 'easeOut' as const } },
}

/* ── 3D Tilt Upload Zone ── */
function TiltUploadZone({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rotateX = useTransform(my, [-0.5, 0.5], [5, -5])
  const rotateY = useTransform(mx, [-0.5, 0.5], [-5, 5])

  const handleMouse = (e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    mx.set((e.clientX - rect.left) / rect.width - 0.5)
    my.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={() => { mx.set(0); my.set(0) }}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ── Animated feature pills ── */
const features = [
  { icon: Shield, text: '4 Fairness Tests' },
  { icon: Database, text: 'Auto Column Detection' },
  { icon: Cpu, text: 'Gemini 3.1 Pro' },
  { icon: BarChart3, text: 'Visual Reports' },
]

export default function Upload() {
  const [activeTab, setActiveTab] = useState<TabId>('csv')
  const [file, setFile] = useState<File | null>(null)
  const [description, setDescription] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const [apiUrl, setApiUrl] = useState('')
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) setFile(droppedFile)
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (selected) setFile(selected)
  }, [])

  const handleAnalyze = async () => {
    if (!file) return
    setUploading(true)
    setError('')
    try {
      const result = await uploadFile(file)
      navigate('/analysis', { state: { sessionId: result.session_id, description, filename: result.filename } })
    } catch (e: any) {
      setError(e.message || 'Upload failed. Is the backend running?')
      setUploading(false)
    }
  }

  return (
    <div className="min-h-screen section-padding relative">
      {/* Background aurora */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] right-[-10%] w-[50%] h-[50%] rounded-full blur-[120px]" style={{ background: 'radial-gradient(circle, rgba(224,122,95,0.12) 0%, transparent 70%)' }} />
        <div className="absolute bottom-[10%] left-[-10%] w-[40%] h-[40%] rounded-full blur-[100px]" style={{ background: 'radial-gradient(circle, rgba(61,90,128,0.1) 0%, transparent 70%)' }} />
      </div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="max-w-3xl mx-auto px-4 sm:px-6 relative"
      >
        {/* Header */}
        <motion.div variants={staggerItem} className="text-center mb-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--color-coral)]/20 bg-[var(--color-coral)]/5 mb-6"
          >
            <Sparkles className="w-4 h-4 text-[var(--color-coral)]" />
            <span className="text-sm font-medium text-[var(--color-coral)]">New Bias Audit</span>
          </motion.div>
          <h1 className="font-['Clash_Display',system-ui,sans-serif] font-bold text-3xl sm:text-4xl md:text-5xl mb-4">
            Upload Your <span className="text-gradient-coral">Data</span>
          </h1>
          <p className="text-[var(--color-text-muted)] max-w-lg mx-auto">
            Provide your dataset in any format. FairLens powered by Gemini will automatically detect biases.
          </p>
        </motion.div>

        {/* Feature pills */}
        <motion.div variants={staggerItem} className="flex flex-wrap items-center justify-center gap-3 mb-10">
          {features.map(({ icon: Icon, text }, i) => (
            <motion.div
              key={text}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + i * 0.08, type: 'spring', stiffness: 200 }}
              className="flex items-center gap-2 px-3.5 py-2 rounded-full border border-[var(--glass-border)] bg-white/[0.02] text-xs font-medium text-[var(--color-text-muted)]"
            >
              <Icon className="w-3.5 h-3.5 text-[var(--color-coral)]" />
              {text}
            </motion.div>
          ))}
        </motion.div>

        {/* Tab Switcher */}
        <motion.div variants={staggerItem} className="flex items-center gap-1 p-1.5 rounded-2xl bg-[var(--color-bg-elevated)] border border-[var(--glass-border)] mb-8">
          {tabs.map(({ id, label, icon: Icon }) => (
            <motion.button
              key={id}
              onClick={() => setActiveTab(id)}
              whileHover={{ scale: activeTab === id ? 1 : 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 relative',
                activeTab === id
                  ? 'text-white'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
              )}
            >
              {activeTab === id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-[var(--color-coral)] to-[var(--color-coral-dark)] shadow-lg shadow-[var(--color-coral)]/20"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                <Icon className="w-4 h-4" />
                {label}
              </span>
            </motion.button>
          ))}
        </motion.div>

        {/* Tab description */}
        <AnimatePresence mode="wait">
          <motion.p
            key={activeTab}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="text-xs text-[var(--color-text-muted)] text-center mb-6"
          >
            {tabs.find(t => t.id === activeTab)?.desc}
          </motion.p>
        </AnimatePresence>

        {/* Upload Area with 3D Tilt */}
        <motion.div variants={staggerItem} className="space-y-6">
          <AnimatePresence mode="wait">
            {activeTab === 'csv' && (
              <motion.div
                key="csv"
                initial={{ opacity: 0, y: 20, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.97 }}
                transition={{ duration: 0.3 }}
              >
                <TiltUploadZone>
                  <div
                    onDragEnter={() => setIsDragging(true)}
                    onDragLeave={() => setIsDragging(false)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                    className={cn(
                      'relative rounded-2xl border-2 border-dashed p-12 text-center transition-all duration-300 cursor-pointer overflow-hidden',
                      isDragging
                        ? 'border-[var(--color-coral)] bg-[var(--color-coral)]/5'
                        : file
                        ? 'border-emerald-500/30 bg-emerald-500/5'
                        : 'border-[var(--color-border)] hover:border-[var(--color-coral)]/30 hover:bg-white/[0.02]'
                    )}
                    onClick={() => document.getElementById('file-input')?.click()}
                  >
                    {/* Animated background particles */}
                    {!file && (
                      <div className="absolute inset-0 opacity-30 pointer-events-none">
                        {[...Array(6)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="absolute w-1 h-1 rounded-full bg-[var(--color-coral)]"
                            style={{ left: `${15 + i * 15}%`, top: `${20 + (i % 3) * 25}%` }}
                            animate={{
                              y: [0, -30, 0],
                              opacity: [0.3, 0.8, 0.3],
                            }}
                            transition={{
                              duration: 3 + i * 0.5,
                              repeat: Infinity,
                              delay: i * 0.4,
                            }}
                          />
                        ))}
                      </div>
                    )}

                    <input id="file-input" type="file" accept=".csv,.json,.xlsx" onChange={handleFileSelect} className="hidden" />

                    {file ? (
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: 'spring', stiffness: 200 }}
                        className="flex flex-col items-center gap-3"
                      >
                        <motion.div
                          animate={{ rotate: [0, 10, -10, 0] }}
                          transition={{ duration: 0.5 }}
                          className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center"
                        >
                          <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                        </motion.div>
                        <div>
                          <p className="font-semibold text-[var(--color-text-primary)]">{file.name}</p>
                          <p className="text-sm text-[var(--color-text-muted)]">{(file.size / 1024).toFixed(1)} KB — Ready to analyze</p>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => { e.stopPropagation(); setFile(null) }}
                          className="text-sm text-red-400 hover:text-red-300 flex items-center gap-1 px-3 py-1 rounded-lg hover:bg-red-500/10 transition-colors"
                        >
                          <X className="w-3 h-3" /> Remove
                        </motion.button>
                      </motion.div>
                    ) : (
                      <div className="relative flex flex-col items-center gap-4">
                        <motion.div
                          animate={{ y: [0, -8, 0] }}
                          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                          className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[var(--color-coral)]/10 to-[var(--color-steel)]/10 flex items-center justify-center border border-[var(--glass-border)]"
                        >
                          <UploadIcon className="w-9 h-9 text-[var(--color-coral)]" />
                        </motion.div>
                        <div>
                          <p className="font-semibold text-[var(--color-text-primary)] mb-1">
                            Drop your file here, or <span className="text-[var(--color-coral)] underline decoration-dotted underline-offset-4">browse</span>
                          </p>
                          <p className="text-sm text-[var(--color-text-muted)]">
                            Supports CSV, JSON, XLSX — up to 50MB
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </TiltUploadZone>
              </motion.div>
            )}

            {activeTab === 'screenshot' && (
              <motion.div
                key="screenshot"
                initial={{ opacity: 0, y: 20, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.97 }}
                transition={{ duration: 0.3 }}
              >
                <TiltUploadZone>
                  <div
                    className="rounded-2xl border-2 border-dashed border-[var(--color-border)] hover:border-[var(--color-steel)]/30 p-12 text-center transition-all cursor-pointer hover:bg-white/[0.02] overflow-hidden relative"
                    onClick={() => document.getElementById('img-input')?.click()}
                  >
                    <input id="img-input" type="file" accept="image/*" className="hidden" />
                    <div className="flex flex-col items-center gap-4 relative">
                      <motion.div
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                        className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[var(--color-steel)]/10 to-[var(--color-sage)]/10 flex items-center justify-center border border-[var(--glass-border)]"
                      >
                        <Camera className="w-9 h-9 text-[var(--color-steel)]" />
                      </motion.div>
                      <div>
                        <p className="font-semibold text-[var(--color-text-primary)] mb-1">
                          Upload a screenshot of any dashboard
                        </p>
                        <p className="text-sm text-[var(--color-text-muted)]">
                          Gemini Vision will extract tables and data automatically
                        </p>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--color-steel)]/10 text-xs text-[var(--color-steel)]">
                        <Sparkles className="w-3 h-3" />
                        Powered by Gemini Vision
                      </div>
                    </div>
                  </div>
                </TiltUploadZone>
              </motion.div>
            )}

            {activeTab === 'api' && (
              <motion.div
                key="api"
                initial={{ opacity: 0, y: 20, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.97 }}
                transition={{ duration: 0.3 }}
              >
                <div className="rounded-2xl border border-[var(--glass-border)] bg-[var(--color-bg-secondary)] p-6">
                  <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-3">
                    <Link2 className="w-4 h-4 inline mr-1.5" />
                    API Endpoint URL
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="url"
                      value={apiUrl}
                      onChange={(e) => setApiUrl(e.target.value)}
                      placeholder="https://api.example.com/data"
                      className="flex-1 px-4 py-3 rounded-xl bg-[var(--color-bg-elevated)] border border-[var(--color-border)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-coral)]/50 focus:ring-2 focus:ring-[var(--color-coral)]/20 outline-none transition-all font-mono text-sm"
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-3 rounded-xl bg-[var(--color-steel)] text-white font-medium hover:bg-[var(--color-steel-light)] transition-colors"
                    >
                      Fetch
                    </motion.button>
                  </div>
                  <p className="text-xs text-[var(--color-text-muted)] mt-3">
                    Supports REST APIs returning JSON data. Headers can be added after fetching.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Description */}
          <motion.div variants={staggerItem} className="rounded-2xl border border-[var(--glass-border)] bg-[var(--color-bg-secondary)] p-6">
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
              <FileText className="w-4 h-4 inline mr-1.5" />
              Describe your dataset
              <span className="text-[var(--color-text-muted)] font-normal ml-1">(optional)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="e.g., Loan approval data from UP state bank for 2024, includes caste, gender, income columns..."
              className="w-full px-4 py-3 rounded-xl bg-[var(--color-bg-elevated)] border border-[var(--color-border)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-coral)]/50 focus:ring-2 focus:ring-[var(--color-coral)]/20 outline-none transition-all resize-none"
            />
          </motion.div>

          {/* Analyze Button */}
          <motion.div variants={staggerItem}>
            <motion.button
              whileHover={{ scale: uploading ? 1 : 1.02, boxShadow: uploading ? 'none' : '0 0 60px -10px rgba(224,122,95,0.5)' }}
              whileTap={{ scale: uploading ? 1 : 0.97 }}
              onClick={handleAnalyze}
              disabled={!file || uploading}
              className={cn(
                'w-full flex items-center justify-center gap-3 px-8 py-4 rounded-2xl text-white font-semibold text-lg transition-all duration-300 relative overflow-hidden group',
                file && !uploading
                  ? 'bg-gradient-to-r from-[var(--color-coral)] to-[var(--color-coral-dark)] animate-pulse-glow cursor-pointer'
                  : 'bg-[var(--color-bg-elevated)] text-[var(--color-text-muted)] cursor-not-allowed'
              )}
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
              {uploading ? (
                <Loader2 className="w-5 h-5 animate-spin relative" />
              ) : (
                <Sparkles className="w-5 h-5 relative" />
              )}
              <span className="relative">{uploading ? 'Uploading...' : 'Analyze for Bias'}</span>
              {!uploading && <ArrowRight className="w-5 h-5 relative group-hover:translate-x-1 transition-transform" />}
            </motion.button>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-400 text-center mt-3"
              >
                {error}
              </motion.p>
            )}
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
}
