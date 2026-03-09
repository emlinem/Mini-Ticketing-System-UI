'use client'

import { useCallback, useEffect, useState } from 'react'

type Props = {
  children: React.ReactNode
  onClose: () => void
}

export default function Modal({ children, onClose }: Props) {
  // Animation state
  const [visible, setVisible] = useState(false)
  const [isClosing, setIsClosing] = useState(false)

  // Trigger entrance animation on mount
  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(raf)
  }, [])

  // Prevent body scroll when modal is open
  useEffect(() => {
    const originalOverflow = document.body.style.overflow
    const originalPaddingRight = document.body.style.paddingRight

    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
    document.body.style.overflow = 'hidden'
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`
    }

    return () => {
      document.body.style.overflow = originalOverflow
      document.body.style.paddingRight = originalPaddingRight
    }
  }, [])

  // Handle modal close with animation
  const requestClose = useCallback(() => {
    if (isClosing) return
    setIsClosing(true)
    setVisible(false)
    setTimeout(() => onClose(), 220)
  }, [isClosing, onClose])

  // Handle Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') requestClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [requestClose])

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm transition-opacity duration-200 ${
        visible ? 'bg-slate-900/45 opacity-100' : 'bg-slate-900/0 opacity-0'
      }`}
      onClick={requestClose}
      role="dialog"
      aria-modal="true"
    >
      {/* Modal card */}
      <div
        className={`relative w-full max-w-xl rounded-2xl bg-white p-6 md:p-7 shadow-2xl ${
          isClosing ? 'animate-modal-out' : 'animate-modal-spring-in'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={requestClose}
          aria-label="Close modal"
          className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          ✕
        </button>

        {/* Content */}
        <div className="pr-8">{children}</div>
      </div>
    </div>
  )
}