import { useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { adminApi, api } from '../api/client'
import type { Project, Skill, TimelineEvent } from '../api/client'

type Tab = 'skills' | 'projects' | 'timeline'
type ProjectDraft = Omit<Project, 'id'> & { id?: number; techStackText: string }
type SkillDraft = Omit<Skill, 'id'> & { id?: number }
type TimelineDraft = Omit<TimelineEvent, 'id'> & { id?: number }

const emptySkill: SkillDraft = {
  name: '',
  category: '',
  proficiency: 80,
  color: '#22d3ee',
}

const emptyProject: ProjectDraft = {
  title: '',
  description: '',
  techStack: [],
  techStackText: '',
  videoUrl: '',
  thumbnailUrl: '',
  githubUrl: '',
  featured: false,
  displayOrder: 0,
}

const emptyTimeline: TimelineDraft = {
  year: new Date().getFullYear(),
  title: '',
  company: '',
  description: '',
  type: 'JOB',
  displayOrder: 0,
}

export default function AdminPage() {
  const [token, setToken] = useState(() => localStorage.getItem('orbitcv-admin-token') ?? '')
  const [inputToken, setInputToken] = useState(token)
  const [tab, setTab] = useState<Tab>('skills')

  const unlocked = token.length > 0

  function unlock() {
    const next = inputToken.trim()
    if (!next) return
    localStorage.setItem('orbitcv-admin-token', next)
    setToken(next)
  }

  function lock() {
    localStorage.removeItem('orbitcv-admin-token')
    setToken('')
    setInputToken('')
  }

  if (!unlocked) {
    return (
      <AdminShell>
        <div style={panelStyle}>
          <h1 style={titleStyle}>OrbitCV Admin</h1>
          <p style={mutedStyle}>Enter the backend admin token to edit live SQLite content.</p>
          <input
            type="password"
            value={inputToken}
            onChange={(e) => setInputToken(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') unlock() }}
            placeholder="ADMIN_TOKEN"
            style={inputStyle}
          />
          <button type="button" onClick={unlock} style={primaryButtonStyle}>Unlock</button>
        </div>
      </AdminShell>
    )
  }

  return (
    <AdminShell>
      <div style={{ ...panelStyle, maxWidth: 1180 }}>
        <div style={topBarStyle}>
          <div>
            <h1 style={titleStyle}>OrbitCV Admin</h1>
            <p style={mutedStyle}>Edit records, save, then return to the main scene.</p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <a href="/" style={secondaryButtonStyle}>Main page</a>
            <button type="button" onClick={lock} style={secondaryButtonStyle}>Lock</button>
          </div>
        </div>

        <div style={tabBarStyle}>
          <TabButton active={tab === 'skills'} onClick={() => setTab('skills')}>Skills</TabButton>
          <TabButton active={tab === 'projects'} onClick={() => setTab('projects')}>Projects</TabButton>
          <TabButton active={tab === 'timeline'} onClick={() => setTab('timeline')}>Timeline</TabButton>
        </div>

        {tab === 'skills' && <SkillAdmin token={token} />}
        {tab === 'projects' && <ProjectAdmin token={token} />}
        {tab === 'timeline' && <TimelineAdmin token={token} />}
      </div>
    </AdminShell>
  )
}

function SkillAdmin({ token }: { token: string }) {
  const queryClient = useQueryClient()
  const { data = [] } = useQuery({ queryKey: ['skills'], queryFn: api.skills })
  const [draft, setDraft] = useState<SkillDraft>(emptySkill)
  const [message, setMessage] = useState('')

  async function save() {
    try {
      const body = { ...draft }
      delete body.id
      if (draft.id) await adminApi.updateSkill(token, draft.id, body)
      else await adminApi.createSkill(token, body)
      await queryClient.invalidateQueries({ queryKey: ['skills'] })
      setDraft(emptySkill)
      setMessage('Saved.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Save failed.')
    }
  }

  async function remove() {
    if (!draft.id || !confirm('Delete this skill?')) return
    try {
      await adminApi.deleteSkill(token, draft.id)
      await queryClient.invalidateQueries({ queryKey: ['skills'] })
      setDraft(emptySkill)
      setMessage('Deleted.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Delete failed.')
    }
  }

  return (
    <EditorLayout
      items={data}
      selectedId={draft.id}
      label={(item) => item.name}
      detail={(item) => item.category}
      onSelect={(item) => setDraft(item)}
      onNew={() => setDraft(emptySkill)}
    >
      <Status message={message} />
      <Field label="Name" value={draft.name} onChange={(v) => setDraft({ ...draft, name: v })} />
      <Field label="Category" value={draft.category} onChange={(v) => setDraft({ ...draft, category: v })} />
      <Field label="Color" type="color" value={draft.color} onChange={(v) => setDraft({ ...draft, color: v })} />
      <Field label="Proficiency" type="number" value={draft.proficiency} onChange={(v) => setDraft({ ...draft, proficiency: Number(v) })} />
      <Actions canDelete={Boolean(draft.id)} onSave={save} onDelete={remove} />
    </EditorLayout>
  )
}

function ProjectAdmin({ token }: { token: string }) {
  const queryClient = useQueryClient()
  const { data = [] } = useQuery({ queryKey: ['projects'], queryFn: api.projects })
  const [draft, setDraft] = useState<ProjectDraft>(emptyProject)
  const [message, setMessage] = useState('')

  function select(project: Project) {
    setDraft({ ...project, techStackText: project.techStack.join(', ') })
  }

  function bodyFromDraft(): Omit<Project, 'id'> {
    return {
      title: draft.title,
      description: draft.description,
      techStack: draft.techStackText.split(',').map((v) => v.trim()).filter(Boolean),
      videoUrl: draft.videoUrl || null,
      thumbnailUrl: draft.thumbnailUrl || null,
      githubUrl: draft.githubUrl || null,
      featured: draft.featured,
      displayOrder: draft.displayOrder,
    }
  }

  async function save() {
    try {
      const body = bodyFromDraft()
      if (draft.id) await adminApi.updateProject(token, draft.id, body)
      else await adminApi.createProject(token, body)
      await queryClient.invalidateQueries({ queryKey: ['projects'] })
      setDraft(emptyProject)
      setMessage('Saved.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Save failed.')
    }
  }

  async function remove() {
    if (!draft.id || !confirm('Delete this project?')) return
    try {
      await adminApi.deleteProject(token, draft.id)
      await queryClient.invalidateQueries({ queryKey: ['projects'] })
      setDraft(emptyProject)
      setMessage('Deleted.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Delete failed.')
    }
  }

  return (
    <EditorLayout
      items={data}
      selectedId={draft.id}
      label={(item) => item.title}
      detail={(item) => item.techStack.join(', ')}
      onSelect={select}
      onNew={() => setDraft(emptyProject)}
    >
      <Status message={message} />
      <Field label="Title" value={draft.title} onChange={(v) => setDraft({ ...draft, title: v })} />
      <TextArea label="Description" value={draft.description} onChange={(v) => setDraft({ ...draft, description: v })} />
      <Field label="Tech stack" value={draft.techStackText} onChange={(v) => setDraft({ ...draft, techStackText: v })} />
      <Field label="Video URL" value={draft.videoUrl ?? ''} onChange={(v) => setDraft({ ...draft, videoUrl: v })} />
      <Field label="Thumbnail URL" value={draft.thumbnailUrl ?? ''} onChange={(v) => setDraft({ ...draft, thumbnailUrl: v })} />
      <Field label="GitHub URL" value={draft.githubUrl ?? ''} onChange={(v) => setDraft({ ...draft, githubUrl: v })} />
      <Field label="Display order" type="number" value={draft.displayOrder} onChange={(v) => setDraft({ ...draft, displayOrder: Number(v) })} />
      <label style={checkStyle}>
        <input
          type="checkbox"
          checked={draft.featured}
          onChange={(e) => setDraft({ ...draft, featured: e.target.checked })}
        />
        Featured
      </label>
      <Actions canDelete={Boolean(draft.id)} onSave={save} onDelete={remove} />
    </EditorLayout>
  )
}

function TimelineAdmin({ token }: { token: string }) {
  const queryClient = useQueryClient()
  const { data = [] } = useQuery({ queryKey: ['timeline'], queryFn: api.timeline })
  const [draft, setDraft] = useState<TimelineDraft>(emptyTimeline)
  const [message, setMessage] = useState('')

  async function save() {
    try {
      const body = { ...draft }
      delete body.id
      if (draft.id) await adminApi.updateTimelineEvent(token, draft.id, body)
      else await adminApi.createTimelineEvent(token, body)
      await queryClient.invalidateQueries({ queryKey: ['timeline'] })
      setDraft(emptyTimeline)
      setMessage('Saved.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Save failed.')
    }
  }

  async function remove() {
    if (!draft.id || !confirm('Delete this timeline event?')) return
    try {
      await adminApi.deleteTimelineEvent(token, draft.id)
      await queryClient.invalidateQueries({ queryKey: ['timeline'] })
      setDraft(emptyTimeline)
      setMessage('Deleted.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Delete failed.')
    }
  }

  return (
    <EditorLayout
      items={data}
      selectedId={draft.id}
      label={(item) => `${item.year} - ${item.title}`}
      detail={(item) => item.company || item.type}
      onSelect={(item) => setDraft(item)}
      onNew={() => setDraft(emptyTimeline)}
    >
      <Status message={message} />
      <Field label="Year" type="number" value={draft.year} onChange={(v) => setDraft({ ...draft, year: Number(v) })} />
      <Field label="Title" value={draft.title} onChange={(v) => setDraft({ ...draft, title: v })} />
      <Field label="Company" value={draft.company} onChange={(v) => setDraft({ ...draft, company: v })} />
      <TextArea label="Description" value={draft.description} onChange={(v) => setDraft({ ...draft, description: v })} />
      <Field label="Type" value={draft.type} onChange={(v) => setDraft({ ...draft, type: v })} />
      <Field label="Display order" type="number" value={draft.displayOrder} onChange={(v) => setDraft({ ...draft, displayOrder: Number(v) })} />
      <Actions canDelete={Boolean(draft.id)} onSave={save} onDelete={remove} />
    </EditorLayout>
  )
}

function EditorLayout<T extends { id: number }>({
  items,
  selectedId,
  label,
  detail,
  onSelect,
  onNew,
  children,
}: {
  items: T[]
  selectedId?: number
  label: (item: T) => string
  detail: (item: T) => string
  onSelect: (item: T) => void
  onNew: () => void
  children: ReactNode
}) {
  return (
    <div style={editorGridStyle}>
      <div style={listStyle}>
        <button type="button" onClick={onNew} style={{ ...primaryButtonStyle, width: '100%', marginBottom: 10 }}>
          New record
        </button>
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(item)}
            style={{
              ...itemButtonStyle,
              borderColor: item.id === selectedId ? '#22d3ee' : 'rgba(148,163,184,0.18)',
              color: item.id === selectedId ? '#e2e8f0' : '#94a3b8',
            }}
          >
            <span style={{ display: 'block', color: '#e2e8f0' }}>{label(item)}</span>
            <span style={{ display: 'block', fontSize: 11, marginTop: 4 }}>{detail(item)}</span>
          </button>
        ))}
      </div>
      <div style={formStyle}>{children}</div>
    </div>
  )
}

function AdminShell({ children }: { children: ReactNode }) {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#05070d',
      color: '#e2e8f0',
      fontFamily: 'Inter, system-ui, sans-serif',
      padding: 24,
      boxSizing: 'border-box',
    }}>
      {children}
    </div>
  )
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        ...secondaryButtonStyle,
        borderColor: active ? '#22d3ee' : 'rgba(148,163,184,0.24)',
        color: active ? '#22d3ee' : '#94a3b8',
      }}
    >
      {children}
    </button>
  )
}

function Status({ message }: { message: string }) {
  return <div style={{ minHeight: 20, color: '#22c55e', fontSize: 13 }}>{message}</div>
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
}: {
  label: string
  value: string | number
  onChange: (value: string) => void
  type?: string
}) {
  return (
    <label style={labelStyle}>
      <span>{label}</span>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} style={inputStyle} />
    </label>
  )
}

function TextArea({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label style={labelStyle}>
      <span>{label}</span>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} style={{ ...inputStyle, minHeight: 96, resize: 'vertical' }} />
    </label>
  )
}

function Actions({ canDelete, onSave, onDelete }: { canDelete: boolean; onSave: () => void; onDelete: () => void }) {
  return (
    <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
      <button type="button" onClick={onSave} style={primaryButtonStyle}>Save</button>
      {canDelete && <button type="button" onClick={onDelete} style={dangerButtonStyle}>Delete</button>}
    </div>
  )
}

const panelStyle: CSSProperties = {
  width: '100%',
  maxWidth: 420,
  margin: '0 auto',
  background: '#0b1020',
  border: '1px solid rgba(148,163,184,0.18)',
  borderRadius: 8,
  padding: 20,
  boxSizing: 'border-box',
}

const topBarStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: 16,
  alignItems: 'flex-start',
  marginBottom: 18,
}

const titleStyle: CSSProperties = {
  margin: '0 0 6px',
  fontSize: 22,
  lineHeight: 1.2,
}

const mutedStyle: CSSProperties = {
  margin: 0,
  color: '#64748b',
  fontSize: 13,
}

const tabBarStyle: CSSProperties = {
  display: 'flex',
  gap: 8,
  marginBottom: 16,
}

const editorGridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '320px 1fr',
  gap: 16,
}

const listStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  maxHeight: '70vh',
  overflow: 'auto',
}

const formStyle: CSSProperties = {
  display: 'grid',
  gap: 10,
}

const labelStyle: CSSProperties = {
  display: 'grid',
  gap: 5,
  color: '#94a3b8',
  fontSize: 12,
}

const inputStyle: CSSProperties = {
  width: '100%',
  background: '#05070d',
  border: '1px solid rgba(148,163,184,0.24)',
  color: '#e2e8f0',
  borderRadius: 6,
  padding: '9px 10px',
  boxSizing: 'border-box',
  font: 'inherit',
}

const checkStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  color: '#94a3b8',
  fontSize: 13,
}

const itemButtonStyle: CSSProperties = {
  width: '100%',
  textAlign: 'left',
  background: '#080d18',
  border: '1px solid rgba(148,163,184,0.18)',
  borderRadius: 6,
  padding: 10,
  cursor: 'pointer',
}

const primaryButtonStyle: CSSProperties = {
  background: '#0891b2',
  color: '#ecfeff',
  border: '1px solid #22d3ee',
  borderRadius: 6,
  padding: '9px 12px',
  cursor: 'pointer',
  textDecoration: 'none',
  font: 'inherit',
}

const secondaryButtonStyle: CSSProperties = {
  background: 'transparent',
  color: '#94a3b8',
  border: '1px solid rgba(148,163,184,0.24)',
  borderRadius: 6,
  padding: '9px 12px',
  cursor: 'pointer',
  textDecoration: 'none',
  font: 'inherit',
}

const dangerButtonStyle: CSSProperties = {
  ...secondaryButtonStyle,
  color: '#fecaca',
  borderColor: 'rgba(239,68,68,0.55)',
}
