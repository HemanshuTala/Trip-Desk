'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface RevealProps {
  children: ReactNode
  delay?: number
  className?: string
  direction?: 'up' | 'left' | 'right'
}

export default function Reveal({ children, delay = 0, className = '', direction = 'up' }: RevealProps) {
  const initial =
    direction === 'up' ? { y: 40, opacity: 0 }
    : direction === 'left' ? { x: -40, opacity: 0 }
    : { x: 40, opacity: 0 }

  return (
    <motion.div
      className={className}
      initial={initial}
      whileInView={{ y: 0, x: 0, opacity: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  )
}
