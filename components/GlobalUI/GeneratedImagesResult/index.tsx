/*
 * NextJS & ReactJS components
 * */
import React, { useEffect, useState } from "react";
import Image from "next/image";

/*
 * Stores
 * */
import { useDashboardStore } from "@/store/dashboard.store";
import { useActiveGeneratingMethodStore } from "@/store/generatingImages.store";

/*
 * UI Components
 * */
import { Skeleton } from "@/components/ui/skeleton";

/*
 * Utils
 * */
import { cn } from "@/lib/utils";

/*
 * Types
 * */
import { IImage } from "@/types";

interface IGeneratedImagesResult {
  images: IImage[];
}

export const GeneratedImagesResult = ({ images }: IGeneratedImagesResult) => {
  const defaultGeneratedImagesNumber = new Array(4).fill(0);

  const [isMounted, setIsMounted] = useState(false);

  const { setActiveGeneratingMethod } = useActiveGeneratingMethodStore();
  const { selectedPreviewImage, setSelectedPreviewImage } = useDashboardStore();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted)
    return (
      <div className="flex items-center justify-center gap-x-2">
        {defaultGeneratedImagesNumber.map((_, index) => (
          <Skeleton key={index} className="w-[100px] h-[100px]" />
        ))}
      </div>
    );

  /*
   * TODO:
   *  1- Get the actual generated images from zustand storage
   *  2- Display the actual generated images
   *  3- Handle the case when there is no images ✅
   *  4- Add functionality to select image and update the image preview ✅
   * */

  if (images.length === 0)
    return (
      <div className="flex items-center justify-center">
        <h3 className="font-semibold text-2xl text-gray-500">
          Generated images will be displayed here.
        </h3>
      </div>
    );

  return (
    <div className="flex items-center justify-center gap-x-2">
      {images.map((image, index) => (
        <div
          key={index}
          className="cursor-pointer"
          onClick={() => {
            setSelectedPreviewImage(image.url);
            setActiveGeneratingMethod("From text");
          }}
        >
          <Image
            src={image.url}
            alt={image.alt}
            width={100}
            height={100}
            className={cn(
              "object-cover rounded-xl border-2 p-0.5",
              selectedPreviewImage === image.url &&
                "border-appPrimaryActiveState",
            )}
          />
        </div>
      ))}
    </div>
  );
};
