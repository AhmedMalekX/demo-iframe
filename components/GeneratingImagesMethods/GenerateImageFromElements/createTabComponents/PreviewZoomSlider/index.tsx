// zoom slider that become transparent when mouse is not over it
// and become visible when mouse is over it ,and it is used in PreviewZoom component
"use client";
import React from "react";

/*
 * Components
 * */
import { Slider } from "@/components/ui/slider";

export type PreviewZoomProps = {
  zoom: number;
  setZoom: (zoom: number) => void;
  className?: string;
};

export const PreviewZoomSlider = (props: PreviewZoomProps) => {
  return (
    <div className={props.className}>
      <span className="mr-2">Zoom</span>

      <Slider
        className="w-[250px]"
        min={0.25}
        max={10}
        step={0.001}
        defaultValue={[props.zoom]}
        onValueChange={(value) => {
          props.setZoom(+value[0]);
        }}
        name="keepStyle"
      />

      <div className="value-text">{(props.zoom * 10).toFixed(0)}%</div>
    </div>
  );
};
