import { getImageData } from "@/actions/getImageData";

type GetImageDataProps = {
  callId: string;
  userId: string | null;
};

export const getImageDataHelper = ({ callId, userId }: GetImageDataProps) => {
  let isDataReceived = false;

  const maxTries = +process.env.API_PULL_MAX_TRIES! || 250;

  try {
    let count = 0;

    return new Promise(async (resolve, reject) => {
      async function getData() {
        count++;
        console.log(`API call number: ${count} from ${maxTries}`);

        // Server action
        const imageDataRequestNew: any = await getImageData({
          callId,
          userId: userId!,
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

          resolve({
            status: 200,
            data: {
              images: imageDataRequestNew,
            },
          });
        }
      }

      while (!isDataReceived) {
        const result: any = await getData();

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
