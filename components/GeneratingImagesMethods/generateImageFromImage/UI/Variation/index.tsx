/*
 * NextJS & ReactJS components
 */
import React from "react";

/*
 * Stores
 */
import { useUploadImagesStore } from "@/store/uploadImages.store";
import { useDashboardStore } from "@/store/dashboard.store";
import { useAccessTokenStore } from "@/store/accessToken.store";

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
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

/*
 * Global UI components
 * */
import { Prompt } from "@/components/GlobalUI/Prompt";
import { NumberOfImages } from "@/components/GlobalUI/NumberOfImages";

/*
 * helpers
 * */
import { validateAction } from "@/helpers/validateAction";
import { getFromImageCallIdHelper } from "@/helpers/getFromImageCallIdHelper";
import { getImageDataHelper } from "@/helpers/getImageDataHelper";

/*
 * Icons
 */
import { CircleHelp, LoaderCircle } from "lucide-react";

export const Variation = () => {
  const {
    variationImage,
    setVariationImage,
    setIsUploadImagesModalOpen,
    setReplacingVariationImage,
    replacingVariationImage,
  } = useUploadImagesStore();
  const { accessToken } = useAccessTokenStore();

  const {
    generationMethod,
    keepStyle,
    setKeepStyle,
    keepOutline,
    setKeepOutline,
    generateFromImagePrompt,
    setGenerateFromImagePrompt,
    submittingFormToGetData,
    setSubmittingFormToGetData,
    generateFromImageNumberOfImages,
    setShowErrorModal,
    setErrorModalMessage,
    setGeneratedImages,
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
        — Be as descriptive as possible, use style names, artists' names, color scheme, vibe, etc. <br />
        — Words at the beginning of the prompt have a higher effect on the final image
  `;

  const handleGeneratePattern = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    /**
     * TODO:
     *  1- Validate access token ✅
     *     -- Show alert if access token is expired! ✅
     *  2- Get call Id ✅
     *  3- Get image data ✅
     *  4- Show loading while generating images on generate button ✅
     *  5- Show loading cards while generating images ✅
     *  6- Upload images ⏳
     *  7- Update database ⏳
     */

    try {
      event.preventDefault();
      setSubmittingFormToGetData(true);

      /**
       * TODO: UNCOMMENT THIS BEFORE MERGE TO ( DEV ) BRANCH
       */

      // 1- Validate access token
      // if (!accessToken) {
      //   toast.error("Access token is missing!");
      //   setSubmittingFormToGetData(false);
      //   return;
      // }

      if (accessToken) {
        const { isValidToken } = await validateAction(accessToken);

        // Show alert if access token is expired!
        if (!isValidToken) {
          toast.error("Your access token is expired, request for new one.");
          setSubmittingFormToGetData(false);
          return;
        }
      }

      // 2- Get call ID
      const { callId } = await getFromImageCallIdHelper({
        prompt: generateFromImagePrompt || "",
        setShowErrorModal,
        setErrorModalMessage,
        keepStyle,
        keepOutline,
        numberOfImages: generateFromImageNumberOfImages,
        imageUrl: variationImage.imageUrl!,
        id: "123",
        generationMethod: "Variation",
      });

      if (callId === "0") {
        toast.error("Something went wrong, please try again!");
        setSubmittingFormToGetData(false);
        return;
      }

      // 3- Get image data
      const getImageDataResponse: any = await getImageDataHelper({
        callId,
        userId: "123",
      });

      if (getImageDataResponse?.status === 500) {
        setErrorModalMessage({
          header: "Invalid data error",
          body: "Something went wrong, please try again!",
        });
        setShowErrorModal(true);
        setSubmittingFormToGetData(false);
        return;
      }

      console.log({ getImageDataResponse });
      setGeneratedImages(getImageDataResponse.data.images);
    } catch (error) {
      console.log({ error });
      setSubmittingFormToGetData(false);
    } finally {
      setSubmittingFormToGetData(false);
    }
  };

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
        <Button
          variant="primary"
          size="primary"
          className="mt-4 w-full"
          disabled={submittingFormToGetData}
          onClick={handleGeneratePattern}
        >
          {submittingFormToGetData ? (
            <LoaderCircle size={24} className="animate-spin !w-7 !h-7" />
          ) : (
            "Generate pattern"
          )}
        </Button>
      </div>
    </div>
  );
};
