"use client";
/*
 * React & Next.js components
 * */
import React, { useState } from "react";

/*
 * Types
 * */
import { Size } from "@/components/GeneratingImagesMethods/GenerateImageFromElements/createTabEngine/types";

/*
 * Constants
 * */
import { CONFIG } from "@/components/GeneratingImagesMethods/GenerateImageFromElements/createTabData/constants";

/*
 * Context
 * */
import { useAppStateContext } from "@/components/GeneratingImagesMethods/GenerateImageFromElements/createTabHooks/AppContextProvider";

type MenuProps = {
  zoom: number;
  setZoom: (zoom: number) => void;
  finalResoluton: Size;
  setFinalResoluton: (resolution: Size) => void;
  pan: { x: number; y: number };
  setPan: (pan: { x: number; y: number }) => void;
};

export const MenuVariables: React.FC<MenuProps> = (props) => {
  const { zoom, setZoom, finalResoluton, setFinalResoluton, pan, setPan } =
    props;

  return (
    <div>
      <div
        className="menu-section"
        style={{ display: "flex", flexDirection: "column" }}
      >
        {/* Slider from zero to one */}
        {/* <SliderForm
        label="Max Size of Object"
        valueKey="maxLimitOfObjectSize"
        maxValue={3}
        minValue={.1}
        step={.1}
      /> */}
        <div style={{ display: "flex", flexDirection: "row" }}>
          <label className="zoom-slider-label" htmlFor="zoom-slider">
            Zoom
          </label>
          <input
            type="range"
            min="0.2"
            max="4"
            value={zoom}
            step="0.1"
            className="slider"
            id="zoom-slider"
            onChange={(event) => {
              setZoom(parseFloat(event.target.value));
            }}
          />
          <div style={{ width: 50 }}>{zoom}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <label className="zoom-slider-label" htmlFor="zoom-slider">
            PanX
          </label>
          <input
            type="range"
            min="-0.5"
            max=".5"
            value={pan.x}
            step="0.01"
            className="slider"
            id="pan-slider"
            onChange={(event) => {
              setPan({
                ...pan,
                x: parseFloat(event.target.value),
              });
            }}
          />
          <div style={{ width: 50 }}>{pan.x}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <label className="zoom-slider-label" htmlFor="zoom-slider">
            PanY
          </label>
          <input
            type="range"
            min="-0.5"
            max="0.5"
            value={pan.y}
            step="0.01"
            className="slider"
            id="pan-slider"
            onChange={(event) => {
              setPan({
                ...pan,
                y: parseFloat(event.target.value),
              });
            }}
          />
          <div style={{ width: 50 }}>{pan.y}</div>
        </div>
      </div>
      <CoreResolutionInput />
      <ResolutionInput
        title="Repeat"
        finalResoluton={finalResoluton}
        setFinalResolution={setFinalResoluton}
      />
    </div>
  );
};

// use contexts from app. Dispatches appropriate actions to change state
const CoreResolutionInput: React.FC = () => {
  const {
    dispatch,
    appState: { patternOffset },
  } = useAppStateContext();
  const setCoreResolution = (resolution: Size) => {
    dispatch({
      type: "UPDATE_EDITOR_PROPERTIES",
      properties: {
        patternOffset: { x: resolution.width, y: resolution.height },
      },
    });
  };
  return (
    <ResolutionInput
      title="Core"
      finalResoluton={{ width: patternOffset.x, height: patternOffset.y }}
      setFinalResolution={setCoreResolution}
    />
  );
};

interface ResolutionInputProps {
  title: string;
  setFinalResolution: (resolution: { width: number; height: number }) => void;
  finalResoluton: Size;
}

const ResolutionInput: React.FC<ResolutionInputProps> = ({
  title,
  setFinalResolution,
  finalResoluton,
}) => {
  const [inputResolution, setInputResolution] = useState({
    width: finalResoluton.width.toString(),
    height: finalResoluton.height.toString(),
  });

  const newWidth = parseInt(inputResolution.width);
  const newHeight = parseInt(inputResolution.height);
  const isValidWidth = !isNaN(newWidth) && newWidth > 0;
  const isValidHeight = !isNaN(newHeight) && newHeight > 0;
  const isValidResolution = isValidWidth && isValidHeight;
  const isResolutionChanged =
    newWidth !== finalResoluton.width || newHeight !== finalResoluton.height;
  return (
    <div>
      <label htmlFor="resolution-width">{title} Resolution</label>
      <input
        type="number"
        id="resolution-width"
        value={inputResolution.width}
        onChange={(event) => {
          setInputResolution({
            ...inputResolution,
            width: event.target.value,
          });
        }}
      />
      <input
        type="number"
        id="resolution-height"
        value={inputResolution.height}
        onChange={(event) => {
          setInputResolution({
            ...inputResolution,
            height: event.target.value,
          });
        }}
      />
      <button
        disabled={!isValidResolution}
        className={`${
          isValidResolution && isResolutionChanged ? "selected" : ""
        } `}
        onClick={() => {
          if (!isValidResolution) return;
          const newResolution = {
            width: Math.min(
              Math.max(newWidth, CONFIG.MIN_REPEAT_CANVAS_RESOLUTION.width),
              CONFIG.MAX_REPEAT_CANVAS_RESOLUTION.width,
            ),
            height: Math.min(
              Math.max(newHeight, CONFIG.MIN_REPEAT_CANVAS_RESOLUTION.height),
              CONFIG.MAX_REPEAT_CANVAS_RESOLUTION.height,
            ),
          };
          setFinalResolution(newResolution);
          setInputResolution({
            width: newResolution.width.toString(),
            height: newResolution.height.toString(),
          });
        }}
      >
        Set
      </button>
    </div>
  );
};
