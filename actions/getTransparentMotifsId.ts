"use server";

/*
 * Next.js components
 */
import { headers } from "next/headers";

/*
 * Libs
 */
import { Ratelimit } from "@upstash/ratelimit";
import { z } from "zod";

/*
 * Actions
 */
import { redis } from "@/actions/upstash-ratelimit";
import { getFireStore } from "@/actions/firebase";

/*
 * Helpers
 */
import { createTimeout } from "@/helpers/vercelTimeout";
// import { calculateRequiredCreditsForGeneratePattern } from '@/helpers/calculateRequiredCreditsForGeneratePattern';

const rateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(15, "60 s"),
});

const getGenerationId = async (prompt: string) => {
  // get generation id
  const getGenerationId = await fetch(process.env.LEONARDO_AI_GENERATE_URL!, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      accept: "application/json",
      authorization: `Bearer ${process.env.LEONARDO_AI_GENERATE_TOKEN}`,
    },
    body: JSON.stringify({
      height: 512,
      // modelId: '6bef9f1b-29cb-40c7-b9df-32b51c1f67d3',
      alchemy: true,
      modelId: "d69c8273-6b17-4a30-a13e-d6637ae1c644",
      prompt: prompt,
      width: 512,
      transparency: "foreground_only",
      num_images: 1,
    }),
  });

  const generationIdData = await getGenerationId.json();

  return generationIdData.sdGenerationJob.generationId;
};

const schema = z.object({
  id: z.string({
    required_error: "Unauthorized request.",
  }),
  prompt: z.string({
    required_error: "Invalid data.",
  }),
});

export const getTransparentMotifsId = async (data: z.infer<typeof schema>) => {
  // Validate user id
  if (!data.id) {
    return {
      message: "Unauthorized request!",
    };
  }

  /* Data validation */
  const validatedFields = schema.safeParse(data);

  // Return early if the form data is invalid
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const db = await getFireStore();

  const userId = data.id as string;

  // get user data
  const userDocRef = await db.collection("users").doc(userId).get();

  // check if the user exists on the firebase
  if (!userDocRef.exists) {
    return {
      message: "Unauthorized request!",
    };
  }

  const user = await userDocRef.data();

  // check if the user not has enough credits
  if (
    +process.env.LEONARDO_AI_GENERATE_COST! >
    user?.subscriptionCredits + user?.credit
  ) {
    return {
      message: "Not enough credits! add more credits or upgrade your plan.",
    };
  }

  /* Vercel timeout constants */
  const timeoutDuration = +process.env.API_CALL_MAX_DURATION!;

  const cancellationToken = {
    cancelled: false,
    timeoutId: null,
    // intervalId: null,
  };

  try {
    // rate limit
    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for");
    const { success: LimitReach } = await rateLimit.limit(ip!);

    if (!LimitReach) {
      return { message: "Rate limit exceed, please wait 1 minute." };
    }

    const timeout = createTimeout(timeoutDuration, cancellationToken);

    const result = await Promise.race([getGenerationId(data.prompt), timeout]);

    cancellationToken.cancelled = true; // Signal that data fetch was successful

    if (cancellationToken.timeoutId !== null) {
      clearTimeout(cancellationToken.timeoutId); // Clear the timeout
    }

    return result;
  } catch (error) {
    if (cancellationToken.timeoutId !== null) {
      clearTimeout(cancellationToken.timeoutId); // Clear the timeout in case of an error as well
    }
    // if (cancellationToken.intervalId !== null) {
    //   clearInterval(cancellationToken.intervalId); // Clear the interval
    // }
    console.log({ error });

    return error;
  }
};
