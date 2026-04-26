import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export default function TypewriterHeadline({ text, className = '', delay = 500 }: { text: string, className?: string, delay?: number }) {
  const [charIndex, setCharIndex] = useState(0)

  useEffect(() => {
    let interval: NodeJS.Timeout
    const timeout = setTimeout(() => {
      interval = setInterval(() => {
        setCharIndex((prev) => {
          if (prev >= text.length) {
            clearInterval(interval)
            return prev
          }
          return prev + 1
        })
      }, 50)
    }, delay)

    return () => {
      clearTimeout(timeout)
      if (interval) clearInterval(interval)
    }
  }, [text, delay])

  return (
    <div className={`text-center ${className}`}>
      {text.split('').map((char, index) => (
        <span key={index} className={index < charIndex ? 'opacity-100' : 'opacity-0'}>
          {char}
        </span>
      ))}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
        className="inline-block w-[0.4em] h-[0.8em] bg-[var(--color-coral)] ml-1 translate-y-[0.1em]"
      />
    </div>
  )
}
