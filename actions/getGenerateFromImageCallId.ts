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
// import { calculateRequiredCredits } from "@/helpers/calculateRequiredCredits";
import { createTimeout } from "@/helpers/vercelTimeout";

const rateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(15, "60 s"),
});

const schema = z.object({
  id: z.string({
    required_error: "Unauthorized request",
  }),
  prompt: z.string().optional(),
  numberOfImages: z.number(),
  webapp_version: z.string(),
  request_user_id: z.string().nullable(),
  input_img_url: z.array(
    z.object({
      url: z.string(),
      url_type: z.string(),
      source_type: z.string(),
      strength: z.number().optional().nullable(),
      style_strength: z.number().optional().nullable(),
      outline_strength: z.number().optional().nullable(),
    }),
  ),
  // model_id: z.enum(Models),
  // style_name: z.enum(styleNames),
});

const getCallIdData = async (data: z.infer<typeof schema>) => {
  // const db = await getFireStore();

  // const userId = data.id as string;

  // get user data
  // const userDocRef = await db.collection("users").doc(userId).get();

  // check if the user exists on the firebase
  // if (!userDocRef.exists) {
  //   return {
  //     message: "Unauthorized request!",
  //   };
  // }
  //
  // const user = userDocRef.data();

  // check if the user not has enough credits

  // send api request to get the callId
  const callIdRequest = await fetch(process.env.API_URL_IMG_GET_CALL_ID!, {
    body: JSON.stringify(data),
    method: "post",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.API_TOKEN}`,
    },
  });

  if (!callIdRequest.ok) {
    return {
      message:
        "Something went wrong, try again No credits were deducted for this request.",
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

export const getGenerateFromImageCallId = async (
  data: z.infer<typeof schema>,
) => {
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
      clearTimeout(cancellationToken.timeoutId);
    }
    console.log({ error });
    return error;
  }
};
