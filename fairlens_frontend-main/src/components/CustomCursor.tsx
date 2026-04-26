import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function CustomCursor() {
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)
  
  // Staggered springs for comet tail effect
  const spring1X = useSpring(cursorX, { damping: 25, stiffness: 400, mass: 0.2 })
  const spring1Y = useSpring(cursorY, { damping: 25, stiffness: 400, mass: 0.2 })
  
  const spring2X = useSpring(cursorX, { damping: 25, stiffness: 200, mass: 0.5 })
  const spring2Y = useSpring(cursorY, { damping: 25, stiffness: 200, mass: 0.5 })
  
  const spring3X = useSpring(cursorX, { damping: 30, stiffness: 120, mass: 0.8 })
  const spring3Y = useSpring(cursorY, { damping: 30, stiffness: 120, mass: 0.8 })

  const [isHovering, setIsHovering] = useState(false)
  const [isHidden, setIsHidden] = useState(false)
  const [isTouchDevice, setIsTouchDevice] = useState(false)

  useEffect(() => {
    const checkTouch = () => {
      setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0)
    }
    checkTouch()

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
    }

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (
        target.closest('a') ||
        target.closest('button') ||
        target.closest('[data-cursor-hover]') ||
        target.closest('.cursor-hover')
      ) {
        setIsHovering(true)
      } else {
        setIsHovering(false)
      }
    }

    const handleMouseLeave = () => setIsHidden(true)
    const handleMouseEnter = () => setIsHidden(false)

    window.addEventListener('mousemove', moveCursor)
    window.addEventListener('mouseover', handleMouseOver)
    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('mouseenter', handleMouseEnter)

    return () => {
      window.removeEventListener('mousemove', moveCursor)
      window.removeEventListener('mouseover', handleMouseOver)
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('mouseenter', handleMouseEnter)
    }
  }, [cursorX, cursorY])

  if (isTouchDevice) return null

  return (
    <div className="pointer-events-none" style={{ opacity: isHidden ? 0 : 1, transition: 'opacity 0.3s' }}>
      {/* 3rd Trail (Slowest, largest, faintest) */}
      <motion.div
        style={{
          position: 'fixed', left: spring3X, top: spring3Y, x: '-50%', y: '-50%',
          width: isHovering ? 80 : 32,
          height: isHovering ? 80 : 32,
          borderRadius: '50%',
          border: isHovering ? '1px dashed rgba(224,122,95,0.2)' : 'none',
          background: 'radial-gradient(circle, rgba(224,122,95,0.08) 0%, transparent 70%)',
          zIndex: 99996,
          transition: 'width 0.4s, height 0.4s',
        }}
        animate={{ rotate: isHovering ? 180 : 0 }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
      />

      {/* 2nd Trail (Medium) */}
      <motion.div
        style={{
          position: 'fixed', left: spring2X, top: spring2Y, x: '-50%', y: '-50%',
          width: isHovering ? 50 : 16,
          height: isHovering ? 50 : 16,
          borderRadius: '50%',
          border: isHovering ? '1px solid rgba(224,122,95,0.5)' : 'none',
          background: isHovering ? 'rgba(224,122,95,0.05)' : 'rgba(224,122,95,0.2)',
          zIndex: 99997,
          transition: 'width 0.3s, height 0.3s',
        }}
      />

      {/* 1st Trail (Fastest, follows closely) */}
      <motion.div
        style={{
          position: 'fixed', left: spring1X, top: spring1Y, x: '-50%', y: '-50%',
          width: isHovering ? 24 : 10,
          height: isHovering ? 24 : 10,
          borderRadius: '50%',
          background: isHovering ? 'transparent' : 'rgba(224,122,95,0.5)',
          border: isHovering ? '2px solid #E07A5F' : 'none',
          zIndex: 99998,
          transition: 'width 0.2s, height 0.2s',
        }}
      />

      {/* Core Dot (Immediate follow) */}
      <motion.div
        style={{
          position: 'fixed', left: cursorX, top: cursorY, x: '-50%', y: '-50%',
          width: isHovering ? 6 : 4,
          height: isHovering ? 6 : 4,
          borderRadius: '50%',
          background: '#FFF',
          boxShadow: '0 0 10px #E07A5F, 0 0 20px #E07A5F',
          zIndex: 99999,
          transition: 'width 0.1s, height 0.1s',
        }}
      />
    </div>
  )
}
