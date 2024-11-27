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
import { Download, Timer } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

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
          <PopoverContent align="end" className="w-full">
            <Tabs defaultValue="tile" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="tile">Pattern Tile</TabsTrigger>
                <TabsTrigger value="repeated">Repeated Pattern</TabsTrigger>
              </TabsList>
              <TabsContent value="tile">
                <div className="flex flex-col gap-y-3">
                  <div className="flex flex-col gap-y-2">
                    <Button
                      size="lg"
                      variant="outline"
                      className="flex items-center w-full"
                    >
                      <Download /> <span>Download Standard (1024 x 1024)</span>
                    </Button>
                    <p className="text-gray-600 italic">
                      Best for small images, web use, or low-resolution
                      applications.
                    </p>
                  </div>
                  <div className="flex flex-col gap-y-2">
                    <Button size="lg">
                      <Timer />
                      <span>
                        Upscale and Download High Quality (4096 x 4096, ~60
                        seconds)
                      </span>
                    </Button>
                    <p className="text-gray-600 italic">
                      Ideal for large prints, high-resolution displays, or where
                      zooming is required.
                    </p>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="repeated">
                <div>repeated</div>
              </TabsContent>
            </Tabs>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};
