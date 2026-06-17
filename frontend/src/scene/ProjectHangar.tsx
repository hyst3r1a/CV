import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html, RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import { useProjects } from '../api/hooks'
import type { Project } from '../api/client'

const STATION_Y = -16

const reducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function ProjectHangar() {
  const { data: projects = [] } = useProjects()

  return (
    <group>
      {/* Station label */}
      <Html
        position={[0, STATION_Y + 3.6, 0]}
        center
        distanceFactor={14}
        style={{ pointerEvents: 'none' }}
      >
        <div
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 8,
            letterSpacing: 5,
            color: '#22d3ee',
            opacity: 0.5,
            textTransform: 'uppercase',
          }}
        >
          ▣ PROJECT HANGAR
        </div>
      </Html>

      {projects.slice(0, 5).map((project, i) => {
        const x = (i - 2) * 4.6
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

function CornerBracket({ x, y }: { x: number; y: number }) {
  const size = 6
  const sx = x < 0 ? 1 : -1
  const sy = y < 0 ? 1 : -1
  return (
    <div
      style={{
        position: 'absolute',
        left:   x < 0 ? 0 : undefined,
        right:  x > 0 ? 0 : undefined,
        top:    y < 0 ? 0 : undefined,
        bottom: y > 0 ? 0 : undefined,
        width:  size,
        height: size,
        borderLeft:   sx > 0 ? '1px solid rgba(34,211,238,0.5)' : undefined,
        borderRight:  sx < 0 ? '1px solid rgba(34,211,238,0.5)' : undefined,
        borderTop:    sy > 0 ? '1px solid rgba(34,211,238,0.5)' : undefined,
        borderBottom: sy < 0 ? '1px solid rgba(34,211,238,0.5)' : undefined,
      }}
    />
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
  const groupRef  = useRef<THREE.Group>(null)
  const glowRef   = useRef<THREE.Mesh>(null)
  const accentColor = project.featured ? '#22d3ee' : '#a78bfa'

  useFrame((state) => {
    if (reducedMotion) return
    const et = state.clock.elapsedTime
    if (groupRef.current) {
      groupRef.current.position.y =
        position.y + Math.sin(et * 0.45 + index * 1.1) * 0.14
      // Subtle tilt toward camera center
      groupRef.current.rotation.y = Math.sin(et * 0.08 + index) * 0.04
    }
    if (glowRef.current) {
      const mat = glowRef.current.material as THREE.MeshBasicMaterial
      mat.opacity = 0.5 + Math.sin(et * 1.5 + index) * 0.25
    }
  })

  return (
    <group ref={groupRef} position={position}>
      {/* Glass panel body */}
      <RoundedBox args={[3.3, 2.3, 0.07]} radius={0.07} smoothness={4}>
        <meshPhysicalMaterial
          color="#060e1e"
          transparent
          opacity={0.82}
          roughness={0.06}
          metalness={0.15}
          reflectivity={0.9}
        />
      </RoundedBox>

      {/* Top accent glow bar */}
      <mesh ref={glowRef} position={[0, 1.08, 0.05]}>
        <planeGeometry args={[3.18, 0.05]} />
        <meshBasicMaterial
          color={accentColor}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* Bottom dim bar */}
      <mesh position={[0, -1.08, 0.05]}>
        <planeGeometry args={[3.18, 0.02]} />
        <meshBasicMaterial color={accentColor} transparent opacity={0.2} />
      </mesh>

      <Html center distanceFactor={14} transform style={{ width: 270 }}>
        <div
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            color: '#e2e8f0',
            userSelect: 'none',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Holographic scanline overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage:
                'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(34,211,238,0.015) 3px, rgba(34,211,238,0.015) 4px)',
              pointerEvents: 'none',
              zIndex: 0,
            }}
          />

          {/* Animated shimmer stripe */}
          {!reducedMotion && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(105deg, transparent 30%, rgba(34,211,238,0.04) 50%, transparent 70%)',
                backgroundSize: '200% 100%',
                animation: 'holo-shimmer 3.5s linear infinite',
                pointerEvents: 'none',
                zIndex: 0,
              }}
            />
          )}

          {/* Corner brackets */}
          <CornerBracket x={-1} y={-1} />
          <CornerBracket x={1}  y={-1} />
          <CornerBracket x={-1} y={1}  />
          <CornerBracket x={1}  y={1}  />

          {/* Content */}
          <div style={{ position: 'relative', zIndex: 1 }}>
            {/* Type badge */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                marginBottom: 5,
              }}
            >
              <div
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: '50%',
                  background: accentColor,
                  boxShadow: `0 0 6px ${accentColor}`,
                  animation: 'status-led 2s ease-in-out infinite',
                }}
              />
              <span
                style={{
                  fontSize: 8,
                  fontWeight: 700,
                  color: accentColor,
                  letterSpacing: 2,
                  textTransform: 'uppercase',
                }}
              >
                {project.featured ? '★ FEATURED' : 'PROJECT'}
              </span>
            </div>

            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: '#f1f5f9',
                marginBottom: 5,
                textShadow: `0 0 12px ${accentColor}55`,
                lineHeight: 1.3,
              }}
            >
              {project.title}
            </div>

            <div
              style={{
                fontSize: 8.5,
                color: '#94a3b8',
                lineHeight: 1.55,
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {project.description}
            </div>

            {/* Tech tags */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3, marginTop: 7 }}>
              {project.techStack.slice(0, 4).map((t) => (
                <span
                  key={t}
                  style={{
                    background: `rgba(${project.featured ? '34,211,238' : '167,139,250'},0.08)`,
                    border: `1px solid ${accentColor}30`,
                    borderRadius: 2,
                    padding: '1px 5px',
                    fontSize: 7.5,
                    color: accentColor,
                    letterSpacing: 0.5,
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
                gap: 10,
                marginTop: 8,
                borderTop: '1px solid rgba(34,211,238,0.08)',
                paddingTop: 7,
              }}
            >
              {project.videoUrl && (
                <a
                  href={project.videoUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    color: '#22d3ee',
                    fontSize: 8,
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 3,
                    pointerEvents: 'auto',
                  }}
                >
                  ▶ Demo
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    color: '#a78bfa',
                    fontSize: 8,
                    textDecoration: 'none',
                    pointerEvents: 'auto',
                  }}
                >
                  ⌥ GitHub
                </a>
              )}
            </div>
          </div>
        </div>
      </Html>
    </group>
  )
}
