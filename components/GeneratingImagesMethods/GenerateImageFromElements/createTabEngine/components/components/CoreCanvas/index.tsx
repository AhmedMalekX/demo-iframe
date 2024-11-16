"use client";
import React, { useContext, useEffect, useRef, FC } from "react";
import * as fabric from "fabric";
import {
  generateFabricCanvasFromAppState,
  getObjectForElement,
  renderControlsOnHover,
  renderHeightAndWithRestriction,
  restrictMinimumScaling,
} from "@/components/GeneratingImagesMethods/GenerateImageFromElements/createTabEngine/Logic";
import {
  BrickObjectPlacer,
  FullDropObjectPlacer,
  HalfDropObjectPlacer,
} from "@/components/GeneratingImagesMethods/GenerateImageFromElements/createTabEngine/Logic";
import {
  AppState,
  AppStateContext,
} from "@/components/GeneratingImagesMethods/GenerateImageFromElements/createTabHooks";
import { EditorElement } from "@/components/GeneratingImagesMethods/GenerateImageFromElements/createTabEngine/types";
import {
  ObjectPlacer,
  SelectionManager,
  ModifiedObject,
  MouseMovementManager,
} from "@/components/GeneratingImagesMethods/GenerateImageFromElements/createTabEngine/Logic";
import { CONFIG } from "@/components/GeneratingImagesMethods/GenerateImageFromElements/createTabData/constants";
import { CoreCanvasMenu } from "./CoreCanvasMenu";

import "./core-canvas.css";

export const CoreCanvas = () => {
  const context = useContext(AppStateContext)!;
  const { appState } = context;
  const coreCanvasRef = useRef<HTMLCanvasElement>(null);
  const coreFabricRef = useRef<fabric.Canvas | null>(null);
  const { patternOffset } = appState;

  useEffect(() => {
    if (coreFabricRef.current) {
      if (
        coreFabricRef.current.width === patternOffset.x &&
        coreFabricRef.current.height === patternOffset.y
      )
        return;
      coreFabricRef.current.setDimensions({
        width: patternOffset.x,
        height: patternOffset.y,
      });

      return;
    }

    if (coreCanvasRef.current) {
      const canvas = new fabric.Canvas(coreCanvasRef.current, {
        width: patternOffset.x,
        height: patternOffset.y,
      });
      canvas.selection = false;
      canvas.backgroundColor = "green";
      canvas.perPixelTargetFind = true;
      canvas.preserveObjectStacking = true;
      coreFabricRef.current = canvas;
      canvas.renderAll();
    }
  }, [patternOffset]);

  useEffect(() => {
    const canvas = coreFabricRef.current;
    if (!canvas) return;
    fabric.cache.charWidthsCache = {};
    const bleedingElements: Record<string, fabric.Object[]> = {};
    generateFabricCanvasFromAppState(canvas, appState);

    appState.elements.forEach((element) => {
      if (!element.fabricObject) return;
      const bl = generateBleedingElements(
        appState,
        element,
        element.fabricObject,
      );
      bl.forEach((element) => {
        canvas.add(element);
      });
      bleedingElements[element.id] = bl;
    });

    canvas.forEachObject((object) => {
      renderControlsOnHover(object);
      restrictMinimumScaling(object, 0.01);
      renderHeightAndWithRestriction(
        object,
        appState.patternOffset.x * appState.maxLimitOfObjectSize,
        appState.patternOffset.y * appState.maxLimitOfObjectSize,
      );
    });

    sortCanvasElementsWithAppStateElementId(appState, canvas);
    const originalElements = appState.elements.reduce(
      (acc, element) => {
        if (!element.fabricObject) return acc;
        acc[element.id] = element.fabricObject;
        return acc;
      },
      {} as Record<string, fabric.Object>,
    );

    const mouseMovementManager = new MouseMovementManager(canvas);

    const selectionManager = new SelectionManager(
      {
        snapping: {
          enabled: CONFIG.SNAPPING_ENABLED,
          snappingDistance: CONFIG.SNAPPING_DISTANCE,
          guideLinesColor: CONFIG.SNAPPING_GUIDELINES_COLOR,
        },
      },
      appState.patternOffset,
      canvas,
      originalElements,
      bleedingElements,
      mouseMovementManager,
    );

    const modifiedObject = new ModifiedObject(
      canvas,
      (id, properties, setSelection) => {
        context.dispatch({
          type: "UPDATE_ELEMENT_PROPERTIES",
          id,
          properties,
          setSelection,
        });
      },
      (id, position) => {
        context.dispatch({
          type: "SELECT_ELEMENT",
          id: id,
          newPosition: position,
        });
      },
    );

    if (appState.selectedElementId) {
      selectionManager.selectElementId(appState.selectedElementId);
    }

    canvas.renderAll();
    mouseMovementManager.initEvents();
    selectionManager.initEvents();
    modifiedObject.initEvents();
    return () => {
      mouseMovementManager.disposeEvents();
      selectionManager.disposeEvents();
      modifiedObject.disposeEvents();
    };
  }, [appState]);

  return (
    <div
      tabIndex={0}
      style={{
        position: "relative",
      }}
      onKeyDown={(event) => {
        if (event.key === "Delete" || event.key === "Backspace") {
          const canvas = coreFabricRef.current;
          if (!canvas) return;
          const selection = canvas.getActiveObject();
          if (!selection) return;
          const id = selection.get("elementId");
          if (!id) return;
          context.dispatch({ type: "DELETE_ELEMENT", id });
        }
      }}
    >
      <canvas id="core-canvas" ref={coreCanvasRef}></canvas>
      <CoreCanvasMenu
        canvas={coreFabricRef.current}
        offsetX={0}
        offsetY={-64}
        positionX="center"
        positionY="top"
      />
    </div>
  );
};

function generateBleedingElements(
  appState: AppState,
  element: EditorElement,
  object: fabric.Object,
) {
  const { left, top } = object;
  return getObjectPlacerWithAppState(appState)
    .getAllPositions({
      left: left + appState.patternOffset.x,
      top: top + appState.patternOffset.y,
    })
    .map((position) => {
      return {
        left: position.left - appState.patternOffset.x,
        top: position.top - appState.patternOffset.y,
      };
    })
    .filter((position) => {
      return !(
        Math.abs(position.left - left) < 5 && Math.abs(position.top - top) < 5
      );
    })
    .map((position) => {
      const o = getObjectForElement(element);
      o.set("elementId", element.id);
      o.set("isBleedingElement", true);
      o.set({
        left: position.left,
        top: position.top,
      });
      if (appState.debug) o.fill = "rgba(0,0,0,0.5)";
      return o;
    });
}

function sortCanvasElementsWithAppStateElementId(
  appState: AppState,
  canvas: fabric.Canvas,
) {
  const elements = appState.elements;
  const idToOrder = elements.reduce(
    (acc, element, index) => {
      acc[element.id] = index;
      return acc;
    },
    {} as Record<string, number>,
  );

  const fabricObjects = canvas.getObjects();
  canvas.remove(...fabricObjects);
  fabricObjects.sort((a, b) => {
    const aId = a.get("elementId");
    const bId = b.get("elementId");
    if (aId && bId) {
      return idToOrder[aId] - idToOrder[bId];
    }
    return 0;
  });
  canvas.add(...fabricObjects);
}

function getObjectPlacerWithAppState(appState: AppState): ObjectPlacer {
  const offset = {
    x: appState.patternOffset.x,
    y: appState.patternOffset.y,
  };
  const canvasSize = {
    width: appState.patternOffset.x * 3,
    height: appState.patternOffset.y * 3,
  };
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
