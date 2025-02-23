import { create } from "zustand";

interface TabStore {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const useTabStore = create<TabStore>((set) => ({
  activeTab: "Детский",
  setActiveTab: (tab) => set({ activeTab: tab }),
}));
