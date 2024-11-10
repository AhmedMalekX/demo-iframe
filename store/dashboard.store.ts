/*
 * Packages
 * */
import { create } from "zustand";

/*
 * Constants
 * */
import { Styles } from "@/constants";

interface DashboardStore {
  // General options
  guidanceScale: number;
  setGuidanceScale: (value: number) => void;
  sizeOfImageOnFromTextTab: number;
  setSizeOfImageOnFromTextTab: (value: number) => void;
  sizeOfImageOnFromImageTab: number;
  setSizeOfImageOnFromImageTab: (value: number) => void;
  numberOfImages: number;
  setNumberOfImages: (value: number) => void;
  openStylesModal: boolean;
  setOpenStylesModal: (value: boolean) => void;
  styleName: (typeof Styles)[number]["styleName"] | undefined;
  setStyleName: (
    value: (typeof Styles)[number]["styleName"] | undefined,
  ) => void;

  // Generate image using another image
  selectedGenerateSimilarImage: string | null;
  setSelectedGenerateSimilarImage: (imageUrl: string | null) => void;
  generationMethod: "Variation" | "Image Mixing";
  setGenerationMethod: (value: "Variation" | "Image Mixing") => void;

  // Generate image using elements
  generatingMotif: boolean;
  setGeneratingMotif: (value: boolean) => void;

  // Result
  allDataLength: number;
  setAllDataLength: (value: number) => void;
  allData: [];
  setAllData: (value: []) => void;
  dataLoading: boolean;
  setDataLoading: (value: boolean) => void;
  showLoadingCards: boolean;
  setShowLoadingCards: (value: boolean) => void;
  showGeneratedImages: boolean;
  setShowGeneratedImages: (value: boolean) => void;
  keepOutline: number;
  setKeepOutline: (value: number) => void;
  keepStyle: number;
  setKeepStyle: (value: number) => void;

  // Submitting the form to get the data
  submittingFromToGetData: boolean;
  setSubmittingFromToGetData: (value: boolean) => void;

  // Handle error
  showErrorModal: boolean;
  setShowErrorModal: (value: boolean) => void;
  errorModalMessage: {
    header: string | null;
    body: string | null;
  };
  setErrorModalMessage: (value: {
    header: string | null;
    body: string | null;
  }) => void;

  // Feedback
  showCreatorReview: boolean;
  setShowCreatorReview: (value: boolean) => void;
}

export const useDashboardStore = create<DashboardStore>((set) => ({
  // General options
  guidanceScale: 7,
  setGuidanceScale: (value) => set({ guidanceScale: value }),
  sizeOfImageOnFromTextTab: 512,
  setSizeOfImageOnFromTextTab: (value) =>
    set({ sizeOfImageOnFromTextTab: value }),
  sizeOfImageOnFromImageTab: 512,
  setSizeOfImageOnFromImageTab: (value) =>
    set({ sizeOfImageOnFromImageTab: value }),
  numberOfImages: 2,
  setNumberOfImages: (value) => set({ numberOfImages: value }),
  openStylesModal: false,
  setOpenStylesModal: (value) => set({ openStylesModal: value }),
  styleName: undefined,
  setStyleName: (value) => set({ styleName: value }),

  // Generate image using another image
  selectedGenerateSimilarImage: null,
  setSelectedGenerateSimilarImage: (state) =>
    set({ selectedGenerateSimilarImage: state }),
  generationMethod: "Variation",
  setGenerationMethod: (value) => set({ generationMethod: value }),

  // Generate image using elements
  generatingMotif: false,
  setGeneratingMotif: (value) => set({ generatingMotif: value }),

  // Result
  allDataLength: 0,
  setAllDataLength: (value) => set({ allDataLength: value }),
  allData: [],
  setAllData: (value) => set({ allData: value }),
  dataLoading: false,
  setDataLoading: (value) => set({ dataLoading: value }),
  showLoadingCards: false,
  setShowLoadingCards: (value) => set({ showLoadingCards: value }),
  showGeneratedImages: false,
  setShowGeneratedImages: (value) => set({ showGeneratedImages: value }),
  keepOutline: 0.7,
  setKeepOutline: (value) => set({ keepOutline: value }),
  keepStyle: 0.7,
  setKeepStyle: (value) => set({ keepStyle: value }),

  // Submitting the form to get the data
  submittingFromToGetData: false,
  setSubmittingFromToGetData: (value) =>
    set({ submittingFromToGetData: value }),

  // Handle error
  showErrorModal: false,
  setShowErrorModal: (value) => set({ showErrorModal: value }),
  errorModalMessage: {
    header: null,
    body: null,
  },
  setErrorModalMessage: (value) =>
    set({ errorModalMessage: { header: value.header, body: value.body } }),

  showCreatorReview: false,
  setShowCreatorReview: (value) => set({ showCreatorReview: value }),
}));
