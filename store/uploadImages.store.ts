import {create} from 'zustand';

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
		state: 'new' | 'replace' | 'variation';
		id: number | 'variation';
	};
	setUploadImagesModalState: (
		value: 'new' | 'replace' | 'variation',
		id: number | 'variation',
	) => void;
	
	variationImage: { imageUrl: string | null; uploaded: boolean };
	setVariationImage: (value: {
		imageUrl: string | null;
		uploaded: boolean;
	}) => void;
	replacingVariationImage: boolean;
	setReplacingVariationImage: (value: boolean) => void;
	
	firstMixingImage: string | null;
	setFirstMixingImage: (value: string | null) => void;
	uploadingFirstMixingImage: boolean;
	setUploadingFirstMixingImage: (value: boolean) => void;
	replacingFirstMixingImage: boolean;
	setReplacingFirstMixingImage: (value: boolean) => void;
	
	secondMixingImage: string | null;
	setSecondMixingImage: (value: string | null) => void;
	replacingSecondMixingImage: boolean;
	setReplacingSecondMixingImage: (value: boolean) => void;
	uploadingSecondMixingImage: boolean;
	setUploadingSecondMixingImage: (value: boolean) => void;
	uploadButtonId: number | null;
	setUploadButtonId: (id: number | null) => void;
	
	firstMixingImageSourceType: 'style' | 'outline';
	secondMixingImageSourceType: 'style' | 'outline';
	firstMixingImageStrength: number;
	setFirstMixingImageStrength: (value: number) => void;
	secondMixingImageStrength: number;
	setSecondMixingImageStrength: (value: number) => void;
	setMixingImageSourceType: (id: number, value: 'style' | 'outline') => void;
}

export const useUploadImagesStore = create<IUploadImagesStore>((set, get) => ({
	isUploadImagesModalOpen: false,
	setIsUploadImagesModalOpen: () =>
		set({isUploadImagesModalOpen: !get().isUploadImagesModalOpen}),
	
	isUploadingImage: false,
	setIsUploadingImage: () => set({isUploadingImage: !get().isUploadingImage}),
	
	showErrorAlert: false,
	setShowErrorAlert: () => set({showErrorAlert: !get().showErrorAlert}),
	errorAlertMessage: {
		header: null,
		body: null,
	},
	setErrorAlertMessage: ({header, body}) =>
		set({
			errorAlertMessage: {
				header,
				body,
			},
		}),
	uploadImagesModalState: {state: 'new', id: 1},
	setUploadImagesModalState: (value, id) =>
		set({uploadImagesModalState: {state: value, id}}),
	/*Variation Tab*/
	variationImage: {imageUrl: null, uploaded: false},
	setVariationImage: (value) => set({variationImage: value}),
	replacingVariationImage: false,
	setReplacingVariationImage: (value) =>
		set({replacingVariationImage: value}),
	
	firstMixingImage: null,
	setFirstMixingImage: (value) => set({firstMixingImage: value}),
	uploadingFirstMixingImage: false,
	setUploadingFirstMixingImage: (value) =>
		set({uploadingFirstMixingImage: value}),
	replacingFirstMixingImage: false,
	setReplacingFirstMixingImage: (value) =>
		set({replacingFirstMixingImage: value}),
	
	secondMixingImage: null,
	setSecondMixingImage: (value) => set({secondMixingImage: value}),
	uploadingSecondMixingImage: false,
	setUploadingSecondMixingImage: (value) =>
		set({uploadingSecondMixingImage: value}),
	replacingSecondMixingImage: false,
	setReplacingSecondMixingImage: (value) =>
		set({replacingSecondMixingImage: value}),
	uploadButtonId: null,
	setUploadButtonId: (id: number | null) => set({uploadButtonId: id}),
	
	firstMixingImageSourceType: 'outline',
	secondMixingImageSourceType: 'style',
	firstMixingImageStrength: 0.7,
	secondMixingImageStrength: 0.7,
	setFirstMixingImageStrength: (value: number) =>
		set({firstMixingImageStrength: value}),
	setSecondMixingImageStrength: (value: number) =>
		set({secondMixingImageStrength: value}),
	setMixingImageSourceType: (id: number, value: 'outline' | 'style') =>
		set(() => ({
			firstMixingImageSourceType:
				id === 1 ? value : value === 'outline' ? 'style' : 'outline',
			secondMixingImageSourceType:
				id === 2 ? value : value === 'outline' ? 'style' : 'outline',
		})),
}));
