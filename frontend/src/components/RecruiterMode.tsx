import { motion } from 'framer-motion'
import { useStore } from '../store/useStore'
import { useSkills, useProjects, useTimeline } from '../api/hooks'

const CATEGORY_ORDER = ['3D / XR', 'Frontend', 'Backend', 'Systems', 'DevOps']

export default function RecruiterMode() {
  const toggleRecruiterMode = useStore((s) => s.toggleRecruiterMode)
  const { data: skills = [] } = useSkills()
  const { data: projects = [] } = useProjects()
  const { data: timeline = [] } = useTimeline()

  const byCategory = CATEGORY_ORDER.reduce<Record<string, typeof skills>>((acc, cat) => {
    acc[cat] = skills.filter((s) => s.category === cat)
    return acc
  }, {})

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 overflow-y-auto"
      style={{ background: '#0a0f1e', fontFamily: 'JetBrains Mono, monospace' }}
    >
      {/* Close button */}
      <button
        className="fixed top-4 right-4 z-50 text-slate-400 hover:text-cyan-400 text-xs border border-slate-700 hover:border-cyan-400 px-3 py-1 rounded transition-all no-print"
        onClick={toggleRecruiterMode}
      >
        ✕ EXIT RECRUITER MODE
      </button>

      <div className="max-w-3xl mx-auto px-8 py-16 recruiter-content">
        {/* Header */}
        <header className="mb-12 border-b border-slate-800 pb-8">
          <h1 className="text-3xl font-bold text-white mb-1">Mikle Higaran</h1>
          <p className="text-cyan-400 text-sm tracking-widest mb-4">
            XR ENGINEER · OMNIVERSE DEVELOPER · FULL STACK SYSTEMS
          </p>
          <div className="flex flex-wrap gap-4 text-xs text-slate-500">
            <span>📧 miklehigaran@gmail.com</span>
            <span>🔗 github.com/mikle-higaran</span>
            <span>🌐 orbital-cv.onrender.com</span>
          </div>
        </header>

        {/* Summary */}
        <section className="mb-10">
          <h2 className="text-xs text-cyan-400 tracking-widest mb-4 uppercase">Summary</h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            Full-stack engineer with deep expertise in XR development and NVIDIA Omniverse.
            Shipped WebXR platforms, USD simulation pipelines, and IoT dashboards in production.
            Equally at home with Spring Boot microservices, Hibernate persistence, and Three.js
            3D scenes. Passionate about systems where real-time 3D and robust backends meet.
          </p>
        </section>

        {/* Skills */}
        <section className="mb-10">
          <h2 className="text-xs text-cyan-400 tracking-widest mb-4 uppercase">Skills</h2>
          <div className="space-y-4">
            {CATEGORY_ORDER.map((cat) =>
              byCategory[cat]?.length ? (
                <div key={cat}>
                  <div className="text-xs text-slate-500 mb-2">{cat}</div>
                  <div className="flex flex-wrap gap-2">
                    {byCategory[cat].map((skill) => (
                      <span
                        key={skill.id}
                        className="text-xs px-2 py-0.5 rounded"
                        style={{
                          background: `${skill.color}18`,
                          border: `1px solid ${skill.color}40`,
                          color: skill.color,
                        }}
                      >
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null
            )}
          </div>
        </section>

        {/* Experience (Timeline) */}
        <section className="mb-10">
          <h2 className="text-xs text-cyan-400 tracking-widest mb-4 uppercase">Experience</h2>
          <div className="space-y-6">
            {timeline
              .filter((e) => e.type === 'JOB')
              .map((event) => (
                <div key={event.id} className="border-l border-slate-700 pl-4">
                  <div className="flex items-baseline gap-3">
                    <span className="text-cyan-400 text-xs font-bold">{event.year}</span>
                    <span className="text-white text-sm font-semibold">{event.title}</span>
                    {event.company && (
                      <span className="text-slate-500 text-xs">@ {event.company}</span>
                    )}
                  </div>
                  <p className="text-slate-400 text-xs mt-1 leading-relaxed">{event.description}</p>
                </div>
              ))}
          </div>
        </section>

        {/* Achievements */}
        <section className="mb-10">
          <h2 className="text-xs text-cyan-400 tracking-widest mb-4 uppercase">Highlights</h2>
          <div className="space-y-3">
            {timeline
              .filter((e) => e.type === 'ACHIEVEMENT')
              .map((event) => (
                <div key={event.id} className="flex gap-3 text-xs">
                  <span className="text-amber-400">★</span>
                  <div>
                    <span className="text-white font-semibold">{event.title}</span>
                    <span className="text-slate-500 ml-2">{event.year}</span>
                    <p className="text-slate-400 mt-0.5 leading-relaxed">{event.description}</p>
                  </div>
                </div>
              ))}
          </div>
        </section>

        {/* Projects */}
        <section className="mb-10">
          <h2 className="text-xs text-cyan-400 tracking-widest mb-4 uppercase">Projects</h2>
          <div className="space-y-5">
            {projects.map((p) => (
              <div key={p.id}>
                <div className="flex items-center gap-2 mb-1">
                  {p.featured && <span className="text-amber-400 text-xs">★</span>}
                  <span className="text-white text-sm font-semibold">{p.title}</span>
                  {p.githubUrl && (
                    <a
                      href={p.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-indigo-400 text-xs hover:text-indigo-300"
                    >
                      GitHub ↗
                    </a>
                  )}
                </div>
                <p className="text-slate-400 text-xs leading-relaxed mb-2">{p.description}</p>
                <div className="flex flex-wrap gap-1.5">
                  {p.techStack.map((t) => (
                    <span key={t} className="text-xs text-slate-500 border border-slate-700 px-1.5 py-0.5 rounded">
                      {t.trim()}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <footer className="border-t border-slate-800 pt-6 text-xs text-slate-600 text-center">
          This CV is served live from a Spring Boot microservice with Hibernate/JPA + SQLite on Render.
          <br />
          Frontend: React + Vite + R3F on Render Static Site.
        </footer>
      </div>
    </motion.div>
  )
}
