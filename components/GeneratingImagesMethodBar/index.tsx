"use client";

/*
 * NextJS & ReactJS components
 * */
import React from "react";

/*
 * Store
 * */
import { useActiveGeneratingMethodStore } from "@/store/generatingImages.store";

/*
 * Utils
 * */
import { cn } from "@/lib/utils";

/*
 * Constants
 * */
import { GeneratingImagesMethods } from "@/constants";

export const GeneratingImagesMethodBar = () => {
  const { activeGeneratingMethod, setActiveGeneratingMethod } =
    useActiveGeneratingMethodStore();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-1 w-full h-full">
      {GeneratingImagesMethods.map((method) => (
        <div
          key={method}
          className={cn(
            activeGeneratingMethod === method &&
              "border-b-4 border-appPrimaryActiveState transition-all duration-75 ease-in-out",
            activeGeneratingMethod !== method &&
              "hover:border-b-4 hover:border-appPrimaryActiveState/50 transition-all duration-75 ease-in-out",
            "px-1 text-md font-medium text-center w-full",
          )}
          role="button"
          onClick={() => {
            setActiveGeneratingMethod(method);
          }}
          aria-label={`Switch to ${method} method`}
        >
          <span className="w-full selection:bg-appPrimaryActiveState/50 selection:text-white">
            {method}
          </span>
        </div>
      ))}
    </div>
  );
};
