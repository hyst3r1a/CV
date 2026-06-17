import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html, Line } from '@react-three/drei'
import * as THREE from 'three'
import { useTimeline } from '../api/hooks'

const STATION_Y = -24

const TYPE_COLOR: Record<string, string> = {
  JOB: '#22d3ee',
  ACHIEVEMENT: '#f59e0b',
  AWARD: '#a78bfa',
}

export default function TimelineElevator() {
  const { data: events = [] } = useTimeline()

  const linePoints: THREE.Vector3[] = events.map((_, i) => {
    const y = STATION_Y + (i - (events.length - 1) / 2) * 1.8
    return new THREE.Vector3(0, y, 0)
  })

  return (
    <group>
      {linePoints.length > 1 && (
        <Line
          points={linePoints}
          color="#22d3ee"
          lineWidth={1}
          transparent
          opacity={0.3}
        />
      )}
      {events.map((event, i) => {
        const y = STATION_Y + (i - (events.length - 1) / 2) * 1.8
        const side = i % 2 === 0 ? 1 : -1
        return (
          <TimelineNode
            key={event.id}
            event={event}
            position={new THREE.Vector3(0, y, 0)}
            cardOffset={side * 4.5}
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
  const ref = useRef<THREE.Mesh>(null)
  const color = TYPE_COLOR[event.type] ?? '#22d3ee'

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.8
      const pulse = 0.9 + Math.sin(state.clock.elapsedTime * 2 + index) * 0.1
      ref.current.scale.setScalar(pulse)
    }
  })

  const lineEnd = new THREE.Vector3(cardOffset * 0.9, position.y, 0)

  return (
    <group position={position}>
      <mesh ref={ref}>
        <sphereGeometry args={[0.12, 8, 8]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1.5}
        />
      </mesh>

      <Line
        points={[new THREE.Vector3(0, 0, 0), lineEnd]}
        color={color}
        lineWidth={0.5}
        transparent
        opacity={0.4}
      />

      <Html
        position={[cardOffset, 0, 0]}
        center
        distanceFactor={13}
        style={{ width: 220, pointerEvents: 'none' }}
      >
        <div
          style={{
            background: 'rgba(10,15,35,0.85)',
            border: `1px solid ${color}40`,
            borderLeft: `3px solid ${color}`,
            borderRadius: 6,
            padding: '8px 12px',
            fontFamily: 'JetBrains Mono, monospace',
            userSelect: 'none',
          }}
        >
          <div style={{ color, fontSize: 10, fontWeight: 700 }}>{event.year}</div>
          <div style={{ color: '#f1f5f9', fontSize: 11, fontWeight: 600, marginTop: 2 }}>
            {event.title}
          </div>
          {event.company && (
            <div style={{ color: '#64748b', fontSize: 9, marginTop: 1 }}>
              @ {event.company}
            </div>
          )}
          <div
            style={{
              color: '#94a3b8',
              fontSize: 9,
              marginTop: 5,
              lineHeight: 1.5,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {event.description}
          </div>
        </div>
      </Html>
    </group>
  )
}
