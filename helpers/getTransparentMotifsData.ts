import { deductUserCredits } from "@/actions/deductUserCredits";
import { getTransparentMotifsDataAction } from "@/actions/getTransparentMotifsData";

interface ImageDataProps {
  generationId: string;
  userId: string | null;
  numberOfCredits: number;
}

export const getTransparentMotifsData = ({
  generationId,
  userId,
}: ImageDataProps) => {
  let isDataReceived = false;
  const maxTries = +process.env.API_PULL_MAX_TRIES! || 250;

  try {
    let count = 0;
    return new Promise(async (resolve, reject) => {
      async function getData() {
        count++;
        // console.log(`API call number: ${count} from ${maxTries}`);

        // SERVER ACTIONS
        const imageDataRequestNew = await getTransparentMotifsDataAction({
          userId: userId!,
          generationId,
        });

        if (imageDataRequestNew?.status === 500) {
          reject({
            status: 500,
            message:
              "We are experiencing high load atm, please try again in few minutes!",
          });
        }

        if (Object.keys(imageDataRequestNew).length) {
          isDataReceived = true;

          if (imageDataRequestNew?.generations_by_pk?.generated_images) {
            const remainCredits = await deductUserCredits({
              id: userId as string,
              numberOfCredits: +process.env.NEXT_PUBLIC_AI_GENERATE_MOTIF_COST!,
            });

            if (remainCredits?.errors || remainCredits?.message) {
              reject({
                status: 500,
                message:
                  "We are experiencing high load atm, please try again in few minutes!",
              });
            }

            resolve({
              status: 200,
              data: {
                images: imageDataRequestNew.generations_by_pk.generated_images,
                userCredits: remainCredits.userCredits,
                userSubscriptionCredits: remainCredits.userSubscriptionCredits,
                usedCredits: remainCredits.usedCredits,
              },
            });
          } else {
            reject({
              status: 500,
              message:
                "We are experiencing high load atm, please try again in few minutes!",
            });
          }
        }
      }

      while (!isDataReceived) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        const result: { status: number } = await getData();

        if (count >= maxTries || result?.status === 500) {
          reject({
            status: 500,
            message:
              "We are experiencing high load atm, please try again in few minutes!",
          });
          break;
        }

        // Wait for a specified interval before making another API call
        await new Promise((resolve) =>
          setTimeout(resolve, +process.env.API_PULL_INTERVAL!),
        );
      }
    });
  } catch (error) {
    console.log({ error });
    return {
      status: 500,
      message: "Something went wrong, please try again!",
    };
  }
};
