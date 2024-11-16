// zoom slider that become transparent when mouse is not over it
// and become visible when mouse is over it
// and, it is used in PreviewZoom component
"use client";

/*
 * React & Next.js components
 * */
import React, { useState } from "react";

export type MenuPreviewZoomProps = {
  zoom: number;
  setZoom: (zoom: number) => void;
  className?: string;
};
export const MenuPreviewZoom = (props: MenuPreviewZoomProps) => {
  const [isMouseOver, setIsMouseOver] = useState(false);
  return (
    <div
      className={props.className}
      onMouseEnter={() => setIsMouseOver(true)}
      onMouseLeave={() => setIsMouseOver(false)}
      style={{ opacity: isMouseOver ? 1 : 0.2 }}
    >
      <input
        type="range"
        min="0.25"
        max="10"
        step="0.001"
        value={props.zoom}
        onChange={(event) => {
          props.setZoom(parseFloat(event.target.value));
        }}
      />
      <div className="value-text">{props.zoom}</div>
    </div>
  );
};
