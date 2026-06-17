import { useQuery } from '@tanstack/react-query'
import { api } from './client'

export const useSystem = () =>
  useQuery({ queryKey: ['system'], queryFn: api.system, refetchInterval: 30_000 })

export const useProjects = () =>
  useQuery({ queryKey: ['projects'], queryFn: api.projects })

export const useSkills = () =>
  useQuery({ queryKey: ['skills'], queryFn: api.skills })

export const useTimeline = () =>
  useQuery({ queryKey: ['timeline'], queryFn: api.timeline })

export const useVideos = () =>
  useQuery({ queryKey: ['videos'], queryFn: api.videos })
