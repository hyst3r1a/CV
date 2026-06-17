import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useStore } from '../store/useStore'

const stations = [
  { position: new THREE.Vector3(0,   0,  12), lookAt: new THREE.Vector3(0,   0,  0) },
  { position: new THREE.Vector3(4,  -8,  12), lookAt: new THREE.Vector3(0,  -8,  0) },
  { position: new THREE.Vector3(0, -19,  18), lookAt: new THREE.Vector3(0, -19,  0) },
  { position: new THREE.Vector3(-5,-43,  17), lookAt: new THREE.Vector3(0, -43,  0) },
  { position: new THREE.Vector3(0, -78,  16), lookAt: new THREE.Vector3(0, -78,  0) },
]

/** Cubic smoothstep — eliminates linear ramp feel between stations */
function smoothstep(t: number): number {
  const c = Math.max(0, Math.min(1, t))
  return c * c * (3 - 2 * c)
}

const reducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Pre-allocated scratch vectors — zero GC pressure per frame
const targetPos  = new THREE.Vector3()
const targetLook = new THREE.Vector3()
const currentLook = new THREE.Vector3()
const sway        = new THREE.Vector3()
const swayedPos   = new THREE.Vector3()

export default function CameraRig() {
  const { camera, size } = useThree()
  const scrollProgress = useStore((s) => s.scrollProgress)
  const initialized = useRef(false)

  useFrame((state) => {
    const isPortrait = size.width < size.height
    const perspective = camera as THREE.PerspectiveCamera
    const targetFov = isPortrait ? 64 : 58

    if (Math.abs(perspective.fov - targetFov) > 0.01) {
      perspective.fov = THREE.MathUtils.lerp(perspective.fov, targetFov, 0.08)
      perspective.updateProjectionMatrix()
    }

    const t    = scrollProgress * (stations.length - 1)
    const from = Math.floor(t)
    const to   = Math.min(Math.ceil(t), stations.length - 1)
    const alpha = smoothstep(t - from)

    targetPos.lerpVectors(stations[from].position, stations[to].position, alpha)
    targetLook.lerpVectors(stations[from].lookAt,  stations[to].lookAt,  alpha)

    if (!initialized.current) {
      camera.position.copy(stations[0].position)
      currentLook.copy(stations[0].lookAt)
      initialized.current = true
    }

    if (!reducedMotion) {
      // Slow sinusoidal orbital drift — gives the scene a "breathing" quality
      const et = state.clock.elapsedTime
      sway.set(
        Math.sin(et * 0.13) * 0.28,
        Math.cos(et * 0.09) * 0.13,
        Math.sin(et * 0.07) * 0.1,
      )
      swayedPos.copy(targetPos).add(sway)
    } else {
      swayedPos.copy(targetPos)
    }

    if (isPortrait) {
      swayedPos.z += 2
    }

    camera.position.lerp(swayedPos, 0.055)
    currentLook.lerp(targetLook, 0.055)
    camera.lookAt(currentLook)
  })

  return null
}

export { stations }
