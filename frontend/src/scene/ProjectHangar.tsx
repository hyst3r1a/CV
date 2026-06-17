import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html, RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import { useProjects } from '../api/hooks'
import type { Project } from '../api/client'

const STATION_Y = -16

export default function ProjectHangar() {
  const { data: projects = [] } = useProjects()

  return (
    <group>
      {projects.slice(0, 5).map((project, i) => {
        const x = (i - 2) * 4.5
        return (
          <ProjectCard
            key={project.id}
            project={project}
            position={new THREE.Vector3(x, STATION_Y, 0)}
            index={i}
          />
        )
      })}
    </group>
  )
}

function ProjectCard({
  project,
  position,
  index,
}: {
  project: Project
  position: THREE.Vector3
  index: number
}) {
  const groupRef = useRef<THREE.Group>(null)
  const [expanded, setExpanded] = useState(false)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y =
        position.y + Math.sin(state.clock.elapsedTime * 0.5 + index) * 0.12
    }
  })

  return (
    <group ref={groupRef} position={position}>
      <RoundedBox args={[3.2, 2.2, 0.08]} radius={0.08} smoothness={4}>
        <meshStandardMaterial
          color="#0f1428"
          emissive="#0a0f25"
          transparent
          opacity={0.85}
          roughness={0.1}
          metalness={0.3}
        />
      </RoundedBox>

      {/* Top accent bar */}
      <mesh position={[0, 1.0, 0.05]}>
        <planeGeometry args={[3.1, 0.04]} />
        <meshBasicMaterial
          color={project.featured ? '#22d3ee' : '#6366f1'}
          transparent
          opacity={0.9}
        />
      </mesh>

      <Html
        center
        distanceFactor={14}
        transform
        style={{ width: 260 }}
      >
        <div
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            color: '#e2e8f0',
            userSelect: 'none',
            cursor: 'pointer',
          }}
          onClick={() => setExpanded(!expanded)}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: project.featured ? '#22d3ee' : '#a78bfa',
              marginBottom: 4,
              textTransform: 'uppercase',
              letterSpacing: 1,
            }}
          >
            {project.featured ? '★ FEATURED' : 'PROJECT'}
          </div>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 6, color: '#f1f5f9' }}>
            {project.title}
          </div>
          <div
            style={{
              fontSize: 9,
              color: '#94a3b8',
              lineHeight: 1.5,
              display: expanded ? 'block' : '-webkit-box',
              WebkitLineClamp: expanded ? 'unset' : 3,
              WebkitBoxOrient: 'vertical',
              overflow: expanded ? 'visible' : 'hidden',
            }}
          >
            {project.description}
          </div>

          {/* Tech tags */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3, marginTop: 8 }}>
            {project.techStack.slice(0, 4).map((t) => (
              <span
                key={t}
                style={{
                  background: 'rgba(99,102,241,0.2)',
                  border: '1px solid rgba(99,102,241,0.4)',
                  borderRadius: 3,
                  padding: '1px 5px',
                  fontSize: 8,
                  color: '#a78bfa',
                }}
              >
                {t.trim()}
              </span>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            {project.videoUrl && (
              <a
                href={project.videoUrl}
                target="_blank"
                rel="noreferrer"
                style={{ color: '#22d3ee', fontSize: 9, textDecoration: 'none' }}
                onClick={(e) => e.stopPropagation()}
              >
                ▶ Watch Demo
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                style={{ color: '#6366f1', fontSize: 9, textDecoration: 'none' }}
                onClick={(e) => e.stopPropagation()}
              >
                ⌥ GitHub
              </a>
            )}
          </div>
        </div>
      </Html>
    </group>
  )
}
