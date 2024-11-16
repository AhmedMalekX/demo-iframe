"use client";

import React, { useContext, useEffect } from "react";
import * as fabric from "fabric";
import { AppStateContext } from "@/components/GeneratingImagesMethods/GenerateImageFromElements/createTabHooks";
import { MdFlip } from "react-icons/md";
import { GoMoveToTop } from "react-icons/go";

export function ActionMenu(props: {
  visible: boolean;
  dismiss: () => void;
  object: fabric.Object | null;
}) {
  const { dispatch, ...context } = useContext(AppStateContext)!;

  // should dismiss on click outside
  // Strategy: Add click listener to window, check if click is inside the box
  // window.addEventListener('click', function (e) {
  //     if (document.getElementById('clickbox').contains(e.target)) {
  //         // Clicked in box
  //     } else {
  //         // Clicked outside the box
  //     }
  // });

  useEffect(() => {
    if (!props.visible) return;
    const dismiss = (e: MouseEvent) => {
      if (!e.target) return;
      if (!(e.target instanceof HTMLElement)) return;
      if (e.target.contains(e.target)) return;
      props.dismiss();
    };
    window.addEventListener("click", dismiss);
    return () => {
      window.removeEventListener("click", dismiss);
    };
  }, [props.visible, props.dismiss]);

  if (!props.visible) return null;
  return (
    <div
      className="core-canvas-action-menu-container core-floating-card"
      style={{ pointerEvents: "auto" }}
    >
      <div
        className="core-canvas-action-menu-button"
        onClick={(e) => {
          e.stopPropagation();
          if (!props.object) return;
          dispatch({
            type: "FLIP_SELECTED_ELEMENT",
            invertFlipX: true,
            invertFlipY: false,
          });
          props.dismiss();
        }}
      >
        <MdFlip size={18} />
        <div className="label">Flip Horizontally</div>
      </div>
      <div
        className="core-canvas-action-menu-button"
        onClick={(e) => {
          e.stopPropagation();
          if (!props.object) return;
          dispatch({
            type: "FLIP_SELECTED_ELEMENT",
            invertFlipX: false,
            invertFlipY: true,
          });
          props.dismiss();
        }}
      >
        <MdFlip
          size={18}
          style={{
            transform: "rotate(90deg)",
          }}
        />
        <div className="label">Flip Vertically</div>
      </div>

      <div
        data-disabled={!context.canSendForwards}
        className="core-canvas-action-menu-button"
        onClick={(e) => {
          e.stopPropagation();
          if (!props.object) return;
          dispatch({ type: "SEND_ELEMENT_FORWARDS" });
          props.dismiss();
        }}
      >
        <GoMoveToTop size={18} />
        <div className="label">Bring Forward</div>
      </div>
      <div
        data-disabled={!context.canSendBackwards}
        className="core-canvas-action-menu-button"
        onClick={(e) => {
          e.stopPropagation();
          if (!props.object) return;
          dispatch({ type: "SEND_ELEMENT_BACKWARDS" });
          props.dismiss();
        }}
      >
        <GoMoveToTop
          size={18}
          style={{
            transform: "rotate(180deg)",
          }}
        />
        <div className="label">Send Backward</div>
      </div>
    </div>
  );
}
