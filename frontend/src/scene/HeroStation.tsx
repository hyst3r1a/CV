import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html, Torus, Ring } from '@react-three/drei'
import * as THREE from 'three'

export default function HeroStation() {
  const ringRef = useRef<THREE.Mesh>(null)
  const ring2Ref = useRef<THREE.Mesh>(null)
  const torusRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (ringRef.current) ringRef.current.rotation.z = t * 0.3
    if (ring2Ref.current) ring2Ref.current.rotation.x = t * 0.2
    if (torusRef.current) {
      torusRef.current.rotation.x = t * 0.4
      torusRef.current.rotation.y = t * 0.25
    }
  })

  return (
    <group position={[0, 0, 0]}>
      {/* Orbital rings */}
      <Ring ref={ringRef} args={[2.2, 2.4, 64]}>
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.4} side={THREE.DoubleSide} />
      </Ring>
      <Ring ref={ring2Ref} args={[3.0, 3.15, 64]}>
        <meshBasicMaterial color="#6366f1" transparent opacity={0.25} side={THREE.DoubleSide} />
      </Ring>

      {/* Core torus */}
      <Torus ref={torusRef} args={[1.2, 0.08, 12, 64]}>
        <meshStandardMaterial
          color="#22d3ee"
          emissive="#22d3ee"
          emissiveIntensity={2}
          roughness={0.1}
          metalness={0.9}
        />
      </Torus>

      {/* Center sphere */}
      <mesh>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial
          color="#0f1428"
          emissive="#22d3ee"
          emissiveIntensity={0.5}
          roughness={0.1}
          metalness={1}
        />
      </mesh>

      {/* Hero HTML overlay */}
      <Html center distanceFactor={18} style={{ width: 400, pointerEvents: 'none' }}>
        <div
          style={{
            textAlign: 'center',
            fontFamily: 'JetBrains Mono, monospace',
            userSelect: 'none',
          }}
        >
          <div
            style={{
              fontSize: 10,
              letterSpacing: 4,
              color: '#22d3ee',
              marginBottom: 8,
              textTransform: 'uppercase',
            }}
          >
            ∴ ORBITAL CV ∴
          </div>
          <div
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: '#f1f5f9',
              lineHeight: 1.3,
              textShadow: '0 0 30px rgba(34,211,238,0.6)',
            }}
          >
            Mikle Higaran
          </div>
          <div
            style={{
              fontSize: 10,
              color: '#94a3b8',
              marginTop: 6,
              letterSpacing: 1,
            }}
          >
            XR · Omniverse · Full Stack Systems
          </div>
        </div>
      </Html>

      {/* Scroll hint */}
      <Html position={[0, -2.8, 0]} center distanceFactor={18} style={{ pointerEvents: 'none' }}>
        <div
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            color: '#475569',
            fontSize: 9,
            letterSpacing: 2,
            animation: 'pulse 2s ease-in-out infinite',
            textAlign: 'center',
          }}
        >
          SCROLL TO NAVIGATE
          <div style={{ marginTop: 4, fontSize: 14 }}>↓</div>
        </div>
      </Html>
    </group>
  )
}
