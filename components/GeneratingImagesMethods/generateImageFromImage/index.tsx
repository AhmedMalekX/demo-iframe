/*
 * NextJS & ReactJS components
 * */
import React from "react";

/*
 * Stores
 * */
import { useUploadImagesModal } from "@/store/uploadImages.store";

/*
 * UI Components
 * */
import { SelectFromImageMethod } from "@/components/GeneratingImagesMethods/generateImageFromImage/UI/SelectFromImageMethod";
import { UploadButton } from "@/components/GeneratingImagesMethods/generateImageFromImage/UI/UploadButton";
import { useDashboardStore } from "@/store/dashboard.store";
import Image from "next/image";
import { Replace, Trash2 } from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const GenerateImageFromImage = () => {
  const { variationImage, setVariationImage, setIsUploadImagesModalOpen } =
    useUploadImagesModal();
  const { generationMethod } = useDashboardStore();

  const handleReplaceVariationImage = () => {
    setIsUploadImagesModalOpen();
  };

  const handleDeleteVariationImage = () => {
    setVariationImage({ imageUrl: null, uploaded: false });
  };

  return (
    <div>
      <SelectFromImageMethod />

      {!variationImage.imageUrl && generationMethod === "Variation" ? (
        <UploadButton />
      ) : (
        <div className="my-4 w-full h-full flex justify-center items-center border-dashed border-4 rounded-xl border-gray-400 relative group transition-all duration-300 overflow-hidden">
          <Image
            src={variationImage.imageUrl!}
            alt="Image"
            width={1000}
            height={1000}
            className="w-full h-full object-cover object-center rounded-xl"
          />
          <div className="absolute top-2 -right-12 group-hover:right-2 bg-black/70 backdrop-blur-sm rounded-3xl p-2 transition-all duration-300 ease-in-out">
            <div className="flex flex-col gap-y-2">
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger onClick={handleReplaceVariationImage}>
                    <Replace size={28} stroke="white" />
                  </TooltipTrigger>
                  <TooltipContent side="left" sideOffset={15} alignOffset={15}>
                    <p>Replace the image</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <hr />
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger onClick={handleDeleteVariationImage}>
                    <Trash2 size={28} stroke="white" />
                  </TooltipTrigger>
                  <TooltipContent side="left" sideOffset={15} alignOffset={15}>
                    <p>Delete the image</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
