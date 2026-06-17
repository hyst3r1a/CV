import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useStore } from '../store/useStore'

const stations = [
  { position: new THREE.Vector3(0, 0, 12), lookAt: new THREE.Vector3(0, 0, 0) },
  { position: new THREE.Vector3(0, -8, 10), lookAt: new THREE.Vector3(0, -8, 0) },
  { position: new THREE.Vector3(8, -16, 10), lookAt: new THREE.Vector3(0, -16, 0) },
  { position: new THREE.Vector3(-8, -24, 10), lookAt: new THREE.Vector3(0, -24, 0) },
  { position: new THREE.Vector3(0, -32, 12), lookAt: new THREE.Vector3(0, -32, 0) },
]

const targetPos = new THREE.Vector3()
const targetLook = new THREE.Vector3()
const currentLook = new THREE.Vector3()

export default function CameraRig() {
  const { camera } = useThree()
  const scrollProgress = useStore((s) => s.scrollProgress)
  const initialized = useRef(false)

  useFrame(() => {
    const t = scrollProgress * (stations.length - 1)
    const from = Math.floor(t)
    const to = Math.min(Math.ceil(t), stations.length - 1)
    const alpha = t - from

    targetPos.lerpVectors(stations[from].position, stations[to].position, alpha)
    targetLook.lerpVectors(stations[from].lookAt, stations[to].lookAt, alpha)

    if (!initialized.current) {
      camera.position.copy(stations[0].position)
      initialized.current = true
    }

    camera.position.lerp(targetPos, 0.06)
    currentLook.lerp(targetLook, 0.06)
    camera.lookAt(currentLook)
  })

  return null
}

export { stations }
