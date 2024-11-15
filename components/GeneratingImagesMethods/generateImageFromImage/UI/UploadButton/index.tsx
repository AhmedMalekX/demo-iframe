/*
 * NextJS & ReactJS components
 */
import React from "react";

/*
 * Stores
 */
import { useUploadImagesModal } from "@/store/uploadImages.store";
import { useDashboardStore } from "@/store/dashboard.store";

/*
 * Utils
 */
import { cn } from "@/lib/utils";

/*
 * Icons
 */
import { LoaderCircle, Upload } from "lucide-react";

interface IUploadButtonProps {
  uploadButtonId?: number;
}

export const UploadButton = ({ uploadButtonId }: IUploadButtonProps) => {
  const {
    setIsUploadImagesModalOpen,
    isUploadingImage,
    uploadingFirstMixingImage,
    setUploadingFirstMixingImage,
    setUploadingSecondMixingImage,
    uploadingSecondMixingImage,
    setUploadImagesModalState,
    setUploadButtonId,
  } = useUploadImagesModal();
  const { generationMethod } = useDashboardStore();

  const handleClickOnUpload = () => {
    if (generationMethod === "Variation") {
      setIsUploadImagesModalOpen();
      return;
    }

    if (generationMethod === "Image mixing") {
      setUploadImagesModalState("new", uploadButtonId!);
      setUploadButtonId(uploadButtonId!);
      if (uploadButtonId === 1) {
        setUploadingFirstMixingImage(true);
        setUploadingSecondMixingImage(false);
      } else {
        setUploadingSecondMixingImage(true);
        setUploadingFirstMixingImage(false);
      }
      setIsUploadImagesModalOpen();
      return;
    }
  };

  const UploadButtonUI = () => (
    <div
      className="w-full h-full cursor-pointer flex flex-col lg:flex-row gap-y-1 lg:gap-y-0 items-center justify-center lg:gap-x-2 group transition-all duration-1000 ease-linear"
      role="button"
      onClick={handleClickOnUpload}
    >
      <Upload className="stroke-gray-500 group-hover:stroke-black w-5 lg:w-6 h-5 lg:h-6" />
      <span className="text-sm lg:text-xl text-gray-500 group-hover:text-black">
        Upload from your device
      </span>
    </div>
  );

  const renderLoader = () => (
    <div>
      <LoaderCircle size="30" className="animate-spin stroke-gray-500" />
    </div>
  );

  return (
    <div
      className={cn(
        "my-4 py-4 w-full border border-dashed h-36 flex items-center justify-center",
        isUploadingImage && "bg-gray-200 cursor-not-allowed",
      )}
    >
      {/* Handle the "Variation" generation method */}
      {generationMethod === "Variation" &&
        (isUploadingImage ? renderLoader() : <UploadButtonUI />)}

      {/* Handle the "Image mixing" generation method */}
      {generationMethod === "Image mixing" && (
        <>
          {uploadButtonId === 1 &&
            (uploadingFirstMixingImage ? renderLoader() : <UploadButtonUI />)}

          {uploadButtonId === 2 &&
            (uploadingSecondMixingImage ? renderLoader() : <UploadButtonUI />)}
        </>
      )}
    </div>
  );
};
