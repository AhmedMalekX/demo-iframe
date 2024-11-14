/*
 * NextJS & ReactJS components
 * */
import React from "react";
import Image from "next/image";

/*
 * UI Components
 * */
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

/*
 * Icons
 * */
import { Replace, Trash2 } from "lucide-react";

interface IUploadedImageProps {
  imageUrl: string;
  alt?: string;
  handleReplaceImage: () => void;
  handleDeleteImage: () => void;
}

export const UploadedImage = ({
  imageUrl,
  alt,
  handleReplaceImage,
  handleDeleteImage,
}: IUploadedImageProps) => {
  return (
    <div className="my-4 w-full h-full min-h-[300px] max-h-[300px] flex justify-center items-center border-dashed border-4 rounded-xl border-gray-400 relative group transition-all duration-300 overflow-hidden">
      <Image
        src={imageUrl}
        alt={alt || "Image"}
        width={1000}
        height={1000}
        className="w-full h-full object-cover object-center rounded-xl"
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
    </div>
  );
};
