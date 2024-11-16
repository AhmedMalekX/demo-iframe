"use client";

/*
 * React & Next.js components
 * */
import React, { useContext, useEffect, useRef, useState } from "react";

/*
 * Hooks
 * */
import { AppStateContext } from "@/components/GeneratingImagesMethods/GenerateImageFromElements/createTabHooks";
import { useUndoRedoKeyboardShortcuts } from "./hooks";

/*
 * Icons
 * */
import { MdOutlineUndo, MdOutlineRedo } from "react-icons/md";

/*
 * Types
 * */
import {
  Placements,
  Size,
} from "@/components/GeneratingImagesMethods/GenerateImageFromElements/createTabEngine/types";

/*
 * Components
 * */
import {
  CheckboxComponent,
  ColorComponent,
  RadioButtonComponent,
} from "./components";
import {
  MenuDownload,
  MenuElementProperty,
  MenuAddShape,
  MenuElementList,
} from "./submenu";
import { MenuSaveAndLoad } from "./submenu/MenuSaveAndLoad";

/*
 * Libs
 * */
import * as fabric from "fabric";

export type MenuProps = {
  zoom: number;
  finalResoluton: Size;
};

export const Menu: React.FC<MenuProps> = (props) => {
  const context = useContext(AppStateContext)!;

  // When Text is added, automatically enter edit mode
  const [autoEditText, setAutoEditText] = useState<number>(0);
  const lastAutoEditTextRun = useRef<number>(0);
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
  // When Text is added --- Done

  useUndoRedoKeyboardShortcuts();
  const { canRedo, canUndo, dispatch } = context;
  return (
    <div className="menu">
      <MenuElementProperty />
      <div className="add-image-options menu-section">
        <button
          onClick={() => {
            dispatch({ type: "UNDO" });
          }}
          disabled={!canUndo}
          title="ctrl+z or cmd+z"
        >
          <MdOutlineUndo size={20} />
          Undo
        </button>
        <button
          onClick={() => {
            dispatch({ type: "REDO" });
          }}
          disabled={!canRedo}
          title="ctrl+shift+z or cmd+shift+z"
        >
          <MdOutlineRedo size={20} />
          Redo{" "}
        </button>
      </div>
      {/*<div className="add-image-options menu-section">*/}
      {/*  <label>Spacing</label>*/}
      {/*  <button*/}
      {/*    onClick={() => {*/}
      {/*      dispatch({ type: "CHANGE_SPACING", incrementFactor: -0.1 });*/}
      {/*    }}*/}
      {/*  >*/}
      {/*    -5%*/}
      {/*  </button>*/}
      {/*  <button*/}
      {/*    onClick={() => {*/}
      {/*      dispatch({ type: "CHANGE_SPACING", incrementFactor: -0.01 });*/}
      {/*    }}*/}
      {/*  >*/}
      {/*    -1%*/}
      {/*  </button>*/}
      {/*  <button*/}
      {/*    onClick={() => {*/}
      {/*      dispatch({ type: "CHANGE_SPACING", incrementFactor: 0.01 });*/}
      {/*    }}*/}
      {/*  >*/}
      {/*    +1%*/}
      {/*  </button>*/}
      {/*  <button*/}
      {/*    onClick={() => {*/}
      {/*      dispatch({ type: "CHANGE_SPACING", incrementFactor: 0.1 });*/}
      {/*    }}*/}
      {/*  >*/}
      {/*    +5%*/}
      {/*  </button>*/}
      {/*</div>*/}
      <MenuAddShape
        addRect={() => dispatch({ type: "ADD_RECT_ELEMENT" })}
        // addText={() => dispatch({ type: "ADD_TEXT_ELEMENT", text: "HELLO" })}
        addText={() => {
          dispatch({ type: "ADD_TEXT_ELEMENT", text: "Your Text" });
          setAutoEditText(autoEditText + 1);
        }}
        addCircle={() => dispatch({ type: "ADD_CIRCLE_ELEMENT" })}
        addImage={(imge, src) =>
          dispatch({
            type: "ADD_IMAGE_ELEMENT",
            imgElement: imge,
            src: src,
          })
        }
        addAiMotif={(img, src) => {
          dispatch({ type: "ADD_AI_MOTIF_ELEMENT", imgElement: img, src: src });
        }}
      />

      <RadioButtonComponent
        options={[
          { id: "full-drop", label: "Full Drop" },
          { id: "half-drop", label: "Half Drop" },
          { id: "brick", label: "Brick" },
        ]}
        selectedOptionId={context.appState.placement}
        onOptionChange={(id) => {
          context.dispatch({
            type: "UPDATE_EDITOR_PROPERTIES",
            properties: { placement: id as Placements },
          });
        }}
      />
      <CheckboxComponent
        checked={context.appState.debug}
        onToggle={(checked) => {
          context.dispatch({
            type: "UPDATE_EDITOR_PROPERTIES",
            properties: { debug: checked },
          });
        }}
        label="Debug"
      />
      <ColorComponent
        color={context.appState.backgroundColor}
        onColorChange={(color) => {
          context.dispatch({
            type: "UPDATE_EDITOR_PROPERTIES",
            properties: { backgroundColor: color },
          });
        }}
        label="Background Color"
      />
      <MenuDownload zoom={props.zoom} finalResoluton={props.finalResoluton} />
      <MenuSaveAndLoad />
      <h2>Element List</h2>
      <div id="element-list">
        <MenuElementList />
      </div>
    </div>
  );
};
