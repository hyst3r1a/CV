import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html, Line } from '@react-three/drei'
import * as THREE from 'three'
import { useTimeline } from '../api/hooks'

const STATION_Y = -24

const reducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

const TYPE_COLOR: Record<string, string> = {
  JOB:         '#22d3ee',
  ACHIEVEMENT: '#f59e0b',
  AWARD:       '#a78bfa',
}

export default function TimelineElevator() {
  const { data: events = [] } = useTimeline()

  const linePoints: THREE.Vector3[] = events.map((_, i) => {
    const y = STATION_Y + (i - (events.length - 1) / 2) * 1.9
    return new THREE.Vector3(0, y, 0)
  })

  return (
    <group>
      {/* Station label */}
      <Html
        position={[0, STATION_Y + (events.length / 2) * 1.9 + 1.0, 0]}
        center
        distanceFactor={13}
        style={{ pointerEvents: 'none' }}
      >
        <div
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 8,
            letterSpacing: 5,
            color: '#22d3ee',
            opacity: 0.45,
            textTransform: 'uppercase',
          }}
        >
          ◈ TIMELINE
        </div>
      </Html>

      {/* Main spine — glowing vertical axis */}
      {linePoints.length > 1 && (
        <Line
          points={linePoints}
          color="#22d3ee"
          lineWidth={1.2}
          transparent
          opacity={0.35}
        />
      )}

      {events.map((event, i) => {
        const y    = STATION_Y + (i - (events.length - 1) / 2) * 1.9
        const side = i % 2 === 0 ? 1 : -1
        return (
          <TimelineNode
            key={event.id}
            event={event}
            position={new THREE.Vector3(0, y, 0)}
            cardOffset={side * 4.8}
            index={i}
          />
        )
      })}
    </group>
  )
}

function TimelineNode({
  event,
  position,
  cardOffset,
  index,
}: {
  event: { year: number; title: string; company: string; description: string; type: string }
  position: THREE.Vector3
  cardOffset: number
  index: number
}) {
  const sphereRef = useRef<THREE.Mesh>(null)
  const color     = TYPE_COLOR[event.type] ?? '#22d3ee'

  useFrame((state) => {
    if (!sphereRef.current || reducedMotion) return
    const et = state.clock.elapsedTime
    sphereRef.current.rotation.y = et * 0.9
    const mat = sphereRef.current.material as THREE.MeshStandardMaterial
    mat.emissiveIntensity = 1.2 + Math.sin(et * 2 + index) * 0.6
  })

  const lineEnd = new THREE.Vector3(cardOffset * 0.88, position.y, 0)

  return (
    <group position={position}>
      {/* Node sphere */}
      <mesh ref={sphereRef}>
        <sphereGeometry args={[0.13, 12, 12]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1.5}
        />
      </mesh>

      {/* Connector line */}
      <Line
        points={[new THREE.Vector3(0, 0, 0), lineEnd]}
        color={color}
        lineWidth={0.6}
        transparent
        opacity={0.35}
      />

      {/* Glass card */}
      <Html
        position={[cardOffset, 0, 0]}
        center
        distanceFactor={13}
        style={{ width: 230, pointerEvents: 'none' }}
      >
        <div
          style={{
            background: 'rgba(6,12,30,0.88)',
            border: `1px solid ${color}22`,
            borderLeft: `3px solid ${color}`,
            borderRadius: 6,
            padding: '9px 13px',
            fontFamily: 'JetBrains Mono, monospace',
            userSelect: 'none',
            backdropFilter: 'blur(4px)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Scanline */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage:
                'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.008) 3px, rgba(255,255,255,0.008) 4px)',
              pointerEvents: 'none',
            }}
          />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ color, fontSize: 9, fontWeight: 700, letterSpacing: 1 }}>
              {event.year}
            </div>
            <div style={{ color: '#f1f5f9', fontSize: 10.5, fontWeight: 600, marginTop: 3, lineHeight: 1.3 }}>
              {event.title}
            </div>
            {event.company && (
              <div style={{ color: '#475569', fontSize: 8, marginTop: 2 }}>
                @ {event.company}
              </div>
            )}
            <div
              style={{
                color: '#64748b',
                fontSize: 8.5,
                marginTop: 5,
                lineHeight: 1.55,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {event.description}
            </div>
          </div>
        </div>
      </Html>
    </group>
  )
}
