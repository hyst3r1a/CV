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

/**
 * Arc layout — centre card closest, outer cards pushed back.
 * This keeps all 5 HTML layers separated in depth so they don't
 * bleed into each other in screen space.
 */
const ARC_Z   = [  -1.2, -0.4,  0.8, -0.4, -1.2 ]
const CARD_X  = [  -7.5, -3.8,  0.0,  3.8,  7.5 ]

export default function ProjectHangar() {
  const { data: projects = [] } = useProjects()

  return (
    <group>
      {/* Station label */}
      <Html
        position={[0, STATION_Y + 3.4, 0]}
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
            opacity: 0.45,
            textTransform: 'uppercase',
          }}
        >
          ▣ PROJECT HANGAR
        </div>
      </Html>

      {projects.slice(0, 5).map((project, i) => (
        <ProjectCard
          key={project.id}
          project={project}
          position={new THREE.Vector3(CARD_X[i], STATION_Y, ARC_Z[i])}
          index={i}
        />
      ))}
    </group>
  )
}

function CornerBracket({ x, y }: { x: number; y: number }) {
  return (
    <div
      style={{
        position: 'absolute',
        left:   x < 0 ? 2 : undefined,
        right:  x > 0 ? 2 : undefined,
        top:    y < 0 ? 2 : undefined,
        bottom: y > 0 ? 2 : undefined,
        width:  7,
        height: 7,
        borderLeft:   x < 0 ? '1px solid rgba(34,211,238,0.45)' : undefined,
        borderRight:  x > 0 ? '1px solid rgba(34,211,238,0.45)' : undefined,
        borderTop:    y < 0 ? '1px solid rgba(34,211,238,0.45)' : undefined,
        borderBottom: y > 0 ? '1px solid rgba(34,211,238,0.45)' : undefined,
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
  const groupRef = useRef<THREE.Group>(null)
  const glowRef  = useRef<THREE.Mesh>(null)
  const accentColor = project.featured ? '#22d3ee' : '#a78bfa'

  useFrame((state) => {
    if (reducedMotion) return
    const et = state.clock.elapsedTime
    if (groupRef.current) {
      groupRef.current.position.y =
        position.y + Math.sin(et * 0.45 + index * 1.1) * 0.1
      groupRef.current.rotation.y = Math.sin(et * 0.08 + index) * 0.03
    }
    if (glowRef.current) {
      const mat = glowRef.current.material as THREE.MeshBasicMaterial
      mat.opacity = 0.5 + Math.sin(et * 1.5 + index) * 0.22
    }
  })

  return (
    <group ref={groupRef} position={position}>
      {/* Glass panel */}
      <RoundedBox args={[3.1, 2.1, 0.07]} radius={0.07} smoothness={4}>
        <meshPhysicalMaterial
          color="#060e1e"
          transparent
          opacity={0.84}
          roughness={0.06}
          metalness={0.15}
          reflectivity={0.9}
        />
      </RoundedBox>

      {/* Top glow bar */}
      <mesh ref={glowRef} position={[0, 1.0, 0.05]}>
        <planeGeometry args={[3.0, 0.05]} />
        <meshBasicMaterial color={accentColor} transparent opacity={0.7} />
      </mesh>

      {/* Bottom dim bar */}
      <mesh position={[0, -1.0, 0.05]}>
        <planeGeometry args={[3.0, 0.02]} />
        <meshBasicMaterial color={accentColor} transparent opacity={0.18} />
      </mesh>

      {/*
       * distanceFactor=13, width=240 — sized to fill the 3.1-unit card.
       * height+overflow ensure content never bleeds beyond card bounds.
       */}
      <Html center distanceFactor={13} transform style={{ width: 240, pointerEvents: 'auto' }}>
        <div
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            color: '#e2e8f0',
            userSelect: 'none',
            position: 'relative',
            overflow: 'hidden',
            height: 176,   /* matches the 2.1-unit card at this distanceFactor */
            boxSizing: 'border-box',
          }}
        >
          {/* CRT scanline overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage:
                'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(34,211,238,0.013) 3px, rgba(34,211,238,0.013) 4px)',
              pointerEvents: 'none',
              zIndex: 0,
            }}
          />

          {/* Holographic shimmer */}
          {!reducedMotion && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(105deg, transparent 30%, rgba(34,211,238,0.035) 50%, transparent 70%)',
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
          <div style={{ position: 'relative', zIndex: 1, padding: '10px 11px 8px' }}>
            {/* Type badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 4 }}>
              <div
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: '50%',
                  background: accentColor,
                  boxShadow: `0 0 6px ${accentColor}`,
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontSize: 7.5,
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
                fontSize: 11,
                fontWeight: 700,
                color: '#f1f5f9',
                marginBottom: 4,
                lineHeight: 1.25,
                textShadow: `0 0 10px ${accentColor}44`,
                /* Clamp title to 2 lines */
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {project.title}
            </div>

            <div
              style={{
                fontSize: 8,
                color: '#94a3b8',
                lineHeight: 1.5,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                marginBottom: 6,
              }}
            >
              {project.description}
            </div>

            {/* Tech tags — max 3 to stay within height */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
              {project.techStack.slice(0, 3).map((t) => (
                <span
                  key={t}
                  style={{
                    background: `rgba(${project.featured ? '34,211,238' : '167,139,250'},0.07)`,
                    border: `1px solid ${accentColor}28`,
                    borderRadius: 2,
                    padding: '1px 5px',
                    fontSize: 7,
                    color: accentColor,
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
                marginTop: 7,
                borderTop: '1px solid rgba(34,211,238,0.07)',
                paddingTop: 6,
              }}
            >
              {project.videoUrl && (
                <a
                  href={project.videoUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: '#22d3ee', fontSize: 8, textDecoration: 'none' }}
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
                  style={{ color: '#a78bfa', fontSize: 8, textDecoration: 'none' }}
                  onClick={(e) => e.stopPropagation()}
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
