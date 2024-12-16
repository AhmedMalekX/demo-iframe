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
import { useAbortStore } from "@/store/abort.store";

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
    setSelectedPreviewImage,
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
  const { accessToken, setAccessToken } = useAccessTokenStore();

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

  function waitForToken(timeout = 120000): Promise<string> {
    return new Promise((resolve, reject) => {
      let timeoutId: ReturnType<typeof setTimeout>;

      window.addEventListener("message", (event) => {
        console.log("==================x Received message:", event.data);
      });

      const expectedOrigin =
        process.env.NEXT_PUBLIC_PARENT_SITE_URL || "http://localhost:3000";

      function handleMessage(event: MessageEvent) {
        console.log("==================x Received message:", event);

        // Validate origin
        if (event.origin !== expectedOrigin) {
          console.warn(
            `==================x Ignored message from unexpected origin: ${event.origin}`,
          );
          return;
        }

        const { message, token } = event.data || {};
        console.log(
          `==================x Message data: ${JSON.stringify(event.data)}`,
        );

        // Abort check
        if (useAbortStore.getState().shouldAbortRequests) {
          console.log(
            "==================x Aborting token retrieval due to abort condition.",
          );
          cleanupListeners();
          reject(new Error("Aborted due to error condition"));
          return;
        }

        if (message === "accessToken") {
          console.log("==================x Validating received token...");

          validateAction(token)
            .then(({ isValidToken }) => {
              if (isValidToken) {
                console.log("==================x Token is valid:", token);
                cleanupListeners();
                resolve(token);
              } else {
                console.warn(
                  "==================x Invalid token received. Waiting for a valid token...",
                );
              }
            })
            .catch((err) => {
              console.error(
                "==================x Error during token validation:",
                err,
              );
            });
        }
      }

      function cleanupListeners() {
        window.removeEventListener("message", handleMessage);
        if (timeoutId) clearTimeout(timeoutId);
      }

      // Attach message listener
      window.addEventListener("message", handleMessage);

      // Set up timeout
      timeoutId = setTimeout(() => {
        console.error("==================x Timeout: No valid token received.");
        cleanupListeners();
        reject(new Error("Timeout: No valid token received"));
      }, timeout);
    });
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
     *  1- Validate access token
     *     -- Show alert if access token is expired!
     *  2- Get call Id
     *  3- Get image data
     *  4- Show loading while generating images on generate button
     *  5- Show loading cards while generating images
     *  6- Upload images ⏳
     *  7- Update database ⏳
     */

    const TIMEOUT = 2 * 60 * 1000; // 2 minutes
    const RETRY_DELAY = 2000; // 2 seconds

    const controller = new AbortController();
    const { signal } = controller;

    const retryWithDelay = async (
      fn: () => Promise<any>,
      delay: number,
      signal: AbortSignal,
    ) => {
      while (true) {
        if (signal.aborted) {
          throw new Error("Process aborted by timeout or user action.");
        }
        try {
          return await fn();
        } catch (err) {
          console.error("==================x Retrying due to error:", err);
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    };

    const ensureValidToken = async (): Promise<string> => {
      while (true) {
        console.log("==================x Ensuring valid token...");
        let validToken = accessToken;

        if (validToken && (await validateAction(validToken)).isValidToken) {
          console.log("==================x Valid token found.");
          return validToken;
        }

        const message = { message: "tokenExpired" };
        window.parent.postMessage(message, "*");

        toast.warning("Waiting for a valid token...");
        console.log("==================x Step: Valid token obtained.");
        validToken = await waitForToken(TIMEOUT);
        console.log(
          "==================x Step: Proceeding with token:",
          validToken,
        );

        if (useAbortStore.getState().shouldAbortRequests) {
          throw new Error("Process aborted during token refresh.");
        }

        setAccessToken(validToken);
        console.log(
          "==================x Token refreshed successfully:",
          validToken,
        );

        console.log("before finish the ensureValidToken function");
        return validToken;
      }
    };

    const executeProcess = async () => {
      console.log("==================x Starting executeProcess...");
      event.preventDefault();
      setSubmittingFormToGetData(true);

      if (useAbortStore.getState().shouldAbortRequests) {
        toast.error("Process aborted.");
        console.log("==================x Process aborted early.");
        return;
      }

      console.log("==================x Access token:", { accessToken });

      // Step 2: Validate and retrieve token
      console.log("==================x Step: Valid token obtained.");
      // const token = await retryWithDelay(() => ensureValidToken(), RETRY_DELAY);
      const token = await retryWithDelay(
        () => ensureValidToken(),
        RETRY_DELAY,
        signal,
      );
      console.log("==================x Step: Proceeding with token:", token);

      console.log({ token });

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
      setSelectedPreviewImage(
        getImageDataResponse.data.images.imgs_dict_list[0].imgUrl,
      );
    };

    try {
      console.log("==================x Starting handleGeneratePattern...");
      await Promise.race([
        // retryWithDelay(() => executeProcess(), RETRY_DELAY),
        retryWithDelay(() => executeProcess(), RETRY_DELAY, signal),
        new Promise((_, reject) =>
          setTimeout(() => {
            controller.abort(); // Abort retries when timeout is reached
            const timeoutMessage = { message: "stopProcess" };
            window.parent.postMessage(timeoutMessage, "*");
            reject(new Error("Process timed out"));
          }, TIMEOUT),
        ),
        // new Promise((_, reject) =>
        //   setTimeout(() => {
        //     // Notify parent to stop the process
        //     const timeoutMessage = { message: "stopProcess" };
        //     window.parent.postMessage(timeoutMessage, "*");
        //     reject(new Error("Process timed out"));
        //   }, TIMEOUT),
        // ),
      ]);
      console.log(
        "==================x handleGeneratePattern completed successfully.",
      );
    } catch (error: any) {
      console.error("==================x Process error:", error);
      toast.error(error.message || "Process failed.");
    } finally {
      console.log(
        "==================x handleGeneratePattern finished execution.",
      );
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
