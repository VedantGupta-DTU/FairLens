import { Outlet, Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Home, Upload, MessageSquare, BarChart3, LayoutDashboard } from 'lucide-react'
import { cn } from '@/lib/utils'
import CustomCursor from '@/components/CustomCursor'
import SidebarNav from '@/components/SidebarNav'
import ScrollProgress from '@/components/ScrollProgress'

const navItems = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/upload', icon: Upload, label: 'Audit' },
  { path: '/chat', icon: MessageSquare, label: 'Chat' },
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
]

export default function MainLayout() {
  const location = useLocation()

  return (
    <div className="min-h-screen relative">
      <ScrollProgress />
      
      {/* Custom cursor */}
      <CustomCursor />

      {/* Sidebar nav (landing page only) */}
      {location.pathname === '/' && <SidebarNav />}

      {/* Noise overlay */}
      <div className="noise-overlay" />

      {/* ═══ PREMIUM NAVBAR ═══ */}
      <header className="fixed top-0 left-0 right-0 z-50">
        {/* Top beam line */}
        <div className="h-[1px] w-full relative overflow-hidden">
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(90deg, transparent, rgba(224,122,95,0.5), rgba(61,90,128,0.5), transparent)',
          }} />
          <motion.div
            className="absolute top-0 h-[1px] w-[100px]"
            style={{ background: 'linear-gradient(90deg, transparent, #E07A5F, transparent)' }}
            animate={{ left: ['-100px', 'calc(100vw + 100px)'] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear', repeatDelay: 2 }}
          />
        </div>

        <div style={{
          background: 'rgba(15, 14, 13, 0.6)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <Link to="/" className="flex items-center gap-2.5 group">
                <motion.div
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.5 }}
                  className="relative w-9 h-9 rounded-xl flex items-center justify-center overflow-hidden"
                >
                  {/* Animated gradient bg */}
                  <div className="absolute inset-0" style={{
                    background: 'linear-gradient(135deg, #E07A5F, #D15A3C, #3D5A80)',
                    backgroundSize: '200% 200%',
                    animation: 'gradient-shift 4s ease infinite',
                  }} />
                  <Search className="w-5 h-5 text-white relative z-10" />
                </motion.div>
                <span className="font-['Clash_Display',system-ui,sans-serif] font-bold text-xl tracking-tight">
                  Fair<span className="text-gradient-coral">Lens</span>
                </span>
              </Link>

              {/* Desktop Nav — pill style */}
              <nav className="hidden md:flex items-center gap-0.5 p-1 rounded-2xl" style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}>
                {navItems.map(({ path, icon: Icon, label }) => {
                  const isActive = location.pathname === path
                  return (
                    <Link
                      key={path}
                      to={path}
                      className={cn(
                        'relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors duration-200',
                        isActive
                          ? 'text-white'
                          : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
                      )}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="nav-active"
                          className="absolute inset-0 rounded-xl"
                          style={{
                            background: 'linear-gradient(135deg, rgba(224,122,95,0.15), rgba(61,90,128,0.1))',
                            border: '1px solid rgba(224,122,95,0.2)',
                          }}
                          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        />
                      )}
                      <Icon className="w-4 h-4 relative z-10" />
                      <span className="relative z-10">{label}</span>
                    </Link>
                  )
                })}
              </nav>

              {/* CTA */}
              <Link to="/upload">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold transition-all duration-300 relative overflow-hidden cursor-pointer"
                  style={{
                    background: 'linear-gradient(135deg, #E07A5F, #D15A3C)',
                    boxShadow: '0 0 20px -5px rgba(224,122,95,0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
                  }}
                >
                  {/* Inner shimmer */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] hover:translate-x-[200%] transition-transform duration-1000" />
                  <Search className="w-4 h-4 relative" />
                  <span className="relative">Start Audit</span>
                </motion.div>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Dock */}
      <nav className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-50 rounded-2xl px-2 py-2" style={{
        background: 'rgba(15, 14, 13, 0.85)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      }}>
        <div className="flex items-center gap-1">
          {navItems.map(({ path, icon: Icon, label }) => {
            const isActive = location.pathname === path
            return (
              <Link
                key={path}
                to={path}
                className={cn(
                  'relative flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-200',
                  isActive ? 'text-[var(--color-coral)]' : 'text-[var(--color-text-muted)]'
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="mobile-active"
                    className="absolute inset-0 rounded-xl"
                    style={{ background: 'rgba(224,122,95,0.12)' }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <Icon className="w-5 h-5 relative z-10" />
                <span className="text-[10px] relative z-10">{label}</span>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Page Content */}
      <main className="pt-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -20, filter: 'blur(4px)' }}
            transition={{ duration: 0.35, ease: "easeOut" as const }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}
