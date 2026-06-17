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

async function adminRequest<T>(
  method: 'POST' | 'PUT' | 'DELETE',
  path: string,
  token: string,
  body?: unknown,
): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'X-Admin-Token': token,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`API ${path} -> ${res.status}`)
  if (res.status === 204 || method === 'DELETE') return undefined as T
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
  embedUrl: string | null
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

export const adminApi = {
  createProject: (token: string, body: Omit<Project, 'id'>) =>
    adminRequest<Project>('POST', '/api/admin/projects', token, body),
  updateProject: (token: string, id: number, body: Omit<Project, 'id'>) =>
    adminRequest<Project>('PUT', `/api/admin/projects/${id}`, token, body),
  deleteProject: (token: string, id: number) =>
    adminRequest<void>('DELETE', `/api/admin/projects/${id}`, token),

  createSkill: (token: string, body: Omit<Skill, 'id'>) =>
    adminRequest<Skill>('POST', '/api/admin/skills', token, body),
  updateSkill: (token: string, id: number, body: Omit<Skill, 'id'>) =>
    adminRequest<Skill>('PUT', `/api/admin/skills/${id}`, token, body),
  deleteSkill: (token: string, id: number) =>
    adminRequest<void>('DELETE', `/api/admin/skills/${id}`, token),

  createTimelineEvent: (token: string, body: Omit<TimelineEvent, 'id'>) =>
    adminRequest<TimelineEvent>('POST', '/api/admin/timeline', token, body),
  updateTimelineEvent: (token: string, id: number, body: Omit<TimelineEvent, 'id'>) =>
    adminRequest<TimelineEvent>('PUT', `/api/admin/timeline/${id}`, token, body),
  deleteTimelineEvent: (token: string, id: number) =>
    adminRequest<void>('DELETE', `/api/admin/timeline/${id}`, token),
}
