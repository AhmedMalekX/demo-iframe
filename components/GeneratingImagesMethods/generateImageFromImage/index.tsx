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
import { SelectFromImageMethod } from "@/components/GeneratingImagesMethods/generateImageFromImage/UI/SelectFromImageMethod";
import { Variation } from "@/components/GeneratingImagesMethods/generateImageFromImage/UI/Variation";
import { ImageMixing } from "@/components/GeneratingImagesMethods/generateImageFromImage/UI/ImageMixing";
import { Skeleton } from "@/components/ui/skeleton";

export const GenerateImageFromImage = () => {
  const { generationMethod } = useDashboardStore();

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="pb-4">
        <Skeleton className="w-full h-[50px]" />
        <Skeleton className="w-full h-[150px] my-4" />
        <Skeleton className="w-full h-[150px] my-4" />
        <Skeleton className="w-full h-[180px] my-4" />
        <Skeleton className="w-full h-[50px] my-4" />
        <Skeleton className="w-full h-[50px]" />
      </div>
    );
  }

  return (
    <div>
      <SelectFromImageMethod />

      {generationMethod === "Variation" && <Variation />}

      {generationMethod === "Image mixing" && <ImageMixing />}
    </div>
  );
};
