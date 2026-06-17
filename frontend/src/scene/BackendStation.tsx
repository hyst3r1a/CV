import { useRef, useState, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { useSystem } from '../api/hooks'
import type { SystemStatus } from '../api/client'

const STATION_Y = -78

const reducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

const BOOT_LOGS = [
  '[OK] Spring Boot context loaded',
  '[OK] Hibernate ORM initialised',
  '[OK] SQLite datasource bound',
  '[OK] Entity schema validated',
  '[OK] DataSeeder complete',
  '[OK] REST routes registered',
  '[→] GET /api/system · 200',
  '[→] GET /api/projects · 200',
  '[→] GET /api/skills · 200',
  '[→] GET /api/timeline · 200',
  '[OK] CORS origin verified',
  '[◉] cache warm · all entities',
  '[→] GET /api/health · 200',
  '[OK] JPA session factory ready',
  '[◉] uptime tracking active',
]

export default function BackendStation() {
  const { data: system, isLoading, isError } = useSystem()
  const { size } = useThree()
  const panelRef = useRef<THREE.Group>(null)
  const PANEL_W = 1040
  const PANEL_H = 760
  const isPortrait = size.width < size.height
  const panelScale = isPortrait ? Math.min(0.86, Math.max(0.58, (size.width - 28) / PANEL_W)) : 1

  useFrame((state) => {
    if (!panelRef.current || reducedMotion) return
    const et = state.clock.elapsedTime
    panelRef.current.rotation.y = Math.sin(et * 0.22) * 0.05
    panelRef.current.rotation.x = Math.cos(et * 0.15) * 0.01
  })

  return (
    <group ref={panelRef} position={[0, STATION_Y, 0]}>
      <Html center distanceFactor={20} style={{ width: PANEL_W, height: PANEL_H, overflow: 'hidden', userSelect: 'none' }}>
        <div
          style={{
            width: PANEL_W,
            height: PANEL_H,
            transform: `scale(${panelScale})`,
            transformOrigin: 'center center',
          }}
        >
          <ReactorConsole system={system} isLoading={isLoading} isError={isError} />
        </div>
      </Html>
    </group>
  )
}

function ReactorConsole({
  system,
  isLoading,
  isError,
}: {
  system: SystemStatus | undefined
  isLoading: boolean
  isError: boolean
}) {
  const hexRef     = useRef<HTMLSpanElement>(null)
  const uptimeRef  = useRef<HTMLSpanElement>(null)
  const [logs, setLogs] = useState<string[]>(BOOT_LOGS.slice(0, 5))

  // Hex counter — direct DOM mutation, no re-render cost
  useEffect(() => {
    if (reducedMotion || isLoading || isError) return
    const id = setInterval(() => {
      if (hexRef.current) {
        hexRef.current.textContent =
          '0x' + Math.floor(Math.random() * 0xffff).toString(16).toUpperCase().padStart(4, '0')
      }
    }, 130)
    return () => clearInterval(id)
  }, [isLoading, isError])

  // Uptime counter
  useEffect(() => {
    if (!system) return
    const started = new Date(system.startedAt).getTime()
    const id = setInterval(() => {
      if (uptimeRef.current) {
        const secs = Math.floor((Date.now() - started) / 1000)
        const h = String(Math.floor(secs / 3600)).padStart(2, '0')
        const m = String(Math.floor((secs % 3600) / 60)).padStart(2, '0')
        const s = String(secs % 60).padStart(2, '0')
        uptimeRef.current.textContent = `${h}:${m}:${s}`
      }
    }, 1000)
    return () => clearInterval(id)
  }, [system])

  // Rolling log feed
  useEffect(() => {
    if (reducedMotion) return
    let idx = 5
    const id = setInterval(() => {
      setLogs((prev) => [...prev.slice(-6), BOOT_LOGS[idx++ % BOOT_LOGS.length]])
    }, 1800)
    return () => clearInterval(id)
  }, [])

  const statusColor = isError ? '#ef4444' : isLoading ? '#f59e0b' : '#22c55e'

  return (
    <div
      style={{
        fontFamily: 'JetBrains Mono, monospace',
        color: '#cbd5e1',
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
        height: '100%',
        boxSizing: 'border-box',
        padding: '25px 32px',
      }}
    >
      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* ── Header ── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 22,
            paddingBottom: 18,
            borderBottom: '1px solid rgba(34,211,238,0.18)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                background: statusColor,
                boxShadow: `0 0 10px ${statusColor}`,
                animation: 'status-led 1.8s ease-in-out infinite',
              }}
            />
            <span style={{ color: '#22d3ee', fontSize: 19, fontWeight: 700, letterSpacing: 2 }}>
              BACKEND REACTOR
            </span>
            <span style={{ color: '#334155', fontSize: 14 }}>//</span>
            <span style={{ color: '#475569', fontSize: 14 }}>DIAGNOSTICS</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16, color: '#334155', fontSize: 14 }}>
            <span>
              ADDR:{' '}
              <span
                ref={hexRef}
                style={{
                  color: '#22d3ee',
                  animation: reducedMotion ? 'none' : 'data-flicker 7s ease-in-out infinite',
                }}
              >
                0x0000
              </span>
            </span>
            <span style={{ color: '#22d3ee', animation: 'blink-cursor 1s step-end infinite' }}>▋</span>
          </div>
        </div>

        {isLoading && (
          <div style={{ color: '#475569', fontSize: 16, textAlign: 'center', padding: 40 }}>
            <span style={{ animation: 'data-flicker 1.5s ease-in-out infinite' }}>
              connecting to Spring Boot service…
            </span>
          </div>
        )}

        {isError && (
          <div style={{ color: '#ef4444', fontSize: 16, textAlign: 'center', padding: 40 }}>
            <div style={{ marginBottom: 4 }}>⚠ BACKEND OFFLINE</div>
            <div style={{ color: '#475569', fontSize: 13 }}>
              start: java -jar target/orbitcv-1.0.0.jar
            </div>
          </div>
        )}

        {system && (
          <>
            {/* ── Metrics grid ── */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: '19px 40px',
                marginBottom: 24,
              }}
            >
              <MetricCell label="SERVICE"  value={system.service}           color="#22d3ee" />
              <MetricCell label="STATUS"   value={system.status.toUpperCase()} color="#22c55e" pulse />
              <MetricCell label="VERSION"  value={system.version}           color="#475569" />
              <MetricCell label="RUNTIME"  value={system.runtime}           color="#a78bfa" />
              <MetricCell label="ORM"      value={system.orm}               color="#a78bfa" />
              <MetricCell label="DATABASE" value={system.database}          color="#f59e0b" />
            </div>

            {/* ── Count meters ── */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px 40px',
                marginBottom: 24,
                paddingTop: 18,
                borderTop: '1px solid rgba(34,211,238,0.1)',
              }}
            >
              <CountBar label="PROJECTS"       count={system.projectCount}   max={20} color="#22d3ee" />
              <CountBar label="SKILLS"         count={system.skillCount}     max={30} color="#6366f1" />
              <CountBar label="TIMELINE"       count={system.timelineEvents} max={20} color="#f59e0b" />
              <CountBar label="VIDEOS"         count={system.videoCount}     max={10} color="#a78bfa" />
            </div>

            {/* ── Uptime / origin ── */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingTop: 15,
                borderTop: '1px solid rgba(34,211,238,0.08)',
                marginBottom: 22,
              }}
            >
              <div style={{ fontSize: 13, color: '#334155' }}>
                <span style={{ color: '#475569' }}>STARTED</span>{' '}
                {new Date(system.startedAt).toLocaleTimeString()}
              </div>
              <div style={{ fontSize: 13, color: '#334155' }}>
                <span style={{ color: '#475569' }}>UPTIME</span>{' '}
                <span ref={uptimeRef} style={{ color: '#22c55e' }}>00:00:00</span>
              </div>
              <div style={{ fontSize: 13, color: '#334155', maxWidth: 290, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                <span style={{ color: '#475569' }}>ORIGIN</span>{' '}
                <span style={{ color: '#6366f1' }}>{system.frontendOrigin}</span>
              </div>
            </div>
          </>
        )}

        {/* ── Live log feed ── */}
        <div
          style={{
            borderTop: '1px solid rgba(34,211,238,0.1)',
            paddingTop: 15,
          }}
        >
          <div style={{ color: '#334155', fontSize: 12.5, letterSpacing: 1, marginBottom: 10 }}>
            ▸ SYSTEM LOG
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {logs.slice(-5).map((line, i) => (
              <div
                key={`${line}-${i}`}
                style={{
                  fontSize: 13,
                  color: line.startsWith('[OK]')
                    ? '#22c55e'
                    : line.startsWith('[→]')
                    ? '#22d3ee'
                    : '#a78bfa',
                  animation: i === logs.slice(-5).length - 1 ? 'log-tick-in 0.3s ease-out' : 'none',
                  opacity: 0.5 + i * 0.1,
                }}
              >
                {line}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function MetricCell({
  label,
  value,
  color,
  pulse,
}: {
  label: string
  value: string
  color: string
  pulse?: boolean
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <span style={{ color: '#2d3f56', fontSize: 12.5, letterSpacing: 1 }}>{label}</span>
      <span
        style={{
          color,
          fontSize: 16,
          fontWeight: 600,
          animation: pulse ? 'data-flicker 6s ease-in-out infinite' : 'none',
        }}
      >
        {value}
      </span>
    </div>
  )
}

function CountBar({
  label,
  count,
  max,
  color,
}: {
  label: string
  count: number
  max: number
  color: string
}) {
  const pct = Math.min(100, (count / max) * 100)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: 12.5,
          color: '#2d3f56',
        }}
      >
        <span style={{ letterSpacing: 1 }}>{label}</span>
        <span style={{ color }}>{count}</span>
      </div>
      <div
        style={{
          height: 6,
          background: 'rgba(255,255,255,0.05)',
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${pct}%`,
            background: `linear-gradient(90deg, ${color}80, ${color})`,
            borderRadius: 2,
            boxShadow: `0 0 6px ${color}60`,
            transition: 'width 1s ease',
          }}
        />
      </div>
    </div>
  )
}
