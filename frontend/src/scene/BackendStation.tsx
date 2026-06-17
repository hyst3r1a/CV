import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html, RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import { useSystem } from '../api/hooks'

const STATION_Y = -32

export default function BackendStation() {
  const { data: system, isLoading, isError } = useSystem()
  const panelRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (panelRef.current) {
      panelRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.06
    }
  })

  return (
    <group ref={panelRef} position={[0, STATION_Y, 0]}>
      {/* Main panel */}
      <RoundedBox args={[7, 5, 0.1]} radius={0.12} smoothness={4}>
        <meshStandardMaterial
          color="#060c1f"
          emissive="#0a1530"
          transparent
          opacity={0.9}
          roughness={0.05}
          metalness={0.4}
        />
      </RoundedBox>

      {/* Top edge glow */}
      <mesh position={[0, 2.42, 0.06]}>
        <planeGeometry args={[6.8, 0.06]} />
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.8} />
      </mesh>

      <Html center distanceFactor={12} transform style={{ width: 520, userSelect: 'none' }}>
        <ReactorPanel system={system} isLoading={isLoading} isError={isError} />
      </Html>
    </group>
  )
}

function ReactorPanel({
  system,
  isLoading,
  isError,
}: {
  system: import('../api/client').SystemStatus | undefined
  isLoading: boolean
  isError: boolean
}) {
  return (
    <div
      style={{
        fontFamily: 'JetBrains Mono, monospace',
        color: '#e2e8f0',
        padding: '0 8px',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 14,
          borderBottom: '1px solid rgba(34,211,238,0.2)',
          paddingBottom: 10,
        }}
      >
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: isError ? '#ef4444' : isLoading ? '#f59e0b' : '#22d3ee',
            boxShadow: `0 0 10px ${isError ? '#ef4444' : isLoading ? '#f59e0b' : '#22d3ee'}`,
            animation: 'pulse 2s ease-in-out infinite',
          }}
        />
        <span style={{ color: '#22d3ee', fontSize: 12, fontWeight: 700, letterSpacing: 2 }}>
          BACKEND REACTOR DIAGNOSTICS
        </span>
      </div>

      {isLoading && (
        <div style={{ color: '#475569', fontSize: 10, textAlign: 'center', padding: 20 }}>
          connecting to Spring Boot service…
        </div>
      )}
      {isError && (
        <div style={{ color: '#ef4444', fontSize: 10, textAlign: 'center', padding: 20 }}>
          ⚠ backend offline — start the Spring Boot service
        </div>
      )}

      {system && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 20px' }}>
          <MetricRow label="SERVICE" value={system.service} color="#22d3ee" />
          <MetricRow label="STATUS" value={system.status.toUpperCase()} color="#22c55e" />
          <MetricRow label="RUNTIME" value={system.runtime} color="#a78bfa" />
          <MetricRow label="ORM" value={system.orm} color="#a78bfa" />
          <MetricRow label="DATABASE" value={system.database} color="#f59e0b" />
          <MetricRow label="VERSION" value={system.version} color="#64748b" />
          <MetricRow label="PROJECTS" value={String(system.projectCount)} color="#22d3ee" />
          <MetricRow label="SKILLS" value={String(system.skillCount)} color="#22d3ee" />
          <MetricRow label="TIMELINE EVENTS" value={String(system.timelineEvents)} color="#22d3ee" />
          <MetricRow label="VIDEOS" value={String(system.videoCount)} color="#22d3ee" />
          <div style={{ gridColumn: '1 / -1' }}>
            <MetricRow
              label="STARTED AT"
              value={new Date(system.startedAt).toLocaleTimeString()}
              color="#475569"
            />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <MetricRow
              label="FRONTEND ORIGIN"
              value={system.frontendOrigin}
              color="#6366f1"
            />
          </div>
        </div>
      )}
    </div>
  )
}

function MetricRow({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      <span style={{ color: '#334155', fontSize: 8, letterSpacing: 1 }}>{label}</span>
      <span style={{ color, fontSize: 10, fontWeight: 600 }}>{value}</span>
    </div>
  )
}
