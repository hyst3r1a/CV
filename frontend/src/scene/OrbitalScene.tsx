import { Suspense } from 'react'
import { Stars } from '@react-three/drei'
import { EffectComposer, Bloom, ChromaticAberration, Vignette, Noise } from '@react-three/postprocessing'
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
      {/* Depth fog — makes far stations dissolve cinematically */}
      <fog attach="fog" args={['#00000a', 55, 160]} />

      {/* Lighting — each station gets a signature hue */}
      <ambientLight intensity={0.25} />
      <pointLight position={[0,   0,  8]} intensity={2.0} color="#22d3ee" distance={30} />
      <pointLight position={[5,  -4,  6]} intensity={0.8} color="#6366f1" distance={25} />
      <pointLight position={[0,  -8,  8]} intensity={1.8} color="#7c3aed" distance={28} />
      <pointLight position={[-4,-12,  6]} intensity={0.6} color="#22d3ee" distance={20} />
      <pointLight position={[8, -16,  8]} intensity={1.8} color="#6366f1" distance={28} />
      <pointLight position={[-8,-16,  4]} intensity={0.7} color="#a78bfa" distance={20} />
      <pointLight position={[-8,-24,  8]} intensity={1.8} color="#22d3ee" distance={28} />
      <pointLight position={[6, -28,  6]} intensity={0.6} color="#f59e0b" distance={20} />
      <pointLight position={[0, -32,  8]} intensity={2.2} color="#a78bfa" distance={32} />
      <pointLight position={[-5,-36,  5]} intensity={0.8} color="#22d3ee" distance={22} />

      <CameraRig />

      {/* Background starfield — two-layer for parallax depth */}
      <Stars radius={90} depth={70} count={4000} factor={5}  saturation={0.9} fade speed={0.3} />
      <Stars radius={40} depth={20} count={1200} factor={2}  saturation={0.6} fade speed={0.6} />
      <Particles />

      <Suspense fallback={null}>
        <HeroStation />
        <SkillConstellation />
        <ProjectHangar />
        <TimelineElevator />
        <BackendStation />
      </Suspense>

      {/* Cinematic postprocessing stack */}
      <EffectComposer>
        <Bloom
          intensity={1.6}
          luminanceThreshold={0.25}
          luminanceSmoothing={0.85}
          blendFunction={BlendFunction.SCREEN}
        />
        <ChromaticAberration
          offset={new THREE.Vector2(0.0006, 0.0006)}
          blendFunction={BlendFunction.NORMAL}
          radialModulation={false}
          modulationOffset={0}
        />
        <Vignette
          offset={0.3}
          darkness={0.75}
          blendFunction={BlendFunction.NORMAL}
        />
        <Noise
          premultiply
          blendFunction={BlendFunction.SOFT_LIGHT}
        />
      </EffectComposer>
    </>
  )
}
