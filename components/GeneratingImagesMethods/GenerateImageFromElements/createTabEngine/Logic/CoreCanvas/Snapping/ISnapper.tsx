import * as fabric from "fabric";
import { Position } from "../../../types";

export interface ISnapper {
  snap(soCenter: { left: number; top: number }): SnappingResult;
}

export type SnappingResult =
  | {
      position: Position;
      object: fabric.Object;
      type: "center" | "x" | "y";
    }
  | undefined;
