import { useStore } from '../store/useStore'
import { useSystem } from '../api/hooks'

const STATIONS = [
  { label: 'DOCKING BAY', icon: '◎' },
  { label: 'SKILL MAP', icon: '✦' },
  { label: 'HANGAR', icon: '▣' },
  { label: 'TIMELINE', icon: '◈' },
  { label: 'REACTOR', icon: '⬡' },
]

export default function Hud() {
  const { currentStation, scrollProgress, toggleRecruiterMode, recruiterMode } = useStore()
  const { data: system, isError: apiError, isLoading: apiLoading } = useSystem()

  return (
    <div className="fixed inset-0 pointer-events-none z-20 select-none">
      {/* Top bar */}
      <div
        className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 py-3"
        style={{ borderBottom: '1px solid rgba(34,211,238,0.1)' }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-2 h-2 rounded-full bg-cyan-400"
            style={{ boxShadow: '0 0 8px #22d3ee', animation: 'pulse 2s infinite' }}
          />
          <span className="text-xs text-cyan-400 tracking-widest font-mono">ORBITAL CV</span>
          <div className="flex items-center gap-1.5 font-mono text-xs" style={{ color: apiError ? '#f59e0b' : system ? '#22c55e' : '#475569' }}>
            <span style={{
              width: 5, height: 5, borderRadius: '50%', display: 'inline-block',
              background: apiError ? '#f59e0b' : system ? '#22c55e' : '#475569',
              boxShadow: system && !apiError ? '0 0 5px #22c55e' : 'none',
            }} />
            {apiLoading ? 'API…' : apiError ? 'WARMING UP' : 'SPRING BOOT LIVE'}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-slate-500 font-mono">
            {STATIONS[currentStation]?.label ?? ''}
          </span>
          <button
            className="pointer-events-auto text-xs font-mono px-3 py-1 rounded border transition-all duration-200"
            style={{
              background: recruiterMode ? 'rgba(34,211,238,0.15)' : 'rgba(15,20,40,0.6)',
              borderColor: recruiterMode ? '#22d3ee' : 'rgba(99,102,241,0.4)',
              color: recruiterMode ? '#22d3ee' : '#6366f1',
              backdropFilter: 'blur(8px)',
            }}
            onClick={toggleRecruiterMode}
          >
            {recruiterMode ? '✕ 3D MODE' : '☰ RECRUITER MODE'}
          </button>
        </div>
      </div>

      {/* Station dots — right side */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-3 items-center">
        {STATIONS.map((s, i) => (
          <div key={i} className="flex items-center gap-2 flex-row-reverse">
            <div
              className="w-2 h-2 rounded-full transition-all duration-300"
              style={{
                background: i === currentStation ? '#22d3ee' : 'rgba(99,102,241,0.3)',
                boxShadow: i === currentStation ? '0 0 8px #22d3ee' : 'none',
                transform: i === currentStation ? 'scale(1.5)' : 'scale(1)',
              }}
            />
            {i === currentStation && (
              <span className="text-xs text-slate-500 font-mono tracking-wider">{s.label}</span>
            )}
          </div>
        ))}
      </div>

      {/* Progress bar — bottom */}
      <div className="absolute bottom-6 left-6 right-6">
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-600 font-mono w-6">
            {String(currentStation + 1).padStart(2, '0')}
          </span>
          <div className="flex-1 h-px bg-slate-800 relative">
            <div
              className="absolute top-0 left-0 h-px bg-cyan-400 transition-all duration-300"
              style={{
                width: `${scrollProgress * 100}%`,
                boxShadow: '0 0 6px #22d3ee',
              }}
            />
          </div>
          <span className="text-xs text-slate-600 font-mono w-6">
            {String(STATIONS.length).padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* Scroll hint fade in/out */}
      <div
        className="absolute bottom-14 left-1/2 -translate-x-1/2 text-slate-700 text-xs font-mono tracking-widest transition-opacity duration-500"
        style={{ opacity: scrollProgress < 0.05 ? 1 : 0 }}
      >
        SCROLL OR USE WHEEL TO NAVIGATE
      </div>
    </div>
  )
}
