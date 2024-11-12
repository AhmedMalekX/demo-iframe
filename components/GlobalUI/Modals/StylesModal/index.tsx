/*
 * React & Next.js components
 * */
import React from "react";
import Image from "next/image";

/*
 * Stores
 * */
import { useDashboardStore } from "@/store/dashboard.store";
import { useActiveGeneratingMethodStore } from "@/store/generatingImages.store";

/*
 * Components
 * */
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

/*
 * Constants
 * */
import { StylesNames } from "@/constants";

export const StylesModal = () => {
  const {
    openStylesModal,
    setOpenStylesModal,
    setGenerateFromTextStyleName,
    setGenerateFromImageStyleName,
  } = useDashboardStore();
  const { activeGeneratingMethod } = useActiveGeneratingMethodStore();

  const handleStyleSelect = (style: {
    styleName: (typeof StylesNames)[number]["styleName"];
  }) => {
    if (activeGeneratingMethod === "From text") {
      setGenerateFromTextStyleName(style.styleName);
    } else {
      setGenerateFromImageStyleName(style.styleName);
    }

    setOpenStylesModal(false);
  };

  return (
    <Dialog open={openStylesModal} onOpenChange={setOpenStylesModal}>
      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">
            Select a style.
          </DialogTitle>
          <DialogDescription asChild>
            <ScrollArea className="min-h-96 mt-2">
              <div className="flex flex-wrap w-full gap-6 px-4">
                {StylesNames.map((style, index) => (
                  <div
                    key={index}
                    onClick={() => handleStyleSelect(style)}
                    className="w-28 h-28 flex flex-col group mt-4 cursor-pointer"
                  >
                    <Image
                      alt={style.styleName}
                      src={style.styleImage}
                      width={250}
                      height={250}
                      className="rounded-md object-cover w-full h-full group-hover:scale-110 transition duration-300 group-hover:border-2 group-hover:border-primary"
                    />
                    <span className="text-center mt-2 font-medium">
                      {style.styleName}
                    </span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
