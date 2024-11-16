import * as fabric from "fabric";

export type Size = {
  width: number;
  height: number;
};

export type Position = {
  top: number;
  left: number;
};

export type offset = {
  x: number;
  y: number;
};

export type Placements = "full-drop" | "half-drop" | "brick";

export interface BaseElement {
  id: string;
  fabricObject?: fabric.Object;
  rotation: number;
  size: Size;
  position: Position;
  flipX: boolean;
  flipY: boolean;
  type: unknown;
  color: string;
  opacity: number;
}

export interface ImageElement extends BaseElement {
  imgElement: HTMLImageElement;
  type: "image";
  properties: {
    src: string;
  };
}

export interface RectElement extends BaseElement {
  type: "rect";
  properties: {};
}

export interface CircleElement extends BaseElement {
  type: "circle";
  properties: {};
}

export interface TextElement extends BaseElement {
  type: "text";

  properties: {
    text: string;
    fontStyle: string;
    fontFamily: string;
    fontSize: number;
    fontWeight: "bold" | "normal";
    textAlign: "left" | "center" | "right";
  };
}

// 1 - move the prompt box and "generate" and "done" button to core canvas
// 2 - if user clicks away from the box before typing text or generating an image then it disappears
// 3 - if user clicks on generate and get an image - then clicks away, it stays(consider it as if user clicked done)
// 4 - if user clicks away while generating the image it should keep the object there, and allow the user to do other things on the canvas in the meantime
// 5 - when it is "done" the AI object becomes a normal image elem

export interface AiMotifElement extends BaseElement {
  type: "ai-motif";
  properties: {
    src: string;
    imgElement: HTMLImageElement;
    prompt: string;
    status: "prompt" | "generating" | "done";
    generatedCount: number;
  };
}

export type EditorElement =
  | ImageElement
  | RectElement
  | CircleElement
  | TextElement
  | AiMotifElement;
