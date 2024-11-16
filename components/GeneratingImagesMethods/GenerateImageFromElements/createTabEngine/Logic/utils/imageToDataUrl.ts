export function convertImageToBase64(image: HTMLImageElement): string {
  const canvas = document.createElement("canvas");
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;
  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Context is null");
  }
  context.drawImage(image, 0, 0);
  return canvas.toDataURL();
}
