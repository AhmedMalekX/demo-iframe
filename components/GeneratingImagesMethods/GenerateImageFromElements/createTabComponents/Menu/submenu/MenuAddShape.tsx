"use client";
/*
 * React & Next.js components
 * */
import React, { useRef } from "react";

/*
 * Utils
 * */
import { convertImageToBase64 } from "@/components/GeneratingImagesMethods/GenerateImageFromElements/createTabEngine/Logic/utils/imageToDataUrl";

export interface MenuAddShapeProps {
  addRect: () => void;
  addText: (text: string) => void;
  addCircle: () => void;
  addImage: (img: HTMLImageElement, src: string) => void;
  addAiMotif: (img: HTMLImageElement, src: string) => void;
}

export const MenuAddShape: React.FC<MenuAddShapeProps> = ({
  addRect,
  addText,
  addCircle,
  addImage,
  addAiMotif,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    if (typeof window === "undefined") return;
    const src = URL.createObjectURL(event.target.files[0]);
    const img = new window.Image();
    img.src = src;
    img.style.opacity = "0";
    img.onload = () => {
      const aspectRatio = img.width / img.height;
      img.width = 100;
      img.height = 100 / aspectRatio;
      document.body.appendChild(img);
      const base64 = convertImageToBase64(img);
      addImage(img, base64);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    };
  };

  const addAiMotifClick = () => {
    if (typeof window === "undefined") return;
    const image = new window.Image();
    image.src = "./ai-motif-placeholder.svg";
    image.onload = () => {
      const base64 = convertImageToBase64(image);
      addAiMotif(image, base64);
    };
  };

  return (
    <div className="add-image-options menu-section">
      <button onClick={addRect}>Add Rectangle</button>
      <button onClick={() => addText("Hello")}>Add Text</button>
      <button onClick={addCircle}>Add Circle</button>
      <button onClick={addAiMotifClick}>Add AI Motif</button>
      <label htmlFor="file-upload" className="button-like">
        Add Image
      </label>
      <input
        ref={inputRef}
        id="file-upload"
        type="file"
        name="myImage"
        onChange={handleFileChange}
      />
    </div>
  );
};
