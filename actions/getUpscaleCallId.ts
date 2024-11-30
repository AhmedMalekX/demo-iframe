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
import { redis } from "@/actions/upstash-ratelimit";
// import { getFireStore } from "@/actions/firebase";

/*
 * Helpers
 */
import { createTimeout } from "@/helpers/vercelTimeout";

const rateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(15, "60 s"),
});

const schema = z.object({
  input_img_url: z.string(),
  outscale: z.number(),
  imageId: z.string(),
});

const getCallId = async (data: z.infer<typeof schema>) => {
  // if (!data.userId) {
  //   return {
  //     message: "Unauthorized request!",
  //   };
  // }

  // const db = await getFireStore();

  // get user data
  // const userDocRef = await db.collection("users").doc(data.userId).get();

  // check if the user exists on the firebase
  // if (!userDocRef.exists) {
  //   return {
  //     message: "Unauthorized request!",
  //   };
  // }

  // get callId
  const getCallId = await fetch(process.env.API_URL_UPSCALE_CALL_ID!, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.API_TOKEN}`,
    },
  });

  if (!getCallId.ok) {
    return {
      message:
        "Something went wrong, try again No credits were deducted for this request.",
    };
  }

  const callIdData = await getCallId.json();

  return { status: 200, callIdData };
};

export const getUpscaleCallId = async (data: z.infer<typeof schema>) => {
  /* Vercel timeout constants */
  const timeoutDuration = +process.env.API_CALL_MAX_DURATION!;

  const cancellationToken = {
    cancelled: false,
    timeoutId: null,
  };

  try {
    // Rate limit
    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for");
    const { success: LimitReach } = await rateLimit.limit(ip!);

    if (!LimitReach) {
      return { message: "Rate limit exceeded, please wait 1 minute." };
    }

    const validatedFields = schema.safeParse({
      ...data,
    });

    // Return early if the form data is invalid
    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }

    const timeout = createTimeout(timeoutDuration, cancellationToken);

    const result = await Promise.race([getCallId(data), timeout]);

    if (cancellationToken.timeoutId !== null) {
      clearTimeout(cancellationToken.timeoutId); // Clear the timeout
    }

    return result;
  } catch (error) {
    if (cancellationToken.timeoutId !== null) {
      clearTimeout(cancellationToken.timeoutId); // Clear the timeout in case of an error as well
    }

    console.log({ error });

    return {
      status: 500,
      message:
        "Something went wrong, try again No credits were deducted for this request.",
    };
  }
};
