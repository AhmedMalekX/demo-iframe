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

export const GeneratingImagesMethod = () => {
  const { activeGeneratingMethod, setActiveGeneratingMethod } =
    useActiveGeneratingMethodStore();

  return (
    <div className="flex gap-x-2">
      {GeneratingImagesMethods.map((method) => (
        <span
          key={method}
          className={cn(
            activeGeneratingMethod === method &&
              "border-b-4 border-appPrimaryActiveState transition-all duration-75 ease-in-out",
            activeGeneratingMethod !== method &&
              "hover:border-b-4 hover:border-appPrimaryActiveState/50 transition-all duration-75 ease-in-out",
            "text-md cursor-pointer font-medium",
          )}
          role="button"
          onClick={() => {
            setActiveGeneratingMethod(method);
          }}
          aria-label={`Switch to ${method} method`}
        >
          {method}
        </span>
      ))}
    </div>
  );
};
