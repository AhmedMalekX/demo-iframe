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
import { UploadButton } from "@/components/GeneratingImagesMethods/generateImageFromImage/UI/UploadButton";
import { UploadedImage } from "@/components/GeneratingImagesMethods/generateImageFromImage/UI/UploadedImage";
import { Prompt } from "@/components/GlobalUI/Prompt";

/*
 * Icons
 * */
import { LoaderCircle } from "lucide-react";
import { NumberOfImages } from "@/components/GlobalUI/NumberOfImages";
import { Button } from "@/components/ui/button";

export const ImageMixing = () => {
  const { generateFromImagePrompt, setGenerateFromImagePrompt } =
    useDashboardStore();

  const {
    firstMixingImage,
    secondMixingImage,
    setFirstMixingImage,
    setSecondMixingImage,
    setUploadButtonId,
    setIsUploadImagesModalOpen,
    setReplacingFirstMixingImage,
    setReplacingSecondMixingImage,
    replacingFirstMixingImage,
    replacingSecondMixingImage,
  } = useUploadImagesModal();

  const handleReplaceVariationImage = (id: number) => {
    setUploadButtonId(id);

    if (id === 1) {
      setReplacingFirstMixingImage(true);
    } else {
      setReplacingSecondMixingImage(true);
    }

    setIsUploadImagesModalOpen();
  };

  const handleDeleteVariationImage = (id: number) => {
    if (id === 1) {
      setFirstMixingImage(null);
    } else {
      setSecondMixingImage(null);
    }
  };

  const tooltipContent = `
        — Be as descriptive as possible, use style names, artists' names, color scheme, vibe, etc. <br />
        — Words at the beginning of the prompt have a higher effect on the final image
  `;

  return (
    <div className="my-4">
      {/* First Mixing Image Handling */}
      {replacingFirstMixingImage ? (
        <div className="my-4 w-full h-full min-h-[300px] max-h-[300px] flex justify-center items-center border-dashed border-4 rounded-xl border-gray-400 relative group transition-all duration-300 overflow-hidden">
          <LoaderCircle size={30} className="animate-spin" />
        </div>
      ) : firstMixingImage ? (
        <UploadedImage
          imageUrl={firstMixingImage}
          alt="First mixing image"
          handleReplaceImage={() => handleReplaceVariationImage(1)}
          handleDeleteImage={() => handleDeleteVariationImage(1)}
          id={1}
        />
      ) : (
        <UploadButton uploadButtonId={1} />
      )}

      {/* Second Mixing Image Handling */}
      {replacingSecondMixingImage ? (
        <div className="my-4 w-full h-full min-h-[300px] max-h-[300px] flex justify-center items-center border-dashed border-4 rounded-xl border-gray-400 relative group transition-all duration-300 overflow-hidden">
          <LoaderCircle size={30} className="animate-spin" />
        </div>
      ) : secondMixingImage ? (
        <UploadedImage
          imageUrl={secondMixingImage}
          alt="Second mixing image"
          handleReplaceImage={() => handleReplaceVariationImage(2)}
          handleDeleteImage={() => handleDeleteVariationImage(2)}
          id={2}
        />
      ) : (
        <UploadButton uploadButtonId={2} />
      )}

      <div>
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
      </div>

      {/*number of images*/}
      <div className="mt-4">
        <NumberOfImages />
      </div>

      {/*Generate button*/}
      <Button variant="primary" size="primary" className="mt-4 w-full">
        Generate pattern
      </Button>
    </div>
  );
};
