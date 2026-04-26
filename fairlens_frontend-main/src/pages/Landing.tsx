import { motion, useScroll, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Shield, Sparkles, Search, AlertTriangle, ChevronRight,
  BarChart3, Database, Globe, Play, Server, Cpu, Code2,
  FileText, ArrowRight, Zap, Users, CheckCircle2, Target
} from 'lucide-react'
import HexGrid from '@/components/HexGrid'
import FlowDiagram from '@/components/FlowDiagram'
import PhoneMockup from '@/components/PhoneMockup'
import FeatureAccordion from '@/components/FeatureAccordion'
import CapabilityChip from '@/components/CapabilityChip'
import ParticleField from '@/components/ParticleField'
import MarqueeTicker from '@/components/MarqueeTicker'
import MagneticButton from '@/components/MagneticButton'
import TypewriterHeadline from '@/components/TypewriterHeadline'

/* ═══ SECTION WRAPPER ═══ */
function Section({ id, children, className = '', dark = false }: { id: string; children: React.ReactNode; className?: string; dark?: boolean }) {
  return (
    <section id={id} className={`relative py-28 ${dark ? 'bg-[var(--color-bg-secondary)]' : ''} border-t border-white/10 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">{children}</div>
    </section>
  )
}

/* ═══ PIPELINE STEP ═══ */
const pipelineSteps = [
  { icon: FileText, label: 'Upload', desc: 'CSV, JSON, or Screenshot', color: '#E07A5F' },
  { icon: Search, label: 'Detect', desc: 'Auto-find protected columns', color: '#3D5A80' },
  { icon: Shield, label: 'Analyze', desc: '4 statistical fairness tests', color: '#f59e0b' },
  { icon: BarChart3, label: 'Report', desc: 'Visual bias report card', color: '#22c55e' },
  { icon: Code2, label: 'Fix', desc: 'AI-generated debiasing code', color: '#a855f7' },
]

/* ═══ TECH STACK ═══ */
const techStack = [
  { name: 'React', desc: 'Frontend Framework', icon: '⚛️', color: '#61dafb' },
  { name: 'FastAPI', desc: 'Backend API', icon: '⚡', color: '#009688' },
  { name: 'Grok AI', desc: 'xAI Language Model', icon: '🤖', color: '#E07A5F' },
  { name: 'Python', desc: 'Analysis Engine', icon: '🐍', color: '#3776ab' },
  { name: 'Pandas', desc: 'Data Processing', icon: '🐼', color: '#150458' },
  { name: 'TailwindCSS', desc: 'Styling System', icon: '🎨', color: '#06b6d4' },
  { name: 'Framer Motion', desc: 'Animations', icon: '✨', color: '#ff0080' },
  { name: 'TypeScript', desc: 'Type Safety', icon: '📘', color: '#3178c6' },
]

/* ═══ TEAM ═══ */
const team = [
  { name: 'Vedant Gupta', role: 'Full-Stack Lead', avatar: 'VG', color: '#E07A5F' },
  { name: 'Priya Sharma', role: 'ML Engineer', avatar: 'PS', color: '#3D5A80' },
  { name: 'Arjun Mehta', role: 'Backend Developer', avatar: 'AM', color: '#22c55e' },
  { name: 'Sneha Patel', role: 'UI/UX Designer', avatar: 'SP', color: '#a855f7' },
]

export default function Landing() {
  const { scrollYProgress } = useScroll()
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0])
  const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.95])

  return (
    <div className="selection:bg-[var(--color-coral)]/30">

      {/* ═══ 1. HERO ═══ */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center pt-20 pb-12 overflow-hidden">
        {/* Particle Network Background */}
        <ParticleField />
        
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vw] max-w-[700px] max-h-[700px] rounded-full blur-[120px] opacity-30 pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(224,122,95,0.25) 0%, transparent 70%)' }} />
        
        <motion.div style={{ opacity: heroOpacity, scale: heroScale }} className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--color-coral)]/30 bg-[var(--color-coral)]/10 mb-8 backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-[var(--color-coral)]" />
            <span className="text-xs font-bold tracking-widest uppercase text-[var(--color-coral)]">Google Solution Challenge 2026</span>
          </motion.div>
          
          <div className="mb-6 flex justify-center">
            <TypewriterHeadline text="Where every algorithm meets its mirror." className="text-massive font-bold text-gradient-coral leading-[1.1]" />
          </div>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className="text-lg md:text-xl text-[var(--color-text-muted)] max-w-2xl mx-auto mb-12">
            Audit any AI system for hidden biases in seconds. Detect discrimination. Get actionable fixes. Built for India.
          </motion.p>
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.6 }} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/upload">
              <MagneticButton intensity={0.3} className="group flex items-center gap-3 px-8 py-4 rounded-full bg-white text-black font-semibold text-lg hover:scale-105 active:scale-95 transition-transform">
                Start Bias Audit
                <div className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors"><ChevronRight className="w-4 h-4" /></div>
              </MagneticButton>
            </Link>
            <MagneticButton intensity={0.2} className="flex items-center gap-2 px-8 py-4 rounded-full border border-white/20 text-white font-semibold text-lg hover:bg-white/5 transition-colors">
              <Play className="w-5 h-5" /> Watch Demo
            </MagneticButton>
          </motion.div>
        </motion.div>
      </section>

      <MarqueeTicker />

      {/* ═══ 2. THE PROBLEM ═══ */}
      <Section id="problem" dark>
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-amber-500 font-mono text-xs tracking-widest uppercase font-bold mb-3 block">The Broken Loop</span>
            <h2 className="font-editorial text-editorial-lg font-bold mb-6">India deploys 200+ AI schemes.<br/><span className="text-amber-500">Zero have been audited for bias.</span></h2>
            <p className="text-lg text-[var(--color-text-muted)] mb-8">When ML models govern loans, welfare, and hiring without oversight, historical prejudices become automated.</p>
            <div className="flex flex-wrap gap-3">
              <CapabilityChip icon={AlertTriangle} label="1.4B Citizens Affected" color="#f59e0b" active />
              <CapabilityChip icon={Shield} label="No Regulatory Standard" color="#f59e0b" />
            </div>
          </div>
          <div className="bg-black/40 rounded-3xl p-8 border border-white/10">
            <FlowDiagram variant="triangle" nodes={[
              { id: '1', label: 'AI Model', sublabel: 'Trained on historical data', color: '#E07A5F' },
              { id: '2', label: 'Decision', sublabel: 'Automated screening', color: '#22c55e' },
              { id: '3', label: 'Impact', sublabel: 'Citizen denied service', color: '#3D5A80' },
              { id: '4', label: '', sublabel: 'No fairness audit mechanism exists' },
            ]} />
          </div>
        </div>
      </Section>

      {/* ═══ 3. FEATURE 1 — BIAS ENGINE ═══ */}
      <Section id="feature-1">
        <span className="text-[var(--color-coral)] font-mono text-xs tracking-widest uppercase font-bold mb-3 block">Our Solution</span>
        <h2 className="font-editorial text-editorial-lg font-bold mb-12">The Complete Audit Toolkit</h2>
        <div className="grid lg:grid-cols-[1fr_380px] gap-12">
          <div className="bg-[#0a0908] rounded-3xl border border-white/10 p-6 flex items-center justify-center min-h-[480px] relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-coral)]/5 to-transparent pointer-events-none" />
            <div className="w-full max-w-md"><HexGrid /></div>
          </div>
          <div className="flex flex-col justify-center">
            <FeatureAccordion items={[
              { id: 'f1', number: '01', label: 'Bias Detection Engine', title: '', color: '#E07A5F', content: (<div><p className="text-sm text-[var(--color-text-muted)] mb-4">4 statistical tests: Demographic Parity, Disparate Impact, Equalized Odds, Group Size Balance.</p><div className="flex flex-wrap gap-2"><CapabilityChip icon={Database} label="Disparate Impact" color="#E07A5F" active /><CapabilityChip icon={BarChart3} label="Equalized Odds" color="#E07A5F" /></div></div>) },
              { id: 'f2', number: '02', label: 'Interactive Bias Map', title: '', color: '#22c55e', content: (<div><p className="text-sm text-[var(--color-text-muted)] mb-4">Hexagonal grid showing bias severity across Indian datasets and sectors.</p><div className="flex flex-wrap gap-2"><CapabilityChip icon={Globe} label="Live HexGrid" color="#22c55e" active /></div></div>) },
              { id: 'f3', number: '03', label: 'AI Chat Explorer', title: '', color: '#3D5A80', content: (<div><p className="text-sm text-[var(--color-text-muted)] mb-4">Chat in Hindi or English. Get debiasing code generated automatically.</p><div className="flex flex-wrap gap-2"><CapabilityChip icon={Sparkles} label="Grok AI" color="#3D5A80" active /><CapabilityChip icon={Server} label="Code Gen" color="#3D5A80" /></div></div>) },
            ]} />
          </div>
        </div>
      </Section>

      {/* ═══ 4. FEATURE 2 — BIAS MAP ═══ */}
      <Section id="feature-2" dark>
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-emerald-400 font-mono text-xs tracking-widest uppercase font-bold mb-3 block">Live Visualization</span>
            <h2 className="font-editorial text-editorial-lg font-bold mb-6">Map bias across<br/><span className="text-emerald-400">every sector.</span></h2>
            <p className="text-lg text-[var(--color-text-muted)] mb-8">Our hexagonal bias map visualizes fairness scores across Finance, Health, Education, and more. Red means critical bias. Green means fair.</p>
            <div className="grid grid-cols-3 gap-3">
              {[{ n: '19', l: 'Datasets', c: '#E07A5F' }, { n: '5', l: 'Critical', c: '#ef4444' }, { n: '73%', l: 'Fair', c: '#22c55e' }].map(s => (
                <div key={s.l} className="p-3 rounded-xl text-center" style={{ background: `${s.c}08`, border: `1px solid ${s.c}20` }}>
                  <p className="font-editorial font-bold text-2xl" style={{ color: s.c }}>{s.n}</p>
                  <p className="text-[10px] text-[var(--color-text-muted)]">{s.l}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-[#0a0908] rounded-3xl border border-white/10 p-6"><HexGrid /></div>
        </div>
      </Section>

      {/* ═══ 5. FEATURE 3 — AI CHAT ═══ */}
      <Section id="feature-3">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1 flex justify-center"><PhoneMockup /></div>
          <div className="order-1 lg:order-2">
            <span className="text-[var(--color-steel)] font-mono text-xs tracking-widest uppercase font-bold mb-3 block">Conversational AI</span>
            <h2 className="font-editorial text-editorial-lg font-bold mb-6">Talk to your data.<br/><span className="text-[var(--color-coral)]">In any language.</span></h2>
            <p className="text-lg text-[var(--color-text-muted)] mb-8">Our Grok-powered AI explains disparities in plain language and generates debiasing code for developers.</p>
            <div className="flex flex-wrap gap-3">
              <CapabilityChip icon={Sparkles} label="Grok AI" color="#3D5A80" active />
              <CapabilityChip icon={Globe} label="Hindi / English" color="#3D5A80" />
              <CapabilityChip icon={Code2} label="Code Generation" color="#3D5A80" />
            </div>
          </div>
        </div>
      </Section>

      {/* ═══ 6. PIPELINE ═══ */}
      <Section id="pipeline" dark>
        <div className="text-center mb-16">
          <span className="text-[var(--color-coral)] font-mono text-xs tracking-widest uppercase font-bold mb-3 block">How It Works</span>
          <h2 className="font-editorial text-editorial-lg font-bold">Five steps to fairness.</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {pipelineSteps.map((step, i) => (
            <motion.div key={step.label} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center text-center p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] cursor-hover group hover:border-opacity-20 transition-all"
              style={{ ['--step-color' as string]: step.color }}>
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-colors" style={{ background: `${step.color}15` }}>
                <step.icon className="w-6 h-6" style={{ color: step.color }} />
              </div>
              <p className="text-[10px] font-bold tracking-widest uppercase text-[var(--color-text-muted)] mb-1">Step {i + 1}</p>
              <p className="font-semibold text-sm mb-1">{step.label}</p>
              <p className="text-[11px] text-[var(--color-text-muted)]">{step.desc}</p>
              {i < pipelineSteps.length - 1 && <div className="hidden md:block absolute right-0 top-1/2 w-4 text-[var(--color-text-muted)]">→</div>}
            </motion.div>
          ))}
        </div>
      </Section>

      {/* ═══ 7. TECH STACK ═══ */}
      <Section id="tech-stack">
        <div className="text-center mb-16">
          <span className="text-purple-400 font-mono text-xs tracking-widest uppercase font-bold mb-3 block">Built With</span>
          <h2 className="font-editorial text-editorial-lg font-bold">Modern Tech Stack</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {techStack.map((t, i) => (
            <motion.div key={t.name} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
              whileHover={{ y: -4, borderColor: `${t.color}40` }}
              className="p-5 rounded-xl border border-white/[0.06] bg-white/[0.02] cursor-hover group">
              <span className="text-2xl mb-3 block">{t.icon}</span>
              <p className="font-semibold text-sm mb-0.5 group-hover:text-white transition-colors">{t.name}</p>
              <p className="text-[11px] text-[var(--color-text-muted)]">{t.desc}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* ═══ 8. STATS ═══ */}
      <Section id="stats" dark>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { value: '200+', label: 'Govt AI Schemes', sub: 'Deployed without audit', color: '#E07A5F' },
            { value: '4', label: 'Fairness Tests', sub: 'Statistical + AI-powered', color: '#3D5A80' },
            { value: '0', label: 'Existing Audits', sub: 'Before FairLens', color: '#ef4444' },
            { value: '1.4B', label: 'Indians Affected', sub: 'By automated decisions', color: '#f59e0b' },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="text-center p-8 rounded-2xl border border-white/[0.06] bg-white/[0.02]">
              <p className="font-editorial font-bold text-5xl md:text-6xl mb-2" style={{ color: s.color }}>{s.value}</p>
              <p className="font-semibold text-sm mb-1">{s.label}</p>
              <p className="text-[11px] text-[var(--color-text-muted)]">{s.sub}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* ═══ 9. TEAM ═══ */}
      <Section id="team">
        <div className="text-center mb-16">
          <span className="text-emerald-400 font-mono text-xs tracking-widest uppercase font-bold mb-3 block">The Team</span>
          <h2 className="font-editorial text-editorial-lg font-bold">Built by students, for citizens.</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {team.map((m, i) => (
            <motion.div key={m.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="flex flex-col items-center text-center p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] cursor-hover">
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold text-white mb-4" style={{ background: `linear-gradient(135deg, ${m.color}, ${m.color}80)`, boxShadow: `0 8px 24px ${m.color}30` }}>
                {m.avatar}
              </div>
              <p className="font-semibold text-sm">{m.name}</p>
              <p className="text-[11px] text-[var(--color-text-muted)]">{m.role}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* ═══ 10. CTA ═══ */}
      <section id="cta" className="relative py-32 border-t border-white/10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-coral)]/10 to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="font-editorial text-editorial-lg font-bold mb-6">Because algorithms should serve democracy, not undermine it.</h2>
          <p className="text-xl text-[var(--color-text-muted)] mb-10">Join the movement for responsible AI in India.</p>
          <Link to="/upload" className="cursor-hover inline-flex items-center gap-3 px-10 py-5 rounded-full bg-gradient-to-r from-[var(--color-coral)] to-[#D15A3C] text-white font-bold text-xl shadow-[0_0_40px_rgba(224,122,95,0.4)] hover:shadow-[0_0_60px_rgba(224,122,95,0.6)] hover:scale-105 transition-all">
            <Sparkles className="w-6 h-6" /> Audit Your First Model
          </Link>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="py-8 border-t border-white/10 text-center text-sm text-[var(--color-text-muted)]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-6">
          <p>FairLens © 2026 · Google Solution Challenge</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <span className="cursor-hover hover:text-white transition-colors">Privacy</span>
            <span className="cursor-hover hover:text-white transition-colors">GitHub</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
