import { getUpscaleImageData } from "@/actions/getUpscaleImageData";

interface ImageDataProps {
  callId: string;
}

export const getUpscaleImageDataHelper = ({ callId }: ImageDataProps) => {
  let isDataReceived = false;
  let maxTries = +process.env.API_PULL_MAX_TRIES! || 250;

  try {
    let count = 0;
    return new Promise(async (resolve, reject) => {
      async function getData() {
        count++;
        console.log(`API call number: ${count} from ${maxTries}`);

        let imageDataRequestNew = await getUpscaleImageData({
          callId,
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

          // update image document
          resolve({ status: 200, data: imageDataRequestNew });
        }
      }

      while (!isDataReceived) {
        await getData();

        if (count >= maxTries) {
          reject({ status: 500, message: "Max Tries exceeded!" });
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
