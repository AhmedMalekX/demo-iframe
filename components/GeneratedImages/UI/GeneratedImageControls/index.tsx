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
 * Packges
 * */
import { v4 as uuidv4 } from "uuid";
import { getUpscaleCallId } from "@/actions/getUpscaleCallId";
import { getUpscaleImageDataHelper } from "@/helpers/getUpscaleImageDataHelper";
import { useCountdown } from "@/hooks/useCountdown";

/*
 * Constants
 * */
const PREVIEW_WIDTH = 900;
const PREVIEW_HEIGHT = 600;

/*
 * TODO:
 *  - REFACTOR THE CODE AFTER IMPLEMENT THE HIGH RESOLUTION IMAGE
 * */

export const GeneratedImageControls = () => {
  const {
    imagePreviewZoom,
    setImagePreviewZoom,
    selectedPreviewImage,
    setScalingFactor,
    setErrorModalMessage,
    setShowErrorModal,
    setIsUpscalingImage,
    generatedImages,
  } = useDashboardStore();

  console.log({ generatedImages });

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
  const [isGenerating, setIsGenerating] = useState(false);
  // const [downloadInfo, setDownloadInfo] = useState<{
  //   dpi: number;
  //   resolution: { width: number; height: number };
  //   imageUrl: string;
  // } | null>(null);
  const [dpiStandard, setDpiStandard] = useState(0);
  const [dpiHigh, setDpiHigh] = useState(0);
  // const [timeLeft, setTimeLeft] = useState(60);

  const [timeLeft, startCountdown, stopCountdown] = useCountdown(60); // Start the countdown with 60 seconds

  useEffect(() => {
    console.log({ imagePreviewZoom });
  }, [imagePreviewZoom]);

  useEffect(() => {
    console.log({ selectedPreviewImage });
  }, [selectedPreviewImage]);

  useEffect(() => {
    console.log({ standardImageUrl });
  }, [standardImageUrl]);

  useEffect(() => {
    console.log({ activeTab });
  }, [activeTab]);

  useEffect(() => {
    console.log({ usePhysicalDimensions });
  }, [usePhysicalDimensions]);

  useEffect(() => {
    console.log({ width });
  }, [width]);

  useEffect(() => {
    console.log({ height });
  }, [height]);

  useEffect(() => {
    console.log({ isGenerating });
  }, [isGenerating]);

  useEffect(() => {
    console.log({ dpiStandard });
  }, [dpiStandard]);

  useEffect(() => {
    console.log({ dpiHigh });
  }, [dpiHigh]);

  useEffect(() => {
    console.log({ timeLeft });
  }, [timeLeft]);

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
      const dpi = calculateDPI(width, height, imagePreviewZoom);
      setDpiStandard(dpi.small);
      setDpiHigh(dpi.large);
    }

    const designWidth = usePhysicalDimensions ? width * dpiStandard : width;
    const designHeight = usePhysicalDimensions ? height * dpiStandard : height;
    const newScalingFactor = calculateScalingFactor(
      designWidth,
      designHeight,
      imagePreviewZoom,
    );
    setScalingFactor(newScalingFactor);
  }, [width, height, imagePreviewZoom, usePhysicalDimensions, dpiStandard]);

  // const startCountdown = () => {
  //   setTimeLeft(60);
  //
  //   const interval = setInterval(() => {
  //     setTimeLeft((prev) => {
  //       if (prev <= 1) {
  //         clearInterval(interval);
  //         return 0;
  //       }
  //       return prev - 1;
  //     });
  //   }, 1000);
  // };

  // OLD CODE
  // const generateImage = async (quality: "standard" | "high") => {
  //   setIsGenerating(true);
  //   startCountdown();
  //   const baseTileSize = 1024;
  //   const tileSize = quality === "standard" ? baseTileSize : baseTileSize * 4;
  //   let finalWidth: number;
  //   let finalHeight: number;
  //   let dpi: number;
  //   let adjustedZoomLevel = imagePreviewZoom;
  //
  //   if (activeTab === "tile") {
  //     finalWidth = tileSize;
  //     finalHeight = tileSize;
  //     dpi = tileSize;
  //   } else if (usePhysicalDimensions) {
  //     const dpiValues = calculateDPI(width, height, imagePreviewZoom);
  //     dpi = quality === "standard" ? dpiValues.small : dpiValues.large;
  //     finalWidth = Math.round(width * dpi);
  //     finalHeight = Math.round(height * dpi);
  //   } else {
  //     if (quality === "high") {
  //       adjustedZoomLevel = imagePreviewZoom / 4;
  //     }
  //     const scaleFactor = adjustedZoomLevel / 100;
  //     finalWidth = width;
  //     finalHeight = height;
  //     dpi = Math.round(tileSize / scaleFactor);
  //   }
  //
  //   if (!standardImageUrl) return;
  //
  //   let imageUrl: string;
  //   if (quality === "standard") {
  //     imageUrl = standardImageUrl;
  //   } else {
  //     setIsUpscalingImage(true);
  //
  //     const dataToGetUpscaleCallId = {
  //       input_img_url: selectedPreviewImage!,
  //       outscale: 4,
  //       imageId: uuidv4(),
  //     };
  //
  //     // get upscale call id
  //     const callIdResponse: any = await getUpscaleCallId(
  //       dataToGetUpscaleCallId,
  //     );
  //
  //     // handle error for call id
  //     if (callIdResponse?.errors) {
  //       setErrorModalMessage({
  //         header: "Server error!",
  //         body: "Something went wrong, try again No credits were deducted for this request.",
  //       });
  //       setShowErrorModal(true);
  //       setIsUpscalingImage(false);
  //       return;
  //     }
  //
  //     if (callIdResponse?.message) {
  //       setErrorModalMessage({
  //         header: "Something went wrong!",
  //         body: "Something went wrong, try again No credits were deducted for this request.",
  //       });
  //       setShowErrorModal(true);
  //       setIsUpscalingImage(false);
  //       return;
  //     }
  //
  //     try {
  //       const getImageDataResponse: any = await getUpscaleImageDataHelper({
  //         callId: callIdResponse.callIdData.call_id,
  //       });
  //
  //       if (getImageDataResponse?.status === 500) {
  //         setErrorModalMessage({
  //           header: "Server error!",
  //           body: "Something went wrong, try again No credits were deducted for this request.",
  //         });
  //         setShowErrorModal(true);
  //         return;
  //       }
  //
  //       imageUrl = getImageDataResponse.data.img_url;
  //     } catch (error: any) {
  //       console.log({ error });
  //       setErrorModalMessage({
  //         header: "Something went wrong!",
  //         body: "Something went wrong, try again No credits were deducted for this request.",
  //       });
  //       setShowErrorModal(true);
  //       return;
  //     } finally {
  //       setIsUpscalingImage(false);
  //     }
  //   }
  //
  //   setDownloadInfo({
  //     dpi,
  //     resolution: { width: finalWidth, height: finalHeight },
  //     imageUrl,
  //   });
  //
  //   const canvas = canvasRef.current;
  //   if (!canvas) return;
  //
  //   canvas.width = finalWidth;
  //   canvas.height = finalHeight;
  //   const ctx = canvas.getContext("2d");
  //   if (!ctx) return;
  //
  //   const img = new Image();
  //   img.crossOrigin = "anonymous";
  //   img.src = imageUrl;
  //
  //   await new Promise((resolve) => {
  //     img.onload = () => {
  //       if (activeTab === "tile" || usePhysicalDimensions) {
  //         for (let y = 0; y < finalHeight; y += tileSize) {
  //           for (let x = 0; x < finalWidth; x += tileSize) {
  //             ctx.drawImage(img, x, y, tileSize, tileSize);
  //           }
  //         }
  //       } else {
  //         const scaleFactor = adjustedZoomLevel / 100;
  //         const effectiveTileSize = Math.round(tileSize * scaleFactor);
  //         for (let y = 0; y < finalHeight; y += effectiveTileSize) {
  //           for (let x = 0; x < finalWidth; x += effectiveTileSize) {
  //             ctx.drawImage(img, x, y, effectiveTileSize, effectiveTileSize);
  //           }
  //         }
  //       }
  //       resolve(null);
  //     };
  //   });
  //
  //   const link = document.createElement("a");
  //   link.download = `repeated-pattern-${quality}.png`;
  //   link.href = canvas.toDataURL();
  //   link.click();
  //
  //   setIsGenerating(false);
  //   setIsUpscalingImage(false);
  //   setTimeLeft(60);
  // };

  // MAXIMIZE IMAGE WIDTH & HEIGHT
  // const generateImage = async (quality: "standard" | "high") => {
  //   setIsGenerating(true);
  //   startCountdown();
  //   const baseTileSize = 1024;
  //   const tileSize = quality === "standard" ? baseTileSize : baseTileSize * 4;
  //   let finalWidth: number;
  //   let finalHeight: number;
  //   let dpi: number;
  //   let adjustedZoomLevel = imagePreviewZoom;
  //
  //   if (activeTab === "tile") {
  //     finalWidth = tileSize;
  //     finalHeight = tileSize;
  //     dpi = tileSize;
  //   } else if (usePhysicalDimensions) {
  //     const dpiValues = calculateDPI(width, height, imagePreviewZoom);
  //     dpi = quality === "standard" ? dpiValues.small : dpiValues.large;
  //     finalWidth = Math.round(width * dpi);
  //     finalHeight = Math.round(height * dpi);
  //   } else {
  //     if (quality === "high") {
  //       adjustedZoomLevel = imagePreviewZoom / 4;
  //     }
  //     const scaleFactor = adjustedZoomLevel / 100;
  //     finalWidth = width;
  //     finalHeight = height;
  //     dpi = Math.round(tileSize / scaleFactor);
  //   }
  //
  //   if (!standardImageUrl) return;
  //
  //   let imageUrl: string;
  //   if (quality === "standard") {
  //     imageUrl = standardImageUrl;
  //   } else {
  //     setIsUpscalingImage(true);
  //
  //     const dataToGetUpscaleCallId = {
  //       input_img_url: selectedPreviewImage!,
  //       outscale: 4,
  //       imageId: uuidv4(),
  //     };
  //
  //     // get upscale call id
  //     const callIdResponse: any = await getUpscaleCallId(
  //       dataToGetUpscaleCallId,
  //     );
  //
  //     if (callIdResponse?.errors || callIdResponse?.message) {
  //       setErrorModalMessage({
  //         header: "Error!",
  //         body: "Something went wrong. No credits were deducted for this request.",
  //       });
  //       setShowErrorModal(true);
  //       setIsUpscalingImage(false);
  //       return;
  //     }
  //
  //     try {
  //       const getImageDataResponse: any = await getUpscaleImageDataHelper({
  //         callId: callIdResponse.callIdData.call_id,
  //       });
  //
  //       if (getImageDataResponse?.status === 500) {
  //         setErrorModalMessage({
  //           header: "Server error!",
  //           body: "Something went wrong. No credits were deducted for this request.",
  //         });
  //         setShowErrorModal(true);
  //         return;
  //       }
  //
  //       imageUrl = getImageDataResponse.data.img_url;
  //     } catch (error: any) {
  //       console.error({ error });
  //       setErrorModalMessage({
  //         header: "Something went wrong!",
  //         body: "Something went wrong. No credits were deducted for this request.",
  //       });
  //       setShowErrorModal(true);
  //       return;
  //     } finally {
  //       setIsUpscalingImage(false);
  //     }
  //   }
  //
  //   setDownloadInfo({
  //     dpi,
  //     resolution: { width: finalWidth, height: finalHeight },
  //     imageUrl,
  //   });
  //
  //   const canvas = canvasRef.current;
  //   if (!canvas) return;
  //
  //   // Scale down canvas for large resolutions
  //   const maxCanvasSize = 4096;
  //   if (finalWidth > maxCanvasSize || finalHeight > maxCanvasSize) {
  //     const scaleFactor = Math.min(
  //       maxCanvasSize / finalWidth,
  //       maxCanvasSize / finalHeight,
  //     );
  //     finalWidth = Math.round(finalWidth * scaleFactor);
  //     finalHeight = Math.round(finalHeight * scaleFactor);
  //     dpi = Math.round(dpi * scaleFactor);
  //   }
  //
  //   canvas.width = finalWidth;
  //   canvas.height = finalHeight;
  //   const ctx = canvas.getContext("2d");
  //   if (!ctx) return;
  //
  //   const img = new Image();
  //   img.crossOrigin = "anonymous";
  //   img.src = imageUrl;
  //
  //   await new Promise((resolve) => {
  //     img.onload = () => {
  //       if (activeTab === "tile" || usePhysicalDimensions) {
  //         for (let y = 0; y < finalHeight; y += tileSize) {
  //           for (let x = 0; x < finalWidth; x += tileSize) {
  //             ctx.drawImage(img, x, y, tileSize, tileSize);
  //           }
  //         }
  //       } else {
  //         const scaleFactor = adjustedZoomLevel / 100;
  //         const effectiveTileSize = Math.round(tileSize * scaleFactor);
  //         for (let y = 0; y < finalHeight; y += effectiveTileSize) {
  //           for (let x = 0; x < finalWidth; x += effectiveTileSize) {
  //             ctx.drawImage(img, x, y, effectiveTileSize, effectiveTileSize);
  //           }
  //         }
  //       }
  //       resolve(null);
  //     };
  //   });
  //
  //   const link = document.createElement("a");
  //   link.download = `repeated-pattern-${quality}.jpeg`;
  //   const imageQuality = 0.7; // Adjust for smaller file size
  //   link.href = canvas.toDataURL("image/jpeg", imageQuality);
  //   link.click();
  //
  //   setIsGenerating(false);
  //   setIsUpscalingImage(false);
  //   setTimeLeft(60);
  // };

  function createShader(
    gl: WebGLRenderingContext,
    type: number,
    source: string,
  ): WebGLShader {
    const shader = gl.createShader(type);
    if (!shader) throw new Error("Unable to create shader.");

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const error = gl.getShaderInfoLog(shader);
      gl.deleteShader(shader);
      throw new Error("Shader compilation error: " + error);
    }

    return shader;
  }

  function createProgram(
    gl: WebGLRenderingContext,
    vertexShader: WebGLShader,
    fragmentShader: WebGLShader,
  ): WebGLProgram {
    const program = gl.createProgram();
    if (!program) throw new Error("Unable to create program.");

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      const error = gl.getProgramInfoLog(program);
      gl.deleteProgram(program);
      throw new Error("Program linking error: " + error);
    }

    return program;
  }

  const [upscaledImages, setUpscaledImages] = useState<any>();

  useEffect(() => {
    setUpscaledImages(
      generatedImages?.imgs_dict_list.map((img) => ({
        imageUrl: img.imgUrl,
        upscaleImageUrl: null,
      })),
    );
  }, [generatedImages]);

  console.log({ upscaledImages });

  const generateImage = async (quality: "standard" | "high") => {
    if (isGenerating) return;
    setIsGenerating(true);
    startCountdown();

    const baseTileSize = 1024;
    const tileSize = quality === "standard" ? baseTileSize : baseTileSize * 4;
    let finalWidth: number;
    let finalHeight: number;
    let dpi: number;
    let adjustedZoomLevel = imagePreviewZoom;

    if (activeTab === "tile") {
      finalWidth = tileSize;
      finalHeight = tileSize;
      dpi = tileSize;
    } else if (usePhysicalDimensions) {
      const dpiValues = calculateDPI(width, height, imagePreviewZoom);
      dpi = quality === "standard" ? dpiValues.small : dpiValues.large;
      finalWidth = Math.round(width * dpi);
      finalHeight = Math.round(height * dpi);
    } else {
      if (quality === "high") {
        adjustedZoomLevel = imagePreviewZoom / 4;
      }
      const scaleFactor = adjustedZoomLevel / 100;
      finalWidth = width;
      finalHeight = height;
      dpi = Math.round(tileSize / scaleFactor);
    }

    if (!standardImageUrl) return;

    let imageUrl: string | null;
    if (quality === "standard") {
      imageUrl = standardImageUrl;
    } else {
      if (
        upscaledImages.find(
          (img: any) =>
            img.imageUrl ===
            "https://dsm6fpp1ioao4.cloudfront.net/b60437a6-b8a8-44f5-9b68-56ac4566c847.png",
        )
      ) {
        imageUrl =
          "https://s3.amazonaws.com/imgs-patternedai/large_b22d6fb8-1a11-4bca-aea5-d2cdae32d81d.png";
      } else {
        const foundImage = upscaledImages.find(
          (img: { imageUrl: string }) => img.imageUrl === selectedPreviewImage,
        );

        if (!foundImage?.upscaleImageUrl) {
          setIsUpscalingImage(true);

          const dataToGetUpscaleCallId = {
            input_img_url: selectedPreviewImage!,
            outscale: 4,
            imageId: uuidv4(),
          };

          const callIdResponse: any = await getUpscaleCallId(
            dataToGetUpscaleCallId,
          );

          if (callIdResponse?.errors || callIdResponse?.message) {
            setErrorModalMessage({
              header: "Error!",
              body: "An error occurred during upscaling. No credits were deducted.",
            });
            setShowErrorModal(true);
            setIsUpscalingImage(false);
            return;
          }

          try {
            const getImageDataResponse: any = await getUpscaleImageDataHelper({
              callId: callIdResponse.callIdData.call_id,
            });

            if (getImageDataResponse?.status === 500) {
              setErrorModalMessage({
                header: "Server Error!",
                body: "An error occurred during image retrieval. No credits were deducted.",
              });
              setShowErrorModal(true);
              return;
            }

            imageUrl = getImageDataResponse.data.img_url;
            setUpscaledImages((prevImages: any) =>
              prevImages.map((img: any) =>
                img.imageUrl === selectedPreviewImage
                  ? { ...img, upscaleImageUrl: imageUrl }
                  : img,
              ),
            );
          } catch (error: any) {
            console.log(error);
            setErrorModalMessage({
              header: "Error!",
              body: "An error occurred. No credits were deducted.",
            });
            setShowErrorModal(true);
            return;
          } finally {
            setIsUpscalingImage(false);
          }
        } else {
          imageUrl = foundImage?.upscaleImageUrl;
        }
      }
    }

    // setDownloadInfo({
    //   dpi,
    //   resolution: { width: finalWidth, height: finalHeight },
    //   imageUrl,
    // });

    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = finalWidth;
    canvas.height = finalHeight;

    const gl = canvas.getContext("webgl");
    if (!gl) {
      console.error("WebGL not supported");
      return;
    }

    gl.clearColor(0.0, 0.0, 0.0, 0.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    const vertexShaderSource = `
        attribute vec2 a_position;
        attribute vec2 a_texCoord;
        uniform vec2 u_resolution;
        varying vec2 v_texCoord;

        void main() {
            vec2 zeroToOne = a_position / u_resolution;
            vec2 zeroToTwo = zeroToOne * 2.0;
            vec2 clipSpace = zeroToTwo - 1.0;

            gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
            v_texCoord = a_texCoord;
        }
    `;

    const fragmentShaderSource = `
        precision mediump float;
        uniform sampler2D u_texture;
        varying vec2 v_texCoord;

        void main() {
            gl_FragColor = texture2D(u_texture, v_texCoord);
        }
    `;

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(
      gl,
      gl.FRAGMENT_SHADER,
      fragmentShaderSource,
    );
    const program = createProgram(gl, vertexShader, fragmentShader);

    const positionLocation = gl.getAttribLocation(program, "a_position");
    const texCoordLocation = gl.getAttribLocation(program, "a_texCoord");
    const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
    const textureLocation = gl.getUniformLocation(program, "u_texture");

    const positions = new Float32Array([
      0,
      0,
      finalWidth,
      0,
      0,
      finalHeight,
      0,
      finalHeight,
      finalWidth,
      0,
      finalWidth,
      finalHeight,
    ]);

    const texCoords = new Float32Array([0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1]);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const texCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, texCoords, gl.STATIC_DRAW);

    const texture = gl.createTexture();
    const img = new Image();
    img.crossOrigin = "anonymous";
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    img.src = imageUrl;

    await new Promise((resolve) => {
      img.onload = () => {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(
          gl.TEXTURE_2D,
          0,
          gl.RGBA,
          gl.RGBA,
          gl.UNSIGNED_BYTE,
          img,
        );

        if (
          (img.width & (img.width - 1)) === 0 &&
          (img.height & (img.height - 1)) === 0
        ) {
          gl.generateMipmap(gl.TEXTURE_2D);
        } else {
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        }

        gl.useProgram(program);
        gl.enableVertexAttribArray(positionLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

        gl.enableVertexAttribArray(texCoordLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
        gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);

        gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.uniform1i(textureLocation, 0);

        gl.uniform2f(resolutionLocation, finalWidth, finalHeight);

        if (activeTab === "tile") {
          for (let y = 0; y < finalHeight; y += tileSize) {
            for (let x = 0; x < finalWidth; x += tileSize) {
              gl.uniform2f(resolutionLocation, tileSize, tileSize);
              gl.drawArrays(gl.TRIANGLES, 0, 6);
            }
          }
        } else {
          const scaleFactor = adjustedZoomLevel / 100;
          const effectiveTileSize = Math.round(tileSize * scaleFactor);
          for (let y = 0; y < finalHeight; y += effectiveTileSize) {
            for (let x = 0; x < finalWidth; x += effectiveTileSize) {
              gl.drawArrays(gl.TRIANGLES, 0, 6);
            }
          }
        }

        // if (activeTab === "tile" || usePhysicalDimensions) {
        //   for (let y = 0; y < finalHeight; y += tileSize) {
        //     for (let x = 0; x < finalWidth; x += tileSize) {
        //       const xOffset = x / finalWidth;
        //       const yOffset = y / finalHeight;
        //       const xScale = tileSize / finalWidth;
        //       const yScale = tileSize / finalHeight;
        //
        //       // Adjust texture coordinates for this tile
        //       const tileTexCoords = new Float32Array([
        //         xOffset,
        //         yOffset, // Bottom-left
        //         xOffset + xScale,
        //         yOffset, // Bottom-right
        //         xOffset,
        //         yOffset + yScale, // Top-left
        //         xOffset,
        //         yOffset + yScale, // Top-left
        //         xOffset + xScale,
        //         yOffset, // Bottom-right
        //         xOffset + xScale,
        //         yOffset + yScale, // Top-right
        //       ]);
        //
        //       gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
        //       gl.bufferData(gl.ARRAY_BUFFER, tileTexCoords, gl.STATIC_DRAW);
        //
        //       gl.drawArrays(gl.TRIANGLES, 0, 6);
        //     }
        //   }
        // } else {
        //   const scaleFactor = adjustedZoomLevel / 100;
        //   const effectiveTileSize = Math.round(tileSize * scaleFactor);
        //
        //   // Ensure canvas resolution adjusts for the zoom level
        //   gl.uniform2f(
        //     resolutionLocation,
        //     finalWidth * scaleFactor,
        //     finalHeight * scaleFactor,
        //   );
        //
        //   for (let y = 0; y < finalHeight; y += effectiveTileSize) {
        //     for (let x = 0; x < finalWidth; x += effectiveTileSize) {
        //       const xOffset = (x / finalWidth) * scaleFactor;
        //       const yOffset = (y / finalHeight) * scaleFactor;
        //       const xScale = (effectiveTileSize / finalWidth) * scaleFactor;
        //       const yScale = (effectiveTileSize / finalHeight) * scaleFactor;
        //
        //       // Adjust texture coordinates to reflect zoom
        //       const tileTexCoords = new Float32Array([
        //         xOffset,
        //         yOffset, // Bottom-left
        //         xOffset + xScale,
        //         yOffset, // Bottom-right
        //         xOffset,
        //         yOffset + yScale, // Top-left
        //         xOffset,
        //         yOffset + yScale, // Top-left
        //         xOffset + xScale,
        //         yOffset, // Bottom-right
        //         xOffset + xScale,
        //         yOffset + yScale, // Top-right
        //       ]);
        //
        //       gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
        //       gl.bufferData(gl.ARRAY_BUFFER, tileTexCoords, gl.STATIC_DRAW);
        //
        //       gl.drawArrays(gl.TRIANGLES, 0, 6);
        //     }
        //   }
        // }

        resolve(null);
      };
    });

    try {
      const link = document.createElement("a");
      link.download = `repeated-pattern-${quality}.png`;
      link.href = canvas.toDataURL();
      link.click();

      setIsGenerating(false);
      setIsUpscalingImage(false);
      gl.deleteTexture(texture);
      gl.deleteBuffer(positionBuffer);
      gl.deleteBuffer(texCoordBuffer);
      gl.deleteProgram(program);
      canvas.width = 0;
      canvas.height = 0;
      setIsGenerating(false);
      setIsUpscalingImage(false);
      imageUrl = null;
    } finally {
      stopCountdown();
    }
  };
  //=================

  const handleDimensionToggle = (checked: boolean) => {
    setUsePhysicalDimensions(checked);
    setWidth(checked ? 12 : 2000);
    setHeight(checked ? 12 : 2000);
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
          min={30}
          max={400}
          step={1}
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
              className="flex items-start gap-x-2 h-9 px-4 py-2 rounded-2xl bg-[#8920ce] text-white shadow hover:bg-[#8920ce]/90"
              role="button"
            >
              <Download size={18} />
              <span>Download</span>
            </p>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-full max-w-md">
            <Tabs defaultValue="tile" className="w-full max-w-md">
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
                      <Download className="!w-5 !h-5" />{" "}
                      <span className="text-[0.9rem]">
                        Download Standard (1024 x 1024)
                      </span>
                    </Button>
                    <p className="text-gray-600 italic text-[0.9rem]">
                      Best for small images, web use, or low-resolution
                      applications.
                    </p>
                  </div>
                  <div className="flex flex-col gap-y-2">
                    <Button
                      size="lg"
                      disabled={!selectedPreviewImage || isGenerating}
                      onClick={() => generateImage("high")}
                      className="flex items-center justify-center gap-x-2 w-full !h-14"
                    >
                      <Timer className="!w-7 !h-7" />
                      {isGenerating ? (
                        <span className="text-[0.9rem]">
                          {isGenerating ? `${timeLeft}s left` : ""}
                        </span>
                      ) : (
                        <span className="text-[1rem] flex flex-col gap-y-0.5">
                          <span>Upscale and Download High Quality</span>
                          <span className="text-sm">
                            (4096 x 4096, ~60 seconds)
                          </span>
                        </span>
                      )}
                    </Button>
                    <p className="text-gray-600 italic text-[0.9rem]">
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
                    Zoom Level: {imagePreviewZoom}%
                  </Label>
                  <Slider
                    id="zoom-repeated"
                    min={30}
                    max={400}
                    step={1}
                    value={[imagePreviewZoom]}
                    onValueChange={(value) => setImagePreviewZoom(value[0])}
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
                    <Download className="!w-5 !h-5" />
                    <span className="text-sm">
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
                    <Timer className="!w-5 !h-5" />{" "}
                    {isGenerating ? (
                      <span className="text-[0.9rem]">
                        {isGenerating ? `${timeLeft}s left` : ""}
                      </span>
                    ) : (
                      <span className="text-sm">
                        Upscale and Download High Quality{" "}
                        {usePhysicalDimensions
                          ? `(${dpiHigh} DPI)`
                          : `(Zoom: ${imagePreviewZoom / 4}%)`}
                      </span>
                    )}
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
