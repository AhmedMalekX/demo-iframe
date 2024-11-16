import * as fabric from "fabric";
import { EditorElement, Position } from "../../types";

export class ModifiedObject {
  constructor(
    private canvas: fabric.Canvas,
    private updateElementProperties: (
      id: string,
      properties: Partial<EditorElement>,
      setSelection?: boolean,
    ) => void,
    private selectObject: (id: string | null, newPostion?: Position) => void,
  ) {
    this.bindFuntions();
  }

  bindFuntions() {
    this.onModified = this.onModified.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
  }

  initEvents() {
    this.canvas.on("object:modified", this.onModified);
    this.canvas.on("mouse:up", this.onMouseUp);
  }

  disposeEvents() {
    this.canvas.off("object:modified", this.onModified);
    this.canvas.off("mouse:up", this.onMouseUp);
  }

  onMouseUp() {
    const selectedObject = this.canvas.getActiveObject();
    const id = selectedObject?.get("elementId");
    // this.selectObject(id ?? null);
    if (!id) {
      this.selectObject(null);
    } else {
      this.selectObject(id, {
        top: selectedObject?.top ?? 1,
        left: selectedObject?.left ?? 1,
      });
      // this.updateElementProperties(id ?? "", {
      //     position: {
      //         top: selectedObject?.top ?? 1,
      //         left: selectedObject?.left ?? 1,
      //     },
      // }, true);
    }
    // if (!id) {
    //     // when there is no selected object, we should always deselect the object. Event if it is not a click event.
    //     this.selectObject(null);
    // } else {
    //     // TODO: There is error. Sometimes object will be selected with a click, but is click will be false. So Ui will not be updated properly
    // }
  }

  onModified() {
    const selectedObject = this.canvas.getActiveObject();
    const id = selectedObject?.get("elementId");
    if (!id || !selectedObject) return;
    this.updateElementProperties(
      id,
      {
        position: {
          top: selectedObject.top ?? 1,
          left: selectedObject.left ?? 1,
        },
        size: {
          width: (selectedObject.width || 1) * (selectedObject.scaleX || 1),
          height: (selectedObject.height || 1) * (selectedObject.scaleY || 1),
        },
        rotation: selectedObject.angle ?? 0,
        properties: {
          ...(selectedObject instanceof fabric.Textbox
            ? {
                text: selectedObject.text ?? "",
                fontSize: selectedObject.fontSize ?? 16,
              }
            : {}),
        },
      },
      true,
    );
    // ... modified handling code ...
  }
}
