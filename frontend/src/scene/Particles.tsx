import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const reducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Large slow-drifting nebula cloud */
function NebulaLayer() {
  const ref = useRef<THREE.Points>(null)
  const COUNT = 4000

  const { positions, colors, sizes } = useMemo(() => {
    const pos  = new Float32Array(COUNT * 3)
    const col  = new Float32Array(COUNT * 3)
    const sz   = new Float32Array(COUNT)
    for (let i = 0; i < COUNT; i++) {
      // Scatter across the full scene height (Y: -40 to +8)
      pos[i * 3]     = (Math.random() - 0.5) * 90
      pos[i * 3 + 1] = (Math.random() - 0.5) * 70 - 18
      pos[i * 3 + 2] = (Math.random() - 0.5) * 65
      sz[i] = 0.06 + Math.random() * 0.14

      // Palette: deep cyan → indigo → violet
      const t = Math.random()
      if (t < 0.4) {
        col[i * 3] = 0.05 + Math.random() * 0.1
        col[i * 3 + 1] = 0.55 + Math.random() * 0.25
        col[i * 3 + 2] = 0.85 + Math.random() * 0.15
      } else if (t < 0.75) {
        col[i * 3] = 0.3 + Math.random() * 0.2
        col[i * 3 + 1] = 0.2 + Math.random() * 0.15
        col[i * 3 + 2] = 0.8 + Math.random() * 0.2
      } else {
        col[i * 3] = 0.55 + Math.random() * 0.15
        col[i * 3 + 1] = 0.35 + Math.random() * 0.1
        col[i * 3 + 2] = 0.9 + Math.random() * 0.1
      }
    }
    return { positions: pos, colors: col, sizes: sz }
  }, [])

  useFrame((state) => {
    if (!ref.current || reducedMotion) return
    const et = state.clock.elapsedTime
    ref.current.rotation.y = et * 0.008
    ref.current.rotation.x = Math.sin(et * 0.004) * 0.04
    // Pulse opacity like a breathing nebula
    const mat = ref.current.material as THREE.PointsMaterial
    mat.opacity = 0.48 + Math.sin(et * 0.35) * 0.08
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color"    args={[colors, 3]} />
        <bufferAttribute attach="attributes-size"     args={[sizes, 1]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.12}
        vertexColors
        transparent
        opacity={0.5}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

/** Small bright sparkle layer — adds life and depth */
function SparkleLayer() {
  const ref = useRef<THREE.Points>(null)
  const COUNT = 1800

  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(COUNT * 3)
    const col = new Float32Array(COUNT * 3)
    for (let i = 0; i < COUNT; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 70
      pos[i * 3 + 1] = (Math.random() - 0.5) * 60 - 16
      pos[i * 3 + 2] = (Math.random() - 0.5) * 50
      // Bright whites and hot cyans
      const hot = Math.random() > 0.6
      col[i * 3]     = hot ? 0.6 : 0.9
      col[i * 3 + 1] = hot ? 0.95 : 0.95
      col[i * 3 + 2] = 1.0
    }
    return { positions: pos, colors: col }
  }, [])

  useFrame((state) => {
    if (!ref.current || reducedMotion) return
    const et = state.clock.elapsedTime
    ref.current.rotation.y = -et * 0.018
    ref.current.rotation.z = et * 0.006
    const mat = ref.current.material as THREE.PointsMaterial
    mat.opacity = 0.55 + Math.sin(et * 0.7 + 1.3) * 0.15
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color"    args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

export default function Particles() {
  return (
    <group>
      <NebulaLayer />
      <SparkleLayer />
    </group>
  )
}
