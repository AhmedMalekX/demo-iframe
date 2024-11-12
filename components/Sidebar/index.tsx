"use client";

/*
 * NextJS & ReactJS components
 * */
import React from "react";
import { GeneratingImagesMethodBar } from "../GeneratingImagesMethodBar";
import { useActiveGeneratingMethodStore } from "@/store/generatingImages.store";

/*
 * Generating images methods components
 * */
import { GenerateImageFromText } from "@/components/GeneratingImagesMethods/generateImageFromText";

export const Sidebar = () => {
  const { activeGeneratingMethod } = useActiveGeneratingMethodStore();

  return (
    <aside className="bg-white px-4 py-6 rounded-xl drop-shadow-sm">
      <GeneratingImagesMethodBar />

      <div className="mt-6">
        {activeGeneratingMethod === "From text" && <GenerateImageFromText />}
        {activeGeneratingMethod === "From image" && <div>From image</div>}
        {activeGeneratingMethod === "From elements" && <div>From elements</div>}
      </div>
    </aside>
  );
};
