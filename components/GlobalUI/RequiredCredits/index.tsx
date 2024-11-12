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
 * Icons
 * */
import { Star } from "lucide-react";

export const RequiredCredits = () => {
  const { generateFromTextNumberOfImages, generateFromImageNumberOfImages } =
    useDashboardStore();
  const { activeGeneratingMethod } = useActiveGeneratingMethodStore();

  return (
    <div className="w-full px-3">
      <p className="flex items-center gap-x-2">
        <Star fill="#8920ce" stroke="#8920ce" size={20} />
        <span className="text-lg font-medium">
          This generating will require{" "}
          {activeGeneratingMethod === "From text"
            ? generateFromTextNumberOfImages
            : generateFromImageNumberOfImages}{" "}
          credits
        </span>
      </p>
    </div>
  );
};
