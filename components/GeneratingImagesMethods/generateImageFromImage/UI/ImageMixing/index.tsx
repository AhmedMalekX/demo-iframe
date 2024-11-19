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
import { UploadButton } from "@/components/GeneratingImagesMethods/generateImageFromImage/UI/UploadButton";
import { UploadedImage } from "@/components/GeneratingImagesMethods/generateImageFromImage/UI/UploadedImage";
import { Prompt } from "@/components/GlobalUI/Prompt";
import { NumberOfImages } from "@/components/GlobalUI/NumberOfImages";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

/*
 * helpers
 * */
import { validateAction } from "@/helpers/validateAction";
import { getFromImageCallIdHelper } from "@/helpers/getFromImageCallIdHelper";
import { getImageDataHelper } from "@/helpers/getImageDataHelper";

/*
 * Types
 * */
import { MixingImage } from "@/components/GeneratingImagesMethods/GenerateImageFromElements/createTabEngine/types";

/*
 * Icons
 * */
import { LoaderCircle } from "lucide-react";

export const ImageMixing = () => {
  const {
    generateFromImagePrompt,
    setGenerateFromImagePrompt,
    submittingFormToGetData,
    setSubmittingFormToGetData,
    setShowErrorModal,
    setErrorModalMessage,
    generateFromImageNumberOfImages,
    setGeneratedImages,
  } = useDashboardStore();

  const {
    firstMixingImage,
    secondMixingImage,
    setFirstMixingImage,
    setSecondMixingImage,
    firstMixingImageStrength,
    firstMixingImageSourceType,
    secondMixingImageStrength,
    secondMixingImageSourceType,
    setUploadButtonId,
    setIsUploadImagesModalOpen,
    setReplacingFirstMixingImage,
    setReplacingSecondMixingImage,
    replacingFirstMixingImage,
    replacingSecondMixingImage,
  } = useUploadImagesStore();
  const { accessToken } = useAccessTokenStore();

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

  const handleGeneratePattern = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    /**
     * TODO:
     *  1- Validate access token
     *     -- Show alert if access token is expired!
     *  2- Get call Id
     *  3- Get image data
     *  4- Show loading while generating images on generate button
     *  5- Show loading cards while generating images
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

      if (!firstMixingImage && !secondMixingImage) {
        setErrorModalMessage({
          header: "Invalid data error",
          body: "Image mixing requires 2 images.",
        });
        setShowErrorModal(true);
        setSubmittingFormToGetData(false);
        return;
      }

      if (!firstMixingImage || !secondMixingImage) {
        setErrorModalMessage({
          header: "Invalid data error",
          body: "Mixing required image.",
        });
        setShowErrorModal(true);
        setSubmittingFormToGetData(false);
        return;
      }

      const mixingImages: MixingImage[] = [
        {
          url: firstMixingImage,
          url_type: firstMixingImage.startsWith("data") ? "data_url" : "http",
          source_type: firstMixingImageSourceType,
          strength: firstMixingImageStrength,
        },
        {
          url: secondMixingImage,
          url_type: secondMixingImage.startsWith("data") ? "data_url" : "http",
          source_type: secondMixingImageSourceType,
          strength: secondMixingImageStrength,
        },
      ];

      // 2- Get call ID
      const { callId } = await getFromImageCallIdHelper({
        prompt: generateFromImagePrompt || "",
        setShowErrorModal,
        setErrorModalMessage,
        numberOfImages: generateFromImageNumberOfImages,
        imageUrl: mixingImages,
        id: "123",
        generationMethod: "Image mixing",
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
  );
};
