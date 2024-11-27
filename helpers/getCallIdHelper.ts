/*
 * Packages
 * */
import Cookies from "js-cookie";
import { getGenerateByTextCallId } from "@/actions/getGenerateByTextCallId";
import { useAbortStore } from "@/store/abort.store";

interface CallIdHelperProps {
  prompt: string;
  style: string;
  numberOfImages: number;
  setErrorModalMessage: (value: {
    header: string | null;
    body: string | null;
  }) => void;
  setShowErrorModal: (value: boolean) => void;
}

// export const getCallIdHelper = async ({
//   setShowErrorModal,
//   setErrorModalMessage,
//   numberOfImages,
//   style,
//   prompt,
// }: CallIdHelperProps): Promise<{ callId: string }> => {
//   const userGeneratingImages = Cookies.get("userGeneratingImages");
//
//   if (userGeneratingImages === "true") {
//     setErrorModalMessage({
//       header: "Invalid Request",
//       body: "Seems like you are already generating images in another tab. Please wait until the current generation process ends and try again. If you think this is a mistake, please contact us at support@patterned.ai.",
//     });
//     setShowErrorModal(true);
//     return { callId: "0" };
//   }
//
//   // Cookies.set("userGeneratingImages", "true", {
//   //   secure: true,
//   //   expires: new Date(new Date().getTime() + 2 * 60 * 1000), // 2 minutes
//   // });
//
//   // request to get call id
//   const callIdResponse: any = await getGenerateByTextCallId({
//     id: "xyz",
//     prompt,
//     numberOfImages,
//     style_name: style,
//   });
//
//   if (callIdResponse?.errors) {
//     Cookies.remove("userGeneratingImages");
//     setErrorModalMessage({
//       header: "Invalid data error",
//       body: "Something went wrong, try again No credits were deducted for this request.",
//     });
//     setShowErrorModal(true);
//
//     return { callId: "0" };
//   }
//
//   if (callIdResponse?.message) {
//     Cookies.remove("userGeneratingImages");
//     setErrorModalMessage({
//       header: "Error",
//       body: callIdResponse.message,
//     });
//     setShowErrorModal(true);
//
//     return { callId: "0" };
//   }
//
//   return {
//     callId: callIdResponse.callIdData.call_id,
//   };
// };

export const getCallIdHelper = async ({
  setShowErrorModal,
  setErrorModalMessage,
  numberOfImages,
  style,
  prompt,
}: CallIdHelperProps): Promise<{
  callId: string;
  messageToParent?: boolean;
}> => {
  // Check if the global abort flag is set
  if (useAbortStore.getState().shouldAbortRequests) {
    setErrorModalMessage({
      header: "Process Aborted",
      body: "The image generation process has been aborted due to an error.",
    });
    setShowErrorModal(true);
    return { callId: "0" };
  }

  const userGeneratingImages = Cookies.get("userGeneratingImages");

  if (userGeneratingImages === "true") {
    setErrorModalMessage({
      header: "Invalid Request",
      body: "Seems like you are already generating images in another tab. Please wait until the current generation process ends and try again. If you think this is a mistake, please contact us at support@patterned.ai.",
    });
    setShowErrorModal(true);
    return { callId: "0" };
  }

  // Check if the global abort flag is set before making the API call
  if (useAbortStore.getState().shouldAbortRequests) {
    setErrorModalMessage({
      header: "Process Aborted",
      body: "The image generation process has been aborted before making the API call.",
    });
    setShowErrorModal(true);
    return { callId: "0" };
  }

  try {
    // Request to get call id
    const callIdResponse: any = await getGenerateByTextCallId({
      id: "xyz", // assuming 'xyz' is static, replace with dynamic if necessary
      prompt,
      numberOfImages,
      style_name: style,
    });

    // Check for abort condition again after the API call
    if (useAbortStore.getState().shouldAbortRequests) {
      setErrorModalMessage({
        header: "Process Aborted",
        body: "The image generation process has been aborted after the API response.",
      });
      setShowErrorModal(true);
      return { callId: "0" };
    }

    if (callIdResponse?.errors) {
      Cookies.remove("userGeneratingImages");
      setErrorModalMessage({
        header: "Invalid data error",
        body: "Something went wrong, try again. No credits were deducted for this request.",
      });
      setShowErrorModal(true);
      return { callId: "0" };
    }

    if (callIdResponse?.message === "Backend Error 1") {
      return { callId: "0", messageToParent: true };
    }

    if (callIdResponse?.message === "Backend Error") {
      return { callId: "0", messageToParent: true };
    }

    if (callIdResponse?.message) {
      Cookies.remove("userGeneratingImages");
      setErrorModalMessage({
        header: "Error",
        body: callIdResponse.message,
      });
      setShowErrorModal(true);
      return { callId: "0" };
    }

    return {
      callId: callIdResponse.callIdData.call_id,
    };
  } catch (error: any) {
    console.log({ error });
    Cookies.remove("userGeneratingImages");
    setErrorModalMessage({
      header: "Error",
      body: "Something went wrong while fetching the call ID. Please try again.",
    });
    setShowErrorModal(true);
    return { callId: "0" };
  }
};
