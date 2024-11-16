import * as fabric from "fabric";
import { Position, offset } from "../../../types";
import { ISnapper } from "./ISnapper";

export class CenterSnapper implements ISnapper {
  positions: {
    center: Position;
    object: fabric.Object;
  }[] = [];

  constructor(
    private snappingCenterDistance: number,
    private canvas: fabric.Canvas,
    private patternOffset: offset,
    elementId: string,
  ) {
    this.canvas.forEachObject((object) => {
      if (object.get("elementId") === elementId) return;
      const bb = object.getBoundingRect();
      const oCenter = {
        left: bb.left + bb.width / 2,
        top: bb.top + bb.height / 2,
      };
      if (oCenter.left < 0 || oCenter.top < 0) return;
      if (
        oCenter.left > this.patternOffset.x ||
        oCenter.top > this.patternOffset.y
      )
        return;
      this.positions.push({
        center: oCenter,
        object,
      });
    });
  }

  snap(soCenter: { left: number; top: number }):
    | {
        position: Position;
        object: fabric.Object;
        type: "center" | "x" | "y";
      }
    | undefined {
    let result:
      | {
          position: Position;
          object: fabric.Object;
          type: "center" | "x" | "y";
        }
      | undefined = undefined;
    let minDistance = this.snappingCenterDistance * 2;
    const snappingAxisDistance = this.snappingCenterDistance / 2;
    this.positions.forEach(({ center: oCenter, object }) => {
      const distance = Math.sqrt(
        Math.pow(soCenter.left - oCenter.left, 2) +
          Math.pow(soCenter.top - oCenter.top, 2),
      );
      const xDistance = Math.abs(soCenter.left - oCenter.left);
      const yDistance = Math.abs(soCenter.top - oCenter.top);

      if (distance < this.snappingCenterDistance && distance < minDistance) {
        result = {
          position: oCenter,
          object,
          type: "center",
        };
        minDistance = distance;
      } else if (xDistance < snappingAxisDistance && xDistance < minDistance) {
        result = {
          position: {
            left: oCenter.left,
            top: soCenter.top,
          },
          type: "x",
          object,
        };
        minDistance = xDistance;
      } else if (yDistance < snappingAxisDistance && yDistance < minDistance) {
        result = {
          position: {
            left: soCenter.left,
            top: oCenter.top,
          },
          type: "y",
          object,
        };
        minDistance = yDistance;
      }
    });
    return result;
  }
}
