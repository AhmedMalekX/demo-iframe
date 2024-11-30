"use server";

/*
 * Packages
 * */
import { z } from "zod";

const schema = z.object({
  callId: z.string({
    required_error: "Invalid data.",
  }),
});

export const getUpscaleImageData = async (data: z.infer<typeof schema>) => {
  try {
    /* Data validation */
    const validatedFields = schema.safeParse(data);

    // Return early if the form data is invalid
    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }

    let imageDataRequest = await fetch(
      `${process.env.API_URL_IMG_UPSCALE_PULL_RESULTS}/${data.callId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.API_TOKEN}`,
        },
      },
    );

    if (
      !imageDataRequest.ok ||
      imageDataRequest.status.toString().startsWith("5")
    ) {
      return {
        status: 500,
        message: "Something went wrong, please try again!",
      };
    }

    let imageDataResponse = await imageDataRequest.json();

    if (Object.keys(imageDataResponse).length) {
      return imageDataResponse;
    } else {
      return {};
    }
  } catch (error) {
    console.log("error", error);
    return {
      status: 500,
      message: "Something went wrong, please try again!",
    };
  }
};
