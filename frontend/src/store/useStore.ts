import { create } from 'zustand'

interface AppStore {
  scrollProgress: number
  setScrollProgress: (p: number) => void
  currentStation: number
  setCurrentStation: (s: number) => void
  recruiterMode: boolean
  toggleRecruiterMode: () => void
  selectedSkill: string | null
  setSelectedSkill: (s: string | null) => void
  backendPanelOpen: boolean
  setBackendPanelOpen: (open: boolean) => void
}

export const useStore = create<AppStore>((set) => ({
  scrollProgress: 0,
  setScrollProgress: (p) =>
    set({ scrollProgress: p, currentStation: Math.round(p * 4) }),
  currentStation: 0,
  setCurrentStation: (s) => set({ currentStation: s }),
  recruiterMode: false,
  toggleRecruiterMode: () =>
    set((s) => ({ recruiterMode: !s.recruiterMode })),
  selectedSkill: null,
  setSelectedSkill: (skill) => set({ selectedSkill: skill }),
  backendPanelOpen: true,
  setBackendPanelOpen: (open) => set({ backendPanelOpen: open }),
}))
