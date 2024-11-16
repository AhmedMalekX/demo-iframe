import * as fabric from "fabric";
import { Position, offset } from "../../types";

export class MaxBounds implements IMaxBound {
  left: number;
  top: number;
  right: number;
  bottom: number;
  constructor(selectedObject: fabric.Object, patternOffset: offset) {
    const boundingRect = selectedObject.getBoundingRect();
    const boundingCenter = {
      left: boundingRect.left + boundingRect.width / 2,
      top: boundingRect.top + boundingRect.height / 2,
    };
    this.left = Math.min(
      selectedObject.left - boundingCenter.left,
      boundingRect.left,
    );
    this.top = Math.min(
      selectedObject.top - boundingCenter.top,
      boundingRect.top,
    );
    this.right = Math.max(
      patternOffset.x + (selectedObject.left - boundingCenter.left),
      boundingRect.left,
    );
    this.bottom = Math.max(
      patternOffset.y + (selectedObject.top - boundingCenter.top),
      boundingRect.top,
    );
  }

  getPosition(position: Position): Position {
    return {
      left: Math.min(Math.max(position.left, this.left), this.right),
      top: Math.min(Math.max(position.top, this.top), this.bottom),
    };
  }
}
export interface IMaxBound {
  getPosition(position: Position): Position;
}
