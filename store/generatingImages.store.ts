/*
 * Packages
 * */
import { create } from "zustand";

/*
 * Types
 * */
import { IGeneratingImagesMethods } from "@/types";

interface TabsStore {
  activeGeneratingMethod: IGeneratingImagesMethods;
  setActiveGeneratingMethod: (method: IGeneratingImagesMethods) => void;
}

export const useActiveGeneratingMethodStore = create<TabsStore>((set) => ({
  activeGeneratingMethod: "From text",
  setActiveGeneratingMethod: (method) =>
    set({ activeGeneratingMethod: method }),
}));
