"use client";

/*
 * NextJS & ReactJS components
 * */
import React from "react";

/*
 * Components
 * */
import { GeneratingImagesMethodBar } from "../GeneratingImagesMethodBar";

/*
 * Generating images methods components
 * */
import { GenerateImageFromText } from "../GeneratingImagesMethods/GenerateImageFromText";
import { GenerateImageFromImage } from "@/components/GeneratingImagesMethods/generateImageFromImage";
import { GenerateImageFromElements } from "@/components/GeneratingImagesMethods/GenerateImageFromElements";

/*
 * Stores
 * */
import { useActiveGeneratingMethodStore } from "@/store/generatingImages.store";

export const Sidebar = () => {
  const { activeGeneratingMethod } = useActiveGeneratingMethodStore();

  return (
    <aside className="bg-white px-4 pt-6 rounded-xl drop-shadow-sm border">
      <GeneratingImagesMethodBar />

      <div className="mt-6">
        {activeGeneratingMethod === "From text" && <GenerateImageFromText />}
        {activeGeneratingMethod === "From image" && <GenerateImageFromImage />}
        {activeGeneratingMethod === "From elements" && (
          <GenerateImageFromElements />
        )}
      </div>
    </aside>
  );
};
