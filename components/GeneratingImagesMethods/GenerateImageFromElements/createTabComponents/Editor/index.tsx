"use client";
/*
 * React & Next.js components
 * */
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
// import * as ReactDOM from "react-dom";
// import { useRouter } from "next/navigation";

/*
 * Components
 * */
import {
  CoreCanvas,
  RepeatCanvas,
} from "@/components/GeneratingImagesMethods/GenerateImageFromElements/createTabEngine/components/components";
import { MenuElementProperty } from "@/components/GeneratingImagesMethods/GenerateImageFromElements/createTabComponents/Menu/submenu";
import { useUndoRedoKeyboardShortcuts } from "@/components/GeneratingImagesMethods/GenerateImageFromElements/createTabComponents/Menu/hooks";
import { MenuSpacingControl } from "@/components/GeneratingImagesMethods/GenerateImageFromElements/createTabComponents/Menu/submenu/MenuPreviewZoom/MenuSpacingControl";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

/*
 * Constants
 * */

import { TILABLE_CANVAS_CONSTANTS } from "@/components/GeneratingImagesMethods/GenerateImageFromElements/createTabData/constants";

/*
 * Hooks
 * */
import { useAppStateContext } from "@/components/GeneratingImagesMethods/GenerateImageFromElements/createTabHooks/AppContextProvider";
import { AppStateContext } from "@/components/GeneratingImagesMethods/GenerateImageFromElements/createTabHooks";

/*
 * Utils
 * */
import { convertImageToBase64 } from "@/components/GeneratingImagesMethods/GenerateImageFromElements/createTabEngine/Logic/utils/imageToDataUrl";

/*
 * Libs
 * */
import * as fabric from "fabric";
import { SketchPicker } from "react-color";
import { useWindowSize } from "usehooks-ts";

/*
 * Stores
 * */
// import { useDashboardStore } from "@/store/dashboard.store";
import { useCreateTabStore } from "@/store/createTab.store";

/*
 * Helps
 * */
// import {
//   downloadCanvas,
//   getCanvasDataUrl,
// } from "@/components/GeneratingImagesMethods/GenerateImageFromElements/createTabEngine/Logic";

/*
 * Icons
 * */
import { cn } from "@/lib/utils";

const TypedSketchPicker =
  SketchPicker as unknown as React.JSXElementConstructor<any>;

export const Editor: React.FC = () => {
  // const router = useRouter();

  const {
    zoom,
    setZoom,
    previewZoom,
    finalResoluton,
    setFinalResoluton,
    pan,
    setPan,
    // upScaleFactor,
    // setUpScaleFactor,
  } = useCreateTabStore();

  const [autoEditText, setAutoEditText] = useState<number>(0);
  const lastAutoEditTextRun = useRef<number>(0);

  // const { setGenerationMethod } = useDashboardStore();

  const size = useWindowSize();

  useEffect(() => {
    if (size.width && size.height) {
      const lScreen = 1024;
      const xlScreen = 1440;
      const xxlScreen = 2560;
      const mobileScreen = 768;

      const deductedWidth =
        size.width >= (lScreen || xlScreen || xxlScreen)
          ? 26.4
          : size.width < mobileScreen
            ? 1
            : 43.2;

      const deductedHeight =
        size.width >= (lScreen || xlScreen || xxlScreen)
          ? 20
          : size.width < mobileScreen
            ? 20
            : 10;

      const percentOfAvailableWidth = (size.width * deductedWidth) / 100;
      const percentOfAvailableHeight = (size.height * deductedHeight) / 100;

      const finalWidth = size.width - percentOfAvailableWidth;
      const finalHeight = size.height - percentOfAvailableHeight;

      setFinalResoluton({
        height: finalHeight,
        width: finalWidth,
      });
    }
  }, [size.width, size.height]);

  const [showInputColorComponent, setShowInputColorComponent] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { appState, canUndo, dispatch, canRedo } = useAppStateContext();
  const context = useContext(AppStateContext)!;

  // const [isDownloadingCanvas, setIsDownloadingCanvas] = useState(false);

  const repeatCanvasMemo = useMemo(() => {
    return (
      <RepeatCanvas
        previewZoom={1}
        pan={pan}
        zoom={zoom}
        canvasId="repeat-canvas"
        canvasSize={finalResoluton}
        parentZoom={previewZoom}
      />
    );
  }, [zoom, finalResoluton, previewZoom, pan]);

  // const tilableCanvasDimensions = { width: 1024, height: 1024 };

  const tilableCanvas = useMemo(() => {
    return (
      <RepeatCanvas
        zoom={TILABLE_CANVAS_CONSTANTS.zoom}
        pan={TILABLE_CANVAS_CONSTANTS.pan}
        canvasSize={{
          width: appState.patternOffset.x * 2,
          height: appState.patternOffset.y * 2,
        }}
        canvasId="tilable-canvas"
        previewZoom={TILABLE_CANVAS_CONSTANTS.previewZoom}
        parentZoom={TILABLE_CANVAS_CONSTANTS.parentZoom}
      />
    );
  }, [appState.patternOffset]);

  {
    /*TODO: UNCOMMENT TO ADD TRANSPARENT BACKGROUND OPTION STATE*/
  }
  // const [transparentBackground, setTransparentBackground] = useState(false);

  // const handleDownloadRepeat = () => {
  //   setIsDownloadingCanvas(true);
  //   const container = document.createElement("div");
  //   document.body.appendChild(container);
  //   const target = document.createElement("div");
  //   container.appendChild(target);
  //
  //   const finalResolutonNew = {
  //     width: finalResoluton.width * upScaleFactor,
  //     height: finalResoluton.height * upScaleFactor,
  //   };
  //
  //   let isDownloaded = false;
  //   const element = (
  //     <AppStateContext.Provider
  //       value={{
  //         ...context,
  //         appState: {
  //           ...appState,
  //
  //           /*TODO: UNCOMMENT TO ADD TRANSPARENT BACKGROUND OPTION STATE*/
  //
  //           // backgroundColor: transparentBackground
  //           //   ? "transparent"
  //           //   : appState.backgroundColor,
  //
  //           backgroundColor: appState.backgroundColor,
  //         },
  //       }}
  //     >
  //       <RepeatCanvas
  //         previewZoom={1}
  //         pan={pan}
  //         zoom={zoom * upScaleFactor}
  //         canvasId="repeat-canvas-download"
  //         canvasSize={finalResolutonNew}
  //         parentZoom={1}
  //         onAfterRender={() => {
  //           if (isDownloaded) return;
  //           isDownloaded = true;
  //           const element = document.getElementById(
  //             "repeat-canvas-download",
  //           ) as HTMLCanvasElement | null;
  //           if (!element) return;
  //           downloadCanvas(
  //             element,
  //             "PatternedAI_repeat_image.png",
  //             finalResolutonNew,
  //             upScaleFactor,
  //           );
  //
  //           ReactDOM.unmountComponentAtNode(container);
  //           document.body.removeChild(container);
  //         }}
  //       />
  //     </AppStateContext.Provider>
  //   );
  //   ReactDOM.render(element, target);
  //   setIsDownloadingCanvas(false);
  // };

  // const handleDownloadTilableImage = () => {
  //   setIsDownloadingCanvas(true);
  //   const element = document.getElementById(
  //     "tilable-canvas",
  //   ) as HTMLCanvasElement | null;
  //
  //   if (!element) return;
  //
  //   const dimension = {
  //     width: tilableCanvasDimensions.width,
  //     height: tilableCanvasDimensions.height,
  //   };
  //
  //   const imageDataUrl = getCanvasDataUrl(
  //     element,
  //     "tilable.png",
  //     dimension,
  //     upScaleFactor,
  //   );
  //
  //   // Create a temporary link element
  //   const downloadLink = document.createElement("a");
  //   downloadLink.href = imageDataUrl;
  //   downloadLink.download = "PatternedAI_tile.png";
  //
  //   document.body.appendChild(downloadLink);
  //   downloadLink.click();
  //   document.body.removeChild(downloadLink);
  //
  //   setIsDownloadingCanvas(false);
  // };

  // const handleEnhanceWithAI = () => {
  //   const element = document.getElementById(
  //     "tilable-canvas",
  //   ) as HTMLCanvasElement | null;
  //
  //   if (!element) return;
  //
  //   const dimension = {
  //     width: tilableCanvasDimensions.width,
  //     height: tilableCanvasDimensions.height,
  //   };
  //
  //   const imageDataUrl = getCanvasDataUrl(
  //     element,
  //     "tilable.png",
  //     dimension,
  //     upScaleFactor,
  //   );
  //
  //   localStorage.setItem(
  //     "variationImageUrl",
  //     JSON.stringify({ imageData: imageDataUrl }),
  //   );
  //
  //   setGenerationMethod("Variation");
  //
  //   router.push("dashboard?method=variation&imgUrl=create");
  // };

  useEffect(() => {
    if (!context.canRedo) {
      context.dispatch({
        type: "REORDER_ELEMENTS",
        elements: appState.elements,
        selectedElement: appState.selectedElementId!,
      });
    }
  }, [appState.elements]);

  useEffect(() => {
    if (autoEditText === 0) return;
    if (autoEditText === lastAutoEditTextRun.current) return;
    if (autoEditText > lastAutoEditTextRun.current) {
      lastAutoEditTextRun.current = autoEditText;
      const lastElement =
        context.appState.elements[context.appState.elements.length - 1];
      const object = lastElement?.fabricObject;
      const selectedElementId = context.appState.selectedElementId;
      if (
        lastElement &&
        selectedElementId &&
        selectedElementId === lastElement.id &&
        lastElement?.type === "text" &&
        object &&
        object instanceof fabric.Textbox
      ) {
        object.enterEditing();
        object.selectAll();
      }
    }
  }, [
    context.appState.elements,
    context.appState.selectedElementId,
    autoEditText,
  ]);

  useUndoRedoKeyboardShortcuts();

  return (
    <div
      className="editor place-items-center w-full space-y-4"
      style={{
        gridTemplateColumns: `max(100%, calc(${appState.patternOffset.x}px + 100px)) 1fr`,
      }}
    >
      <div
        className="w-full flex items-center justify-between"
        style={{
          gridArea: "core",
          maxWidth: `300px`,
        }}
      >
        <div>
          <button
            className="bg-[#f2f3f5] px-3.5 py-2 rounded-md disabled:cursor-not-allowed"
            onClick={async () => {
              dispatch({
                type: "SET",
                newState: {
                  patternOffset: {
                    x: 300,
                    y: 300,
                  },
                  spacing: 1,
                  elements: [],
                  debug: false,
                  backgroundColor: "#fff",
                  maxLimitOfObjectSize: 1,
                  placement: "full-drop",
                  selectedElementId: null,
                },
              });
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="20"
              viewBox="0 -960 960 960"
              width="20"
            >
              <path d="M440-122q-121-15-200.5-105.5T160-440q0-66 26-126.5T260-672l57 57q-38 34-57.5 79T240-440q0 88 56 155.5T440-202v80Zm80 0v-80q87-16 143.5-83T720-440q0-100-70-170t-170-70h-3l44 44-56 56-140-140 140-140 56 56-44 44h3q134 0 227 93t93 227q0 121-79.5 211.5T520-122Z" />
            </svg>
          </button>
        </div>
        <div className="space-x-2">
          <button
            onClick={() => {
              dispatch({ type: "UNDO" });
            }}
            disabled={!canUndo}
            title="ctrl+z or cmd+z"
            className="bg-[#f2f3f5] px-3.5 py-2 rounded-md disabled:cursor-not-allowed"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="20"
              viewBox="0 -960 960 960"
              width="20"
              fill="black"
            >
              <path d="M280-200v-80h284q63 0 109.5-40T720-420q0-60-46.5-100T564-560H312l104 104-56 56-200-200 200-200 56 56-104 104h252q97 0 166.5 63T800-420q0 94-69.5 157T564-200H280Z" />
            </svg>
          </button>

          <button
            onClick={() => {
              dispatch({ type: "REDO" });
            }}
            disabled={!canRedo}
            title="ctrl+shift+z or cmd+shift+z"
            className="bg-[#f2f3f5] px-3.5 py-2 rounded-md disabled:cursor-not-allowed"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="20"
              viewBox="0 -960 960 960"
              width="20"
              fill="black"
            >
              <path d="M396-200q-97 0-166.5-63T160-420q0-94 69.5-157T396-640h252L544-744l56-56 200 200-200 200-56-56 104-104H396q-63 0-109.5 40T240-420q0 60 46.5 100T396-280h284v80H396Z" />
            </svg>
          </button>
        </div>
      </div>

      <div
        id="core-canvas-container"
        style={{ width: "100%", height: "300px" }}
        className="flex items-center justify-center"
      >
        {appState.elements.length > 0 ? (
          <div
            style={{
              border: "2px dashed rgba(43, 59, 74, 0.3)",
            }}
          >
            <CoreCanvas />
          </div>
        ) : (
          <div
            className="flex flex-col justify-center items-center w-full h-full cursor-pointer"
            style={{
              border: "2px dashed rgba(43, 59, 74, 0.3)",
              maxWidth: `300px`,
            }}
            onClick={(event) => {
              event.stopPropagation();
              inputRef.current?.click();
            }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              width="96"
              height="96"
              strokeWidth={0.5}
              stroke="black"
              style={{ marginRight: "0.3rem" }}
            >
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                <path
                  d="M12 19V12M12 12L9.75 14.3333M12 12L14.25 14.3333M6.6 17.8333C4.61178 17.8333 3 16.1917 3 14.1667C3 12.498 4.09438 11.0897 5.59198 10.6457C5.65562 10.6268 5.7 10.5675 5.7 10.5C5.7 7.46243 8.11766 5 11.1 5C14.0823 5 16.5 7.46243 16.5 10.5C16.5 10.5582 16.5536 10.6014 16.6094 10.5887C16.8638 10.5306 17.1284 10.5 17.4 10.5C19.3882 10.5 21 12.1416 21 14.1667C21 16.1917 19.3882 17.8333 17.4 17.8333"
                  stroke="var(--ui-kit-color-typography-secondary)"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </g>
            </svg>

            <button
              onClick={(event) => {
                event.stopPropagation();
              }}
              className="mt-2 cursor-pointer w-[88%] bg-[rgba(64,87,109,.07)] hover:bg-[rgba(57,76,96,.15)] transition duration-300 py-2.5 rounded-sm flex"
            >
              <label
                htmlFor="file-upload"
                className="flex justify-center items-center w-full cursor-pointer"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  strokeWidth={2}
                  stroke="black"
                  style={{ marginRight: "0.3rem" }}
                >
                  <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    <path
                      d="M12 19V12M12 12L9.75 14.3333M12 12L14.25 14.3333M6.6 17.8333C4.61178 17.8333 3 16.1917 3 14.1667C3 12.498 4.09438 11.0897 5.59198 10.6457C5.65562 10.6268 5.7 10.5675 5.7 10.5C5.7 7.46243 8.11766 5 11.1 5C14.0823 5 16.5 7.46243 16.5 10.5C16.5 10.5582 16.5536 10.6014 16.6094 10.5887C16.8638 10.5306 17.1284 10.5 17.4 10.5C19.3882 10.5 21 12.1416 21 14.1667C21 16.1917 19.3882 17.8333 17.4 17.8333"
                      stroke="var(--ui-kit-color-typography-secondary)"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                  </g>
                </svg>

                <span className="font-medium">Upload an image</span>
              </label>
            </button>
          </div>
        )}
      </div>

      {/*File upload input*/}
      <input
        ref={inputRef}
        id="file-upload"
        type="file"
        name="myImage"
        className="hidden"
        onChange={(event) => {
          if (!event.target.files) return;
          if (typeof window === "undefined") return;
          const src = URL.createObjectURL(event.target.files[0]);
          const img = new window.Image();
          img.src = src;
          img.style.opacity = "0";
          img.onload = () => {
            const aspectRatio = img.width / img.height;
            img.width = 100;
            img.height = 100 / aspectRatio;
            document.body.appendChild(img);
            const base64 = convertImageToBase64(img);

            dispatch({
              type: "ADD_IMAGE_ELEMENT",
              imgElement: img,
              src: base64,
            });

            if (inputRef.current) {
              inputRef.current.value = "";
            }
          };
        }}
      />

      <div className="w-full max-w-[300px] bg-gray-200 rounded-sm px-1">
        <MenuElementProperty />
      </div>

      {/*Actions*/}
      <div className="w-full max-w-[300px] flex flex-col place-items-center gap-2 mb-3">
        {/*Text & image buttons wrapper*/}
        <div className="w-full flex flex-col gap-2 sm:flex-row">
          <Button
            className="w-full"
            variant="secondary"
            size="sm"
            onClick={() => {
              dispatch({ type: "ADD_TEXT_ELEMENT", text: "Your Text" });
              setAutoEditText(autoEditText + 1);
            }}
          >
            Add Text
          </Button>
          <Button
            className="w-full"
            variant="secondary"
            size="sm"
            onClick={() => {
              inputRef.current?.click();
            }}
          >
            Add Image
          </Button>
        </div>
        <div className="w-full">
          <Button
            className="w-full"
            variant="secondary"
            size="sm"
            onClick={async () => {
              if (typeof window === "undefined") return;

              const image = new window.Image();
              image.src = "/assets/images/ai-motif-placeholder.svg";
              image.onload = () => {
                const base64 = convertImageToBase64(image);
                dispatch({
                  type: "ADD_AI_MOTIF_ELEMENT",
                  imgElement: image,
                  src: base64,
                });
              };
            }}
          >
            Add AI Element
          </Button>
        </div>
      </div>

      {/*Spacing*/}
      <div className="w-full max-w-[300px] flex flex-col self-center md:self-start mb-2">
        {/*<h5>Spacing</h5>*/}

        <MenuSpacingControl />

        {/*<ToggleGroup type="single" className="mt-1 self-start">*/}
        {/*  <ToggleGroupItem*/}
        {/*    value="-5%"*/}
        {/*    aria-label="-5%"*/}
        {/*    onClick={() => {*/}
        {/*      dispatch({ type: "CHANGE_SPACING", incrementFactor: -0.1 });*/}
        {/*    }}*/}
        {/*  >*/}
        {/*    -5%*/}
        {/*  </ToggleGroupItem>*/}
        {/*  <ToggleGroupItem*/}
        {/*    value="-1%"*/}
        {/*    aria-label="-1%"*/}
        {/*    onClick={() => {*/}
        {/*      dispatch({ type: "CHANGE_SPACING", incrementFactor: -0.01 });*/}
        {/*    }}*/}
        {/*  >*/}
        {/*    -1%*/}
        {/*  </ToggleGroupItem>*/}
        {/*  <ToggleGroupItem*/}
        {/*    value="1%"*/}
        {/*    aria-label="1%"*/}
        {/*    onClick={() => {*/}
        {/*      dispatch({ type: "CHANGE_SPACING", incrementFactor: 0.01 });*/}
        {/*    }}*/}
        {/*  >*/}
        {/*    1%*/}
        {/*  </ToggleGroupItem>*/}
        {/*  <ToggleGroupItem*/}
        {/*    value="5%"*/}
        {/*    aria-label="5%"*/}
        {/*    onClick={() => {*/}
        {/*      dispatch({ type: "CHANGE_SPACING", incrementFactor: 0.1 });*/}
        {/*    }}*/}
        {/*  >*/}
        {/*    5%*/}
        {/*  </ToggleGroupItem>*/}
        {/*</ToggleGroup>*/}
      </div>

      {/*Pattern*/}
      <div className="w-full max-w-[300px] flex flex-col self-center md:self-start mb-2">
        <h5>Pattern</h5>
        <div className="flex gap-x-3 my-2">
          <div
            style={{
              outline:
                appState.placement === "full-drop"
                  ? "3px solid #8b3dff"
                  : "1px solid rgba(43, 59, 74, .3)",
              borderRadius: "0.5rem",
              overflow: "hidden",
              cursor: "pointer",
              maxWidth: "60px",
              maxHeight: "60px",
            }}
            onClick={() => {
              context.dispatch({
                type: "UPDATE_EDITOR_PROPERTIES",
                properties: { placement: "full-drop" },
              });
            }}
          >
            <img
              src="/assets/images/full-drop.png"
              alt="Full drop"
              width={60}
              height={60}
              className="object-cover object-center"
            />
          </div>
          <div
            style={{
              outline:
                appState.placement === "half-drop"
                  ? "3px solid #8b3dff"
                  : "1px solid rgba(43, 59, 74, .3)",
              borderRadius: "0.5rem",
              overflow: "hidden",
              cursor: "pointer",
              maxWidth: "60px",
              maxHeight: "60px",
            }}
            onClick={() => {
              context.dispatch({
                type: "UPDATE_EDITOR_PROPERTIES",
                properties: { placement: "half-drop" },
              });
            }}
          >
            <img
              src="/assets/images/half-drop.png"
              alt="Full drop"
              width={60}
              height={60}
              className="object-cover object-center"
            />
          </div>
          <div
            style={{
              outline:
                appState.placement === "brick"
                  ? "3px solid #8b3dff"
                  : "1px solid rgba(43, 59, 74, .3)",
              borderRadius: "0.5rem",
              overflow: "hidden",
              cursor: "pointer",
              maxWidth: "60px",
              maxHeight: "60px",
            }}
            onClick={() => {
              context.dispatch({
                type: "UPDATE_EDITOR_PROPERTIES",
                properties: { placement: "brick" },
              });
            }}
          >
            <img
              src="/assets/images/brick.png"
              alt="Full drop"
              width={60}
              height={60}
              className="object-cover object-center"
            />
          </div>
        </div>
      </div>

      {/*background color*/}
      <div className="self-center max-w-[300px] md:self-start my-2 flex justify-between items-center w-full !relative px-1">
        <h5>Background color</h5>
        <div className="!relative flex items-center justify-between">
          <div
            onClick={() => {
              if (showInputColorComponent) {
                setShowInputColorComponent(false);
              } else {
                setShowInputColorComponent(true);
              }
            }}
            style={{ background: appState.backgroundColor }}
            className="w-8 h-8 rounded-md drop-shadow-none hover:drop-shadow-md cursor-pointer transition-all ease outline outline-1 outline-offset-1 outline-gray-400"
          />

          <TypedSketchPicker
            color={appState.backgroundColor}
            onChange={(color: any) => {
              console.log({ color });
              context.dispatch({
                type: "UPDATE_EDITOR_PROPERTIES",
                properties: { backgroundColor: color.hex },
              });
            }}
            className={cn(
              "absolute top-[-320px] left-[-150px] hidden",
              showInputColorComponent && "block",
            )}
          />
        </div>
      </div>

      {/*Zoom & scroll horizontal & scroll vertical*/}
      <div className="mt-2 w-full max-w-[300px] self-center md:self-start px-1 space-y-4">
        {/*Zoom*/}
        <div className="w-full">
          <h5>Zoom</h5>

          <div className="flex w-full justify-start">
            <div className="flex-1 mt-1.5">
              <Slider
                min={0.2}
                max={4}
                step={0.1}
                defaultValue={[zoom]}
                onValueChange={(value) => {
                  setZoom(value[0]);
                }}
                disabled={appState.elements.length === 0}
                className="data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/*Scroll horizontally*/}
        <div className="w-full my-2">
          <h5>Scroll horizontally</h5>

          <div className="flex w-full justify-start">
            <div className="flex-1 mt-1.5">
              <Slider
                min={-0.45}
                max={0.55}
                step={0.01}
                defaultValue={[pan.x]}
                onValueChange={(value) => {
                  setPan({ ...pan, x: value[0] });
                }}
                disabled={appState.elements.length === 0}
                className="data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/*Scroll vertically*/}
        <div className="w-full my-2">
          <h5>Scroll vertically</h5>

          <div className="flex w-full justify-start">
            <div className="flex-1 mt-1.5">
              <Slider
                min={-0.45}
                max={0.55}
                step={0.01}
                defaultValue={[pan.y]}
                onValueChange={(value) => {
                  setPan({ ...pan, y: value[0] });
                }}
                disabled={appState.elements.length === 0}
                className="data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/*TODO: UNCOMMENT TO ADD UPSCALE OPTION*/}

        {/*Upscale*/}
        {/*<div className="w-full my-2">*/}
        {/*  <h5>Upscale</h5>*/}

        {/*  <div className="flex w-full justify-start">*/}
        {/*    <div className="flex-1 mt-1.5">*/}
        {/*      <Slider*/}
        {/*        min={0.1}*/}
        {/*        max={10}*/}
        {/*        step={0.1}*/}
        {/*        defaultValue={[upScaleFactor]}*/}
        {/*        onValueChange={(value) => {*/}
        {/*          setUpScaleFactor(value[0]);*/}
        {/*        }}*/}
        {/*        disabled={appState.elements.length === 0}*/}
        {/*      />*/}
        {/*    </div>*/}
        {/*  </div>*/}
        {/*</div>*/}

        {/*<div className="flex justify-between items-center w-full my-5 space-x-1">*/}
        {/*  <h5>Resolution</h5>*/}
        {/*  <div className="flex space-x-2">*/}
        {/*    <Input*/}
        {/*      type="number"*/}
        {/*      placeholder="Width"*/}
        {/*      value={*/}
        {/*        finalResoluton.width < 1 ? "" : Math.floor(finalResoluton.width)*/}
        {/*      }*/}
        {/*      defaultValue={*/}
        {/*        finalResoluton.width < 1 ? "" : Math.floor(finalResoluton.width)*/}
        {/*      }*/}
        {/*      onChange={(event) => {*/}
        {/*        const newValue = Math.floor(+event.target.value);*/}
        {/*        setFinalResoluton({ ...finalResoluton, width: newValue });*/}
        {/*      }}*/}
        {/*    />*/}

        {/*    <Input*/}
        {/*      type="number"*/}
        {/*      placeholder="Width"*/}
        {/*      value={*/}
        {/*        finalResoluton.height < 1*/}
        {/*          ? ""*/}
        {/*          : Math.floor(finalResoluton.height)*/}
        {/*      }*/}
        {/*      defaultValue={*/}
        {/*        finalResoluton.height < 1*/}
        {/*          ? ""*/}
        {/*          : Math.floor(finalResoluton.height)*/}
        {/*      }*/}
        {/*      onChange={(event) => {*/}
        {/*        const newValue = Math.floor(+event.target.value);*/}
        {/*        setFinalResoluton({ ...finalResoluton, height: newValue });*/}
        {/*      }}*/}
        {/*    />*/}

        {/*    <span className="self-center">px</span>*/}
        {/*  </div>*/}
        {/*</div>*/}
      </div>

      <div className="hidden">{repeatCanvasMemo}</div>

      {/*TODO: UNCOMMENT TO ADD TRANSPARENT BACKGROUND OPTION*/}

      {/*<div className="flex w-full justify-start items-center my-2 mx-1 space-x-1 max-w-[300px] self-center md:self-start">*/}
      {/*  <Checkbox*/}
      {/*    id="transparentBackground"*/}
      {/*    onClick={(event: any) => {*/}
      {/*      console.log(event.target?.value);*/}

      {/*      if (event.target.value && event.target.value === "on") {*/}
      {/*        setTransparentBackground(true);*/}
      {/*      } else {*/}
      {/*        setTransparentBackground(false);*/}
      {/*      }*/}
      {/*    }}*/}
      {/*  />*/}
      {/*  <Label htmlFor="transparentBackground">Transparent background</Label>*/}
      {/*</div>*/}

      <div className="flex flex-col w-full max-w-[300px] self-center md:self-start justify-center items-center mt-5 space-y-2">
        {/*<Button*/}
        {/*  onClick={handleDownloadRepeat}*/}
        {/*  disabled={appState.elements.length === 0 || isDownloadingCanvas}*/}
        {/*  className="w-full"*/}
        {/*  size="lg"*/}
        {/*  variant="default"*/}
        {/*>*/}
        {/*  Download Repeat Image*/}
        {/*</Button>*/}

        {/*<Button*/}
        {/*  onClick={handleDownloadTilableImage}*/}
        {/*  disabled={appState.elements.length === 0 || isDownloadingCanvas}*/}
        {/*  className="w-full"*/}
        {/*  size="lg"*/}
        {/*  variant="secondary"*/}
        {/*>*/}
        {/*  Download Pattern Tile*/}
        {/*</Button>*/}

        {/*<Button*/}
        {/*  onClick={handleEnhanceWithAI}*/}
        {/*  disabled={appState.elements.length === 0 || isDownloadingCanvas}*/}
        {/*  className="w-full"*/}
        {/*  size="lg"*/}
        {/*  variant="secondary"*/}
        {/*>*/}
        {/*  Enhance with AI*/}
        {/*</Button>*/}
      </div>

      <div className="hidden">{tilableCanvas}</div>
    </div>
  );
};
