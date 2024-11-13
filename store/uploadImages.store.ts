import { create } from "zustand";

interface IUploadImagesStore {
  isUploadImagesModalOpen: boolean;
  setIsUploadImagesModalOpen: () => void;

  isUploadingImage: boolean;
  setIsUploadingImage: () => void;

  showErrorAlert: boolean;
  setShowErrorAlert: () => void;
  errorAlertMessage: {
    header: string | null;
    body: string | null;
  };
  setErrorAlertMessage: (message: {
    header: string | null;
    body: string | null;
  }) => void;

  uploadImagesModalState: {
    state: "new" | "replace" | "variation";
    id: number | "variation";
  };
  setUploadImagesModalState: (
    value: "new" | "replace" | "variation",
    id: number | "variation",
  ) => void;

  variationImage: { imageUrl: string | null; uploaded: boolean };
  setVariationImage: (value: {
    imageUrl: string | null;
    uploaded: boolean;
  }) => void;
}

export const useUploadImagesModal = create<IUploadImagesStore>((set, get) => ({
  isUploadImagesModalOpen: false,
  setIsUploadImagesModalOpen: () =>
    set({ isUploadImagesModalOpen: !get().isUploadImagesModalOpen }),

  isUploadingImage: false,
  setIsUploadingImage: () => set({ isUploadingImage: !get().isUploadingImage }),

  showErrorAlert: false,
  setShowErrorAlert: () => set({ showErrorAlert: !get().showErrorAlert }),
  errorAlertMessage: {
    header: null,
    body: null,
  },
  setErrorAlertMessage: ({ header, body }) =>
    set({
      errorAlertMessage: {
        header,
        body,
      },
    }),
  uploadImagesModalState: { state: "new", id: 1 },
  setUploadImagesModalState: (value, id) =>
    set({ uploadImagesModalState: { state: value, id } }),
  /*Variation Tab*/
  variationImage: { imageUrl: null, uploaded: false },
  setVariationImage: (value) => set({ variationImage: value }),
}));
