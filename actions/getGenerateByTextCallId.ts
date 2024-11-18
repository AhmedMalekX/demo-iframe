"use server";

/*
 * Next.js
 * */
import { headers } from "next/headers";

/*
 * Libs
 * */
import { z } from "zod";
import { Ratelimit } from "@upstash/ratelimit";

/*
 * Actions
 * */
// import { getFireStore } from "@/actions/firebase";
import { redis } from "@/actions/upstash-ratelimit";

/*
 * helpers
 * */
import { createTimeout } from "@/helpers/vercelTimeout";

/*
 * Constants
 */
import { StylesNames } from "@/constants";

// Extract the style names into a separate array
const styleNames = StylesNames.map((style) => style.styleName) as [
  string,
  ...string[],
];

const rateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(15, "60 s"),
});

const schema = z.object({
  id: z.string({
    required_error: "Unauthorized request",
  }),
  prompt: z.string({ required_error: "Prompt is required!" }),
  numberOfImages: z.number(),
  style_name: z.union([z.enum(styleNames), z.literal("None")]).optional(),
});

const getCallIdData = async (data: z.infer<typeof schema>) => {
  // Calculate required credits
  const numberOfImages = data.numberOfImages || 2;

  const dataToGetCallId = {
    prompt: data.prompt as string,
    n_images: numberOfImages,
    webapp_version: "1.2.0",
    style_name: data.style_name || "None",
  };

  // send api request to get the callId
  const callIdRequest = await fetch(process.env.API_URL_IMG_GET_CALL_ID!, {
    body: JSON.stringify(dataToGetCallId),
    method: "post",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.API_TOKEN}`,
    },
  });

  if (!callIdRequest.ok) {
    return {
      message: "Something went wrong, please try again!",
    };
  }

  const callIdData = await callIdRequest.json();

  if (!callIdData.api_available) {
    return {
      message: "Something went wrong, please try again!",
    };
  }

  return { callIdData };
};

export const getGenerateByTextCallId = async (data: z.infer<typeof schema>) => {
  /* Vercel timeout constants */
  const timeoutDuration = +process.env.API_CALL_MAX_DURATION!;

  const cancellationToken = {
    cancelled: false,
    timeoutId: null,
  };

  try {
    if (!data.id) {
      return {
        message: "Unauthorized request!",
      };
    }

    // rate limit
    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for");
    const { success: LimitReach } = await rateLimit.limit(ip!);

    if (!LimitReach) {
      return { message: "Rate limit exceed, please wait 1 minute." };
    }

    /* Data validation */
    const validatedFields = schema.safeParse(data);

    // Return early if the form data is invalid
    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }

    const timeout = createTimeout(timeoutDuration, cancellationToken);

    const result = await Promise.race([getCallIdData(data), timeout]);

    cancellationToken.cancelled = true; // Signal that data fetch was successful

    if (cancellationToken.timeoutId !== null) {
      clearTimeout(cancellationToken.timeoutId); // Clear the timeout
    }

    return result;
  } catch (error) {
    if (cancellationToken.timeoutId !== null) {
      clearTimeout(cancellationToken.timeoutId); // Clear the timeout in case of an error as well
    }
    console.log({ error });
    return error;
  }
};
