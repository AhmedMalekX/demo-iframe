/*
 * NextJS & ReactJS Components
 * */
import React, { useEffect, useRef, useState } from "react";

/*
 * Stores
 * */
import { useDashboardStore } from "@/store/dashboard.store";

/*
 * UI Components
 * */
import { Slider } from "@/components/ui/slider";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

/*
 * Icons
 * */
import { Download, Timer } from "lucide-react";

/*
 * Constants
 * */
const PREVIEW_WIDTH = 900;
const PREVIEW_HEIGHT = 600;

/*
 * TODO:
 *  - REMOVE IT AFTER IMPLEMENT THE HIGH RESOLUTION IMAGE
 *  - REFACTOR THE CODE AFTER IMPLEMENT THE HIGH RESOLUTION IMAGE
 * */
const HIGH_QUALITY_IMAGE_URL =
  "https://s3.amazonaws.com/imgs-patternedai/large_f003f64d-6fdc-41c8-9a50-85bd96844c5f.png";

export const GeneratedImageControls = () => {
  const { imagePreviewZoom, setImagePreviewZoom, selectedPreviewImage } =
    useDashboardStore();

  /*
   * Handle the selected preview image
   * */
  const [standardImageUrl, setStandardImageUrl] =
    useState(selectedPreviewImage);

  useEffect(() => {
    setStandardImageUrl(selectedPreviewImage);
  }, [selectedPreviewImage]);

  /*
   * Handle the download options state
   * */
  const [activeTab, setActiveTab] = useState<"tile" | "repeated">("tile");
  const [usePhysicalDimensions, setUsePhysicalDimensions] = useState(true);
  const [width, setWidth] = useState(usePhysicalDimensions ? 12 : 2000);
  const [height, setHeight] = useState(usePhysicalDimensions ? 12 : 2000);
  const [zoomLevel, setZoomLevel] = useState(50);
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadInfo, setDownloadInfo] = useState<{
    dpi: number;
    resolution: { width: number; height: number };
    imageUrl: string;
  } | null>(null);
  const [dpiStandard, setDpiStandard] = useState(0);
  const [dpiHigh, setDpiHigh] = useState(0);
  const [scalingFactor, setScalingFactor] = useState(1);

  console.log({ downloadInfo, scalingFactor });

  /*
   * Canvas ref
   * */
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const calculateDPI = (
    widthInch: number,
    heightInch: number,
    zoomLevelPercent: number,
  ) => {
    const tileSize = {
      small: 1024,
      large: 4096,
    };

    const zoomFactor = zoomLevelPercent / 100;
    const effectiveTileSize = {
      small: tileSize.small / zoomFactor,
      large: tileSize.large / zoomFactor,
    };

    const physicalDiagonalInch = Math.sqrt(widthInch ** 2 + heightInch ** 2);
    const diagonalPixels = {
      small: Math.sqrt(
        effectiveTileSize.small ** 2 + effectiveTileSize.small ** 2,
      ),
      large: Math.sqrt(
        effectiveTileSize.large ** 2 + effectiveTileSize.large ** 2,
      ),
    };

    return {
      small: Math.round(diagonalPixels.small / physicalDiagonalInch),
      large: Math.round(diagonalPixels.large / physicalDiagonalInch),
    };
  };

  const calculateScalingFactor = (
    designWidth: number,
    designHeight: number,
    zoomLevelPercent: number,
  ) => {
    const scalingUnzoomed = Math.min(
      PREVIEW_WIDTH / designWidth,
      PREVIEW_HEIGHT / designHeight,
    );
    return scalingUnzoomed * (zoomLevelPercent / 100);
  };

  useEffect(() => {
    if (usePhysicalDimensions) {
      const dpi = calculateDPI(width, height, zoomLevel);
      setDpiStandard(dpi.small);
      setDpiHigh(dpi.large);
    }

    const designWidth = usePhysicalDimensions ? width * dpiStandard : width;
    const designHeight = usePhysicalDimensions ? height * dpiStandard : height;
    const newScalingFactor = calculateScalingFactor(
      designWidth,
      designHeight,
      zoomLevel,
    );
    setScalingFactor(newScalingFactor);
  }, [width, height, zoomLevel, usePhysicalDimensions, dpiStandard]);

  const generateImage = async (quality: "standard" | "high") => {
    setIsGenerating(true);
    const baseTileSize = 1024;
    const tileSize = quality === "standard" ? baseTileSize : baseTileSize * 4;
    let finalWidth: number;
    let finalHeight: number;
    let dpi: number;
    let adjustedZoomLevel = zoomLevel;

    if (activeTab === "tile") {
      finalWidth = tileSize;
      finalHeight = tileSize;
      dpi = tileSize;
    } else if (usePhysicalDimensions) {
      const dpiValues = calculateDPI(width, height, zoomLevel);
      dpi = quality === "standard" ? dpiValues.small : dpiValues.large;
      finalWidth = Math.round(width * dpi);
      finalHeight = Math.round(height * dpi);
    } else {
      if (quality === "high") {
        adjustedZoomLevel = zoomLevel / 4;
      }
      const scaleFactor = adjustedZoomLevel / 100;
      finalWidth = width;
      finalHeight = height;
      dpi = Math.round(tileSize / scaleFactor);
    }

    if (!standardImageUrl) return;

    const imageUrl =
      quality === "standard" ? standardImageUrl : HIGH_QUALITY_IMAGE_URL;

    setDownloadInfo({
      dpi,
      resolution: { width: finalWidth, height: finalHeight },
      imageUrl,
    });

    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = finalWidth;
    canvas.height = finalHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageUrl;

    await new Promise((resolve) => {
      img.onload = () => {
        if (activeTab === "tile" || usePhysicalDimensions) {
          for (let y = 0; y < finalHeight; y += tileSize) {
            for (let x = 0; x < finalWidth; x += tileSize) {
              ctx.drawImage(img, x, y, tileSize, tileSize);
            }
          }
        } else {
          const scaleFactor = adjustedZoomLevel / 100;
          const effectiveTileSize = Math.round(tileSize * scaleFactor);
          for (let y = 0; y < finalHeight; y += effectiveTileSize) {
            for (let x = 0; x < finalWidth; x += effectiveTileSize) {
              ctx.drawImage(img, x, y, effectiveTileSize, effectiveTileSize);
            }
          }
        }
        resolve(null);
      };
    });

    const link = document.createElement("a");
    link.download = `repeated-pattern-${quality}.png`;
    link.href = canvas.toDataURL();
    link.click();

    setIsGenerating(false);
  };

  const handleDimensionToggle = (checked: boolean) => {
    setUsePhysicalDimensions(checked);
    setWidth(checked ? 12 : 2000);
    setHeight(checked ? 12 : 2000);
    setDownloadInfo(null);
  };

  // const previewStyle = {
  //   width: `${PREVIEW_WIDTH}px`,
  //   height: `${PREVIEW_HEIGHT}px`,
  //   backgroundImage: `url(${STANDARD_IMAGE_URL})`,
  //   backgroundRepeat: "repeat",
  //   backgroundSize: `${scalingFactor * 100}%`,
  //   border: "1px solid #ccc",
  //   marginTop: "20px",
  // };

  /*Check if the component is mounted*/
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted)
    return (
      <div className="py-4 flex items-center justify-between w-full">
        <div className="w-1/2">
          <Skeleton className="w-full h-8" />
        </div>

        <div className="w-1/6">
          <Skeleton className="w-full h-8" />
        </div>
      </div>
    );

  return (
    <div className="py-4 flex items-center justify-between w-full">
      {/*Slider */}
      <div className="w-full flex items-center gap-x-2">
        <h3>Zoom</h3>
        <Slider
          min={10}
          max={100}
          step={5}
          name="imagePreviewZoom"
          className="cursor-pointer w-1/2"
          value={[imagePreviewZoom]}
          onValueChange={(value) => {
            setImagePreviewZoom(value[0]);
          }}
        />
        <span className="font-medium">{imagePreviewZoom}%</span>
      </div>
      <div>
        <Popover>
          <PopoverTrigger>
            <p
              className="flex items-center gap-x-2 h-9 px-4 py-2 rounded-2xl bg-[#8920ce] text-white shadow hover:bg-[#8920ce]/90"
              role="button"
            >
              <Download />
              <span>Download</span>
            </p>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-full">
            <Tabs defaultValue="tile" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger
                  value="tile"
                  onClick={() => {
                    setActiveTab("tile");
                  }}
                >
                  Pattern Tile
                </TabsTrigger>
                <TabsTrigger
                  value="repeated"
                  onClick={() => {
                    setActiveTab("repeated");
                  }}
                >
                  Repeated Pattern
                </TabsTrigger>
              </TabsList>
              <TabsContent value="tile">
                <div className="flex flex-col gap-y-3">
                  <div className="flex flex-col gap-y-2">
                    <Button
                      size="lg"
                      variant="outline"
                      className="flex items-center w-full"
                      disabled={!selectedPreviewImage || isGenerating}
                      onClick={() => generateImage("standard")}
                    >
                      <Download /> <span>Download Standard (1024 x 1024)</span>
                    </Button>
                    <p className="text-gray-600 italic">
                      Best for small images, web use, or low-resolution
                      applications.
                    </p>
                  </div>
                  <div className="flex flex-col gap-y-2">
                    <Button
                      size="lg"
                      disabled={!selectedPreviewImage || isGenerating}
                      onClick={() => generateImage("high")}
                    >
                      <Timer />
                      <span>
                        Upscale and Download High Quality (4096 x 4096, ~60
                        seconds)
                      </span>
                    </Button>
                    <p className="text-gray-600 italic">
                      Ideal for large prints, high-resolution displays, or where
                      zooming is required.
                    </p>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="repeated">
                <div className="flex items-center gap-x-2">
                  <Switch
                    id="dimensions-toggle-repeated"
                    checked={usePhysicalDimensions}
                    onCheckedChange={handleDimensionToggle}
                    className="cursor-pointer"
                    disabled={!selectedPreviewImage || isGenerating}
                  />
                  <Label
                    htmlFor="dimensions-toggle-repeated"
                    className="cursor-pointer"
                  >
                    {usePhysicalDimensions ? "Print Size" : "Pixel Resolution"}
                  </Label>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="width-repeated">
                      Width ({usePhysicalDimensions ? "inches" : "pixels"})
                    </Label>
                    <Input
                      id="width-repeated"
                      type="number"
                      value={width}
                      onChange={(e) => setWidth(parseFloat(e.target.value))}
                      disabled={!selectedPreviewImage || isGenerating}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="height-repeated">
                      Height ({usePhysicalDimensions ? "inches" : "pixels"})
                    </Label>
                    <Input
                      id="height-repeated"
                      type="number"
                      value={height}
                      onChange={(e) => setHeight(parseFloat(e.target.value))}
                      disabled={!selectedPreviewImage || isGenerating}
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <Label htmlFor="zoom-repeated">
                    Zoom Level: {zoomLevel}%
                  </Label>
                  <Slider
                    id="zoom-repeated"
                    min={30}
                    max={400}
                    step={1}
                    value={[zoomLevel]}
                    onValueChange={(value) => setZoomLevel(value[0])}
                  />
                </div>

                <div className="mt-4 w-full">
                  <Button
                    size="lg"
                    variant="outline"
                    className="flex items-center w-full"
                    disabled={!selectedPreviewImage || isGenerating}
                    onClick={() => generateImage("standard")}
                  >
                    <Download />
                    <span>
                      Download Standard{" "}
                      {usePhysicalDimensions ? `(${dpiStandard} DPI)` : ""}
                    </span>
                  </Button>
                </div>

                <div className="mt-4 w-full">
                  <Button
                    size="lg"
                    className="flex items-center w-full"
                    disabled={!selectedPreviewImage || isGenerating}
                    onClick={() => generateImage("high")}
                  >
                    <Timer />{" "}
                    <span>
                      Upscale and Download High Quality{" "}
                      {usePhysicalDimensions
                        ? `(${dpiHigh} DPI)`
                        : `(Zoom: ${zoomLevel / 4}%)`}
                    </span>
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </PopoverContent>
        </Popover>
      </div>
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
};
