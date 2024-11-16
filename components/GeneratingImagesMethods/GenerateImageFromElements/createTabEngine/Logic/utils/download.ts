import { Size } from "../../types";

export const downloadCanvas = (
  canvas: HTMLCanvasElement,
  filename: string,
  dimension: Size,
  upscaleFactor: number,
) => {
  // downloadCanvasBlob(
  //   canvas,
  //   `blob_(${upscaleFactor.toFixed(1)}x) ${filename}`,
  //   dimension,
  //   upscaleFactor,
  // );
  // downloadCanvasDataUrl(
  //   canvas,
  //   `dataurl_(${upscaleFactor.toFixed(1)}x) ${filename}`,
  //   dimension,
  //   upscaleFactor,
  // );

  downloadCanvasDataUrl(canvas, filename, dimension, upscaleFactor);
};

export const downloadCanvasDataUrl = (
  canvas: HTMLCanvasElement,
  filename: string,
  dimension: Size,
  upscaleFactor: number,
) => {
  const link = document.createElement("a");
  link.download = filename;
  link.href = resizeImage(canvas, dimension, upscaleFactor);
  link.click();
};

export const getCanvasDataUrl = (
  canvas: HTMLCanvasElement,
  filename: string,
  dimension: Size,
  upscaleFactor: number,
) => {
  return resizeImage(canvas, dimension, upscaleFactor);
};

export const resizeImage = (
  canvas: HTMLCanvasElement,
  dimension: Size,
  upScaleFactor: number,
) => {
  const c = document.createElement("canvas");
  c.width = dimension.width / upScaleFactor;
  c.height = dimension.height / upScaleFactor;
  const context = c.getContext("2d");
  if (!context) {
    throw new Error("Context is null");
  }
  context.drawImage(
    canvas,
    0,
    0,
    canvas.width,
    canvas.height,
    0,
    0,
    dimension.width / upScaleFactor,
    dimension.height / upScaleFactor,
  );
  return c.toDataURL("image/png", 1);
};

export const downloadCanvasBlob = (
  canvas: HTMLCanvasElement,
  filename: string,
  dimension: Size,
  upscaleFactor: number,
) => {
  // Create a temporary canvas to apply resizing and antialiasing
  const tempCanvas = document.createElement("canvas");
  const ctx = tempCanvas.getContext("2d");
  if (!ctx) {
    throw new Error("Context is null");
  }

  // Set dimensions for high resolution
  tempCanvas.width = dimension.width / upscaleFactor; // Increase for higher resolution
  tempCanvas.height = dimension.height / upscaleFactor; // Increase for higher resolution

  // Ensure the temporary canvas is scaled back down for display
  // antialiasing
  ctx.imageSmoothingEnabled = true;

  // Draw the original canvas onto the temporary one with resizing
  // ctx.scale(0.5, 0.5);
  ctx.drawImage(
    canvas,
    0,
    0,
    canvas.width,
    canvas.height,
    0,
    0,
    tempCanvas.width,
    tempCanvas.height,
  );

  // Use toBlob for efficient file creation
  tempCanvas.toBlob(
    function (blob) {
      if (blob) {
        // Create a link and trigger the download
        const link = document.createElement("a");
        link.download = filename;
        link.href = URL.createObjectURL(blob);
        link.click();

        // Cleanup the URL object
        URL.revokeObjectURL(link.href);
      }
    },
    "image/png",
    1,
  ); // You can adjust the format and quality (if applicable) here
};

// Note: This code assumes you want to double the resolution for antialiasing. Adjust as needed.
