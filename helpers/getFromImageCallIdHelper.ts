/*
 * Actions
 * */
import { getGenerateFromImageCallId } from "@/actions/getGenerateFromImageCallId";

/*
 * Types
 * */
import { MixingImage } from "@/components/GeneratingImagesMethods/GenerateImageFromElements/createTabEngine/types";

interface BaseProps {
  prompt?: string;
  numberOfImages: number;
  id: string;
  setErrorModalMessage: (value: {
    header: string | null;
    body: string | null;
  }) => void;
  setShowErrorModal: (value: boolean) => void;
}

interface VariationProps extends BaseProps {
  generationMethod: "Variation";
  imageUrl: string;
  keepStyle: number;
  keepOutline: number;
}

interface ImageMixingProps extends BaseProps {
  generationMethod: "Image mixing";
  imageUrl: MixingImage[];
}

type FromImageCallIdHelperProps = VariationProps | ImageMixingProps;

export const getFromImageCallIdHelper = async (
  props: FromImageCallIdHelperProps,
): Promise<{ callId: string }> => {
  const {
    numberOfImages,
    id,
    prompt = "",
    imageUrl,
    setErrorModalMessage,
    setShowErrorModal,
    generationMethod,
  } = props;
  if (!imageUrl) {
    setErrorModalMessage({
      header: "Invalid Request",
      body: "No uploaded images found!, please upload an image and click on generate pattern again.",
    });
    setShowErrorModal(true);
    return { callId: "0" };
  }

  let dataToGetCallId: {
    id: string;
    numberOfImages: number;
    prompt: string;
    request_user_id: string;
    webapp_version: string;
    input_img_url: any;
  } = {
    id,
    numberOfImages,
    prompt,
    request_user_id: id,
    webapp_version: "1.2.0",
    input_img_url: null,
  };

  if (generationMethod === "Variation") {
    const { keepStyle, keepOutline } = props;

    dataToGetCallId = {
      ...dataToGetCallId,
      input_img_url: [
        {
          url: imageUrl,
          url_type: imageUrl.startsWith("data") ? "data_url" : "http",
          source_type: "variation",
          style_strength: keepStyle,
          outline_strength: keepOutline,
        },
      ],
    };
  } else {
    dataToGetCallId = { ...dataToGetCallId, input_img_url: imageUrl };
  }

  const callIdResponse: any = await getGenerateFromImageCallId(dataToGetCallId);

  if (callIdResponse?.errors) {
    setErrorModalMessage({
      header: "Invalid data error",
      body: "Something went wrong, please try again!",
    });
    setShowErrorModal(true);

    return { callId: "0" };
  }

  if (callIdResponse?.errors) {
    setErrorModalMessage({
      header: "Invalid data error",
      body: "Something went wrong, please try again!",
    });
    setShowErrorModal(true);

    return { callId: "0" };
  }

  if (callIdResponse?.errors) {
    setErrorModalMessage({
      header: "Invalid data error",
      body: "Something went wrong, please try again!",
    });
    setShowErrorModal(true);

    return { callId: "0" };
  }

  if (callIdResponse?.message) {
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
