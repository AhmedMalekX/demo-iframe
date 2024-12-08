"use client";

/*
 * NextJS & ReactJS components
 * */
import React from "react";

/*
 * Stores
 * */
import { useDashboardStore } from "@/store/dashboard.store";
import { useActiveGeneratingMethodStore } from "@/store/generatingImages.store";

/*
 * Global UI Components
 * */
import { GeneratedImagesResult } from "../GlobalUI/GeneratedImagesResult";

/*
 * UI Components
 * */
import { GeneratedImageControls } from "@/components/GeneratedImages/UI/GeneratedImageControls";
import { GeneratedImagePreview } from "@/components/GeneratedImages/UI/GeneratedImagePreview";
import { Mockups } from "@/components/GlobalUI/Mockups";

/*
 * Utils
 * */
import { cn } from "@/lib/utils";

export const GeneratedImages = () => {
  const { selectedPreviewImage } = useDashboardStore();
  const { activeGeneratingMethod } = useActiveGeneratingMethodStore();

  return (
    <div
      className={cn(
        "bg-white rounded-xl drop-shadow-sm border overflow-hidden",
        activeGeneratingMethod !== "From elements" ? "py-6" : "py-1",
      )}
    >
      {activeGeneratingMethod !== "From elements" && (
        <div className="px-4">
          <GeneratedImagesResult />
        </div>
      )}

      <div className="bg-appSecondaryBackground">
        {activeGeneratingMethod !== "From elements" && <hr className="mt-3" />}

        {/*Zoom & Download*/}
        <div className="px-4">
          <GeneratedImageControls />
        </div>

        {/*Image preview*/}
        <GeneratedImagePreview url={selectedPreviewImage} />

        {/*Mockups*/}
        <div className="px-4">
          <Mockups />
        </div>
      </div>
    </div>
  );
};
