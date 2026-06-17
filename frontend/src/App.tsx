import { useEffect, useCallback, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { AnimatePresence } from 'framer-motion'
import * as THREE from 'three'
import OrbitalScene from './scene/OrbitalScene'
import Hud from './components/Hud'
import BackendStatusPanel from './components/BackendStatusPanel'
import RecruiterMode from './components/RecruiterMode'
import AdminPage from './components/AdminPage'
import { useStore } from './store/useStore'

const SCROLL_SPEED = 1 / (window.innerHeight * 3.5)

export default function App() {
  const { setScrollProgress, recruiterMode } = useStore()
  const adminPage = window.location.pathname === '/admin' || window.location.hash === '#admin'
  const dragScrollRef = useRef({
    active: false,
    lastY: 0,
  })

  const updateScroll = useCallback(
    (deltaY: number, multiplier = 1) => {
      setScrollProgress(
        Math.min(
          1,
          Math.max(0, useStore.getState().scrollProgress + deltaY * SCROLL_SPEED * multiplier),
        ),
      )
    },
    [setScrollProgress],
  )

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      if (recruiterMode || adminPage) return
      if ((window as Window & { __orbitSceneDragLock?: boolean }).__orbitSceneDragLock) return
      e.preventDefault()
      updateScroll(e.deltaY)
    },
    [adminPage, recruiterMode, updateScroll],
  )

  useEffect(() => {
    let lastY = 0
    const sceneWindow = window as Window & { __orbitSceneDragLock?: boolean }

    const onTouchStart = (e: TouchEvent) => {
      if (sceneWindow.__orbitSceneDragLock) return
      const target = e.target as HTMLElement | null
      if (target?.closest('[data-no-page-drag="true"]')) return
      lastY = e.touches[0].clientY
    }

    const onTouchMove = (e: TouchEvent) => {
      if (recruiterMode || adminPage) return
      if (sceneWindow.__orbitSceneDragLock) {
        e.preventDefault()
        return
      }

      const target = e.target as HTMLElement | null
      if (target?.closest('[data-no-page-drag="true"]')) return

      const dy = lastY - e.touches[0].clientY
      lastY = e.touches[0].clientY
      updateScroll(dy, 2)
    }

    const onPointerDown = (e: PointerEvent) => {
      if (recruiterMode || adminPage || e.pointerType !== 'mouse' || e.button !== 0) return
      if (sceneWindow.__orbitSceneDragLock) return

      const target = e.target as HTMLElement | null
      if (target?.closest('[data-no-page-drag="true"]')) return

      dragScrollRef.current.active = true
      dragScrollRef.current.lastY = e.clientY
    }

    const onPointerMove = (e: PointerEvent) => {
      if (!dragScrollRef.current.active) return
      if (sceneWindow.__orbitSceneDragLock) {
        dragScrollRef.current.active = false
        return
      }

      const dy = dragScrollRef.current.lastY - e.clientY
      dragScrollRef.current.lastY = e.clientY
      if (Math.abs(dy) < 0.5) return

      e.preventDefault()
      updateScroll(dy, 2.3)
    }

    const onPointerUp = () => {
      dragScrollRef.current.active = false
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: false })
    window.addEventListener('pointerdown', onPointerDown, { passive: true })
    window.addEventListener('pointermove', onPointerMove, { passive: false })
    window.addEventListener('pointerup', onPointerUp, { passive: true })
    window.addEventListener('pointercancel', onPointerUp, { passive: true })

    return () => {
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('pointercancel', onPointerUp)
    }
  }, [adminPage, handleWheel, recruiterMode, updateScroll])

  if (adminPage) return <AdminPage />

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000', overflow: 'hidden' }}>
      <div
        className="fixed inset-0 z-0"
        style={{ opacity: recruiterMode ? 0.04 : 1, transition: 'opacity 0.6s ease' }}
      >
        <Canvas
          camera={{ position: [0, 0, 12], fov: 58, near: 0.1, far: 250 }}
          gl={{
            antialias: true,
            alpha: false,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.15,
          }}
          dpr={[1, 1.5]}
          style={{ background: '#00000a', touchAction: 'none' }}
        >
          <OrbitalScene />
        </Canvas>
      </div>

      {!recruiterMode && <Hud />}
      <BackendStatusPanel />

      <AnimatePresence>{recruiterMode && <RecruiterMode />}</AnimatePresence>
    </div>
  )
}
