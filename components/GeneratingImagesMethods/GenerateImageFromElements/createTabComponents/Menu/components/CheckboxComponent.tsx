"use client";

import React from "react";

export type CheckboxComponentProps = {
  checked: boolean;
  onToggle: (checked: boolean) => void;
  label: string;
};

export const CheckboxComponent: React.FC<CheckboxComponentProps> = ({
  checked,
  onToggle,
  label,
}) => {
  return (
    <div className="menu-toggle">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => {
          onToggle(e.target.checked);
        }}
      />
      <label style={{ padding: 4 }}>{label}</label>
    </div>
  );
};
