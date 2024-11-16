"use server";

/*
 * Libs
 */
import { z } from "zod";

/*
 * Actions
 */
import { getFireStore } from "@/actions/firebase";

const schema = z.object({
  userId: z.string({
    required_error: "Unauthorized request.",
  }),
  generationId: z.string({
    required_error: "Invalid data.",
  }),
});

export const getTransparentMotifsDataAction = async (
  data: z.infer<typeof schema>,
) => {
  // generationIdData.sdGenerationJob.generationId

  try {
    /* Data validation */
    const validatedFields = schema.safeParse(data);

    // Return early if the form data is invalid
    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }

    const db = await getFireStore();

    const userId = data.userId as string;

    // get user data
    const userDocRef = await db.collection("users").doc(userId).get();

    // check if the user exists on the firebase
    if (!userDocRef.exists) {
      return {
        message: "Unauthorized request!",
      };
    }

    const imageDataRequest = await fetch(
      `${process.env.LEONARDO_AI_GENERATE_URL!}/${data.generationId}`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          authorization: `Bearer ${process.env.LEONARDO_AI_GENERATE_TOKEN!}`,
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

    const imageDataResponse = await imageDataRequest.json();

    if (imageDataResponse.generations_by_pk.generated_images.length) {
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
