/*
 * Packages
 * */
import { create } from "zustand";

/*
 * Types
 * */
import { ITabs } from "@/types";

interface TabsStore {
  activeTab: ITabs;
  setActiveTab: (tab: ITabs) => void;
}

export const useTabsStore = create<TabsStore>((set) => ({
  activeTab: "Current",
  setActiveTab: (tab) => set({ activeTab: tab }),
}));
