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
  // Temp images
  const images = [
    {
      url: "https://dsm6fpp1ioao4.cloudfront.net/sim_88e57352-4bf4-4748-98ab-0d9fe1828a4d.png",
      alt: "A modern take on birds, this Scandinavian inspired simple bird wallpaper features cascading birds in blush blue.",
    },
    {
      url: "https://dsm6fpp1ioao4.cloudfront.net/sim_1d3016f5-bc19-4f60-a714-7d03c6ebb5ff.png",
      alt: "A modern take on florals, this Scandinavian inspired simple plant wallpaper features cascading leaves in blush pink, mustard and charcoal.",
    },
    {
      url: "https://res.cloudinary.com/patternedai/image/upload/v1671747897/ces9e6eo4bydepecjx7p.png",
      alt: "A pattern of pink roses on a white background, inspired by Annabel Kidston, tumblr, rococo, red and brown color scheme, had, greta thunberg.",
    },
    {
      url: "https://res.cloudinary.com/patternedai/image/upload/v1671747887/vqbsbdgulnr551pfhjoh.png",
      alt: "A pattern of cupcakes and donuts on a white background, a screenshot, naive art, kawaii cutest sticker ever.",
    },
  ];

  const { selectedPreviewImage } = useDashboardStore();

  return (
    <div className="bg-white py-6 rounded-xl drop-shadow-sm border overflow-hidden">
      <div className="px-4">
        <GeneratedImagesResult images={images} />
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
