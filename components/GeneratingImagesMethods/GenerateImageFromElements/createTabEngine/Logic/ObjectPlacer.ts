import { Position, Size, offset } from "../types";

export abstract class ObjectPlacer {
  constructor(
    protected canvasSize: Size,
    protected offset: offset,
  ) {}

  abstract getAllPositions(position: Position): Position[];
}

export class FullDropObjectPlacer extends ObjectPlacer {
  getAllPositions(position: Position): Position[] {
    const positions: Position[] = [];
    const startX = position.left - this.offset.x;
    const startY = position.top - this.offset.y;
    for (let x = startX; x <= this.canvasSize.width; x += this.offset.x) {
      for (let y = startY; y <= this.canvasSize.height; y += this.offset.y) {
        positions.push({
          left: x,
          top: y,
        });
      }
    }
    return positions;
  }
}

export class BrickObjectPlacer extends ObjectPlacer {
  getAllPositions(position: Position): Position[] {
    const positions: Position[] = [];
    let even = true;
    const startX = position.left - this.offset.x;
    const startY = position.top - this.offset.y;
    for (let y = startY; y <= this.canvasSize.height; y += this.offset.y) {
      for (let x = startX; x <= this.canvasSize.width; x += this.offset.x) {
        positions.push({
          left: x + (even ? this.offset.x / 2 : 0),
          top: y,
        });
      }
      even = !even;
    }
    return positions;
  }
}

export class HalfDropObjectPlacer extends ObjectPlacer {
  getAllPositions(position: Position): Position[] {
    const positions: Position[] = [];
    let even = true;
    const startX = position.left - this.offset.x;
    const startY = position.top - this.offset.y;
    for (let x = startX; x <= this.canvasSize.width; x += this.offset.x) {
      for (let y = startY; y <= this.canvasSize.height; y += this.offset.y) {
        positions.push({
          left: x,
          top: y + (even ? this.offset.y / 2 : 0),
        });
      }
      even = !even;
    }
    return positions;
  }
}
