export const generateErrorResponse = (status: number, message: string) => ({
  status,
  cloudfrontUrl: null,
  success: false,
  showErrorAlert: true,
  errorMessage: {
    header: "Error uploading file",
    body: message || "Something went wrong, please try again later!",
  },
});
