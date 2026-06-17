import { useEffect, useCallback } from 'react'
import { Canvas } from '@react-three/fiber'
import { AnimatePresence } from 'framer-motion'
import OrbitalScene from './scene/OrbitalScene'
import Hud from './components/Hud'
import BackendStatusPanel from './components/BackendStatusPanel'
import RecruiterMode from './components/RecruiterMode'
import { useStore } from './store/useStore'

const SCROLL_SPEED = 1 / (window.innerHeight * 3.5)

export default function App() {
  const { setScrollProgress, recruiterMode } = useStore()

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      if (recruiterMode) return
      e.preventDefault()
      setScrollProgress(
        Math.min(1, Math.max(0, useStore.getState().scrollProgress + e.deltaY * SCROLL_SPEED)),
      )
    },
    [recruiterMode, setScrollProgress],
  )

  const handleTouch = useCallback(() => {
    // Touch scroll handled via touchmove
  }, [])

  useEffect(() => {
    let lastY = 0

    const onTouchStart = (e: TouchEvent) => {
      lastY = e.touches[0].clientY
    }

    const onTouchMove = (e: TouchEvent) => {
      if (recruiterMode) return
      const dy = lastY - e.touches[0].clientY
      lastY = e.touches[0].clientY
      setScrollProgress(
        Math.min(1, Math.max(0, useStore.getState().scrollProgress + dy * SCROLL_SPEED * 2)),
      )
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: true })

    return () => {
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
    }
  }, [handleWheel, handleTouch, recruiterMode, setScrollProgress])

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000', overflow: 'hidden' }}>
      {/* 3D Canvas — always mounted so camera state is preserved */}
      <div
        className="fixed inset-0 z-0"
        style={{ opacity: recruiterMode ? 0.05 : 1, transition: 'opacity 0.4s' }}
      >
        <Canvas
          camera={{ position: [0, 0, 12], fov: 60, near: 0.1, far: 200 }}
          gl={{ antialias: true, alpha: false }}
          dpr={[1, 1.5]}
          style={{ background: '#000008' }}
        >
          <OrbitalScene />
        </Canvas>
      </div>

      {/* HUD overlay */}
      {!recruiterMode && (
        <>
          <Hud />
          <BackendStatusPanel />
        </>
      )}

      {/* Recruiter mode full-screen overlay */}
      <AnimatePresence>{recruiterMode && <RecruiterMode />}</AnimatePresence>
    </div>
  )
}
