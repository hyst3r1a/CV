import { useRef, useMemo, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html, Line } from '@react-three/drei'
import * as THREE from 'three'
import { useSkills } from '../api/hooks'
import { useStore } from '../store/useStore'

const STATION_Y = -8

export default function SkillConstellation() {
  const { data: skills = [] } = useSkills()
  const setSelectedSkill = useStore((s) => s.setSelectedSkill)
  const selectedSkill = useStore((s) => s.selectedSkill)
  const groupRef = useRef<THREE.Group>(null)

  const nodes = useMemo(() => {
    return skills.slice(0, 16).map((skill, i) => {
      const angle = (i / Math.min(skills.length, 16)) * Math.PI * 2
      const radius = 3.5 + (i % 3) * 1.2
      return {
        ...skill,
        pos: new THREE.Vector3(
          Math.cos(angle) * radius,
          STATION_Y + Math.sin(i * 1.3) * 1.5,
          Math.sin(angle) * radius,
        ),
      }
    })
  }, [skills])

  const linePoints = useMemo(() => {
    if (nodes.length < 2) return []
    const pairs: [THREE.Vector3, THREE.Vector3][] = []
    nodes.forEach((n, i) => {
      const next = nodes[(i + 1) % nodes.length]
      pairs.push([n.pos, next.pos])
      if (i % 3 === 0 && i + 4 < nodes.length) {
        pairs.push([n.pos, nodes[i + 4].pos])
      }
    })
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
          lineWidth={0.4}
          transparent
          opacity={0.25}
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

  const size = 0.12 + (node.proficiency / 100) * 0.18

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
            background: selected ? 'rgba(15,20,40,0.92)' : 'rgba(15,20,40,0.6)',
            border: `1px solid ${node.color}55`,
            borderRadius: 6,
            padding: selected ? '8px 12px' : '3px 7px',
            color: '#e2e8f0',
            fontSize: selected ? 11 : 9,
            whiteSpace: 'nowrap',
            fontFamily: 'JetBrains Mono, monospace',
            transition: 'all 0.2s',
          }}
        >
          <div style={{ color: node.color, fontWeight: 700, fontSize: selected ? 12 : 9 }}>
            {node.name}
          </div>
          {selected && (
            <>
              <div style={{ color: '#94a3b8', marginTop: 2 }}>{node.category}</div>
              <div style={{ marginTop: 4, height: 4, background: '#1e293b', borderRadius: 2 }}>
                <div
                  style={{
                    height: '100%',
                    width: `${node.proficiency}%`,
                    background: `linear-gradient(90deg, ${node.color}, #22d3ee)`,
                    borderRadius: 2,
                  }}
                />
              </div>
              <div style={{ color: '#64748b', fontSize: 9, marginTop: 2 }}>
                {node.proficiency}% proficiency
              </div>
            </>
          )}
        </div>
      </Html>
    </group>
  )
}
