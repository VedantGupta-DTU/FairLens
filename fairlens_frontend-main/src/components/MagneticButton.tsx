import { useRef, useState } from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'

interface Props extends HTMLMotionProps<"button"> {
  children: React.ReactNode
  className?: string
  intensity?: number
}

export default function MagneticButton({ children, className = '', intensity = 0.5, ...props }: Props) {
  const ref = useRef<HTMLButtonElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const handleMouse = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { clientX, clientY } = e
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    const middleX = clientX - (rect.left + rect.width / 2)
    const middleY = clientY - (rect.top + rect.height / 2)
    setPosition({ x: middleX * intensity, y: middleY * intensity })
  }

  const reset = () => {
    setPosition({ x: 0, y: 0 })
  }

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 150, damping: 15, mass: 0.1 }}
      className={`cursor-hover relative ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  )
}
