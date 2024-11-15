/*
 * NextJS & ReactJS components
 * */
import React from "react";
import Image from "next/image";

/*
 * Stores
 * */
import { useDashboardStore } from "@/store/dashboard.store";
import { useUploadImagesModal } from "@/store/uploadImages.store";

/*
 * UI Components
 * */
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";

/*
 * Utils
 * */
import { cn } from "@/lib/utils";

/*
 * Icons
 * */
import { CircleHelp, Replace, Trash2 } from "lucide-react";

interface IUploadedImageProps {
  imageUrl: string;
  alt?: string;
  handleReplaceImage: () => void;
  handleDeleteImage: () => void;
  id?: number;
}

export const UploadedImage = ({
  imageUrl,
  alt,
  handleReplaceImage,
  handleDeleteImage,
  id = 1, // default id to 1 if not provided
}: IUploadedImageProps) => {
  const { generationMethod } = useDashboardStore();
  const {
    firstMixingImageSourceType,
    secondMixingImageSourceType,
    setMixingImageSourceType,
    firstMixingImageStrength,
    secondMixingImageStrength,
    setFirstMixingImageStrength,
    setSecondMixingImageStrength,
  } = useUploadImagesModal();

  // Determine selected type and strength based on id
  const selectedType =
    id === 1 ? firstMixingImageSourceType : secondMixingImageSourceType;
  const strength =
    id === 1 ? firstMixingImageStrength : secondMixingImageStrength;
  const setStrength =
    id === 1 ? setFirstMixingImageStrength : setSecondMixingImageStrength;

  return (
    <div className="flex justify-center items-center flex-col my-4 w-full h-full border-dashed border-4 rounded-xl border-gray-400 relative group transition-all duration-300 overflow-hidden bg-gray-300">
      <Image
        src={imageUrl}
        alt={alt || "Image"}
        width={1000}
        height={1000}
        className="w-full h-full object-cover object-center rounded-xl min-h-[300px] max-h-[300px]"
      />
      <div className="absolute top-2 -right-12 group-hover:right-2 bg-black/70 backdrop-blur-sm rounded-3xl p-2 transition-all duration-300 ease-in-out">
        <div className="flex flex-col gap-y-2">
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger onClick={handleReplaceImage}>
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
              <TooltipTrigger onClick={handleDeleteImage}>
                <Trash2 size={28} stroke="white" />
              </TooltipTrigger>
              <TooltipContent side="left" sideOffset={15} alignOffset={15}>
                <p>Delete the image</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Keep style and keep outline */}
      {generationMethod === "Image mixing" && (
        <div className="flex flex-col lg:flex-row gap-y-3 lg:gap-y-0 w-full self-start justify-between px-2 py-2 ">
          <div className="flex flex-col gap-y-1">
            <div className="flex items-center gap-x-1">
              <h4>Use from this image</h4>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <CircleHelp size={20} />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-sm">
                    Style (color, material and atmosphere ) or Outline (spatial
                    layout, structure, and composition )
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="flex gap-x-2 p-0.5 bg-gray-200 rounded-full">
              <span
                className={cn(
                  "w-1/2 cursor-pointer text-center text-black",
                  selectedType === "outline" && "rounded-full bg-white",
                )}
                role="button"
                onClick={() => setMixingImageSourceType(id, "outline")}
              >
                Outline
              </span>
              <span
                className={cn(
                  "w-1/2 cursor-pointer text-center text-black",
                  selectedType === "style" && "rounded-full bg-white",
                )}
                role="button"
                onClick={() => setMixingImageSourceType(id, "style")}
              >
                Style
              </span>
            </div>
          </div>

          <Separator
            orientation="vertical"
            className="bg-gray-100 w-1 h-14 rounded-full hidden lg:flex"
          />

          <div className="flex flex-col gap-y-3">
            <div className="flex items-center gap-x-1">
              <h4>Strength</h4>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <CircleHelp size={20} />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-sm">
                    The amount of image guidance to apply
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div>
              <Slider
                min={0.1}
                max={1}
                step={0.05}
                defaultValue={[strength]}
                onValueChange={(value) => {
                  setStrength(value[0]);
                }}
                name="strength"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
