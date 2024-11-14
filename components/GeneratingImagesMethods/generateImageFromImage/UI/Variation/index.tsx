/*
 * NextJS & ReactJS components
 */
import React from "react";

/*
 * Stores
 */
import { useUploadImagesModal } from "@/store/uploadImages.store";
import { useDashboardStore } from "@/store/dashboard.store";

/*
 * UI Components
 */
import { Slider } from "@/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { UploadButton } from "@/components/GeneratingImagesMethods/generateImageFromImage/UI/UploadButton";
import { UploadedImage } from "@/components/GeneratingImagesMethods/generateImageFromImage/UI/UploadedImage";

/*
 * Icons
 */
import { CircleHelp, LoaderCircle } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Prompt } from "@/components/GlobalUI/Prompt";
import { NumberOfImages } from "@/components/GlobalUI/NumberOfImages";
import { Button } from "@/components/ui/button";

export const Variation = () => {
  const {
    variationImage,
    setVariationImage,
    setIsUploadImagesModalOpen,
    setReplacingVariationImage,
    replacingVariationImage,
  } = useUploadImagesModal();

  const {
    generationMethod,
    keepStyle,
    setKeepStyle,
    keepOutline,
    setKeepOutline,
    generateFromImagePrompt,
    setGenerateFromImagePrompt,
  } = useDashboardStore();

  const handleReplaceVariationImage = () => {
    setReplacingVariationImage(true);
    setIsUploadImagesModalOpen();
  };

  const handleDeleteVariationImage = () => {
    setVariationImage({ imageUrl: null, uploaded: false });
  };

  // Render upload logic
  let content;

  if (!variationImage.imageUrl && generationMethod === "Variation") {
    content = <UploadButton />;
  } else if (replacingVariationImage) {
    content = (
      <div className="my-4 w-full h-full min-h-[300px] max-h-[300px] flex justify-center items-center border-dashed border-4 rounded-xl border-gray-400 relative group transition-all duration-300 overflow-hidden">
        <LoaderCircle size={30} className="animate-spin" />
      </div>
    );
  } else {
    content = (
      <UploadedImage
        imageUrl={variationImage.imageUrl!}
        alt="Variant image"
        handleReplaceImage={handleReplaceVariationImage}
        handleDeleteImage={handleDeleteVariationImage}
      />
    );
  }

  const tooltipContent = `
        - Be as descriptive as possible, use style names, artists names, colour scheme, vibe, etc <br />
        - Words at the beginning of the prompt have higher effect on the final image
  `;

  return (
    <div>
      {content}

      {/* Other variation options */}
      <div className="my-4 flex flex-col gap-y-4">
        {/*keep style*/}
        <div>
          <Label htmlFor="keepStyle" className="text-md my-2">
            <div className="flex items-center justify-start gap-x-2">
              <span>Keep style</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <CircleHelp size={22} />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    maintain some of the style, color, material and atmosphere.
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </Label>
          <Slider
            min={0.1}
            max={1}
            step={0.05}
            defaultValue={[keepStyle]}
            onValueChange={(value) => {
              setKeepStyle(+value[0]);
            }}
            name="keepStyle"
            className="mt-2"
          />
        </div>

        {/*keep outline*/}
        <div>
          <Label htmlFor="keepOutline" className="text-md my-2">
            <div className="flex items-center justify-start gap-x-2">
              <span>Keep outline</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <CircleHelp size={22} />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    maintain some of the spatial layout, structure, and
                    composition.
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </Label>
          <Slider
            min={0.1}
            max={1}
            step={0.05}
            defaultValue={[keepOutline]}
            onValueChange={(value) => {
              setKeepOutline(+value[0]);
            }}
            name="keepOutline"
            className="mt-2"
          />
        </div>

        {/*prompt*/}
        <div>
          <Prompt
            title="Prompt (Optional)"
            id="prompt"
            showGuidToGeneratePrompt={false}
            tooltipContent={tooltipContent}
            showTryAnExample={false}
            value={generateFromImagePrompt || ""}
            setValue={setGenerateFromImagePrompt}
            placeholder="Describe your pattern elements, colors and background..."
          />
        </div>

        {/*number of images*/}
        <div className="!-my-4">
          <NumberOfImages />
        </div>

        {/*Generate button*/}
        <Button variant="primary" size="primary" className="mt-4 w-full">
          Generate pattern
        </Button>
      </div>
    </div>
  );
};
