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
 * Components
 * */
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

/*
 * Utils
 * */
import { cn } from "@/lib/utils";

/*
 * Constants
 * */
import { StylesNames } from "@/constants";

/*
 * Icons
 * */
import { Image as ImageIcon } from "lucide-react";

export const Styles = () => {
  const {
    generateFromTextStyleName,
    setGenerateFromTextStyleName,
    setOpenStylesModal,
  } = useDashboardStore();

  /*Handle displayed styles*/
  const [displayedStyles, setDisplayedStyles] = useState(
    StylesNames.slice(0, 5),
  );

  useEffect(() => {
    // Update displayed styles if the selected style is from outside the first 5
    if (
      !displayedStyles.find(
        (style) => style.styleName === generateFromTextStyleName,
      )
    ) {
      const updatedStyles = [...StylesNames];
      const selectedStyleIndex = updatedStyles.findIndex(
        (style) => style.styleName === generateFromTextStyleName,
      );
      if (selectedStyleIndex !== -1) {
        const [selectedStyle] = updatedStyles.splice(selectedStyleIndex, 1);
        updatedStyles.unshift(selectedStyle);
        setDisplayedStyles(updatedStyles.slice(0, 5));
      }
    }
  }, [generateFromTextStyleName]);

  const handleStyleClick = (style: {
    styleName: (typeof StylesNames)[number]["styleName"];
  }) => {
    if (displayedStyles[0].styleName !== style.styleName) {
      setGenerateFromTextStyleName(style.styleName);
      return;
    }
    setGenerateFromTextStyleName(style.styleName);
  };

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <Skeleton className="w-full h-[200px] mt-4" />;
  }

  return (
    <div className="mt-4">
      <div className="flex w-full items-center justify-between">
        <h3 className="font-medium text-md">Styles</h3>

        <Button
          variant="link"
          type="button"
          className="!p-0 underline"
          onClick={() => {
            setOpenStylesModal(true);
          }}
        >
          See all
        </Button>
      </div>

      {/*Styles*/}
      <div className="grid grid-cols-3 w-full gap-2 mt-2">
        <div
          className={cn(
            "rounded-md flex flex-col justify-center items-center overflow-hidden cursor-pointer group",
          )}
          onClick={() => {
            setGenerateFromTextStyleName(undefined);
          }}
        >
          <div className="grid grid-rows-[auto,auto,1fr] gap-1 w-full h-full">
            <div
              className={cn(
                "flex justify-center rounded-md items-center bg-gray-200 hover:border-2 hover:border-primary",
                !generateFromTextStyleName && "border-2 border-primary",
              )}
              style={{ height: "120px" }}
            >
              <ImageIcon stroke="#8920CE" fill="white" size={35} />
            </div>
            <span className="text-xs text-center mt-1 row-span-1 font-medium">
              None
            </span>
          </div>
        </div>

        {displayedStyles.map((style, index) => (
          <div
            key={index}
            className={cn(
              "rounded-md flex flex-col justify-center items-center cursor-pointer group",
            )}
            onClick={() => handleStyleClick(style)}
          >
            <div className="grid grid-rows-[auto,auto,1fr] gap-1 w-full h-full">
              <div
                className={cn(
                  "rounded-md w-full h-full overflow-hidden group-hover:scale-105 hover:border-2 hover:border-primary transition duration-300 row-span-2",
                  generateFromTextStyleName === style.styleName &&
                    "border-2 border-primary",
                )}
                style={{ height: "120px" }}
              >
                <Image
                  alt={style.styleName}
                  src={style.styleImage}
                  width={250}
                  height={250}
                  className="object-cover w-full h-full"
                />
              </div>
              <span className="text-sm text-center mt-1 row-span-1 font-medium">
                {style.styleName}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
