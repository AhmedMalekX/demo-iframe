/*
 * Actions
 */
import { getUploadedImageUrl } from "@/actions/getUploadedImageUrl";

/*
 * Helpers
 * */
import { generateErrorResponse } from "@/helpers/generateErrorResponse";

export const uploadFile = async (file: File) => {
  try {
    // Step 1: Get pre-signed URL for uploading
    const preSignedUrl = await getUploadedImageUrl({ fileName: file.name });

    // Handle error response when retrieving pre-signed URL
    if (preSignedUrl.status !== 200) {
      return generateErrorResponse(
        preSignedUrl.status,
        "Error retrieving upload URL",
      );
    }

    const { url } = preSignedUrl;

    // Step 2: Upload the file to the provided URL
    if (url) {
      const uploadResponse = await fetch(url, {
        method: "PUT",
        body: file,
      });

      // Handle error response during file upload
      if (!uploadResponse.ok) {
        return generateErrorResponse(500, "Error uploading file");
      }

      // Return success response
      return {
        status: uploadResponse.status,
        cloudfrontUrl: `https://d8c4cbe2y3ofj.cloudfront.net/${file.name}`,
        success: true,
        showErrorAlert: false,
        errorMessage: null,
      };
    }

    // Handle missing URL scenario
    return generateErrorResponse(500, "Invalid upload URL");
  } catch (error) {
    // Handle unexpected errors
    console.log({ error });
    return generateErrorResponse(500, "Unexpected error occurred");
  }
};
