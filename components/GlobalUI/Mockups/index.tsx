/*
 * NextJS & ReactJS components
 * */
import React, { useEffect, useState } from "react";
import Image from "next/image";

/*
 * Stores
 * */
import { useDashboardStore } from "@/store/dashboard.store";

/*
 * UI Components
 * */
import { Skeleton } from "@/components/ui/skeleton";

/*
 * Constants
 * */
import { mockups } from "@/constants";

export const Mockups = () => {
  const { selectedPreviewImage, imagePreviewZoom, setSelectedMockup } =
    useDashboardStore();

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const defaultMockupsNumber = new Array(7).fill(0);

  if (!isMounted)
    return (
      <div className="flex items-center justify-start gap-x-2">
        {defaultMockupsNumber.map((_, index) => (
          <Skeleton key={index} className="w-[150px] h-[150px] rounded-md" />
        ))}
      </div>
    );

  return (
    <div className="mt-4">
      <h3 className="font-medium mb-3">See in mock ups</h3>
      <div className="flex items-center justify-center md:justify-start gap-x-2 gap-y-2 flex-wrap">
        {/*Selected image*/}
        {selectedPreviewImage && (
          <div
            className="border rounded-xl overflow-hidden cursor-pointer"
            onClick={() => {
              setSelectedMockup(null);
            }}
          >
            <div
              style={{
                objectFit: "cover",
                objectPosition: "center center",
                backgroundImage: `url("${selectedPreviewImage}")`,
                backgroundSize: `${imagePreviewZoom}%`,
              }}
              className="w-[115px] h-[115px]"
            />
          </div>
        )}

        {/*Mockups*/}
        {mockups.map((mockup, index) => (
          <div
            key={index}
            className="relative"
            onClick={() => {
              setSelectedMockup(mockup);
            }}
          >
            <div className="w-[115px] h-[115px] border rounded-xl overflow-hidden">
              <Image
                src={`/products/${mockup}.png`}
                alt={mockup}
                width={150}
                height={150}
                className="object-cover object-center rounded-xl cursor-pointer !w-full !h-full !z-50"
                style={{
                  backgroundImage: `url("${selectedPreviewImage}")`,
                  backgroundSize: `${imagePreviewZoom}%`,
                  objectFit: "cover",
                  objectPosition: "center center",
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
