const BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`)
  if (!res.ok) throw new Error(`API ${path} → ${res.status}`)
  return res.json() as Promise<T>
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`API ${path} → ${res.status}`)
  return res.json() as Promise<T>
}

export interface SystemStatus {
  service: string
  runtime: string
  orm: string
  database: string
  status: string
  projectCount: number
  skillCount: number
  timelineEvents: number
  videoCount: number
  startedAt: string
  frontendOrigin: string
  version: string
}

export interface Project {
  id: number
  title: string
  description: string
  techStack: string[]
  videoUrl: string | null
  thumbnailUrl: string | null
  githubUrl: string | null
  featured: boolean
  displayOrder: number
}

export interface Skill {
  id: number
  name: string
  category: string
  proficiency: number
  color: string
}

export interface TimelineEvent {
  id: number
  year: number
  title: string
  company: string
  description: string
  type: string
  displayOrder: number
}

export interface Video {
  id: number
  title: string
  description: string
  embedUrl: string
  thumbnailUrl: string | null
  projectId: number | null
}

export const api = {
  health: () => get<{ status: string; service: string }>('/api/health'),
  system: () => get<SystemStatus>('/api/system'),
  projects: () => get<Project[]>('/api/projects'),
  skills: () => get<Skill[]>('/api/skills'),
  timeline: () => get<TimelineEvent[]>('/api/timeline'),
  videos: () => get<Video[]>('/api/videos'),
  contactIntent: (body: { name: string; email: string; message: string }) =>
    post<{ status: string; message: string }>('/api/contact-intent', body),
}
