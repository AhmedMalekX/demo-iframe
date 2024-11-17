/*
 * NextJS & ReactJS components
 * */
import React from "react";

/*
 * Store
 * */
import { useDashboardStore } from "@/store/dashboard.store";
import { useAccessTokenStore } from "@/store/accessToken.store";

/*
 * UI components
 * */
import { Button } from "@/components/ui/button";

/*
 * Global UI Components
 * */
import { Styles } from "@/components/GlobalUI/Styles";
import { NumberOfImages } from "@/components/GlobalUI/NumberOfImages";
import { Prompt } from "@/components/GlobalUI/Prompt";
import { toast } from "sonner";

/*
 * Helpers
 * */
import { validateAction } from "@/helpers/validateAction";
import { getCallIdHelper } from "@/helpers/getCallIdHelper";
import { getImageDataHelper } from "@/helpers/getImageDataHelper";
import Cookies from "js-cookie";
import { LoaderCircle } from "lucide-react";

export const GenerateImageFromText = () => {
  const {
    prompt,
    setPrompt,
    setErrorModalMessage,
    setShowErrorModal,
    generateFromTextNumberOfImages,
    generateFromTextStyleName,
    submittingFormToGetData,
    setSubmittingFormToGetData,
    setGeneratedImages,
  } = useDashboardStore();
  const { accessToken } = useAccessTokenStore();

  const tooltipContent = `
        — Be as descriptive as possible, use style names, artists' names, color scheme, vibe, etc. <br />
        — Words at the beginning of the prompt have a higher effect on the final image
  `;

  return (
    <div>
      {/*Prompt*/}
      <Prompt
        value={prompt || ""}
        id="prompt"
        setValue={setPrompt}
        showTryAnExample={true}
        tooltipContent={tooltipContent}
        showGuidToGeneratePrompt={true}
        title="Prompt"
        placeholder="Describe your pattern elements, colours and background..."
      />

      <hr className="mt-6" />

      {/*Styles*/}
      <Styles />

      {/*Number of images*/}
      <NumberOfImages />

      {/*Generate button*/}
      <Button
        variant="primary"
        size="primary"
        className="mb-5 mt-5 w-full"
        disabled={submittingFormToGetData}
        onClick={async (event) => {
          /*
           * TODO:
           *  1- Validate access token ✅
           *     -- Show alert if access token is expired! ✅
           *  2- Get call Id ✅
           *  3- Get image data ✅
           *  4- Show loading while generating images on generate button ✅
           *  5- Show loading cards while generating images
           *  6- Upload images ⏳
           *  7- Update database ⏳
           * */

          try {
            event.preventDefault();
            setSubmittingFormToGetData(true);

            // 1- Validate access token
            if (accessToken) {
              const { isValidToken } = await validateAction(accessToken);

              // Show alert if access token is expired!
              if (!isValidToken) {
                toast.error(
                  "Your access token is expired, request for new one.",
                );
                setSubmittingFormToGetData(false);
                return;
              }
            }

            if (!prompt) {
              toast.error("Prompt is required!");
              setSubmittingFormToGetData(false);
              return;
            }

            // 2- Get call ID
            const { callId } = await getCallIdHelper({
              setErrorModalMessage,
              setShowErrorModal,
              prompt,
              numberOfImages: generateFromTextNumberOfImages,
              style: generateFromTextStyleName || "None",
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
              Cookies.remove("userGeneratingImages");
              setErrorModalMessage({
                header: "Invalid data error",
                body: "Something went wrong, try again No credits were deducted for this request.",
              });
              setShowErrorModal(true);
              setSubmittingFormToGetData(false);
              return;
            }

            console.log({ getImageDataResponse });
            setGeneratedImages(getImageDataResponse.data.images);
            Cookies.remove("userGeneratingImages");
          } catch (error) {
            console.log({ error });
          } finally {
            setSubmittingFormToGetData(false);
          }
        }}
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
