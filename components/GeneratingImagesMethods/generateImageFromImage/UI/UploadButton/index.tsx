/*
 * NextJS & ReactJS components
 * */
import React from "react";

/*
 * Stores
 * */
import { useUploadImagesModal } from "@/store/uploadImages.store";

/*
 * Utils
 * */
import { cn } from "@/lib/utils";

/*
 * Icons
 * */
import { LoaderCircle, Upload } from "lucide-react";
import { useDashboardStore } from "@/store/dashboard.store";

export const UploadButton = () => {
  const {
    setIsUploadImagesModalOpen,
    isUploadingImage,
    setUploadImagesModalState,
  } = useUploadImagesModal();
  const { generationMethod } = useDashboardStore();

  const handleClickOnUpload = () => {
    if (generationMethod === "Variation") {
      setUploadImagesModalState("variation", "variation");
      setIsUploadImagesModalOpen();
    }
  };

  return (
    <div
      className={cn(
        "my-4 py-4 w-full border border-dashed h-36 flex items-center justify-center",
        isUploadingImage && "bg-gray-200 cursor-not-allowed",
      )}
    >
      {isUploadingImage ? (
        <div>
          <LoaderCircle
            size="30"
            className={cn(
              "animate-spin",
              isUploadingImage && "stroke-gray-500",
            )}
          />
        </div>
      ) : (
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
      )}
    </div>
  );
};
