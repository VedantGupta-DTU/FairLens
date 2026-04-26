import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Home, AlertTriangle, BarChart3, MapPin, Cpu, Sparkles,
  Users, MessageSquare, Code2, Target, Shield, Rocket
} from 'lucide-react'

const sections = [
  { id: 'hero', icon: Home, label: 'Home', color: '#E07A5F' },
  { id: 'problem', icon: AlertTriangle, label: 'The Problem', color: '#f59e0b' },
  { id: 'feature-1', icon: Shield, label: 'Bias Engine', color: '#E07A5F' },
  { id: 'feature-2', icon: MapPin, label: 'Bias Map', color: '#22c55e' },
  { id: 'feature-3', icon: MessageSquare, label: 'AI Chat', color: '#3D5A80' },
  { id: 'pipeline', icon: Rocket, label: 'How It Works', color: '#E07A5F' },
  { id: 'tech-stack', icon: Code2, label: 'Tech Stack', color: '#a855f7' },
  { id: 'stats', icon: BarChart3, label: 'Impact', color: '#f59e0b' },
  { id: 'team', icon: Users, label: 'Team', color: '#22c55e' },
  { id: 'cta', icon: Target, label: 'Get Started', color: '#E07A5F' },
]

export default function SidebarNav() {
  const [activeSection, setActiveSection] = useState('hero')
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const { pathname } = useLocation()

  useEffect(() => {
    if (pathname !== '/') return

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the entry that is most visible
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { threshold: 0.2, rootMargin: '-10% 0px -40% 0px' }
    )

    // Wait for the Outlet to fully render the Landing page components
    const timer = setTimeout(() => {
      sections.forEach(({ id }) => {
        const el = document.getElementById(id)
        if (el) observer.observe(el)
      })
    }, 200)

    return () => {
      clearTimeout(timer)
      observer.disconnect()
    }
  }, [pathname])

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <motion.nav
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1.5, duration: 0.6 }}
      className="fixed right-4 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col items-center gap-1.5"
    >
      {/* Vertical line behind icons */}
      <div className="absolute inset-y-2 left-1/2 -translate-x-1/2 w-[1px] bg-gradient-to-b from-transparent via-white/[0.06] to-transparent" />

      {sections.map(({ id, icon: Icon, label, color }) => {
        const isActive = activeSection === id
        const isHovered = hoveredId === id

        return (
          <div
            key={id}
            className="relative flex items-center"
            onMouseEnter={() => setHoveredId(id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            {/* Tooltip label */}
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, x: 10, scale: 0.8 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 10, scale: 0.8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-full mr-3 whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-medium"
                  style={{
                    background: 'rgba(15,14,13,0.9)',
                    border: `1px solid ${color}30`,
                    color: color,
                    backdropFilter: 'blur(10px)',
                    boxShadow: `0 4px 20px rgba(0,0,0,0.3), 0 0 10px ${color}10`,
                  }}
                >
                  {label}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Icon button */}
            <motion.button
              onClick={() => scrollTo(id)}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              className="relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 cursor-hover"
              style={{
                background: isActive
                  ? `${color}18`
                  : 'transparent',
                border: isActive
                  ? `1px solid ${color}40`
                  : '1px solid transparent',
              }}
            >
              {/* Active indicator glow */}
              {isActive && (
                <motion.div
                  layoutId="sidebar-active-glow"
                  className="absolute inset-0 rounded-xl"
                  style={{
                    boxShadow: `0 0 15px ${color}20, inset 0 0 15px ${color}08`,
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}

              <Icon
                className="w-4 h-4 relative z-10 transition-colors duration-300"
                style={{
                  color: isActive ? color : isHovered ? color : 'rgba(120,113,108,0.7)',
                }}
              />

              {/* Active dot */}
              {isActive && (
                <motion.div
                  layoutId="sidebar-active-dot"
                  className="absolute -left-1.5 w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}` }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </motion.button>
          </div>
        )
      })}
    </motion.nav>
  )
}
