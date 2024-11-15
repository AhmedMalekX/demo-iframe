"use server";

/*
 * Libs
 * */
import * as AWS from "aws-sdk";

AWS.config.update({
  accessKeyId: process.env.AWS_S3_ACCESSID,
  secretAccessKey: process.env.AWS_S3_SECTRETKEY,
});

const s3 = new AWS.S3({
  signatureVersion: "v4",
  region: process.env.AWS_S3_REGION,
});

//get pre-signed- Url
const getSignedURL = async (fileName: string) => {
  const key = fileName;
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: key,
    ContentType: "multipart/form-data",
    Expires: 1020,
  };
  const signedUrl = await s3.getSignedUrl("putObject", params);
  return signedUrl;
};

export const getUploadedImageUrl = async ({
  fileName,
}: {
  fileName: string;
}) => {
  try {
    const url = await getSignedURL(fileName);

    return {
      status: 200,
      url,
    };
  } catch (error) {
    return {
      status: 500,
      error: (error as Error).message,
      url: null,
    };
  }
};
