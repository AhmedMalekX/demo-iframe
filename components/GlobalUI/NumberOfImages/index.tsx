/*
 * NextJS & ReactJS components
 * */
import React from "react";

/*
 * Stores
 * */
import { useActiveGeneratingMethodStore } from "@/store/generatingImages.store";
import { useDashboardStore } from "@/store/dashboard.store";

/*
 * UI Components
 * */
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Slider } from "@/components/ui/slider";

/*
 * Icons
 * */
import { CircleHelp } from "lucide-react";

export const NumberOfImages = () => {
  const { activeGeneratingMethod } = useActiveGeneratingMethodStore();
  const {
    generateFromTextNumberOfImages,
    generateFromImageNumberOfImages,
    setGenerateFromTextNumberOfImages,
    setGenerateFromImageNumberOfImages,
  } = useDashboardStore();

  return (
    <div className="mt-4">
      {/*Header*/}
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-md">Number of images</h3>
        <div className="flex items-center gap-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <CircleHelp size={22} />
              </TooltipTrigger>
              <TooltipContent className="max-w-md mb-2">
                Get multiple images from a single prompt to increase your
                chances of getting the desired result.
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <div className="border px-2.5 py-1 rounded-md">
            <span>
              {activeGeneratingMethod === "From text" &&
                generateFromTextNumberOfImages}
            </span>
            <span>
              {activeGeneratingMethod === "From image" &&
                generateFromImageNumberOfImages}
            </span>
          </div>
        </div>
      </div>

      {/*Slider*/}
      <Slider
        min={1}
        max={4}
        step={3}
        value={[
          activeGeneratingMethod === "From text"
            ? generateFromTextNumberOfImages
            : generateFromImageNumberOfImages,
        ]}
        onValueChange={(value) => {
          if (value[0] === 1) {
            if (activeGeneratingMethod === "From text") {
              setGenerateFromTextNumberOfImages(2);
            } else {
              setGenerateFromImageNumberOfImages(2);
            }
            return;
          }

          if (activeGeneratingMethod === "From text") {
            setGenerateFromTextNumberOfImages(value[0]);
          } else {
            setGenerateFromImageNumberOfImages(value[0]);
          }
        }}
        name="numberOfImages"
        // disabled={submittingFromToGetData}
        className="cursor-pointer !mt-3"
      />
    </div>
  );
};
