import { Suspense } from 'react'
import { Stars } from '@react-three/drei'
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import * as THREE from 'three'
import CameraRig from './CameraRig'
import Particles from './Particles'
import SkillConstellation from './SkillConstellation'
import ProjectHangar from './ProjectHangar'
import TimelineElevator from './TimelineElevator'
import HeroStation from './HeroStation'
import BackendStation from './BackendStation'

export default function OrbitalScene() {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 5, 5]} intensity={1.5} color="#22d3ee" />
      <pointLight position={[0, -8, 5]} intensity={1.0} color="#7c3aed" />
      <pointLight position={[0, -16, 5]} intensity={1.0} color="#6366f1" />
      <pointLight position={[-8, -24, 5]} intensity={1.0} color="#22d3ee" />
      <pointLight position={[0, -32, 5]} intensity={1.2} color="#a78bfa" />

      {/* Camera driver */}
      <CameraRig />

      {/* Background */}
      <Stars radius={80} depth={60} count={3000} factor={4} saturation={0.8} fade speed={0.5} />
      <Particles />

      {/* Scene stations */}
      <Suspense fallback={null}>
        <HeroStation />
        <SkillConstellation />
        <ProjectHangar />
        <TimelineElevator />
        <BackendStation />
      </Suspense>

      {/* Postprocessing */}
      <EffectComposer>
        <Bloom
          intensity={1.2}
          luminanceThreshold={0.3}
          luminanceSmoothing={0.9}
          blendFunction={BlendFunction.SCREEN}
        />
        <ChromaticAberration
          offset={new THREE.Vector2(0.0005, 0.0005)}
          blendFunction={BlendFunction.NORMAL}
          radialModulation={false}
          modulationOffset={0}
        />
      </EffectComposer>
    </>
  )
}
