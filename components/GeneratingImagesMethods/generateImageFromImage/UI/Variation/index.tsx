/*
 * NextJS & ReactJS components
 * */
import React from "react";

/*
 * Stores
 * */
import { useUploadImagesModal } from "@/store/uploadImages.store";
import { useDashboardStore } from "@/store/dashboard.store";

/*
 * UI Components
 * */
import { UploadButton } from "@/components/GeneratingImagesMethods/generateImageFromImage/UI/UploadButton";
import { UploadedImage } from "@/components/GeneratingImagesMethods/generateImageFromImage/UI/UploadedImage";

/*
 * Icons
 * */
import { LoaderCircle } from "lucide-react";

export const Variation = () => {
  const {
    variationImage,
    setVariationImage,
    setIsUploadImagesModalOpen,
    setReplacingVariationImage,
    replacingVariationImage,
  } = useUploadImagesModal();

  const { generationMethod } = useDashboardStore();

  const handleReplaceVariationImage = () => {
    setReplacingVariationImage(true);
    setIsUploadImagesModalOpen();
  };

  const handleDeleteVariationImage = () => {
    setVariationImage({ imageUrl: null, uploaded: false });
  };

  if (!variationImage.imageUrl && generationMethod === "Variation") {
    return <UploadButton />;
  } else {
    return replacingVariationImage ? (
      <div className="my-4 w-full h-full min-h-[300px] max-h-[300px] flex justify-center items-center border-dashed border-4 rounded-xl border-gray-400 relative group transition-all duration-300 overflow-hidden">
        <LoaderCircle size={30} className="animate-spin" />
      </div>
    ) : (
      <UploadedImage
        imageUrl={variationImage.imageUrl!}
        alt="Variant image"
        handleReplaceImage={handleReplaceVariationImage}
        handleDeleteImage={handleDeleteVariationImage}
      />
    );
  }
};
