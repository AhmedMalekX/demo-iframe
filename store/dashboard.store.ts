/*
 * Packages
 * */
import { create } from "zustand";

/*
 * Constants
 * */
import { StylesNames } from "@/constants";

interface DashboardStore {
  // General options
  guidanceScale: number;
  setGuidanceScale: (value: number) => void;
  sizeOfImageOnFromTextTab: number;
  setSizeOfImageOnFromTextTab: (value: number) => void;
  sizeOfImageOnFromImageTab: number;
  setSizeOfImageOnFromImageTab: (value: number) => void;
  openStylesModal: boolean;
  setOpenStylesModal: (value: boolean) => void;

  // Generate image using text
  prompt: string | undefined;
  setPrompt: (value: string | undefined) => void;
  generateFromTextStyleName:
    | (typeof StylesNames)[number]["styleName"]
    | undefined;
  setGenerateFromTextStyleName: (
    value: (typeof StylesNames)[number]["styleName"] | undefined,
  ) => void;
  generateFromTextNumberOfImages: number;
  setGenerateFromTextNumberOfImages: (value: number) => void;
  negativePrompt: string | undefined;
  setNegativePrompt: (value: string | undefined) => void;

  // Generate image using another image
  selectedGenerateSimilarImage: string | null;
  setSelectedGenerateSimilarImage: (imageUrl: string | null) => void;
  generationMethod: "Variation" | "Image Mixing";
  setGenerationMethod: (value: "Variation" | "Image Mixing") => void;
  generateFromImageStyleName:
    | (typeof StylesNames)[number]["styleName"]
    | undefined;
  setGenerateFromImageStyleName: (
    value: (typeof StylesNames)[number]["styleName"] | undefined,
  ) => void;
  generateFromImageNumberOfImages: number;
  setGenerateFromImageNumberOfImages: (value: number) => void;

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

  // Image preview
  imagePreviewZoom: number;
  setImagePreviewZoom: (value: number) => void;
  selectedPreviewImage: string | null;
  setSelectedPreviewImage: (imageUrl: string | null) => void;
  selectedMockup: string | null;
  setSelectedMockup: (value: string | null) => void;
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
  openStylesModal: false,
  setOpenStylesModal: (value) => set({ openStylesModal: value }),

  // Generate image using text
  prompt: "",
  setPrompt: (value) => set({ prompt: value }),
  generateFromTextStyleName: undefined,
  setGenerateFromTextStyleName: (value) =>
    set({ generateFromTextStyleName: value }),
  generateFromTextNumberOfImages: 2,
  setGenerateFromTextNumberOfImages: (value: number) =>
    set({ generateFromTextNumberOfImages: value }),
  negativePrompt: "",
  setNegativePrompt: (value) => set({ prompt: value }),

  // Generate image using another image
  selectedGenerateSimilarImage: null,
  setSelectedGenerateSimilarImage: (state) =>
    set({ selectedGenerateSimilarImage: state }),
  generationMethod: "Variation",
  setGenerationMethod: (value) => set({ generationMethod: value }),
  generateFromImageStyleName: undefined,
  setGenerateFromImageStyleName: (value) =>
    set({ generateFromImageStyleName: value }),
  generateFromImageNumberOfImages: 2,
  setGenerateFromImageNumberOfImages: (value: number) =>
    set({ generateFromImageNumberOfImages: value }),

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

  // Image preview
  imagePreviewZoom: 50,
  setImagePreviewZoom: (value) => set({ imagePreviewZoom: value }),
  selectedPreviewImage: null,
  setSelectedPreviewImage: (imageUrl) =>
    set({ selectedPreviewImage: imageUrl }),
  selectedMockup: null,
  setSelectedMockup: (value) => set({ selectedMockup: value }),
}));
