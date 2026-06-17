import { useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html, Line } from '@react-three/drei'
import * as THREE from 'three'
import { useTimeline } from '../api/hooks'

const STATION_Y = -30

const reducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

const TYPE_COLOR: Record<string, string> = {
  JOB:         '#22d3ee',
  ACHIEVEMENT: '#f59e0b',
  AWARD:       '#a78bfa',
}

const CARD_FLOAT_RADIUS = 0.36
const CARD_EDGE_RATIO = 0.12

function randomPointInSphere(radius: number) {
  const v = new THREE.Vector3(
    Math.random() * 2 - 1,
    Math.random() * 2 - 1,
    Math.random() * 2 - 1,
  )

  if (v.lengthSq() === 0) return v
  return v.normalize().multiplyScalar(Math.random() * radius)
}

export default function TimelineElevator() {
  const { data: events = [] } = useTimeline()
  const [expandedEventId, setExpandedEventId] = useState<number | null>(null)

  // Min 2.2 units per entry so cards never crowd; cap at 3.0 for short lists
  const spacing = Math.min(3.0, Math.max(2.2, 20.0 / Math.max(events.length, 1)))

  const linePoints: THREE.Vector3[] = events.map((_, i) => {
    const y = STATION_Y + (i - (events.length - 1) / 2) * spacing
    return new THREE.Vector3(0, y, 0)
  })

  return (
    <group>
      {/* Station label */}
      <Html
        position={[0, STATION_Y + (events.length / 2) * spacing + 1.0, 0]}
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
        const y    = STATION_Y + (i - (events.length - 1) / 2) * spacing
        const side = i % 2 === 0 ? 1 : -1
        return (
          <TimelineNode
            key={event.id}
            event={event}
            position={new THREE.Vector3(0, y, 0)}
            cardOffset={side * 4.8}
            index={i}
            expanded={expandedEventId === event.id}
            onToggle={() => setExpandedEventId(expandedEventId === event.id ? null : event.id)}
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
  expanded,
  onToggle,
}: {
  event: { id: number; year: number; title: string; company: string; description: string; type: string }
  position: THREE.Vector3
  cardOffset: number
  index: number
  expanded: boolean
  onToggle: () => void
}) {
  const sphereRef = useRef<THREE.Mesh>(null)
  const cardGroupRef = useRef<THREE.Group>(null)
  const connectorRef = useRef<THREE.Line>(null)
  const cardPositionRef = useRef(new THREE.Vector3(cardOffset, 0, 0))
  const targetPositionRef = useRef(new THREE.Vector3(cardOffset, 0, 0))
  const nextTargetAtRef = useRef(0)
  const color     = TYPE_COLOR[event.type] ?? '#22d3ee'
  const connectorGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute([0, 0, 0, cardOffset * 0.88, 0, 0], 3),
    )
    return geometry
  }, [cardOffset])

  const connectorLine = useMemo(() => {
    const material = new THREE.LineBasicMaterial({
      color,
      transparent: true,
      opacity: 0.35,
    })

    return new THREE.Line(connectorGeometry, material)
  }, [connectorGeometry, color])

  useFrame((state, delta) => {
    if (reducedMotion) return
    const et = state.clock.elapsedTime

    if (sphereRef.current) {
      sphereRef.current.rotation.y = et * 0.9
      const mat = sphereRef.current.material as THREE.MeshStandardMaterial
      mat.emissiveIntensity = 1.2 + Math.sin(et * 2 + index) * 0.6
    }

    if (!cardGroupRef.current || !connectorRef.current) return

    if (
      et >= nextTargetAtRef.current ||
      cardPositionRef.current.distanceToSquared(targetPositionRef.current) < 0.002
    ) {
      targetPositionRef.current
        .set(cardOffset, 0, 0)
        .add(randomPointInSphere(CARD_FLOAT_RADIUS))
      nextTargetAtRef.current = et + 1.6 + Math.random() * 1.4
    }

    cardPositionRef.current.lerp(targetPositionRef.current, Math.min(delta * 0.75, 1))
    cardGroupRef.current.position.copy(cardPositionRef.current)

    const side = Math.sign(cardOffset) || 1
    const lineEnd = cardPositionRef.current.clone()
    lineEnd.x -= side * Math.abs(cardOffset) * CARD_EDGE_RATIO

    const position = connectorRef.current.geometry.attributes.position as THREE.BufferAttribute
    position.setXYZ(1, lineEnd.x, lineEnd.y, lineEnd.z)
    position.needsUpdate = true
    connectorRef.current.geometry.computeBoundingSphere()
  })

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
      <primitive ref={connectorRef} object={connectorLine} />

      {/* Glass card */}
      <group ref={cardGroupRef} position={[cardOffset, 0, 0]}>
        <Html
          center
          distanceFactor={13}
          style={{ width: expanded ? 310 : 230, pointerEvents: 'auto' }}
        >
          <div
            data-no-page-drag="true"
            onClick={(e) => {
              e.stopPropagation()
              onToggle()
            }}
            style={{
              background: 'rgba(6,12,30,0.88)',
              border: `1px solid ${color}${expanded ? '55' : '22'}`,
              borderLeft: `3px solid ${color}`,
              borderRadius: 6,
              padding: expanded ? '16px 20px 18px' : '14px 20px',
              fontFamily: 'JetBrains Mono, monospace',
              userSelect: 'none',
              backdropFilter: 'blur(4px)',
              position: 'relative',
              overflow: 'hidden',
              cursor: 'pointer',
              boxShadow: expanded ? `0 0 24px ${color}18` : 'none',
              transition: 'width 0.22s ease, padding 0.22s ease, border-color 0.22s ease, box-shadow 0.22s ease',
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
              <div style={{ color, fontSize: 13, fontWeight: 700, letterSpacing: 1 }}>
                {event.year}
              </div>
              <div style={{ color: '#f1f5f9', fontSize: 15.5, fontWeight: 600, marginTop: 4, lineHeight: 1.3 }}>
                {event.title}
              </div>
              {event.company && (
                <div style={{ color: '#475569', fontSize: 12, marginTop: 3 }}>
                  @ {event.company}
                </div>
              )}
              <div
                style={{
                  color: expanded ? '#94a3b8' : '#64748b',
                  fontSize: 13,
                  marginTop: 7,
                  lineHeight: 1.55,
                  display: expanded ? 'block' : '-webkit-box',
                  WebkitLineClamp: expanded ? 'unset' : 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  transition: 'color 0.22s ease',
                }}
              >
                {event.description}
              </div>
            </div>
          </div>
        </Html>
      </group>
    </group>
  )
}
