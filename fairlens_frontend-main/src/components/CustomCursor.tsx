import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function CustomCursor() {
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)
  const springConfig = { damping: 25, stiffness: 200, mass: 0.5 }
  const glowX = useSpring(cursorX, springConfig)
  const glowY = useSpring(cursorY, springConfig)
  const [isHovering, setIsHovering] = useState(false)
  const [isHidden, setIsHidden] = useState(false)
  const [isTouchDevice, setIsTouchDevice] = useState(false)

  useEffect(() => {
    // Detect touch devices
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
    <>
      {/* Main dot cursor */}
      <motion.div
        className="custom-cursor-dot"
        style={{
          position: 'fixed',
          left: cursorX,
          top: cursorY,
          x: '-50%',
          y: '-50%',
          width: isHovering ? 12 : 6,
          height: isHovering ? 12 : 6,
          borderRadius: '50%',
          background: '#E07A5F',
          pointerEvents: 'none',
          zIndex: 99999,
          mixBlendMode: 'normal',
          transition: 'width 0.2s, height 0.2s',
        }}
      />

      {/* Outer glow ring */}
      <motion.div
        className="custom-cursor-glow"
        style={{
          position: 'fixed',
          left: glowX,
          top: glowY,
          x: '-50%',
          y: '-50%',
          width: isHovering ? 60 : 40,
          height: isHovering ? 60 : 40,
          borderRadius: '50%',
          border: `1.5px solid ${isHovering ? 'rgba(224,122,95,0.6)' : 'rgba(224,122,95,0.25)'}`,
          background: isHovering
            ? 'radial-gradient(circle, rgba(224,122,95,0.12) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(224,122,95,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 99998,
          opacity: isHidden ? 0 : 1,
          transition: 'width 0.3s, height 0.3s, border-color 0.3s, opacity 0.3s',
        }}
      />

      {/* Large ambient glow blob (very subtle) */}
      <motion.div
        style={{
          position: 'fixed',
          left: glowX,
          top: glowY,
          x: '-50%',
          y: '-50%',
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(224,122,95,0.04) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 99997,
          opacity: isHidden ? 0 : 1,
          filter: 'blur(30px)',
        }}
      />
    </>
  )
}
