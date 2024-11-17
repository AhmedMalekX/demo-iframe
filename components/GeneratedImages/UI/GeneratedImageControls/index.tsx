/*
 * NextJS & ReactJS Components
 * */
import React, { useEffect, useState } from "react";

/*
 * Stores
 * */
import { useDashboardStore } from "@/store/dashboard.store";

/*
 * UI Components
 * */
import { Slider } from "@/components/ui/slider";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

/*
 * Icons
 * */
import { Download } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export const GeneratedImageControls = () => {
  const { imagePreviewZoom, setImagePreviewZoom } = useDashboardStore();

  /*
   * TODO:
   *  1- Add download options
   * */

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted)
    return (
      <div className="py-4 flex items-center justify-between w-full">
        <div className="w-1/2">
          <Skeleton className="w-full h-8" />
        </div>

        <div className="w-1/6">
          <Skeleton className="w-full h-8" />
        </div>
      </div>
    );

  return (
    <div className="py-4 flex items-center justify-between w-full">
      {/*Slider */}
      <div className="w-full flex items-center gap-x-2">
        <h3>Zoom</h3>
        <Slider
          min={10}
          max={100}
          step={5}
          name="imagePreviewZoom"
          className="cursor-pointer w-1/2"
          value={[imagePreviewZoom]}
          onValueChange={(value) => {
            setImagePreviewZoom(value[0]);
          }}
        />
        <span className="font-medium">{imagePreviewZoom}%</span>
      </div>
      <div>
        <Popover>
          <PopoverTrigger>
            <p
              className="flex items-center gap-x-2 h-9 px-4 py-2 rounded-2xl bg-[#8920ce] text-white shadow hover:bg-[#8920ce]/90"
              role="button"
            >
              <Download />
              <span>Download</span>
            </p>
          </PopoverTrigger>
          <PopoverContent align="end">Download options!</PopoverContent>
        </Popover>
      </div>
    </div>
  );
};
