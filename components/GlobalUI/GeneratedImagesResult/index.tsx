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

export const GeneratedImagesResult = () => {
  const [isMounted, setIsMounted] = useState(false);

  const { setActiveGeneratingMethod, activeGeneratingMethod } =
    useActiveGeneratingMethodStore();
  const {
    selectedPreviewImage,
    setSelectedPreviewImage,
    generatedImages,
    submittingFormToGetData,
    generateFromImageNumberOfImages,
    generateFromTextNumberOfImages,
  } = useDashboardStore();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted)
    return (
      <div className="flex items-center justify-center gap-x-2">
        <Skeleton className="w-full h-[35px]" />
      </div>
    );

  if (!submittingFormToGetData && !generatedImages) {
    return (
      <div className="flex items-center justify-center h-20">
        <h3 className="font-semibold text-2xl text-gray-500">
          Generated images will be displayed here.
        </h3>
      </div>
    );
  }

  if (submittingFormToGetData) {
    const loadingCards = new Array(
      activeGeneratingMethod === "From text"
        ? generateFromTextNumberOfImages
        : generateFromImageNumberOfImages,
    ).fill(0);

    return (
      <div className="flex items-center justify-center gap-x-2">
        {loadingCards.map((_, index) => (
          <div key={index}>
            <Skeleton key={index} className="w-[100px] h-[100px]" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-x-2">
      {generatedImages?.imgs_dict_list?.map((image) => (
        <div
          key={image.uiid}
          className="cursor-pointer"
          onClick={() => {
            setSelectedPreviewImage(image.imgUrl);
            setActiveGeneratingMethod("From text");
          }}
        >
          <Image
            src={image.imgUrl}
            alt={generatedImages.metadata.prompt}
            width={100}
            height={100}
            className={cn(
              "object-cover rounded-xl border-2 p-0.5",
              selectedPreviewImage === image.imgUrl &&
                "border-appPrimaryActiveState",
            )}
          />
        </div>
      ))}
    </div>
  );
};
