import { create } from "zustand";

interface IAbortStore {
  shouldAbortRequests: boolean;
  setShouldAbortRequests: (value: boolean) => void;
}

export const useAbortStore = create<IAbortStore>((set) => ({
  shouldAbortRequests: false,
  setShouldAbortRequests: (value) => set({ shouldAbortRequests: value }),
}));
