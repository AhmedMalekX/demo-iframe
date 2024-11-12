/*
 * NextJS & ReactJS components
 * */
import React, { useEffect, useState } from "react";

/*
 * Stores
 * */
import { useDashboardStore } from "@/store/dashboard.store";
import { Skeleton } from "@/components/ui/skeleton";

interface IGeneratedImagePreview {
  url: string | null;
}

export const GeneratedImagePreview = ({ url }: IGeneratedImagePreview) => {
  const { imagePreviewZoom } = useDashboardStore();

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="flex w-full items-center justify-center h-[500px]">
        <Skeleton className="w-full h-[500px]" />
      </div>
    );
  }

  if (!url)
    return (
      <div className="flex w-full items-center justify-center h-[500px]">
        <h3 className="text-2xl font-semibold text-gray-500 text-center select-none">
          Image preview
        </h3>
      </div>
    );

  return (
    <div className="px-4">
      <div
        className="rounded-2xl transition-all duration-75 ease-linear"
        style={{
          backgroundImage: `url(${url})`,
          height: "500px",
          width: "100%",
          backgroundSize: `${imagePreviewZoom}%`,
          objectPosition: "center center",
        }}
      />
    </div>
  );
};
