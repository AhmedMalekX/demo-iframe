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
    setGeneratedImages,
    submittingFormToGetData,
    generateFromImageNumberOfImages,
    generateFromTextNumberOfImages,
  } = useDashboardStore();

  useEffect(() => {
    if (!generatedImages?.imgs_dict_list.length) {
      setGeneratedImages({
        imgs_dict_list: [
          {
            imgFileUrl:
              "http://cdn.patterned.ai.s3-website-us-east-1.amazonaws.com/b60437a6-b8a8-44f5-9b68-56ac4566c847.png",

            imgUrl:
              "https://dsm6fpp1ioao4.cloudfront.net/b60437a6-b8a8-44f5-9b68-56ac4566c847.png",

            uiid: "d723a3ab-d8d9-4d05-8996-16fde86a43dd",
          },
        ],
        metadata: {
          prompt:
            "Embodying the essence of ethnic elegance, this mesmerizing watercolor artwork showcases a detailed botanical scene with beautifully rendered floral and leaf elements. The soft pastel color palette is accentuated by bold strokes and delicate shading, creating a visually striking balance between sophistication and natural beauty.",
        },
      });
    }
  }, []);

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
            if (activeGeneratingMethod === "From elements") {
              setActiveGeneratingMethod("From text");
            }
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
