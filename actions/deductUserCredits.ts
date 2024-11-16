"use server";

/*
 * Libs
 * */
import { z } from "zod";

/*
 * Actions
 * */
import { getFireStore } from "@/actions/firebase";
import { calculateRequiredCredits } from "@/helpers/calculateRequiredCredits";

const schema = z.object({
  id: z.string({
    required_error: "Unauthorized request",
  }),
  numberOfCredits: z.number(),
});

export const deductUserCredits = async (data: z.infer<typeof schema>) => {
  const validatedFields = schema.safeParse({ ...data });

  // Return early if the form data is invalid
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  if (!data.id) {
    return {
      message: "Unauthorized request!",
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

  const user = userDocRef.data();

  const { deductedSubscriptionCredits, deductedPermanentCredit } =
    calculateRequiredCredits({ user, amount: data.numberOfCredits });

  // deduct user credits
  await db
    .collection("users")
    .doc(userId)
    .update({
      credit: user!.credit - deductedPermanentCredit,
      subscriptionCredits:
        user!.subscriptionCredits - deductedSubscriptionCredits,
      usedCredits:
        user!.usedCredits +
        (deductedPermanentCredit + deductedSubscriptionCredits),
    });

  // return images to the user
  return {
    status: 200,
    userCredits: user!.credit - deductedPermanentCredit,
    userSubscriptionCredits:
      user!.subscriptionCredits - deductedSubscriptionCredits,
    usedCredits:
      user!.usedCredits +
      (deductedPermanentCredit + deductedSubscriptionCredits),
  };
};
