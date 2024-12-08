/*
 * NextJS & ReactJS components
 */
import React, { useMemo, useState } from "react";
import Image from "next/image";

/*
 * Canvas
 */
import { RepeatCanvas } from "@/components/GeneratingImagesMethods/GenerateImageFromElements/createTabEngine/components/components";

/*
 * Stores
 * */
import { useDashboardStore } from "@/store/dashboard.store";

/*
 * Components
 * */
import { useAppStateContext } from "@/components/GeneratingImagesMethods/GenerateImageFromElements/createTabHooks/AppContextProvider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

/*
 * Icons
 * */
import { RefreshCw } from "lucide-react";
import { useActiveGeneratingMethodStore } from "@/store/generatingImages.store";
import { useUploadImagesStore } from "@/store/uploadImages.store";

/*
 * Types
 */
interface IEditorPreview {
  zoom: number;
  pan: {
    x: number;
    y: number;
  };
  finalResoluton: {
    width: number;
    height: number;
  };
  previewZoom: number;
}

export const EditorPreview = ({
  zoom,
  pan,
  finalResoluton,
  previewZoom,
}: IEditorPreview) => {
  // hooks
  const { appState } = useAppStateContext();
  const {
    imagePreviewZoom,
    selectedMockup,
    setSelectedPreviewImage,
    setGenerationMethod,
  } = useDashboardStore();
  const { setActiveGeneratingMethod } = useActiveGeneratingMethodStore();
  const { setVariationImage } = useUploadImagesStore();

  const [url, setUrl] = useState<string | null>(null);

  const handleGeneratedImageUrl = (imageUrl: string) => {
    console.log("Generated Image URL:", imageUrl);
    // You can set this URL to state or use it as needed
    setUrl(imageUrl);
    setSelectedPreviewImage(imageUrl);
  };

  const handleGenerateSimilar = () => {
    setActiveGeneratingMethod("From image");
    setGenerationMethod("Variation");
    setVariationImage({ imageUrl: url, uploaded: true });
  };

  const renderImageContent = () => (
    <TooltipProvider>
      <Tooltip delayDuration={0}>
        <TooltipTrigger className="absolute top-5 right-5">
          <RefreshCw
            className="bg-black bg-opacity-50 rounded-lg p-1 backdrop-blur-sm"
            stroke="white"
            size={30}
            role="button"
            onClick={handleGenerateSimilar}
          />
        </TooltipTrigger>
        <TooltipContent
          align="end"
          side="left"
          alignOffset={-2}
          sideOffset={10}
          className="!px-2 py-1 mb-0.5"
        >
          <p className="select-none">Generate similar</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  const repeatCanvasPreviewWindow = useMemo(() => {
    return (
      <RepeatCanvas
        previewZoom={1}
        pan={pan}
        zoom={zoom}
        canvasId="repeat-canvas"
        canvasSize={finalResoluton}
        parentZoom={previewZoom}
        onAfterRender={handleGeneratedImageUrl} // Pass the callback
      />
    );
  }, [zoom, finalResoluton, previewZoom, pan]);

  return (
    <div
      className="w-full bg-[#f8f8f8]"
      style={{
        backgroundImage: url ? `url(${url})` : "none",
        backgroundSize: `${imagePreviewZoom}%`,
        backgroundPosition: "center center",
        backgroundRepeat: "repeat",
      }}
    >
      <div className="w-full bg-[#f8f8f8]">
        {appState.elements.length > 0 && (
          <div
            id="repeat-canvas-container"
            className="w-full relative bg-[#f8f8f8]"
          >
            <div className="hidden">{repeatCanvasPreviewWindow}</div>
            {selectedMockup ? (
              <div className="w-full h-full flex justify-center bg-[#f8f8f8]">
                <Image
                  src={`/products/${selectedMockup}.png`}
                  alt="Image preview"
                  width={1000}
                  height={1000}
                  style={{
                    backgroundImage: `url("${url}")`,
                    backgroundSize: `${imagePreviewZoom}%`,
                    objectFit: "cover",
                    objectPosition: "center",
                  }}
                  className="w-auto max-h-[500px] object-cover object-center"
                />
                {renderImageContent()}
              </div>
            ) : (
              <div
                className="rounded-2xl transition-all duration-75 ease-linear relative w-full h-full bg-[#f8f8f8]"
                style={{
                  backgroundImage: url ? `url(${url})` : "none",
                  backgroundSize: `${imagePreviewZoom}%`,
                  backgroundPosition: "center center",
                  backgroundRepeat: "no-repeat",
                }}
              >
                {renderImageContent()}
              </div>
            )}
          </div>
        )}

        {appState.elements.length === 0 && (
          <div
            style={{
              height: "500px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                backgroundImage: `url(/assets/images/transparent-background.jpg)`,
                objectFit: "cover",
                objectPosition: "center",
                backgroundRepeat: "repeat",
                backgroundSize: "contain",
              }}
            ></div>
          </div>
        )}
      </div>
    </div>
  );
};
