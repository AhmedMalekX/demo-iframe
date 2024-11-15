/*
 * Packages
 * */
import { v4 as uuidv4 } from "uuid";

export const handleUploadFile = (file: File) => {
  // get photo size
  const fileSize = file.size;

  // 10485760 is equal 10mb
  if (fileSize > 10485760) {
    return {
      showErrorAlert: true,
      errorMessage: {
        header: "File size error",
        body: "File size is too large, max size is 10mb.",
      },
      success: false,
      file: null,
    };
  }

  // Check a photo type
  const allowedTypes = ["jpg", "png", "jpeg", "webp"];
  const fileType = file.type?.split("/")[1];

  if (!allowedTypes.includes(fileType)) {
    return {
      showErrorAlert: true,
      errorMessage: {
        header: "File type error",
        body: "File type is not allowed, allowed types are (jpg, png, jpeg)",
      },
      success: false,
      file: null,
    };
  }

  // Change file name
  const newName = `patternedai-${uuidv4()}.${fileType}`;
  const newFile = new File([file], newName, { type: file.type });

  return {
    showErrorAlert: false,
    errorMessage: {
      header: null,
      body: null,
    },
    success: true,
    file: newFile,
  };
};
