import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import { Send, Sparkles, User, Globe, ArrowDown, Bot, Copy, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { chatWithAI } from '@/lib/api'

type Message = {
  id: number
  role: 'user' | 'ai'
  content: string
  timestamp: string
}

const initialMessages: Message[] = [
  {
    id: 1,
    role: 'ai',
    content: "👋 Namaste! I'm FairLens AI. I've analyzed your loan approval dataset (45,230 records from UP).\n\n📊 **Quick Summary:**\n• 2 critical biases found (caste & gender)\n• 1 attribute passes fairness tests (age)\n• Overall Fairness Score: **34/100**\n\nAsk me anything — in Hindi or English!",
    timestamp: 'Just now',
  },
]

const quickQuestions = [
  { text: 'Is this data biased against women?', emoji: '👩' },
  { text: 'Kya SC auraton ko kam approval milta hai?', emoji: '🇮🇳' },
  { text: 'Which group is most affected?', emoji: '📊' },
  { text: 'Show me the worst disparities', emoji: '🔴' },
  { text: 'Generate fix code for caste bias', emoji: '🛠️' },
  { text: 'Explain disparate impact ratio', emoji: '📖' },
]

/* ── Message bubble with enhanced animations ── */
function MessageBubble({ msg, index }: { msg: Message; index: number }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(msg.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95, filter: 'blur(4px)' }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
      transition={{
        duration: 0.4,
        ease: 'easeOut' as const,
        delay: index === 0 ? 0 : 0.05,
      }}
      className={cn('flex gap-3', msg.role === 'user' ? 'justify-end' : '')}
    >
      {msg.role === 'ai' && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, delay: 0.1 }}
          className="flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--color-coral)] to-[var(--color-steel)] flex items-center justify-center mt-1 shadow-lg shadow-[var(--color-coral)]/20"
        >
          <Sparkles className="w-4 h-4 text-white" />
        </motion.div>
      )}

      <div className="group relative max-w-[80%]">
        <div className={cn(
          'rounded-2xl px-4 py-3 text-sm leading-relaxed',
          msg.role === 'user'
            ? 'bg-gradient-to-r from-[var(--color-coral)] to-[var(--color-coral-dark)] text-white rounded-br-md shadow-lg shadow-[var(--color-coral)]/15'
            : 'bg-[var(--color-bg-secondary)] border border-[var(--glass-border)] text-[var(--color-text-secondary)] rounded-bl-md'
        )}>
          <div className="whitespace-pre-wrap">{msg.content}</div>
        </div>

        {/* Copy button for AI messages */}
        {msg.role === 'ai' && (
          <motion.button
            onClick={handleCopy}
            initial={{ opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            className="absolute -bottom-2 right-2 opacity-0 group-hover:opacity-100 p-1.5 rounded-lg bg-[var(--color-bg-elevated)] border border-[var(--glass-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-all shadow-lg"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
          </motion.button>
        )}
      </div>

      {msg.role === 'user' && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, delay: 0.1 }}
          className="flex-shrink-0 w-9 h-9 rounded-xl bg-[var(--color-bg-elevated)] border border-[var(--glass-border)] flex items-center justify-center mt-1"
        >
          <User className="w-4 h-4 text-[var(--color-text-muted)]" />
        </motion.div>
      )}
    </motion.div>
  )
}

/* ── Enhanced typing indicator ── */
function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex gap-3"
    >
      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--color-coral)] to-[var(--color-steel)] flex items-center justify-center shadow-lg shadow-[var(--color-coral)]/20">
        <Sparkles className="w-4 h-4 text-white" />
      </div>
      <div className="bg-[var(--color-bg-secondary)] border border-[var(--glass-border)] rounded-2xl rounded-bl-md px-5 py-3">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {[0, 1, 2].map(i => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full bg-[var(--color-coral)]"
                animate={{
                  y: [0, -8, 0],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  delay: i * 0.15,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </div>
          <span className="text-xs text-[var(--color-text-muted)] ml-1">Analyzing...</span>
        </div>
      </div>
    </motion.div>
  )
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [lang, setLang] = useState<'en' | 'hi'>('en')
  const bottomRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const location = useLocation()
  const sessionId = (location.state as any)?.sessionId || ''

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const handleSend = async (text?: string) => {
    const msg = text || input
    if (!msg.trim()) return

    const userMsg: Message = {
      id: Date.now(),
      role: 'user',
      content: msg,
      timestamp: 'Now',
    }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    let aiContent: string
    if (sessionId) {
      // Real mode — call Grok API
      try {
        const res = await chatWithAI(sessionId, msg)
        aiContent = res.response
      } catch {
        aiContent = 'Sorry, I couldn\'t process your request. Please check the backend connection.'
      }
    } else {
      // Demo mode — simulated response
      await new Promise(r => setTimeout(r, 1500 + Math.random() * 1000))
      aiContent = getAIResponse(msg)
    }

    const aiMsg: Message = {
      id: Date.now() + 1,
      role: 'ai',
      content: aiContent,
      timestamp: 'Now',
    }
    setMessages(prev => [...prev, aiMsg])
    setIsTyping(false)
  }

  const getAIResponse = (q: string): string => {
    const lower = q.toLowerCase()
    if (lower.includes('women') || lower.includes('gender') || lower.includes('female')) {
      return "Yes, I found **gender bias** in the loan approval data.\n\n📊 **Key Findings:**\n• Women approval rate: **45%** vs Men: **62%**\n• Disparate Impact ratio: **0.73** (below the 0.80 threshold)\n• Most affected: Women aged 25-35 from **rural areas** with income < ₹3L/yr (only **22%** approval)\n\n⚠️ **Intersection Alert:** Rural SC/ST women face the worst disparity at just **14%** approval.\n\nWould you like me to suggest debiasing techniques? I can generate Python code for re-weighting or threshold adjustment."
    }
    if (lower.includes('sc') || lower.includes('caste') || lower.includes('jati') || lower.includes('auraton')) {
      return "🔴 **Haan, critical caste-based bias mila hai.**\n\n📊 **Analysis:**\n• SC/ST approval rate: **28%** vs General: **71%**\n• Disparate Impact: **0.39** — yeh 0.80 threshold se bahut neeche hai\n• SC/ST applicants jinki income ₹5L+ hai, unka rejection rate **same** hai jaise General category ka income ₹2L ke neeche\n\n⚠️ Iska matlab model ne **systematic caste bias** seekh liya hai jo economic factors se aage jaata hai.\n\n🛠️ **Fix options:**\n1. Re-weighting samples\n2. Threshold optimization per group\n3. Adversarial debiasing\n\nKya koi specific fix ka code generate karun?"
    }
    if (lower.includes('worst') || lower.includes('affected') || lower.includes('disparity')) {
      return "📊 **Most affected groups, ranked by disparity:**\n\n| Rank | Group | Disparity | Affected |\n|------|-------|-----------|----------|\n| 1 | 🔴 SC/ST | DI: 0.39 | 12,400 |\n| 2 | 🟡 Rural Women | 22% vs 68% | ~5,800 |\n| 3 | 🟡 Female | DI: 0.73 | 8,200 |\n| 4 | 🟢 Age (all) | DI: 0.95 | 0 |\n\n⚠️ **Critical Intersection:**\nRural SC/ST women = **14% approval rate**\nUrban General men = **76% approval rate**\n\nThe gap is **5.4x** — this is among the worst I've seen in Indian public datasets."
    }
    if (lower.includes('fix') || lower.includes('code') || lower.includes('generate')) {
      return "🛠️ **Here's a re-weighting fix for the caste bias:**\n\n```python\nimport numpy as np\nfrom sklearn.utils.class_weight import compute_sample_weight\n\n# Compute fairness-aware weights\nweights = compute_sample_weight(\n    class_weight='balanced',\n    y=df['caste_category']\n)\n\n# Apply to model training\nmodel.fit(X_train, y_train, sample_weight=weights)\n\n# Post-processing: equalize thresholds\nfrom fairlearn.postprocessing import ThresholdOptimizer\nopt = ThresholdOptimizer(\n    estimator=model,\n    constraints='demographic_parity',\n    prefit=True\n)\nopt.fit(X_train, y_train, sensitive_features=df['caste'])\n```\n\nThis should improve the Disparate Impact ratio from **0.39** to approximately **0.82+**."
    }
    return "Based on my analysis of the 45,230 records, I can help you explore the bias patterns. Try asking about:\n\n• **Specific groups** — \"Is there gender bias?\" or \"Caste ke baare mein batao\"\n• **Intersections** — \"Rural SC women ka kya haal hai?\"\n• **Fix strategies** — \"Generate debiasing code\"\n• **Comparison** — \"Compare districts\" or \"Urban vs rural\"\n• **Explanation** — \"What is disparate impact?\"\n\nI respond in both Hindi and English! 🇮🇳"
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col relative">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[20%] right-[-15%] w-[40%] h-[40%] rounded-full blur-[120px]" style={{ background: 'radial-gradient(circle, rgba(224,122,95,0.08) 0%, transparent 70%)' }} />
        <div className="absolute bottom-[20%] left-[-15%] w-[35%] h-[35%] rounded-full blur-[100px]" style={{ background: 'radial-gradient(circle, rgba(61,90,128,0.08) 0%, transparent 70%)' }} />
      </div>

      {/* Chat Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-[var(--glass-border)] px-4 sm:px-6 py-4 glass relative z-10"
      >
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="w-11 h-11 rounded-xl bg-gradient-to-br from-[var(--color-coral)] to-[var(--color-steel)] flex items-center justify-center shadow-lg shadow-[var(--color-coral)]/20"
            >
              <Bot className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h2 className="font-['Clash_Display',system-ui,sans-serif] font-semibold text-lg">Bias Explorer</h2>
              <div className="flex items-center gap-1.5">
                <motion.div
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-2 h-2 rounded-full bg-emerald-500"
                />
                <p className="text-xs text-emerald-400">Analyzing UP_Loans_2024.csv</p>
              </div>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setLang(l => l === 'en' ? 'hi' : 'en')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[var(--glass-border)] text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-white/5 transition-all"
          >
            <Globe className="w-4 h-4" />
            {lang === 'en' ? 'EN' : 'हिंदी'}
          </motion.button>
        </div>
      </motion.div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 relative">
        <div className="max-w-3xl mx-auto space-y-5">
          <AnimatePresence>
            {messages.map((msg, i) => (
              <MessageBubble key={msg.id} msg={msg} index={i} />
            ))}
          </AnimatePresence>

          <AnimatePresence>
            {isTyping && <TypingIndicator />}
          </AnimatePresence>

          <div ref={bottomRef} />
        </div>
      </div>

      {/* Quick Questions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="px-4 sm:px-6 pb-3 relative z-10"
      >
        <div className="max-w-3xl mx-auto">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {quickQuestions.map((q) => (
              <motion.button
                key={q.text}
                whileHover={{ scale: 1.05, borderColor: 'rgba(224,122,95,0.3)' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSend(q.text)}
                className="flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[var(--glass-border)] bg-[var(--color-bg-secondary)]/80 backdrop-blur-sm text-xs text-[var(--color-text-muted)] hover:text-[var(--color-coral)] transition-all whitespace-nowrap"
              >
                <span>{q.emoji}</span>
                {q.text}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* 21st.dev-Inspired Gradient Input */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
        className="px-4 sm:px-6 py-4 relative z-10"
        style={{ borderTop: '1px solid var(--glass-border)', background: 'var(--glass-bg)', backdropFilter: 'blur(12px)' }}
      >
        <div className="max-w-3xl mx-auto">
          <form
            onSubmit={(e) => { e.preventDefault(); handleSend() }}
            className="relative group"
          >
            {/* Animated gradient border */}
            <div
              className="absolute -inset-[1px] rounded-2xl opacity-40 group-focus-within:opacity-100 transition-opacity duration-500"
              style={{
                background: 'linear-gradient(90deg, #E07A5F, #3D5A80, #81936A, #E07A5F)',
                backgroundSize: '300% 100%',
                animation: 'gradient-shift 4s ease infinite',
              }}
            />

            {/* Inner container */}
            <div className="relative flex items-center gap-2 rounded-2xl px-4 py-2" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
              <Sparkles className="w-4 h-4 text-[var(--color-coral)] flex-shrink-0 opacity-50 group-focus-within:opacity-100 transition-opacity" />
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={lang === 'en' ? 'Ask about bias in your data...' : 'Apne data ke baare mein puchein...'}
                className="flex-1 bg-transparent py-2 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] outline-none text-sm"
              />
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-[var(--color-text-muted)] px-1.5 py-0.5 rounded" style={{ backgroundColor: 'var(--color-bg-elevated)' }}>⏎</span>
                <motion.button
                  whileHover={{ scale: 1.1, boxShadow: '0 0 20px -3px rgba(224,122,95,0.5)' }}
                  whileTap={{ scale: 0.9 }}
                  type="submit"
                  disabled={!input.trim()}
                  className={cn(
                    'w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer',
                    input.trim()
                      ? 'bg-gradient-to-r from-[var(--color-coral)] to-[var(--color-coral-dark)] text-white'
                      : 'text-[var(--color-text-muted)]'
                  )}
                  style={input.trim() ? { boxShadow: '0 0 15px -3px rgba(224,122,95,0.3)' } : {}}
                >
                  <Send className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  )
}
