import { create } from "zustand";

interface TabStore {
  activeTab: string;
  setActiveTab: (tab: string) => void;

  user: any | null;
  setUser: (user: any) => void;
}

export const useTabStore = create<TabStore>((set) => ({
  activeTab: "home",
  setActiveTab: (tab) => set({ activeTab: tab }),

  user: null,
  setUser: (user) => set({ user }),
}));