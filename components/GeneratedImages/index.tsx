"use client";

/*
 * NextJS & ReactJS components
 * */
import React from "react";

/*
 * Stores
 * */
import { useDashboardStore } from "@/store/dashboard.store";

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

export const GeneratedImages = () => {
  const { selectedPreviewImage } = useDashboardStore();

  return (
    <div className="bg-white py-6 rounded-xl drop-shadow-sm border overflow-hidden">
      <div className="px-4">
        <GeneratedImagesResult />
      </div>

      <div className="bg-appSecondaryBackground">
        <hr className="mt-3" />

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
