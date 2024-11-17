/*
 * Packages
 * */
import Cookies from "js-cookie";
import { getGenerateByTextCallId } from "@/actions/getGenerateByTextCallId";

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

export const getCallIdHelper = async ({
  setShowErrorModal,
  setErrorModalMessage,
  numberOfImages,
  style,
  prompt,
}: CallIdHelperProps): Promise<{ callId: string }> => {
  const userGeneratingImages = Cookies.get("userGeneratingImages");

  if (userGeneratingImages === "true") {
    setErrorModalMessage({
      header: "Invalid Request",
      body: "Seems like you are already generating images in another tab. Please wait until the current generation process ends and try again. If you think this is a mistake, please contact us at support@patterned.ai.",
    });
    setShowErrorModal(true);
    return { callId: "0" };
  }

  // Cookies.set("userGeneratingImages", "true", {
  //   secure: true,
  //   expires: new Date(new Date().getTime() + 2 * 60 * 1000), // 2 minutes
  // });

  // request to get call id
  const callIdResponse: any = await getGenerateByTextCallId({
    id: "xyz",
    prompt,
    numberOfImages,
    style_name: style,
  });

  if (callIdResponse?.errors) {
    Cookies.remove("userGeneratingImages");
    setErrorModalMessage({
      header: "Invalid data error",
      body: "Something went wrong, try again No credits were deducted for this request.",
    });
    setShowErrorModal(true);

    return { callId: "0" };
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
};
