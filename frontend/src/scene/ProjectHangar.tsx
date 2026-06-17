import { useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { useProjects } from '../api/hooks'
import type { Project } from '../api/client'

const STATION_Y = -16

const CARD_W    = 430
const CARD_H    = 300
const CARD_GAP  = 28
const STRIDE    = CARD_W + CARD_GAP
const VIEWPORT_W = 1080
const VIEWPORT_H = 370

const reducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function ProjectHangar() {
  const { data: projects = [] } = useProjects()
  const { size } = useThree()
  const panelRef = useRef<THREE.Group>(null)
  const [activeIdx, setActiveIdx] = useState(0)
  const isPortrait = size.width < size.height
  const panelScale = isPortrait ? Math.min(0.72, Math.max(0.42, (size.width - 28) / VIEWPORT_W)) : 1

  useFrame((state) => {
    if (!panelRef.current || reducedMotion) return
    const et = state.clock.elapsedTime
    panelRef.current.rotation.y = Math.sin(et * 0.10) * 0.025
  })

  return (
    <group ref={panelRef} position={[0, STATION_Y, 0]}>
      {/* Station label */}
      <Html
        position={[0, 2.5, 0]}
        center
        distanceFactor={14}
        style={{ pointerEvents: 'none' }}
      >
        <div
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 10,
            letterSpacing: 5,
            color: '#22d3ee',
            opacity: 0.45,
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
          }}
        >
          ▣ PROJECT HANGAR
        </div>
      </Html>

      {/* Carousel */}
      <Html
        center
        distanceFactor={13}
        position={[0, 0, 0.06]}
        style={{
          width: VIEWPORT_W,
          height: VIEWPORT_H,
          overflow: 'visible',
          pointerEvents: 'auto',
          userSelect: 'none',
        }}
      >
        <div
          style={{
            width: VIEWPORT_W,
            height: VIEWPORT_H,
            transform: `scale(${panelScale})`,
            transformOrigin: 'center center',
          }}
        >
          <Carousel
            projects={projects}
            activeIdx={activeIdx}
            onActiveChange={setActiveIdx}
          />
        </div>
      </Html>
    </group>
  )
}

/* ── Carousel ──────────────────────────────────────────────────── */

function Carousel({
  projects,
  activeIdx,
  onActiveChange,
}: {
  projects: Project[]
  activeIdx: number
  onActiveChange: (i: number) => void
}) {
  const trackRef  = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)
  const startX     = useRef(0)
  const startTx    = useRef(0)
  const currentTx  = useRef(0)
  const wheelSnapTimer = useRef<number | null>(null)

  /* Centre the active card in the viewport */
  const centreOffset = (VIEWPORT_W - CARD_W) / 2
  const clamp = (v: number) =>
    Math.max(-Math.max(projects.length - 1, 0) * STRIDE, Math.min(0, v))

  function applyTransform(tx: number, animate: boolean) {
    if (!trackRef.current) return
    currentTx.current = tx
    trackRef.current.style.transition = animate
      ? 'transform 0.38s cubic-bezier(0.25,0.46,0.45,0.94)'
      : 'none'
    trackRef.current.style.transform =
      `translateX(${tx + centreOffset}px)`
  }

  function snapTo(idx: number) {
    const clamped = Math.max(0, Math.min(Math.max(projects.length - 1, 0), idx))
    applyTransform(-clamped * STRIDE, true)
    onActiveChange(clamped)
  }

  function onPointerDown(e: React.PointerEvent) {
    const target = e.target as HTMLElement
    if (target.closest('[data-carousel-control="true"]')) return

    isDragging.current = true
    startX.current  = e.clientX
    startTx.current = currentTx.current
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!isDragging.current) return
    const tx = clamp(startTx.current + (e.clientX - startX.current))
    applyTransform(tx, false)
  }

  function onPointerUp(e: React.PointerEvent) {
    if (!isDragging.current) return
    isDragging.current = false
    const delta = e.clientX - startX.current
    if (Math.abs(delta) > 40) {
      snapTo(delta < 0 ? activeIdx + 1 : activeIdx - 1)
    } else {
      snapTo(activeIdx)
    }
  }

  function onWheel(e: React.WheelEvent) {
    const horizontalDelta = Math.abs(e.deltaX) > Math.abs(e.deltaY) * 0.65 ? e.deltaX : 0
    if (!horizontalDelta) return

    e.preventDefault()
    e.stopPropagation()

    const tx = clamp(currentTx.current - horizontalDelta)
    const nearestIdx = Math.max(
      0,
      Math.min(Math.max(projects.length - 1, 0), Math.round(Math.abs(tx) / STRIDE)),
    )

    applyTransform(tx, false)
    onActiveChange(nearestIdx)

    if (wheelSnapTimer.current !== null) window.clearTimeout(wheelSnapTimer.current)
    wheelSnapTimer.current = window.setTimeout(() => {
      snapTo(nearestIdx)
      wheelSnapTimer.current = null
    }, 120)
  }

  return (
    <div
      data-no-page-drag="true"
      style={{
        width: '100%',
        height: '100%',
        overflow: 'visible',
        position: 'relative',
        fontFamily: 'JetBrains Mono, monospace',
        cursor: 'grab',
        boxSizing: 'border-box',
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onWheel={onWheel}
    >
      {/* Card track */}
      <div
        ref={trackRef}
        style={{
          display: 'flex',
          gap: CARD_GAP,
          transform: `translateX(${centreOffset}px)`,
          height: CARD_H,
          marginTop: (VIEWPORT_H - CARD_H - 42) / 2,
          alignItems: 'stretch',
        }}
      >
        {projects.map((project, i) => (
          <CarouselCard
            key={project.id}
            project={project}
            isActive={i === activeIdx}
          />
        ))}
      </div>

      {/* Nav controls */}
      <div
        data-carousel-control="true"
        onPointerDown={(e) => e.stopPropagation()}
        style={{
          position: 'absolute',
          bottom: 10,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 9,
          zIndex: 4,
          pointerEvents: 'auto',
        }}
      >
        <NavButton label="Previous project" disabled={activeIdx === 0} onClick={() => snapTo(activeIdx - 1)}>
          ‹
        </NavButton>
        {projects.map((_, i) => (
          <div
            key={i}
            data-carousel-control="true"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); snapTo(i) }}
            style={{
              width:  i === activeIdx ? 30 : 10,
              height: 8,
              borderRadius: 4,
              background: i === activeIdx ? '#22d3ee' : 'rgba(34,211,238,0.28)',
              cursor: 'pointer',
              transition: 'all 0.3s',
              boxShadow: i === activeIdx ? '0 0 8px #22d3ee80' : 'none',
              flexShrink: 0,
            }}
          />
        ))}
        <NavButton
          label="Next project"
          disabled={activeIdx >= projects.length - 1}
          onClick={() => snapTo(activeIdx + 1)}
        >
          ›
        </NavButton>
      </div>

    </div>
  )
}

function NavButton({
  children,
  label,
  disabled,
  onClick,
}: {
  children: string
  label: string
  disabled: boolean
  onClick: () => void
}) {
  return (
    <button
      data-carousel-control="true"
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation()
        if (!disabled) onClick()
      }}
      style={{
        width: 32,
        height: 26,
        display: 'grid',
        placeItems: 'center',
        borderRadius: 4,
        border: '1px solid rgba(34,211,238,0.28)',
        background: disabled ? 'rgba(6,12,30,0.32)' : 'rgba(6,12,30,0.82)',
        color: disabled ? 'rgba(148,163,184,0.35)' : '#67e8f9',
        cursor: disabled ? 'default' : 'pointer',
        fontSize: 22,
        lineHeight: 1,
        fontFamily: 'JetBrains Mono, monospace',
        boxShadow: disabled ? 'none' : '0 0 10px rgba(34,211,238,0.16)',
      }}
    >
      {children}
    </button>
  )
}

/* ── Individual card ───────────────────────────────────────────── */

function CarouselCard({
  project,
  isActive,
}: {
  project: Project
  isActive: boolean
}) {
  const accent = project.featured ? '#22d3ee' : '#a78bfa'

  return (
    <div
      style={{
        width: CARD_W,
        height: CARD_H,
        flexShrink: 0,
        background: 'rgba(6,12,30,0.90)',
        border: `1px solid ${accent}${isActive ? '38' : '18'}`,
        borderTop: `2px solid ${accent}`,
        borderRadius: 6,
        padding: '19px 22px 15px',
        boxSizing: 'border-box',
        position: 'relative',
        overflow: 'hidden',
        transform: `scale(${isActive ? 1 : 0.91})`,
        transition: 'transform 0.32s cubic-bezier(0.25,0.46,0.45,0.94), border-color 0.32s',
        backdropFilter: 'blur(4px)',
      }}
    >
      {/* CRT scanline */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.006) 3px, rgba(255,255,255,0.006) 4px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Shimmer on active */}
      {isActive && !reducedMotion && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(105deg, transparent 30%, rgba(34,211,238,0.03) 50%, transparent 70%)',
            backgroundSize: '200% 100%',
            animation: 'holo-shimmer 3.5s linear infinite',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />
      )}

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 9 }}>
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: accent,
              boxShadow: `0 0 6px ${accent}`,
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: accent,
              letterSpacing: 2,
              textTransform: 'uppercase',
            }}
          >
            {project.featured ? '★ FEATURED' : 'PROJECT'}
          </span>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 19,
            fontWeight: 700,
            color: '#f1f5f9',
            marginBottom: 9,
            lineHeight: 1.25,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textShadow: isActive ? `0 0 10px ${accent}44` : 'none',
          }}
        >
          {project.title}
        </div>

        {/* Description */}
        <div
          style={{
            fontSize: 13.5,
            color: '#94a3b8',
            lineHeight: 1.5,
            marginBottom: 11,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {project.description}
        </div>

        {/* Tech tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 11 }}>
          {project.techStack.slice(0, 4).map((t) => (
            <span
              key={t}
              style={{
                background: `rgba(${project.featured ? '34,211,238' : '167,139,250'},0.07)`,
                border: `1px solid ${accent}28`,
                borderRadius: 2,
                padding: '3px 8px',
                fontSize: 10.5,
                color: accent,
              }}
            >
              {t.trim()}
            </span>
          ))}
        </div>

        {/* Links */}
        <div
          style={{
            display: 'flex',
            gap: 18,
            borderTop: '1px solid rgba(34,211,238,0.07)',
            paddingTop: 10,
          }}
        >
          {project.videoUrl && (
            <a
              href={project.videoUrl}
              target="_blank"
              rel="noreferrer"
              style={{ color: '#22d3ee', fontSize: 13, textDecoration: 'none' }}
              onClick={(e) => e.stopPropagation()}
            >
              ▶ Demo
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              style={{ color: '#a78bfa', fontSize: 13, textDecoration: 'none' }}
              onClick={(e) => e.stopPropagation()}
            >
              ⌥ GitHub
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
