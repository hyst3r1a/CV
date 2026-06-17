import { useEffect, useRef, useMemo, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html, Line, Torus } from '@react-three/drei'
import * as THREE from 'three'
import { useSkills } from '../api/hooks'
import { useStore } from '../store/useStore'

const STATION_Y = -8
const STAR_SCALE = 1.5
const LABEL_SCALE = 1.55

function readableSkillColor(color: string) {
  const hex = color.replace('#', '')
  if (hex.length !== 6) return color

  const r = Number.parseInt(hex.slice(0, 2), 16)
  const g = Number.parseInt(hex.slice(2, 4), 16)
  const b = Number.parseInt(hex.slice(4, 6), 16)
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255

  return luminance < 0.18 ? '#94a3b8' : color
}

export default function SkillConstellation() {
  const { data: skills = [] } = useSkills()
  const setSelectedSkill = useStore((s) => s.setSelectedSkill)
  const selectedSkill = useStore((s) => s.selectedSkill)
  const groupRef = useRef<THREE.Group>(null)
  const dragRef = useRef({
    active: false,
    lastX: 0,
    velocity: 0,
  })

  const nodes = useMemo(() => {
    const total = Math.min(skills.length, 16)
    return skills.slice(0, 16).map((skill, i) => {
      // Helix: 1.5 turns so nodes are spread in X/Z and staggered in Y/Z depth
      const t      = i / Math.max(total - 1, 1)
      const angle  = t * Math.PI * 3           // 1.5 full turns
      const radius = 4.0 + (i % 2) * 0.8      // alternating inner/outer ring
      const helixY = STATION_Y + (t - 0.5) * 5 // ±2.5 units vertical spread
      const helixZ = Math.cos(t * Math.PI * 2) * 1.5 // ±1.5 depth variation
      return {
        ...skill,
        pos: new THREE.Vector3(
          Math.cos(angle) * radius,
          helixY,
          Math.sin(angle) * radius + helixZ,
        ),
      }
    })
  }, [skills])

  const linePoints = useMemo(() => {
    if (nodes.length < 2) return []
    const pairs: [THREE.Vector3, THREE.Vector3][] = []
    for (let i = 0; i < nodes.length - 1; i++) {
      pairs.push([nodes[i].pos, nodes[i + 1].pos])
    }
    return pairs
  }, [nodes])

  useEffect(() => {
    const move = (e: PointerEvent) => {
      if (!dragRef.current.active || !groupRef.current) return
      e.preventDefault()

      const dx = e.clientX - dragRef.current.lastX
      dragRef.current.lastX = e.clientX
      const nextVelocity = dx * 0.0038

      groupRef.current.rotation.y += nextVelocity
      dragRef.current.velocity = nextVelocity
    }

    const release = () => {
      dragRef.current.active = false
      ;(window as Window & { __orbitSceneDragLock?: boolean }).__orbitSceneDragLock = false
    }

    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', release)
    window.addEventListener('pointercancel', release)

    return () => {
      release()
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', release)
      window.removeEventListener('pointercancel', release)
    }
  }, [])

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.04 + dragRef.current.velocity
      dragRef.current.velocity *= 0.9
    }
  })

  function startSpinDrag(e: { clientX: number; stopPropagation: () => void; preventDefault?: () => void }) {
    e.stopPropagation()
    e.preventDefault?.()
    dragRef.current.active = true
    dragRef.current.lastX = e.clientX
    dragRef.current.velocity = 0
    ;(window as Window & { __orbitSceneDragLock?: boolean }).__orbitSceneDragLock = true
  }

  return (
    <group ref={groupRef}>
      <Torus
        args={[4.8, 0.85, 8, 72]}
        position={[0, STATION_Y, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        onPointerDown={startSpinDrag}
      >
        <meshBasicMaterial transparent opacity={0.001} depthWrite={false} />
      </Torus>
      {linePoints.map((pair, i) => (
        <Line
          key={i}
          points={pair}
          color="#22d3ee"
          lineWidth={1.2}
          transparent
          opacity={0.36}
          depthWrite={false}
        />
      ))}
      {nodes.map((node) => (
        <SkillNode
          key={node.id}
          node={node}
          selected={selectedSkill === node.name}
          onSelect={() =>
            setSelectedSkill(selectedSkill === node.name ? null : node.name)
          }
          onSpinDragStart={startSpinDrag}
        />
      ))}
    </group>
  )
}

function SkillNode({
  node,
  selected,
  onSelect,
  onSpinDragStart,
}: {
  node: { name: string; proficiency: number; color: string; category: string; pos: THREE.Vector3 }
  selected: boolean
  onSelect: () => void
  onSpinDragStart: (e: { clientX: number; stopPropagation: () => void; preventDefault?: () => void }) => void
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)
  const dragStartXRef = useRef(0)

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5
      const scale = selected ? 1.5 : hovered ? 1.2 : 1
      meshRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1)
    }
  })

  const size = (0.12 + (node.proficiency / 100) * 0.18) * STAR_SCALE
  const displayColor = readableSkillColor(node.color)

  return (
    <group position={node.pos}>
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation()
          if (Math.abs(e.clientX - dragStartXRef.current) < 5) onSelect()
        }}
        onPointerDown={(e) => {
          dragStartXRef.current = e.clientX
          onSpinDragStart(e)
        }}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        <octahedronGeometry args={[size, 0]} />
        <meshStandardMaterial
          color={displayColor}
          emissive={displayColor}
          emissiveIntensity={selected ? 2.5 : hovered ? 1.5 : 0.8}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      <Html
        center
        distanceFactor={12}
        style={{ pointerEvents: 'none', userSelect: 'none' }}
      >
        <div
          style={{
            background: selected ? 'rgba(15,20,40,0.92)' : hovered ? 'rgba(15,20,40,0.80)' : 'rgba(15,20,40,0.55)',
            border: `1px solid ${displayColor}${selected ? '55' : hovered ? '44' : '22'}`,
            borderRadius: selected || hovered ? 12 : 8,
            padding: selected ? '16px 24px' : hovered ? '6px 14px' : '4px 10px',
            color: '#e2e8f0',
            whiteSpace: 'nowrap',
            fontFamily: 'JetBrains Mono, monospace',
            transition: 'all 0.2s',
          }}
        >
          <div style={{ color: displayColor, fontWeight: 700, fontSize: (selected ? 12 : hovered ? 9 : 7.5) * LABEL_SCALE }}>
            {node.name}
          </div>
          {selected && (
            <div style={{ color: '#94a3b8', marginTop: 4, fontSize: 18 }}>
              {node.category}
            </div>
          )}
        </div>
      </Html>
    </group>
  )
}
