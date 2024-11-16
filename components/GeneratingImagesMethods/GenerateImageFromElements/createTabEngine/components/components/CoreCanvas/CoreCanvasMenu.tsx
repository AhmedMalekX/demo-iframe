"use client";
import React, { useContext, useEffect, useState } from "react";
import * as fabric from "fabric";
import { useForceUpdate } from "@/components/GeneratingImagesMethods/GenerateImageFromElements/createTabHooks";
import { AppStateContext } from "@/components/GeneratingImagesMethods/GenerateImageFromElements/createTabHooks";
import { IoDuplicateOutline } from "react-icons/io5";
import { RxTransparencyGrid } from "react-icons/rx";
import { FiTrash2 } from "react-icons/fi";
import { BsThreeDots } from "react-icons/bs";
import { OpacitySlider } from "./OpacitySlider";
import { ActionMenu } from "./ActionMenu";
import { EditorElement } from "@/components/GeneratingImagesMethods/GenerateImageFromElements/createTabEngine/types";
import { AiMotifPromptCoreCanvas } from "./AiMotifPromptCoreCanvas";

type CoreCanvasMenuProps = {
  canvas: fabric.Canvas | null;
  positionX: "center";
  positionY: "top";
  offsetX: number;
  offsetY: number;
};

export const CoreCanvasMenu = (props: CoreCanvasMenuProps) => {
  const [visible, setVisible] = useState(false);
  const forceUpdate = useForceUpdate();
  const appContext = useContext(AppStateContext)!;
  const [isOpacityMenuVisible, setIsOpacityMenuVisible] = useState(false);
  const [isActionMenuVisible, setIsActionMenuVisible] = useState(false);
  const { dispatch } = appContext;
  // const [prompt, setText] = useState("");

  useEffect(() => {
    const canvas = props.canvas;
    if (!canvas) {
      return;
    }

    function hideActionMenu() {
      setIsActionMenuVisible(false);
    }

    canvas.on("selection:created", hideActionMenu);
    canvas.on("selection:updated", hideActionMenu);
    canvas.on("selection:cleared", hideActionMenu);

    canvas.on("selection:created", showDeleteButton);
    canvas.on("selection:created", forceUpdate);
    canvas.on("selection:updated", forceUpdate);
    canvas.on("selection:cleared", hideDeleteButton);

    function hideDeleteButton() {
      setVisible(false);
    }

    function showDeleteButton() {
      setVisible(true);
    }

    function checkStatusOnMouseDown() {
      if (!canvas?.getActiveObject()) {
        setVisible(false);
      } else {
        setVisible(true);
      }
    }

    canvas.on("mouse:down", checkStatusOnMouseDown);

    canvas.on("object:modified", showDeleteButton);
    canvas.on("object:scaling", hideDeleteButton);
    canvas.on("object:moving", hideDeleteButton);
    canvas.on("object:rotating", hideDeleteButton);

    return () => {
      canvas.off("selection:created", hideActionMenu);
      canvas.off("selection:updated", hideActionMenu);
      canvas.off("selection:cleared", hideActionMenu);

      canvas.off("selection:created", showDeleteButton);
      canvas.off("selection:created", forceUpdate);
      canvas.off("selection:updated", forceUpdate);
      canvas.off("selection:cleared", hideDeleteButton);

      canvas.off("mouse:down", checkStatusOnMouseDown);

      canvas.off("object:modified", showDeleteButton);
      canvas.off("object:scaling", hideDeleteButton);
      canvas.off("object:moving", hideDeleteButton);
      canvas.off("object:rotating", hideDeleteButton);
    };
  }, [props.canvas, visible, forceUpdate]);

  const activeObject = props.canvas?.getActiveObject();
  if (!visible || !activeObject) return null;
  const elementId = activeObject.get("elementId");
  const element = appContext.appState.elements.find(
    (element) => element.id === elementId,
  );
  const boundingRect = activeObject.getBoundingRect();
  const bottom = boundingRect.top + boundingRect.height;
  const position = {
    left: boundingRect.left + boundingRect.width / 2 + props.offsetX,
    top: boundingRect.top + props.offsetY,
  };
  if (bottom < 100) {
    position.top = boundingRect.top + boundingRect.height - props.offsetY;
  }

  forceMenuInCoreCanvas(position, appContext.appState.patternOffset, {
    top: 20,
    left: 60,
    right: 60,
    bottom: 0,
  });

  const topBarGenerator = (
    o: fabric.Object,
    element: EditorElement | undefined,
  ) => {
    if (element?.type === "ai-motif") {
      return null;
    }
    const id = o.get("elementId");
    if (!id) return null;
    return (
      <div
        style={{
          position: "relative",
        }}
      >
        <div
          style={{ pointerEvents: "auto", position: "absolute" }}
          className="core-canvas-menu-container core-floating-card"
        >
          <div
            className="core-canvas-menu-button"
            onClick={(e) => {
              dispatch({ type: "DUPLICATE_ELEMENT", id: o.get("elementId") });
              e.stopPropagation();
            }}
          >
            <IoDuplicateOutline size={18} />
          </div>
          <div
            className="core-canvas-menu-button"
            onClick={(e) => {
              setIsOpacityMenuVisible(!isOpacityMenuVisible);
              if (isActionMenuVisible) {
                setIsActionMenuVisible(false);
              }
              e.stopPropagation();
            }}
          >
            <RxTransparencyGrid size={18} />
          </div>
          <div
            className="core-canvas-menu-button"
            onClick={(e) => {
              dispatch({ type: "DELETE_ELEMENT", id: o.get("elementId") });
              e.stopPropagation();
            }}
          >
            <FiTrash2 size={18} />
          </div>
          <div
            className="core-canvas-menu-button"
            onClick={(e) => {
              setIsActionMenuVisible(!isActionMenuVisible);
              if (isOpacityMenuVisible) {
                setIsOpacityMenuVisible(false);
              }
              e.stopPropagation();
            }}
            style={{}}
          >
            <BsThreeDots size={18} />
          </div>
          {isOpacityMenuVisible ? (
            <div
              style={{
                position: "absolute",
                background: "white",
                transform: "translateY(40px)",
              }}
            >
              <OpacitySlider
                dismiss={() => {
                  setIsOpacityMenuVisible(false);
                }}
                opacity={o.opacity * 100}
                onUpdate={(opacity) => {
                  activeObject?.set("opacity", opacity / 100);
                  activeObject?.canvas?.requestRenderAll();
                }}
                onStart={() => {}}
                onEnd={(opacity) => {
                  dispatch({
                    type: "UPDATE_ELEMENT_PROPERTIES",
                    id,
                    properties: { opacity: opacity / 100 },
                    setSelection: true,
                  });
                }}
                // onChange={(opacity) => {
                //   dispatch({
                //     type: "UPDATE_ELEMENT_PROPERTIES",
                //     id,
                //     properties: { opacity: opacity / 100 },
                //     setSelection: true,
                //   });
                // }}
              />
            </div>
          ) : null}
        </div>
      </div>
    );
  };

  const bottomBarGenerator = (
    o: fabric.Object,
    element: EditorElement | undefined,
  ) => {
    if (!element) return null;
    if (element.type !== "ai-motif") return null;
    return <AiMotifPromptCoreCanvas key={element.id} element={element} />;
  };

  const actionMenu = (
    <ActionMenu
      visible={isActionMenuVisible}
      object={activeObject}
      dismiss={() => setIsActionMenuVisible(false)}
    />
  );
  const topBar = topBarGenerator(activeObject, element);
  const bottomBar = bottomBarGenerator(activeObject, element);

  return (
    <div
      className=""
      style={{
        position: "absolute",
        top: position.top,
        left: position.left,
        transform: `translate(-50%, -50%))`,
        pointerEvents: "none",
        display: visible ? "block" : "none",
      }}
    >
      {topBar}
      {actionMenu}
      {bottomBar}
    </div>
  );
};

function forceMenuInCoreCanvas(
  position: { top: number; left: number },
  canvasSize: { x: number; y: number },
  offesets: { top: number; left: number; right: number; bottom: number },
) {
  if (position.top < 0) {
    position.top = offesets.top;
  }
  if (position.top > canvasSize.y) {
    position.top = canvasSize.y - offesets.bottom;
  }
  if (position.left < 60) {
    position.left = offesets.left;
  }
  if (position.left > canvasSize.x - 60) {
    position.left = canvasSize.x - offesets.right;
  }
}

export async function AiGenerateRequest(prompt: string): Promise<string> {
  // placeholder image
  return new Promise((res, rej) => {
    setTimeout(() => {
      const seed = Math.floor(Math.random() * 1000);
      res(`https://picsum.photos/seed/${seed}/800`);
      // res('https://via.placeholder.com/150');
    }, 2000);
  });
}

const convertToImage = (
  url: string,
  callback: (img: HTMLImageElement) => void,
) => {
  if (typeof window === "undefined") return;

  const img = new window.Image();
  img.src = url;
  img.style.opacity = "0";
  img.crossOrigin = "anonymous";
  img.onload = () => {
    const aspectRatio = img.width / img.height;
    img.width = 100;
    img.height = 100 / aspectRatio;
    document.body.appendChild(img);
    callback(img);
  };
};

export async function convertToImageAsync(
  url: string,
): Promise<HTMLImageElement> {
  return new Promise((res, rej) => {
    convertToImage(url, (img) => {
      res(img);
    });
  });
}
