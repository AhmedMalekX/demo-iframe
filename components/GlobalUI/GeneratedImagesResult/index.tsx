/*
 * NextJS & ReactJS components
 * */
import React, { useEffect, useState } from "react";
import Image from "next/image";

/*
 * Types
 * */
import { IImage } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

interface IGeneratedImagesResult {
  images: IImage[];
}

export const GeneratedImagesResult = ({ images }: IGeneratedImagesResult) => {
  const defaultGeneratedImagesNumber = new Array(4).fill(0);

  const [isMounted, setIsMounted] = useState(false);

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
        <div key={index} className="cursor-pointer">
          <Image
            src={image.url}
            alt={image.alt}
            width={100}
            height={100}
            className="object-cover rounded-xl border-2 border-appPrimaryActiveState p-0.5"
          />
        </div>
      ))}
    </div>
  );
};
