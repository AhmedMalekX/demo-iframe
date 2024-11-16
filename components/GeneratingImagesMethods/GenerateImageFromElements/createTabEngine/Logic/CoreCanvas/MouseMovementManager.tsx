import * as fabric from "fabric";
export class MouseMovementManager implements IMouseMovementPosition {
  mousePosition: MousePosition;
  constructor(private canvas: fabric.Canvas) {
    this.mousePosition = { x: 0, y: 0 };
    this.bindFuntions();
  }
  getMousePosition() {
    return { ...this.mousePosition };
  }
  bindFuntions() {
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
  }

  initEvents() {
    this.canvas.on("mouse:move", this.onMouseMove);
    this.canvas.on("mouse:down", this.onMouseDown);
  }

  disposeEvents() {
    this.canvas.off("mouse:move", this.onMouseMove);
    this.canvas.off("mouse:down", this.onMouseDown);
  }

  onMouseDown(e: any) {
    this.mousePosition.x = e.pointer.x;
    this.mousePosition.y = e.pointer.y;
  }

  onMouseMove(e: any) {
    this.mousePosition.x = e.pointer.x;
    this.mousePosition.y = e.pointer.y;
  }
}
export interface IMouseMovementPosition {
  getMousePosition(): MousePosition;
}
export type MousePosition = {
  x: number;
  y: number;
};
