"use client";

import React from "react";

export type ColorComponentProps = {
  color: string;
  onColorChange: (color: string) => void;
  label: string;
};

export const ColorComponent: React.FC<ColorComponentProps> = ({
  color,
  onColorChange,
  label,
}) => {
  return (
    <div className="menu-color">
      <input
        type="color"
        value={color}
        onChange={(e) => {
          onColorChange(e.target.value);
        }}
      />
      <label style={{ padding: 4 }}>{label}</label>
    </div>
  );
};
