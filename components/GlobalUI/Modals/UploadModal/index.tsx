/*
 * NextJS & ReactJS components
 * */
import React, { useEffect, useRef, useState } from "react";

/*
 * Stores
 * */
import { useUploadImagesModal } from "@/store/uploadImages.store";

/*
 * Components
 * */
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

export const UploadModal = () => {
  const uploadInputRef = useRef<HTMLInputElement>(null);

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
  } = useUploadImagesModal();

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target?.files?.[0]) return;

    // Get The File
    const file = e.target.files[0];

    // Handle file validation or processing (assuming `handleUploadFile` returns a promise)
    try {
      const newFile = handleUploadFile(file);

      // Handle error scenario from `handleUploadFile`
      if (newFile.showErrorAlert && !newFile.success) {
        setShowErrorAlert();
        setErrorAlertMessage({
          header: newFile.errorMessage.header,
          body: newFile.errorMessage.body,
        });
        return;
      }

      // Proceed if the file handling is successful
      if (newFile.success && newFile.file) {
        setIsUploadingImage(); // toggle the previous value

        try {
          const result = await uploadFile(newFile.file);

          if (result.showErrorAlert && !result.success && result.errorMessage) {
            setShowErrorAlert();
            setErrorAlertMessage({
              header: result.errorMessage.header,
              body: result.errorMessage.body,
            });

            setVariationImage({ imageUrl: null, uploaded: false });
          } else {
            setVariationImage({
              imageUrl: result.cloudfrontUrl,
              uploaded: true,
            });
            setIsUploadImagesModalOpen();
          }
        } catch (error) {
          // Handle unexpected errors during upload
          console.error("Unexpected error during file upload:", error);
          setShowErrorAlert();
          setErrorAlertMessage({
            header: "Upload Error",
            body: "An unexpected error occurred during the file upload. Please try again later.",
          });
          setVariationImage({ imageUrl: null, uploaded: false });
        } finally {
          setIsUploadingImage();
        }
      }
    } catch (error) {
      // Handle unexpected errors in `handleUploadFile`
      console.error("Unexpected error during file processing:", error);
      setShowErrorAlert();
      setErrorAlertMessage({
        header: "File Handling Error",
        body: "An unexpected error occurred while processing the file. Please try again.",
      });
      setVariationImage({ imageUrl: null, uploaded: false });
    }
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
      onOpenChange={setIsUploadImagesModalOpen}
    >
      <input
        type="file"
        multiple={false}
        className="hidden"
        ref={uploadInputRef}
        onChange={handleFile}
      />

      {/*Error message*/}
      {showErrorAlert && (
        <Alert variant="destructive" className="mt-4 -mb-4 relative">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error: {errorAlertMessage?.header}</AlertTitle>
          <AlertDescription>{errorAlertMessage?.body}</AlertDescription>
          <div
            className="absolute top-4 right-4 cursor-pointer"
            onClick={() => {
              setShowErrorAlert();
            }}
          >
            <X size={20} />
          </div>
        </Alert>
      )}

      {isUploadingImage ? (
        <div className="flex justify-center items-center w-full">
          <LoaderCircle size={30} className="animate-spin" />
        </div>
      ) : (
        <DialogContent className="max-w-5xl">
          <DialogHeader>
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
              <ScrollArea className="min-h-96 mt-2">
                {/*
                 * TODO: Add previous uploaded images when integrate the app with backend
                 */}
              </ScrollArea>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      )}
    </Dialog>
  );
};
