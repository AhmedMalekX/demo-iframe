/*
 * Packages
 * */
import { create } from "zustand";

interface IAccessToken {
  accessToken: string | null;
  setAccessToken: (accessToken: string | null) => void;
}

export const useAccessTokenStore = create<IAccessToken>((set) => ({
  accessToken: null,
  setAccessToken: (accessToken: string | null) => set({ accessToken }),
}));
