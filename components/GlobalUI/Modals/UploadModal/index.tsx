/*
 * NextJS & ReactJS components
 */
import React, { useEffect, useRef, useState } from "react";

/*
 * Stores
 */
import { useUploadImagesModal } from "@/store/uploadImages.store";

/*
 * Components
 */
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCircle, LoaderCircle, Upload, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { handleUploadFile } from "@/components/GlobalUI/Modals/UploadModal/helpers/handleUploadFile";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { uploadFile } from "@/components/GlobalUI/Modals/UploadModal/helpers/uploadFile";
import { useDashboardStore } from "@/store/dashboard.store";

export const UploadModal = () => {
  const uploadInputRef = useRef<HTMLInputElement>(null);

  const { generationMethod } = useDashboardStore();

  const {
    setIsUploadImagesModalOpen,
    isUploadImagesModalOpen,
    setIsUploadingImage,
    isUploadingImage,
    setShowErrorAlert,
    showErrorAlert,
    setErrorAlertMessage,
    errorAlertMessage,
    setVariationImage,
    uploadButtonId,
    setFirstMixingImage,
    setSecondMixingImage,
    setUploadingFirstMixingImage,
    setUploadingSecondMixingImage,
    variationImage,
    setReplacingVariationImage,
    setReplacingFirstMixingImage,
    setReplacingSecondMixingImage,
  } = useUploadImagesModal();

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target?.files?.[0]) return;

    const file = e.target.files[0];

    try {
      const newFile = handleUploadFile(file);

      if (newFile.showErrorAlert && !newFile.success) {
        setShowErrorAlert();
        setErrorAlertMessage({
          header: newFile.errorMessage.header,
          body: newFile.errorMessage.body,
        });
        setReplacingFirstMixingImage(false);
        setReplacingSecondMixingImage(false);
        setUploadingFirstMixingImage(false);
        setUploadingSecondMixingImage(false);
        return;
      }

      if (newFile.success && newFile.file) {
        setIsUploadingImage();

        try {
          const result = await uploadFile(newFile.file);

          if (result.showErrorAlert && !result.success && result.errorMessage) {
            setShowErrorAlert();
            setErrorAlertMessage({
              header: result.errorMessage.header,
              body: result.errorMessage.body,
            });
            setReplacingFirstMixingImage(false);
            setReplacingSecondMixingImage(false);
            setUploadingFirstMixingImage(false);
            setUploadingSecondMixingImage(false);
            resetStateOnError();
          } else {
            handleSuccessfulUpload(result);
          }
        } catch (error) {
          console.error("Unexpected error during file upload:", error);
          showErrorOnUnexpectedUpload();
          resetStateOnError();
          setReplacingFirstMixingImage(false);
          setReplacingSecondMixingImage(false);
          setUploadingFirstMixingImage(false);
          setUploadingSecondMixingImage(false);
        } finally {
          cleanupStateAfterUpload();
          setReplacingFirstMixingImage(false);
          setReplacingSecondMixingImage(false);
          setUploadingFirstMixingImage(false);
          setUploadingSecondMixingImage(false);
          setShowErrorAlert();
        }
      }
    } catch (error) {
      console.error("Unexpected error during file processing:", error);
      setShowErrorAlert();
      setErrorAlertMessage({
        header: "File Handling Error",
        body: "An unexpected error occurred while processing the file. Please try again.",
      });
      setReplacingFirstMixingImage(false);
      setReplacingSecondMixingImage(false);
      setUploadingFirstMixingImage(false);
      setUploadingSecondMixingImage(false);
      resetStateOnError();
    }
  };

  const resetStateOnError = () => {
    if (generationMethod === "Variation") {
      setVariationImage({ imageUrl: null, uploaded: false });
    } else {
      setFirstMixingImage(null);
      setSecondMixingImage(null);
      setUploadingFirstMixingImage(false);
      setUploadingSecondMixingImage(false);
      setReplacingFirstMixingImage(false);
      setReplacingSecondMixingImage(false);
    }
  };

  const handleSuccessfulUpload = (
    result:
      | {
          status: number;
          cloudfrontUrl: null;
          success: boolean;
          showErrorAlert: boolean;
          errorMessage: { header: string; body: string };
        }
      | {
          status: number;
          cloudfrontUrl: string;
          success: boolean;
          showErrorAlert: boolean;
          errorMessage: null;
        },
  ) => {
    if (generationMethod === "Variation") {
      setVariationImage({
        imageUrl: result.cloudfrontUrl,
        uploaded: true,
      });
      if (variationImage.imageUrl) {
        setReplacingVariationImage(false);
      }
    } else {
      if (uploadButtonId === 1) {
        setFirstMixingImage(result.cloudfrontUrl);
        setUploadingFirstMixingImage(false);
        setReplacingFirstMixingImage(false);
      } else {
        setSecondMixingImage(result.cloudfrontUrl);
        setUploadingSecondMixingImage(false);
        setReplacingSecondMixingImage(false);
      }
    }
    setIsUploadImagesModalOpen();
  };

  const cleanupStateAfterUpload = () => {
    setIsUploadingImage();
    setUploadingFirstMixingImage(false);
    setUploadingSecondMixingImage(false);
    setReplacingVariationImage(false);
    setReplacingFirstMixingImage(false);
    setReplacingSecondMixingImage(false);
  };

  const showErrorOnUnexpectedUpload = () => {
    setShowErrorAlert();
    setErrorAlertMessage({
      header: "Upload Error",
      body: "An unexpected error occurred during the file upload. Please try again later.",
    });
  };

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <Dialog
        open={isUploadImagesModalOpen}
        onOpenChange={setIsUploadImagesModalOpen}
      >
        <DialogContent className="max-w-5xl">
          <DialogHeader>
            <Skeleton className="h-28 w-full my-6" />
            <DialogDescription asChild>
              <Skeleton className="h-96 w-full" />
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog
      open={isUploadImagesModalOpen}
      onOpenChange={() => {
        setIsUploadImagesModalOpen();
        if (generationMethod === "Variation") {
          setReplacingVariationImage(false);
        } else {
          setReplacingFirstMixingImage(false);
          setReplacingSecondMixingImage(false);
          setUploadingFirstMixingImage(false);
          setUploadingSecondMixingImage(false);
        }
      }}
    >
      <input
        type="file"
        multiple={false}
        className="hidden"
        ref={uploadInputRef}
        onChange={handleFile}
      />

      {isUploadingImage ? (
        <div className="hidden">
          <LoaderCircle size={30} className="animate-spin" />
        </div>
      ) : (
        <DialogContent className="max-w-5xl">
          <DialogHeader>
            {showErrorAlert &&
              errorAlertMessage.header &&
              errorAlertMessage.body && (
                <Alert variant="destructive" className="mt-4 mb-4 relative">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error: {errorAlertMessage.header}</AlertTitle>
                  <AlertDescription>{errorAlertMessage.body}</AlertDescription>
                  <div
                    className="absolute top-4 right-4 cursor-pointer"
                    onClick={setShowErrorAlert}
                  >
                    <X size={20} />
                  </div>
                </Alert>
              )}

            <DialogTitle
              className={cn(
                "text-center text-md flex justify-center items-center flex-col gap-y-1 border border-dashed my-6 py-6 cursor-pointer",
                isUploadingImage &&
                  "bg-gray-100 hover:cursor-not-allowed text-gray-500",
              )}
              role="button"
              onClick={() => {
                if (isUploadingImage) return;
                uploadInputRef.current?.click();
              }}
            >
              <Upload size="30" />
              <span>Add an image to get started</span>
              <span>PNG, JPG and Webp up to 10MB</span>
            </DialogTitle>

            <DialogDescription asChild>
              <ScrollArea className="min-h-96 mt-2" />
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      )}
    </Dialog>
  );
};
