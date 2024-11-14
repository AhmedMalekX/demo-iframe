/*
 * NextJS & ReactJS components
 * */
import React from "react";

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

export const GenerateImageFromImage = () => {
  const { generationMethod } = useDashboardStore();

  return (
    <div>
      <SelectFromImageMethod />

      {generationMethod === "Variation" && <Variation />}

      {generationMethod === "Image mixing" && <ImageMixing />}
    </div>
  );
};
