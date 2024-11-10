"use client";

/*
 * NextJS & ReactJS components
 * */
import React from "react";
import { GeneratingImagesMethod } from "@/components/GeneratingImagesMethod";
import { useActiveGeneratingMethodStore } from "@/store/generatingImages.store";

export const Sidebar = () => {
  const { activeGeneratingMethod } = useActiveGeneratingMethodStore();

  return (
    <aside className="bg-white px-4 py-6 rounded-xl drop-shadow-sm">
      <GeneratingImagesMethod />

      <div className="mt-6">
        {activeGeneratingMethod === "From text" && <div>From text</div>}
        {activeGeneratingMethod === "From image" && <div>From image</div>}
        {activeGeneratingMethod === "From elements" && <div>From elements</div>}
      </div>
    </aside>
  );
};
