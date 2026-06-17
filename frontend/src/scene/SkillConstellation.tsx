import { useRef, useMemo, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html, Line } from '@react-three/drei'
import * as THREE from 'three'
import { useSkills } from '../api/hooks'
import { useStore } from '../store/useStore'

const STATION_Y = -8
const STAR_SCALE = 1.5
const LABEL_SCALE = 2

export default function SkillConstellation() {
  const { data: skills = [] } = useSkills()
  const setSelectedSkill = useStore((s) => s.setSelectedSkill)
  const selectedSkill = useStore((s) => s.selectedSkill)
  const groupRef = useRef<THREE.Group>(null)

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

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.04
    }
  })

  return (
    <group ref={groupRef}>
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
        />
      ))}
    </group>
  )
}

function SkillNode({
  node,
  selected,
  onSelect,
}: {
  node: { name: string; proficiency: number; color: string; category: string; pos: THREE.Vector3 }
  selected: boolean
  onSelect: () => void
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5
      const scale = selected ? 1.5 : hovered ? 1.2 : 1
      meshRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1)
    }
  })

  const size = (0.12 + (node.proficiency / 100) * 0.18) * STAR_SCALE

  return (
    <group position={node.pos}>
      <mesh
        ref={meshRef}
        onClick={(e) => { e.stopPropagation(); onSelect() }}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        <octahedronGeometry args={[size, 0]} />
        <meshStandardMaterial
          color={node.color}
          emissive={node.color}
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
            border: `1px solid ${node.color}${selected ? '55' : hovered ? '44' : '22'}`,
            borderRadius: selected || hovered ? 12 : 8,
            padding: selected ? '16px 24px' : hovered ? '6px 14px' : '4px 10px',
            color: '#e2e8f0',
            whiteSpace: 'nowrap',
            fontFamily: 'JetBrains Mono, monospace',
            transition: 'all 0.2s',
          }}
        >
          <div style={{ color: node.color, fontWeight: 700, fontSize: (selected ? 12 : hovered ? 9 : 7.5) * LABEL_SCALE }}>
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
