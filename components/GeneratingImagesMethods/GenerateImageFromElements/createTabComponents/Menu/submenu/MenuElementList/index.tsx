"use client";
/*
 * React & Next.js components
 * */
import React, { useContext } from "react";

/*
 * Hooks
 * */
import { AppStateContext } from "@/components/GeneratingImagesMethods/GenerateImageFromElements/createTabHooks";

/*
 * Types
 * */
import { EditorElement } from "@/components/GeneratingImagesMethods/GenerateImageFromElements/createTabEngine/types";

/*
 * Style
 * */
import "./style.css";

export const MenuElementList = () => {
  const context = useContext(AppStateContext)!;
  return (
    <div className="element-list">
      {context.appState.elements.map((element, index) => {
        return <Element element={element} key={index} />;
      })}
    </div>
  );
};

type ElementProps = {
  element: EditorElement;
};

const Element = (props: ElementProps) => {
  const { dispatch } = useContext(AppStateContext)!;
  const { element } = props;
  const { type } = element;
  return (
    <div className="element">
      <div>
        {type} - {element.id.substring(0, 4)}
      </div>
      {type === "image" ? (
        <img
          src={element.imgElement?.src}
          width={40}
          height={40}
          style={{ objectFit: "contain" }}
          alt=""
        />
      ) : (
        <input
          type="color"
          value={element.color}
          style={{
            width: "40px",
            height: "30px",
          }}
          onChange={(event) => {
            const color = event.target.value;
            dispatch({
              type: "UPDATE_ELEMENT_PROPERTIES",
              id: element.id,
              properties: { color },
              setSelection: true,
            });
          }}
        />
      )}
    </div>
  );
};
