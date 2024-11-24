/*
 * NextJS & ReactJS components
 * */
import React, { useEffect, useState } from "react";

/*
 * Store
 * */
import { useDashboardStore } from "@/store/dashboard.store";
import { useAccessTokenStore } from "@/store/accessToken.store";

/*
 * UI components
 * */
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

/*
 * Global UI Components
 * */
import { Styles } from "@/components/GlobalUI/Styles";
import { Prompt } from "@/components/GlobalUI/Prompt";
import { NumberOfImages } from "@/components/GlobalUI/NumberOfImages";

/*
 * Helpers
 * */
import { validateAction } from "@/helpers/validateAction";
import { getCallIdHelper } from "@/helpers/getCallIdHelper";
import { getImageDataHelper } from "@/helpers/getImageDataHelper";

/*
 * Icons
 * */
import { LoaderCircle } from "lucide-react";
import { useAbortStore } from "@/store/abort.store";

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
  const { accessToken, setAccessToken } = useAccessTokenStore();

  const tooltipContent = `
        — Be as descriptive as possible, use style names, artists' names, color scheme, vibe, etc. <br />
        — Words at the beginning of the prompt have a higher effect on the final image
  `;

  // function waitForToken(timeout = 120000): Promise<string> {
  //   return new Promise((resolve, reject) => {
  //     let timeoutId: ReturnType<typeof setTimeout>;
  //
  //     function handleMessage(event: MessageEvent) {
  //       // TODO: Validate the origin for security
  //       if (
  //         event.origin !==
  //         (process.env.NEXT_PUBLIC_PARENT_SITE_URL || "http://localhost:3000")
  //       )
  //         return;
  //
  //       console.log({ data: event.data });
  //
  //       const { message, token } = event.data;
  //
  //       if (message === "accessToken") {
  //         // Temporarily validate the token without resolving
  //         validateAction(token).then(({ isValidToken }) => {
  //           if (isValidToken) {
  //             // Stop listening once a valid token is found
  //             window.removeEventListener("message", handleMessage);
  //             clearTimeout(timeoutId);
  //             resolve(token);
  //           } else {
  //             console.warn("Received invalid token from parent. Waiting...");
  //           }
  //         });
  //       }
  //     }
  //
  //     // Listen for messages from the parent
  //     window.addEventListener("message", handleMessage);
  //
  //     // Reject the promise if no valid token is received within the timeout
  //     timeoutId = setTimeout(() => {
  //       window.removeEventListener("message", handleMessage);
  //       reject(new Error("Timeout: No valid token received"));
  //     }, timeout);
  //   });
  // }

  function waitForToken(timeout = 120000): Promise<string> {
    return new Promise((resolve, reject) => {
      let timeoutId: ReturnType<typeof setTimeout>;

      function handleMessage(event: MessageEvent) {
        // TODO: Validate the origin for security
        if (
          event.origin !==
          (process.env.NEXT_PUBLIC_PARENT_SITE_URL || "http://localhost:3000")
        )
          return;

        console.log({ data: event.data });

        const { message, token } = event.data;

        // Check if the abort flag is true from Zustand store
        if (useAbortStore.getState().shouldAbortRequests) {
          console.log("Aborting token retrieval due to error condition.");
          window.removeEventListener("message", handleMessage); // Clean up listener
          clearTimeout(timeoutId); // Clear the timeout
          reject(new Error("Aborted due to error condition"));
          return; // Exit early if abort condition is true
        }

        if (message === "accessToken") {
          // Temporarily validate the token without resolving
          validateAction(token).then(({ isValidToken }) => {
            if (isValidToken) {
              // Stop listening once a valid token is found
              window.removeEventListener("message", handleMessage);
              clearTimeout(timeoutId);
              resolve(token);
            } else {
              console.warn("Received invalid token from parent. Waiting...");
            }
          });
        }
      }

      // Listen for messages from the parent
      window.addEventListener("message", handleMessage);

      // Reject the promise if no valid token is received within the timeout
      timeoutId = setTimeout(() => {
        window.removeEventListener("message", handleMessage);
        reject(new Error("Timeout: No valid token received"));
      }, timeout);
    });
  }

  // const handleGeneratePattern = async (
  //   event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  // ) => {
  //   try {
  //     event.preventDefault();
  //     setSubmittingFormToGetData(true);
  //
  //     console.log({ accessToken });
  //
  //     // Step 1: Ensure we have a valid token
  //     let validToken = accessToken;
  //
  //     if (!validToken || !(await validateAction(validToken)).isValidToken) {
  //       // Notify parent about the expired token
  //       const message = { message: "tokenExpired" };
  //       window.parent.postMessage(message, "*"); // TODO: Replace "*" with the parent's origin
  //
  //       toast.warning("Your access token is expired. Waiting for a new one...");
  //
  //       try {
  //         // Wait for the parent to send a valid token (timeout after 2 minutes)
  //         validToken = await waitForToken(2 * 60 * 1000);
  //         console.log("Valid token received:", validToken);
  //
  //         // Update the access token state
  //         setAccessToken(validToken);
  //         console.log("Token refreshed successfully:", validToken);
  //       } catch (error: any) {
  //         console.error("Failed to refresh token:", error.message);
  //
  //         // Notify parent to stop the process
  //         const timeoutMessage = { message: "stopProcess" };
  //         window.parent.postMessage(timeoutMessage, "*");
  //
  //         toast.error("Failed to get a valid token. Stopping the process.");
  //         setSubmittingFormToGetData(false);
  //         return;
  //       }
  //     }
  //
  //     // Step 2: Ensure we have a prompt
  //     if (!prompt) {
  //       toast.error("Prompt is required!");
  //       setSubmittingFormToGetData(false);
  //       return;
  //     }
  //
  //     // Step 3: Continue with the rest of the process
  //     const { callId } = await getCallIdHelper({
  //       setErrorModalMessage,
  //       setShowErrorModal,
  //       prompt,
  //       numberOfImages: generateFromTextNumberOfImages,
  //       style: generateFromTextStyleName || "None",
  //     });
  //
  //     if (callId === "0") {
  //       toast.error("Something went wrong, please try again!");
  //       setSubmittingFormToGetData(false);
  //       return;
  //     }
  //
  //     const getImageDataResponse: any = await getImageDataHelper({
  //       callId,
  //       userId: "123",
  //     });
  //
  //     if (getImageDataResponse?.status === 500) {
  //       setErrorModalMessage({
  //         header: "Invalid data error",
  //         body: "Something went wrong, please try again!",
  //       });
  //       setShowErrorModal(true);
  //       setSubmittingFormToGetData(false);
  //       return;
  //     }
  //
  //     console.log({ getImageDataResponse });
  //     setGeneratedImages(getImageDataResponse.data.images);
  //   } catch (error) {
  //     console.log({ error });
  //   } finally {
  //     setSubmittingFormToGetData(false);
  //   }
  // };

  const handleGeneratePattern = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    try {
      event.preventDefault();
      setSubmittingFormToGetData(true);

      // Step 1: Check if the process should be aborted
      if (useAbortStore.getState().shouldAbortRequests) {
        toast.error("Process aborted due to an error.");
        setSubmittingFormToGetData(false);
        return;
      }

      console.log({ accessToken });

      // Step 2: Ensure we have a valid token
      let validToken = accessToken;

      if (!validToken || !(await validateAction(validToken)).isValidToken) {
        // Notify parent about the expired token
        const message = { message: "tokenExpired" };
        window.parent.postMessage(message, "*"); // TODO: Replace "*" with the parent's origin

        toast.warning("Your access token is expired. Waiting for a new one...");

        try {
          // Wait for the parent to send a valid token (timeout after 2 minutes)
          validToken = await waitForToken(2 * 60 * 1000);

          // Check if the process should be aborted
          if (useAbortStore.getState().shouldAbortRequests) {
            toast.error("Process aborted during token refresh.");
            setSubmittingFormToGetData(false);
            return;
          }

          console.log("Valid token received:", validToken);

          // Update the access token state
          setAccessToken(validToken);
          console.log("Token refreshed successfully:", validToken);
        } catch (error: any) {
          console.error("Failed to refresh token:", error.message);

          // Notify parent to stop the process
          const timeoutMessage = { message: "stopProcess" };
          window.parent.postMessage(timeoutMessage, "*");

          toast.error("Failed to get a valid token. Stopping the process.");
          setSubmittingFormToGetData(false);
          return;
        }
      }

      // Step 3: Ensure we have a prompt
      if (!prompt) {
        toast.error("Prompt is required!");
        setSubmittingFormToGetData(false);
        return;
      }

      // Step 4: Continue with the rest of the process
      const { callId } = await getCallIdHelper({
        setErrorModalMessage,
        setShowErrorModal,
        prompt,
        numberOfImages: generateFromTextNumberOfImages,
        style: generateFromTextStyleName || "None",
      });

      // Check if the process should be aborted during this step
      if (useAbortStore.getState().shouldAbortRequests) {
        toast.error("Process aborted during callId retrieval.");
        setSubmittingFormToGetData(false);
        return;
      }

      if (callId === "0") {
        toast.error("Something went wrong, please try again!");
        setSubmittingFormToGetData(false);
        return;
      }

      const getImageDataResponse: any = await getImageDataHelper({
        callId,
        userId: "123",
      });

      // Check if the process should be aborted during this step
      if (useAbortStore.getState().shouldAbortRequests) {
        toast.error("Process aborted during image data retrieval.");
        setSubmittingFormToGetData(false);
        return;
      }

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

      if (useAbortStore.getState().shouldAbortRequests) {
        setGeneratedImages([]);
        setSubmittingFormToGetData(false);
        return;
      } else {
        setGeneratedImages(getImageDataResponse.data.images);
      }
    } catch (error) {
      console.log({ error });
    } finally {
      setSubmittingFormToGetData(false);
    }
  };

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <Skeleton className="w-full h-[500px] mb-5" />;
  }

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
