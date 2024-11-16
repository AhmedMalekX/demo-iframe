import { create } from "zustand";
import { CONFIG } from "@/components/GeneratingImagesMethods/GenerateImageFromElements/createTabData/constants";

interface CreateTabStore {
  zoom: number;
  setZoom: (value: number) => void;
  previewZoom: number;
  setPreviewZoom: (value: number) => void;
  finalResoluton: { width: number; height: number };
  setFinalResoluton: (value: { width: number; height: number }) => void;
  pan: {
    x: number;
    y: number;
  };
  setPan: (value: { x: number; y: number }) => void;
  upScaleFactor: number;
  setUpScaleFactor: (value: number) => void;
  parentZoom: number;
  setParentZoom: (value: number) => void;
}

export const useCreateTabStore = create<CreateTabStore>()((set, get) => ({
  zoom: 1,
  setZoom: (value) => set({ zoom: value }),
  previewZoom: 1,
  setPreviewZoom: (value) => set({ previewZoom: value }),
  finalResoluton: CONFIG.STARTING_REPEAT_CANVAS_RESOLUTION,
  setFinalResoluton: (value: { width: number; height: number }) =>
    set({ finalResoluton: value }),
  pan: { x: 0, y: 0 },
  setPan: (value: { x: number; y: number }) => set({ pan: value }),
  upScaleFactor: 1,
  setUpScaleFactor: (value) => set({ upScaleFactor: value }),
  parentZoom: 1,
  setParentZoom: (value) => set({ parentZoom: value }),
}));
