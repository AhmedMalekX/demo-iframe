"use client";

import React, { useRef, useEffect, useContext, useMemo } from "react";
import * as fabric from "fabric";
import {
  AppState,
  AppStateContext,
} from "@/components/GeneratingImagesMethods/GenerateImageFromElements/createTabHooks";

import {
  BrickObjectPlacer,
  FullDropObjectPlacer,
  HalfDropObjectPlacer,
  ObjectPlacer,
} from "@/components/GeneratingImagesMethods/GenerateImageFromElements/createTabEngine/Logic";
import {
  Position,
  Size,
  offset,
} from "@/components/GeneratingImagesMethods/GenerateImageFromElements/createTabEngine/types";
import { getObjectForElement } from "@/components/GeneratingImagesMethods/GenerateImageFromElements/createTabEngine/Logic";

type RepeatCanvasProps = {
  canvasId?: string;
  canvasSize: Size;
  zoom: number;
  pan: {
    x: number;
    y: number;
  };
  previewZoom: number; // unsused
  parentZoom: number;
  onAfterRender?: (imageUrl: string) => void;
};

export const RepeatCanvas: React.FC<RepeatCanvasProps> = (props) => {
  // init fabric canvas
  const appStateOriginal = useContext(AppStateContext)!.appState;

  const appState = useMemo(() => {
    return appStateWithZoom(appStateOriginal, props.zoom, props.pan);
  }, [props.zoom, appStateOriginal, props.pan]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<fabric.StaticCanvas | null>(null);
  useEffect(() => {
    if (fabricRef.current) {
      fabricRef.current.width = props.canvasSize.width;
      fabricRef.current.height = props.canvasSize.height;
      canvasRef.current!.width = props.canvasSize.width;
      canvasRef.current!.height = props.canvasSize.height;
      fabricRef.current.renderAll();
      return;
    }
    if (canvasRef.current) {
      const canvas = new fabric.Canvas(canvasRef.current, {
        width: props.canvasSize.width,
        height: props.canvasSize.height,
        renderOnAddRemove: false,
        moveCursor: "auto",
        hoverCursor: "auto",
        defaultCursor: "auto",
        notAllowedCursor: "auto",
        freeDrawingCursor: "auto",
      });
      canvas.selection = false;
      fabricRef.current = canvas;
      canvas.renderAll();
    }
  }, [props.canvasSize]);

  useEffect(() => {
    const parent = canvasRef.current?.parentElement;
    if (parent) {
      parent.style.transform = `scale(${props.parentZoom})`;
      parent.style.transformOrigin = "top left";
    }
  }, [props.parentZoom]);

  useEffect(() => {
    const canvas = fabricRef.current;
    if (!canvas) {
      return;
    }
    canvas.clear();
    canvas.backgroundColor = appState.backgroundColor;
    canvas.setZoom(props.previewZoom);
    canvas.setDimensions({
      width: props.canvasSize.width * props.previewZoom,
      height: props.canvasSize.height * props.previewZoom,
    });

    const fixedCanvasSize = {
      width: props.canvasSize.width + appState.patternOffset.x * 2, // object rotation causes object placer to ignore elements on the right=> 1 should be for rotation and one for panning
      height: props.canvasSize.height + appState.patternOffset.y * 2,
    };
    const objectPlacer = getObjectPlacerWithAppState(appState, fixedCanvasSize);
    if (appState.debug) {
      const cellBounds = appState.patternOffset;
      const color = "rgba(0,0,0,0.5)";
      const topLeftPoints: Position = { left: 0, top: 0 };
      const allPositions = objectPlacer.getAllPositions(topLeftPoints);
      allPositions.forEach((position) => {
        drawCellBoundary(canvas, position, cellBounds, color);
      });
      // drawCellBoundary(canvas, topPointLeft, cellBounds, color);
    }
    appState.elements.forEach((element) => {
      const allPositions = objectPlacer
        .getAllPositions(element.position)
        // to take effect for panning
        .map(({ left, top }) => {
          return {
            left: left - appState.patternOffset.x,
            top: top - appState.patternOffset.y,
          };
        });

      allPositions.forEach((position) => {
        const object = getObjectForElement(element);
        object.set("selectable", false);
        object.set("left", position.left);
        object.set("top", position.top);
        canvas.add(object);
      });
    });
    canvas.renderAll();
    // Generate an image URL after rendering
    if (props.onAfterRender) {
      const imageUrl = fabricRef.current!.toDataURL({
        format: "png",
        quality: 1.0,
        multiplier: 1,
      });
      props.onAfterRender(imageUrl);
    }
  }, [appState, props, props.canvasSize]);

  return (
    <canvas
      style={{
        width: props.canvasSize.width,
        height: props.canvasSize.height,
        cursor: "none",
      }}
      id={props.canvasId}
      ref={canvasRef}
    />
  );
};

function drawCellBoundary(
  canvas: fabric.Canvas | fabric.StaticCanvas,
  position: Position,
  offset: offset,
  color: string,
) {
  if (!canvas) return;
  canvas.add(
    new fabric.Rect({
      left: position.left,
      top: position.top,
      width: offset.x,
      height: offset.y,
      fill: "transparent",
      stroke: color,
      selectable: false,
      strokeWidth: 1,
    }),
  );
}

function appStateWithZoom(
  appState: AppState,
  zoom: number,
  pan: {
    x: number;
    y: number;
  },
): AppState {
  if (zoom === 1 && pan.x === 0 && pan.y === 0) return appState;
  return {
    ...appState,
    elements: appState.elements.map((element) => {
      return {
        ...element,
        position: {
          left:
            element.position.left * zoom +
            appState.patternOffset.x * zoom * pan.x,
          top:
            element.position.top * zoom +
            appState.patternOffset.y * zoom * pan.y,
        },
        size: {
          width: element.size.width * zoom,
          height: element.size.height * zoom,
        },
        ...(element.type === "text"
          ? {
              properties: {
                ...element.properties,
                fontSize: element.properties.fontSize * zoom,
              },
            }
          : {}),
      };
    }),
    patternOffset: {
      x: appState.patternOffset.x * zoom,
      y: appState.patternOffset.y * zoom,
    },
  } as AppState;
}

export function getObjectPlacerWithAppState(
  appState: AppState,
  canvasSize: Size,
): ObjectPlacer {
  const offset = appState.patternOffset;
  switch (appState.placement) {
    case "full-drop":
      return new FullDropObjectPlacer(canvasSize, offset);
    case "half-drop":
      return new HalfDropObjectPlacer(canvasSize, offset);
    case "brick":
      return new BrickObjectPlacer(canvasSize, offset);
    default:
      return new FullDropObjectPlacer(canvasSize, offset);
  }
}
