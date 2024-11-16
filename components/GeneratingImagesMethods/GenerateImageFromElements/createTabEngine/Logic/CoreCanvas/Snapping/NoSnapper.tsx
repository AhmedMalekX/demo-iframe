import * as fabric from "fabric";
import { Position } from "../../../types";
import { ISnapper } from "./ISnapper";

export class NoSnapper implements ISnapper {
  snap():
    | {
        position: Position;
        object: fabric.Object;
        type: "center" | "x" | "y";
      }
    | undefined {
    return undefined;
  }
}
