"use client";
/*
 * React & Next.js components
 * */
import React, { useContext, useState } from "react";
import * as ReactDOM from "react-dom";

/*
 * Components
 * */
import { RepeatCanvas } from "@/components/GeneratingImagesMethods/GenerateImageFromElements/createTabEngine/components/components";

/*
 * Hooks
 * */
import { AppStateContext } from "@/components/GeneratingImagesMethods/GenerateImageFromElements/createTabHooks";

/*
 * Helpers
 * */
import { downloadCanvas } from "@/components/GeneratingImagesMethods/GenerateImageFromElements/createTabEngine/Logic";

/*
 * Types
 * */
import type { Size } from "@/components/GeneratingImagesMethods/GenerateImageFromElements/createTabEngine/types";

/*
 * Constants
 * */
import { TILABLE_CANVAS_CONSTANTS } from "@/components/GeneratingImagesMethods/GenerateImageFromElements/createTabData/constants";

export type MenuDownloadProps = {
  zoom: number;
  finalResoluton: Size;
};

export const MenuDownload: React.FC<MenuDownloadProps> = ({
  zoom,
  finalResoluton,
}) => {
  const context = useContext(AppStateContext)!;
  const { appState } = context;

  const [upScaledFactor, setUpScaledFactor] = useState(1);

  const [transparentBackground, setTransparentBackground] = useState(false);

  const [pan] = useState({
    x: 0,
    y: 0,
  });

  return (
    <div className="menu-section">
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <label className="zoom-slider-label" htmlFor="zoom-slider">
          UpScale
        </label>
        <input
          type="range"
          min="0.1"
          max="10"
          value={upScaledFactor}
          step=".1"
          className="slider"
          id="zoom-slider"
          onChange={(event) => {
            setUpScaledFactor(parseFloat(event.target.value));
          }}
        />
        <div style={{ width: 50 }}>{upScaledFactor.toFixed(1)}</div>
      </div>
      {/* Transparent Background tick*/}
      <div>
        <input
          type="checkbox"
          id="transparent-background"
          name="transparent-background"
          checked={transparentBackground}
          onChange={(event) => {
            setTransparentBackground(event.target.checked);
          }}
        />
        <label htmlFor="transparent-background">Transparent Background</label>
      </div>

      <button
        onClick={() => {
          const element = document.getElementById(
            "core-canvas",
          ) as HTMLCanvasElement | null;
          if (!element) return;
          const dimensionFromPatternOffset = {
            width: appState.patternOffset.x,
            height: appState.patternOffset.y,
          };
          downloadCanvas(element, "core.jpeg", dimensionFromPatternOffset, 1);
        }}
      >
        Download Core
      </button>
      <button
        onClick={() => {
          const container = document.createElement("div");
          document.body.appendChild(container);
          const target = document.createElement("div");
          container.appendChild(target);
          const finalResolutonNew = {
            width: finalResoluton.width * upScaledFactor,
            height: finalResoluton.height * upScaledFactor,
          };
          let isDownloaded = false;
          const element = (
            <AppStateContext.Provider
              value={{
                ...context,
                appState: {
                  ...appState,
                  backgroundColor: transparentBackground
                    ? "transparent"
                    : appState.backgroundColor,
                },
              }}
            >
              <RepeatCanvas
                previewZoom={1}
                pan={pan}
                zoom={zoom * upScaledFactor}
                canvasId="repeat-canvas-download"
                canvasSize={finalResolutonNew}
                parentZoom={1}
                onAfterRender={() => {
                  if (isDownloaded) return;
                  isDownloaded = true;
                  const element = document.getElementById(
                    "repeat-canvas-download",
                  ) as HTMLCanvasElement | null;
                  if (!element) return;
                  downloadCanvas(
                    element,
                    "repeat.png",
                    finalResolutonNew,
                    upScaledFactor,
                  );
                  (ReactDOM as any).unmountComponentAtNode(container);
                  document.body.removeChild(container);
                }}
              />
            </AppStateContext.Provider>
          );
          (ReactDOM as any).render(element, target);
        }}
      >
        Download Repeat
      </button>
      <button
        onClick={() => {
          const container = document.createElement("div");
          document.body.appendChild(container);
          const target = document.createElement("div");
          container.appendChild(target);
          const finalResolutonNew = {
            width: appState.patternOffset.x * 2 * upScaledFactor,
            height: appState.patternOffset.y * 2 * upScaledFactor,
          };
          let isDownloaded = false;
          const element = (
            <AppStateContext.Provider
              value={{
                ...context,
                appState: {
                  ...appState,
                  backgroundColor: transparentBackground
                    ? "transparent"
                    : appState.backgroundColor,
                },
              }}
            >
              <RepeatCanvas
                zoom={TILABLE_CANVAS_CONSTANTS.zoom * upScaledFactor}
                pan={TILABLE_CANVAS_CONSTANTS.pan}
                canvasSize={finalResolutonNew}
                canvasId="tilable-canvas-download"
                previewZoom={TILABLE_CANVAS_CONSTANTS.previewZoom}
                parentZoom={TILABLE_CANVAS_CONSTANTS.parentZoom}
                onAfterRender={() => {
                  if (isDownloaded) return;
                  isDownloaded = true;
                  const element = document.getElementById(
                    "tilable-canvas-download",
                  ) as HTMLCanvasElement | null;
                  if (!element) return;
                  downloadCanvas(
                    element,
                    "tilable.png",
                    finalResolutonNew,
                    upScaledFactor,
                  );
                  (ReactDOM as any).unmountComponentAtNode(container);
                  document.body.removeChild(container);
                }}
              />
            </AppStateContext.Provider>
          );
          (ReactDOM as any).render(element, target);
        }}
      >
        Download Tilable
      </button>
    </div>
  );
};
