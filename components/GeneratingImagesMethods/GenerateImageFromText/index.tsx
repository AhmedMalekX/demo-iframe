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

  // function waitForToken(timeout = 120000): Promise<string> {
  //   return new Promise((resolve, reject) => {
  //     let timeoutId: ReturnType<typeof setTimeout>;
  //
  //     const expectedOrigin =
  //       process.env.NEXT_PUBLIC_PARENT_SITE_URL || "http://localhost:3000";
  //
  //     function handleMessage(event: MessageEvent) {
  //       console.log("Received message:", event);
  //
  //       // Validate origin
  //       if (event.origin !== expectedOrigin) {
  //         console.warn(
  //           `Ignored message from unexpected origin: ${event.origin}`,
  //         );
  //         return;
  //       }
  //
  //       const { message, token } = event.data || {};
  //       console.log(`Message data: ${JSON.stringify(event.data)}`);
  //
  //       // Abort check
  //       if (useAbortStore.getState().shouldAbortRequests) {
  //         console.log("Aborting token retrieval due to abort condition.");
  //         cleanupListeners();
  //         reject(new Error("Aborted due to error condition"));
  //         return;
  //       }
  //
  //       if (message === "accessToken") {
  //         console.log("Validating received token...");
  //
  //         validateAction(token)
  //           .then(({ isValidToken }) => {
  //             if (isValidToken) {
  //               console.log("Token is valid:", token);
  //               cleanupListeners();
  //               resolve(token);
  //             } else {
  //               console.warn(
  //                 "Invalid token received. Waiting for a valid token...",
  //               );
  //             }
  //           })
  //           .catch((err) => {
  //             console.error("Error during token validation:", err);
  //           });
  //       }
  //     }
  //
  //     function cleanupListeners() {
  //       window.removeEventListener("message", handleMessage);
  //       if (timeoutId) clearTimeout(timeoutId);
  //     }
  //
  //     // Attach message listener
  //     window.addEventListener("message", handleMessage);
  //
  //     // Set up timeout
  //     timeoutId = setTimeout(() => {
  //       console.error("Timeout: No valid token received.");
  //       cleanupListeners();
  //       reject(new Error("Timeout: No valid token received"));
  //     }, timeout);
  //   });
  // }

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

  // const handleGeneratePattern = async (
  //   event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  // ) => {
  //   try {
  //     event.preventDefault();
  //     setSubmittingFormToGetData(true);
  //
  //     // Step 1: Check if the process should be aborted
  //     if (useAbortStore.getState().shouldAbortRequests) {
  //       toast.error("Process aborted due to an error.");
  //       setSubmittingFormToGetData(false);
  //       return;
  //     }
  //
  //     console.log({ accessToken });
  //
  //     // Step 2: Ensure we have a valid token
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
  //         // validToken = await waitForToken(5 * 60 * 1000);
  //         validToken = await waitForToken(5 * 60 * 1000);
  //
  //         // Check if the process should be aborted
  //         if (useAbortStore.getState().shouldAbortRequests) {
  //           toast.error("Process aborted during token refresh.");
  //           setSubmittingFormToGetData(false);
  //           return;
  //         }
  //
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
  //     // Step 3: Ensure we have a prompt
  //     if (!prompt) {
  //       toast.error("Prompt is required!");
  //       setSubmittingFormToGetData(false);
  //       return;
  //     }
  //
  //     // Step 4: Continue with the rest of the process
  //     const { callId, messageToParent } = await getCallIdHelper({
  //       setErrorModalMessage,
  //       setShowErrorModal,
  //       prompt,
  //       numberOfImages: generateFromTextNumberOfImages,
  //       style: generateFromTextStyleName || "None",
  //     });
  //
  //     if (messageToParent) {
  //       const message = { message: "tokenExpired" };
  //       window.parent.postMessage(message, "*"); // TODO: Replace "*" with the parent's origin
  //       return;
  //     }
  //
  //     // Check if the process should be aborted during this step
  //     if (useAbortStore.getState().shouldAbortRequests) {
  //       toast.error("Process aborted during callId retrieval.");
  //       setSubmittingFormToGetData(false);
  //       return;
  //     }
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
  //     // Check if the process should be aborted during this step
  //     if (useAbortStore.getState().shouldAbortRequests) {
  //       toast.error("Process aborted during image data retrieval.");
  //       setSubmittingFormToGetData(false);
  //       return;
  //     }
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
  //
  //     if (useAbortStore.getState().shouldAbortRequests) {
  //       setGeneratedImages([]);
  //       setSubmittingFormToGetData(false);
  //       return;
  //     } else {
  //       setGeneratedImages(getImageDataResponse.data.images);
  //     }
  //   } catch (error) {
  //     console.log({ error });
  //   } finally {
  //     setSubmittingFormToGetData(false);
  //   }
  // };

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

  const handleGeneratePattern = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    const TIMEOUT = 2 * 60 * 1000; // 2 minutes
    const RETRY_DELAY = 2000; // 2 seconds

    // const retryWithDelay = async (fn: () => Promise<any>, delay: number) => {
    //   while (true) {
    //     try {
    //       return await fn();
    //     } catch (err) {
    //       console.error("==================x Retrying due to error:", err);
    //       await new Promise((resolve) => setTimeout(resolve, delay));
    //     }
    //   }
    // };

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

      if (!prompt) {
        toast.error("Prompt is required!");
        console.log("==================x Missing prompt. Exiting...");
        throw new Error("Missing prompt.");
      }

      // Step 4: Get call ID
      const { callId, messageToParent } = await getCallIdHelper({
        setErrorModalMessage,
        setShowErrorModal,
        prompt,
        numberOfImages: generateFromTextNumberOfImages,
        style: generateFromTextStyleName || "None",
      });

      if (messageToParent) {
        console.log(
          "==================x messageToParent detected. Resetting process....",
        );
        toast.warning("Retrying due to message to parent.");
        throw new Error("Reset process due to messageToParent.");
      }

      if (callId === "0") {
        console.log("==================x Invalid callId. Exiting...");
        toast.error("Something went wrong, please try again!");
        throw new Error("Invalid callId.");
      }

      // Step 5: Get image data
      const getImageDataResponse: any = await getImageDataHelper({
        callId,
        userId: "123",
      });

      if (getImageDataResponse?.status === 500) {
        console.log("==================x Error during image data retrieval.");
        setErrorModalMessage({
          header: "Invalid data error",
          body: "Something went wrong, please try again!",
        });
        setShowErrorModal(true);
        throw new Error("Error during image data retrieval.");
      }

      console.log("==================x Images retrieved successfully.");
      setGeneratedImages(getImageDataResponse.data.images);
    };

    // Run with timeout
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
    } catch (err: any) {
      console.error("==================x Process error:", err);
      toast.error(err.message || "Process failed.");
    } finally {
      console.log(
        "==================x handleGeneratePattern finished execution.",
      );
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
