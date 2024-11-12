/*
 * NextJS & ReactJS components
 * */
import React, { useEffect, useState } from "react";

/*
 * Stores
 * */
import { useDashboardStore } from "@/store/dashboard.store";

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

/*
 * Icons
 * */
import { RefreshCw } from "lucide-react";

interface IGeneratedImagePreview {
  url: string | null;
}

export const GeneratedImagePreview = ({ url }: IGeneratedImagePreview) => {
  const { imagePreviewZoom } = useDashboardStore();

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

  if (!url)
    return (
      <div className="flex w-full items-center justify-center h-[500px]">
        <h3 className="text-2xl font-semibold text-gray-500 text-center select-none">
          Image preview
        </h3>
      </div>
    );

  return (
    <div className="px-4">
      <div
        className="rounded-2xl transition-all duration-75 ease-linear relative"
        style={{
          backgroundImage: `url(${url})`,
          height: "500px",
          width: "100%",
          backgroundSize: `${imagePreviewZoom}%`,
          objectPosition: "center center",
        }}
      >
        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger className="absolute top-5 right-5 ">
              <RefreshCw
                className="bg-black bg-opacity-50 rounded-lg p-1 backdrop-blur-sm"
                stroke="white"
                size={30}
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
      </div>
    </div>
  );
};
