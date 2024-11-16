"use client";

import React from "react";

export type RadioButtonComponentProps = {
  options: { id: string; label: string }[];
  selectedOptionId: string;
  onOptionChange: (id: string) => void;
};

export const RadioButtonComponent: React.FC<RadioButtonComponentProps> = ({
  options,
  selectedOptionId,
  onOptionChange,
}) => {
  return (
    <div className="placement-options menu-section">
      {options.map((option) => {
        return (
          <button
            className={` ${option.id === selectedOptionId ? "selected" : ""}`}
            key={option.id}
            onClick={() => {
              onOptionChange(option.id);
            }}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
};
