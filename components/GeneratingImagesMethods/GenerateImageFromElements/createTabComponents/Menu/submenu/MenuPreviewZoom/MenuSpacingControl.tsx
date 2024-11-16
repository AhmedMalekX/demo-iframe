/*
 * React & Next.js components
 * */
import React, { useContext, useEffect, useRef, useState, useMemo } from "react";

/*
 * Context
 * */
import { AppStateContext } from "@/components/GeneratingImagesMethods/GenerateImageFromElements/createTabHooks";

/*
 * Types
 * */
import {
  Position,
  Size,
} from "@/components/GeneratingImagesMethods/GenerateImageFromElements/createTabEngine/types";

/*
 * Libs
 * */
import * as fabric from "fabric";
import { Slider } from "@/components/ui/slider";

export const MenuSpacingControl = () => {
  const { dispatch, appState } = useContext(AppStateContext)!;

  const [spacingValue, setSpacingValue] = useState(1);
  const lastValueRef = useRef(spacingValue);

  const maxPossibleSpacing = useMemo(() => {
    const maxWidth = Math.max(
      ...appState.elements.map((element) => element.size.width),
    );
    const maxHeight = Math.max(
      ...appState.elements.map((element) => element.size.height),
    );
    const patternOffset = appState.patternOffset;
    const maxSpacing = Math.min(
      (patternOffset.x / maxWidth) * appState.spacing,
      (patternOffset.y / maxHeight) * appState.spacing,
    );
    return maxSpacing;
  }, [appState.elements, appState.patternOffset, appState.spacing]);

  useEffect(() => {
    setSpacingValue(appState.spacing);
    lastValueRef.current = appState.spacing;
    slideStartValueRef.current = null;
  }, [appState.spacing]);

  const slideStartValueRef = useRef<number | null>(null);
  const objectListRef = useRef<fabric.Object[]>([]);
  const objectSizePositionScaleSnapshotsRef = useRef<
    { size: Size; position: Position; scaleX: number; scaleY: number }[]
  >([]);

  const handleDown = () => {
    slideStartValueRef.current = spacingValue;
    const canvas = appState.elements[0]?.fabricObject?.canvas;
    objectListRef.current = canvas?.getObjects() || [];

    objectSizePositionScaleSnapshotsRef.current = objectListRef.current.map(
      (object) => {
        return {
          size: { width: object.width!, height: object.height! },
          position: { top: object.top!, left: object.left! },
          scaleX: object.scaleX,
          scaleY: object.scaleY,
        };
      },
    );

    objectListRef.current.forEach((object) => {
      const newTopLeft = object.getPointByOrigin("center", "center");
      object.set({
        left: newTopLeft.x,
        top: newTopLeft.y,
        originX: "center",
        originY: "center",
      });
    });
  };
  const handleUp = () => {
    if (slideStartValueRef.current === null) return;
    objectListRef.current.forEach((object) => {
      const newTopLeft = object.getPointByOrigin("left", "top");
      object.set({
        left: newTopLeft.x,
        top: newTopLeft.y,
      });

      object.setCoords();
    });
    dispatch({
      type: "CHANGE_SPACING",
      sizePosition: objectListRef.current
        .filter((object) => (object as any).isBleedingElement !== true)
        .map((object) => {
          return {
            size: {
              width: object.width! * object.scaleX!,
              height: object.height * object.scaleY!,
            },
            position: { top: object.top!, left: object.left! },
          };
        }),
      spacing: spacingValue,
    });
  };
  const handleChange = (value: number[]) => {
    let newValue = +value[0].toFixed(2);
    newValue = Math.min(+maxPossibleSpacing.toFixed(2), newValue);
    setSpacingValue(newValue);

    const newFactor = newValue / lastValueRef.current;

    lastValueRef.current = newValue;
    objectListRef.current.forEach((object) => {
      object.set({
        originX: "center",
        originY: "center",
        scaleX: object.scaleX * newFactor,
        scaleY: object.scaleY * newFactor,
      });
    });
    if (objectListRef.current.length > 0) {
      const canvas = objectListRef.current[0].canvas;
      canvas?.renderAll();
    }
  };

  return (
    <div className="flex w-full items-center justify-between">
      <h5>Spacing</h5>

      <div className="flex items-center flex-[0.8]">
        <Slider
          min={0.25}
          max={4}
          step={0.01}
          value={[spacingValue]}
          onValueChange={handleChange}
          onPointerDown={handleDown}
          onPointerUp={handleUp}
          onTouchStart={handleDown}
          onTouchEnd={handleUp}
          disabled={!appState.elements.length}
          className="data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed"
        />
        {/*<input*/}
        {/*  type="range"*/}
        {/*  min=".25"*/}
        {/*  max="4"*/}
        {/*  step="0.01"*/}
        {/*  value={spacingValue}*/}
        {/*  onMouseDown={handleDown}*/}
        {/*  onMouseUp={handleUp}*/}
        {/*  onChange={handleChange}*/}
        {/*  onTouchStart={handleDown}*/}
        {/*  onTouchEnd={handleUp}*/}
        {/*/>*/}
        {/*<span>x{spacingValue}</span>*/}
      </div>
    </div>
  );
};
