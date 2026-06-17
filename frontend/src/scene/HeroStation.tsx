import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html, Torus, Ring } from '@react-three/drei'
import * as THREE from 'three'

const reducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

const scaleVec = new THREE.Vector3()

export default function HeroStation() {
  const ring1Ref  = useRef<THREE.Mesh>(null)
  const ring2Ref  = useRef<THREE.Mesh>(null)
  const ring3Ref  = useRef<THREE.Mesh>(null)
  const torusRef  = useRef<THREE.Mesh>(null)
  const coreRef   = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (reducedMotion) return
    const t = state.clock.elapsedTime

    if (ring1Ref.current) ring1Ref.current.rotation.z = t * 0.28
    if (ring2Ref.current) ring2Ref.current.rotation.x = t * 0.18
    if (ring3Ref.current) {
      ring3Ref.current.rotation.z = -t * 0.12
      ring3Ref.current.rotation.x = t * 0.08
    }

    if (torusRef.current) {
      torusRef.current.rotation.x = t * 0.38
      torusRef.current.rotation.y = t * 0.22
    }

    if (coreRef.current) {
      // Core sphere breathes
      const pulse = 1 + Math.sin(t * 1.6) * 0.08
      scaleVec.setScalar(pulse)
      coreRef.current.scale.lerp(scaleVec, 0.1)
      // Emissive flicker
      const mat = coreRef.current.material as THREE.MeshStandardMaterial
      mat.emissiveIntensity = 0.4 + Math.sin(t * 2.2) * 0.2
    }
  })

  return (
    <group position={[0, 0, 0]}>
      {/* Outer slow ring — largest, faintest */}
      <Ring ref={ring3Ref} args={[4.2, 4.36, 80]}>
        <meshBasicMaterial
          color="#6366f1"
          transparent
          opacity={0.12}
          side={THREE.DoubleSide}
        />
      </Ring>

      {/* Mid ring */}
      <Ring ref={ring2Ref} args={[3.0, 3.16, 72]}>
        <meshBasicMaterial
          color="#a78bfa"
          transparent
          opacity={0.2}
          side={THREE.DoubleSide}
        />
      </Ring>

      {/* Inner ring — most visible */}
      <Ring ref={ring1Ref} args={[2.2, 2.38, 64]}>
        <meshBasicMaterial
          color="#22d3ee"
          transparent
          opacity={0.45}
          side={THREE.DoubleSide}
        />
      </Ring>

      {/* Glowing torus ring */}
      <Torus ref={torusRef} args={[1.2, 0.06, 10, 72]}>
        <meshStandardMaterial
          color="#22d3ee"
          emissive="#22d3ee"
          emissiveIntensity={3}
          roughness={0.05}
          metalness={0.9}
        />
      </Torus>

      {/* Secondary torus — violet, offset axis */}
      <Torus args={[1.6, 0.035, 8, 60]} rotation={[Math.PI / 3, 0.4, 0]}>
        <meshStandardMaterial
          color="#a78bfa"
          emissive="#a78bfa"
          emissiveIntensity={2}
          roughness={0.1}
          metalness={0.8}
        />
      </Torus>

      {/* Core sphere */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.42, 40, 40]} />
        <meshStandardMaterial
          color="#080e20"
          emissive="#22d3ee"
          emissiveIntensity={0.5}
          roughness={0.05}
          metalness={1}
        />
      </mesh>

      {/* Hero HTML name plate */}
      <Html center distanceFactor={18} style={{ width: 440, pointerEvents: 'none' }}>
        <div
          style={{
            textAlign: 'center',
            fontFamily: 'JetBrains Mono, monospace',
            userSelect: 'none',
          }}
        >
          <div
            style={{
              fontSize: 9,
              letterSpacing: 5,
              color: '#22d3ee',
              marginBottom: 10,
              textTransform: 'uppercase',
              opacity: 0.8,
              animation: 'data-flicker 8s ease-in-out infinite',
            }}
          >
            ∴ ORBITAL CV ∴
          </div>
          <div
            style={{
              fontSize: 26,
              fontWeight: 700,
              color: '#f1f5f9',
              lineHeight: 1.25,
              textShadow:
                '0 0 20px rgba(34,211,238,0.7), 0 0 50px rgba(34,211,238,0.3), 0 0 80px rgba(34,211,238,0.1)',
              letterSpacing: 1,
            }}
          >
            Mikle Higaran
          </div>
          <div
            style={{
              fontSize: 9,
              color: '#7dd3fc',
              marginTop: 7,
              letterSpacing: 3,
              textTransform: 'uppercase',
              opacity: 0.75,
            }}
          >
            XR · Omniverse · Full Stack Systems
          </div>

          {/* Separator */}
          <div
            style={{
              marginTop: 14,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            <div
              style={{
                height: 1,
                width: 40,
                background: 'linear-gradient(90deg, transparent, rgba(34,211,238,0.5))',
              }}
            />
            <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#22d3ee', boxShadow: '0 0 6px #22d3ee' }} />
            <div
              style={{
                height: 1,
                width: 40,
                background: 'linear-gradient(90deg, rgba(34,211,238,0.5), transparent)',
              }}
            />
          </div>
        </div>
      </Html>

      {/* Scroll hint */}
      <Html position={[0, -3.0, 0]} center distanceFactor={18} style={{ pointerEvents: 'none' }}>
        <div
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            color: '#334155',
            fontSize: 8,
            letterSpacing: 3,
            animation: 'pulse 2.5s ease-in-out infinite',
            textAlign: 'center',
          }}
        >
          SCROLL TO NAVIGATE
          <div style={{ marginTop: 5, fontSize: 13, opacity: 0.7 }}>↓</div>
        </div>
      </Html>
    </group>
  )
}
