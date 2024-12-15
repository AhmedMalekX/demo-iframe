/*
 * NextJS & ReactJS components
 * */
import React, { useEffect, useState } from "react";
import Image from "next/image";

/*
 * Stores
 * */
import { useDashboardStore } from "@/store/dashboard.store";
import { useUploadImagesStore } from "@/store/uploadImages.store";
import { useCreateTabStore } from "@/store/createTab.store";
import { useActiveGeneratingMethodStore } from "@/store/generatingImages.store";

/*
 * UI Components
 * */
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { EditorPreview } from "@/components/GeneratingImagesMethods/GenerateImageFromElements/createTabComponents/EditorPreview";

/*
 * Icons
 * */
import { RefreshCw } from "lucide-react";

interface IGeneratedImagePreview {
  url: string | null;
}

export const GeneratedImagePreview = ({ url }: IGeneratedImagePreview) => {
  const { selectedMockup, scalingFactor, setGenerationMethod } =
    useDashboardStore();
  const { activeGeneratingMethod, setActiveGeneratingMethod } =
    useActiveGeneratingMethodStore();
  const { setVariationImage } = useUploadImagesStore();
  const { previewZoom, zoom, pan, finalResoluton } = useCreateTabStore();

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="flex w-full items-center justify-center h-[500px]">
        <Skeleton className="w-full h-[500px]" />
      </div>
    );
  }

  console.log({ finalResoluton, pan, previewZoom, zoom });

  if (activeGeneratingMethod === "From elements") {
    return (
      <div className="flex w-full justify-center h-[500px] max-h-[500px] overflow-hidden">
        <EditorPreview
          finalResoluton={finalResoluton}
          pan={pan}
          previewZoom={previewZoom}
          zoom={zoom}
        />
      </div>
    );
  }

  if (!url)
    return (
      <div className="flex items-center justify-center h-[500px] w-full">
        <h3 className="text-2xl font-semibold text-gray-500 text-center select-none">
          Image preview
        </h3>
      </div>
    );

  const handleGenerateSimilar = () => {
    setActiveGeneratingMethod("From image");
    setGenerationMethod("Variation");
    setVariationImage({ imageUrl: url, uploaded: true });
  };

  const renderImageContent = () => (
    <TooltipProvider>
      <Tooltip delayDuration={0}>
        <TooltipTrigger className="absolute top-5 right-5">
          <RefreshCw
            className="bg-black bg-opacity-50 rounded-lg p-1 backdrop-blur-sm"
            stroke="white"
            size={30}
            role="button"
            onClick={handleGenerateSimilar}
          />
        </TooltipTrigger>
        <TooltipContent
          align="end"
          side="left"
          alignOffset={-2}
          sideOffset={10}
          className="!px-2 py-1 mb-0.5"
        >
          <p className="select-none">Generate similar</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  return (
    <div className="px-4">
      <div className="rounded-2xl transition-all duration-75 ease-linear relative w-full h-[500px] flex justify-center">
        {selectedMockup ? (
          <div className="w-full flex justify-center bg-[#f8f8f8]">
            <Image
              src={`/products/${selectedMockup}.png`}
              alt="Image preview"
              width={1000}
              height={1000}
              style={{
                backgroundImage: `url("${url}")`,
                backgroundSize: `${scalingFactor * 100}%`,
                objectFit: "cover",
                objectPosition: "center",
              }}
              className="w-auto max-h-[500px] object-cover object-center"
            />
            {renderImageContent()}
          </div>
        ) : (
          <div
            className="rounded-2xl transition-all duration-75 ease-linear relative"
            style={{
              backgroundImage: `url(${url})`,
              height: "500px",
              width: "100%",
              backgroundSize: `${scalingFactor * 100}%`,
              objectPosition: "center center",
            }}
          >
            {renderImageContent()}
          </div>
        )}
      </div>
    </div>
  );
};
