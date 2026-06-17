import { motion, AnimatePresence } from 'framer-motion'
import { useSystem } from '../api/hooks'
import { useStore } from '../store/useStore'

export default function BackendStatusPanel() {
  const { backendPanelOpen, setBackendPanelOpen } = useStore()
  const { data: system, isLoading, isError, refetch } = useSystem()

  return (
    <>
      {/* Floating trigger button */}
      <button
        className="fixed bottom-14 right-6 z-30 pointer-events-auto flex items-center gap-2 px-3 py-2 rounded font-mono text-xs transition-all duration-200"
        style={{
          background: 'rgba(10,15,35,0.85)',
          border: '1px solid rgba(34,211,238,0.3)',
          color: '#22d3ee',
          backdropFilter: 'blur(8px)',
          boxShadow: '0 0 16px rgba(34,211,238,0.15)',
        }}
        onClick={() => setBackendPanelOpen(!backendPanelOpen)}
      >
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: isError ? '#ef4444' : '#22d3ee',
            boxShadow: `0 0 6px ${isError ? '#ef4444' : '#22d3ee'}`,
            display: 'inline-block',
          }}
        />
        {backendPanelOpen ? 'HIDE API' : 'LIVE API'}
      </button>

      <AnimatePresence>
        {backendPanelOpen && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed right-6 bottom-28 z-30 w-72 font-mono text-xs pointer-events-auto"
            style={{
              background: 'rgba(6,12,31,0.95)',
              border: '1px solid rgba(34,211,238,0.2)',
              borderRadius: 10,
              backdropFilter: 'blur(16px)',
            }}
          >
            {/* Header */}
            <div
              style={{
                borderBottom: '1px solid rgba(34,211,238,0.15)',
                padding: '10px 14px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span className="text-cyan-400 tracking-widest">API DIAGNOSTICS</span>
              <button
                onClick={() => refetch()}
                className="text-slate-500 hover:text-cyan-400 transition-colors"
              >
                ↻ REFRESH
              </button>
            </div>

            <div style={{ padding: '12px 14px' }}>
              {isLoading && (
                <div className="text-slate-500 text-center py-4">connecting…</div>
              )}
              {isError && (
                <div className="text-red-400 text-center py-4">
                  ⚠ backend unreachable
                  <div className="text-slate-600 mt-1">start: java -jar target/*.jar</div>
                </div>
              )}
              {system && (
                <div className="space-y-2">
                  <Row label="GET /api/system" value="200 OK" color="#22c55e" />
                  <Row label="service" value={system.service} />
                  <Row label="runtime" value={system.runtime} color="#a78bfa" />
                  <Row label="orm" value={system.orm} color="#a78bfa" />
                  <Row label="database" value={system.database} color="#f59e0b" />
                  <Row label="status" value={system.status} color="#22c55e" />
                  <div
                    style={{
                      borderTop: '1px solid rgba(34,211,238,0.1)',
                      marginTop: 8,
                      paddingTop: 8,
                    }}
                  >
                    <Row label="projects" value={`${system.projectCount} records`} color="#22d3ee" />
                    <Row label="skills" value={`${system.skillCount} records`} color="#22d3ee" />
                    <Row label="timeline" value={`${system.timelineEvents} events`} color="#22d3ee" />
                    <Row label="videos" value={`${system.videoCount} records`} color="#22d3ee" />
                  </div>
                  <div
                    style={{
                      borderTop: '1px solid rgba(34,211,238,0.1)',
                      marginTop: 8,
                      paddingTop: 8,
                      color: '#334155',
                    }}
                  >
                    started {new Date(system.startedAt).toLocaleTimeString()}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function Row({
  label,
  value,
  color = '#64748b',
}: {
  label: string
  value: string
  color?: string
}) {
  return (
    <div className="flex justify-between gap-2">
      <span className="text-slate-600">{label}</span>
      <span style={{ color, textAlign: 'right' }}>{value}</span>
    </div>
  )
}
