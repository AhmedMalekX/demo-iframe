import * as fabric from "fabric";
import { Position, offset } from "../../types";
import { IMouseMovementPosition, MousePosition } from "./MouseMovementManager";
import { ISnapper } from "./Snapping/ISnapper";
import { CenterSnapper } from "./Snapping/CenterSnapper";
import { NoSnapper } from "./Snapping/NoSnapper";
import { GuideLineDrawUtil } from "./Snapping/GuideLineDrawUtil";
import { MaxBounds, IMaxBound } from "./MaxBounds";

type Line = {
  start: Position;
  end: Position;
};

export type SelectionManagerConfig = {
  snapping: {
    enabled: boolean;
    snappingDistance: number;
    guideLinesColor: string;
  };
};

export class SelectionManager {
  startBOCenter: Position | null = { left: 0, top: 0 };

  guideLines: Line[] = [];
  starterSnapshot:
    | {
        selectedObject: fabric.Object;
        bleedingPositions: Position[];
        startPosition: Position;
        selectElementId: string;
        originalObject: {
          position: Position;
          object: fabric.Object;
        } | null;
        mousePosition: MousePosition;
        maxBounds: IMaxBound;
        snapper: ISnapper;
      }
    | undefined = undefined;

  constructor(
    private config: SelectionManagerConfig,
    private patternOffset: offset,
    private canvas: fabric.Canvas,
    private originalElements: Record<string, fabric.Object>,
    private bleedingElements: Record<string, fabric.Object[]>,
    private mouseMovementManager: IMouseMovementPosition,
  ) {
    this.startBOCenter = null;
    this.bindFuntions();
  }

  bindFuntions() {
    this.onSelection = this.onSelection.bind(this);
    this.onMoving = this.onMoving.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onBeforeRender = this.onBeforeRender.bind(this);
    this.onAfterRender = this.onAfterRender.bind(this);
  }

  initEvents() {
    this.canvas.on("selection:created", this.onSelection);
    this.canvas.on("selection:updated", this.onSelection);
    this.canvas.on("selection:cleared", this.onSelection);
    this.canvas.on("object:moving", this.onMoving);
    this.canvas.on("mouse:down", this.onMouseDown);
    this.canvas.on("before:render", this.onBeforeRender);
    this.canvas.on("after:render", this.onAfterRender);
  }

  disposeEvents() {
    this.canvas.off("selection:created", this.onSelection);
    this.canvas.off("selection:updated", this.onSelection);
    this.canvas.off("selection:cleared", this.onSelection);
    this.canvas.off("object:moving", this.onMoving);
    this.canvas.off("mouse:down", this.onMouseDown);
    this.canvas.off("before:render", this.onBeforeRender);
    this.canvas.off("after:render", this.onAfterRender);
  }

  getBleeingElementsFor(id: string) {
    return this.bleedingElements[id];
  }

  selectElementId(id: string) {
    const object = this.originalElements[id];
    if (!object) return;
    this.canvas.setActiveObject(object);
    this.canvas.requestRenderAll();
    this.onSelection();
  }

  onSelection() {
    let selection = this.canvas?.getActiveObject();
    if (selection) {
      const selectedObject = selection;
      const id = selectedObject.get("elementId");

      this.starterSnapshot = {
        selectedObject: selection,
        bleedingPositions: this.getBleeingElementsFor(id).map((element) => {
          return {
            left: element.left,
            top: element.top,
          };
        }),
        startPosition: {
          left: selection.left,
          top: selection.top,
        },
        selectElementId: id,
        originalObject: null,
        maxBounds: new MaxBounds(selectedObject, this.patternOffset),
        mousePosition: this.mouseMovementManager.getMousePosition(),
        snapper: this.config.snapping.enabled
          ? new CenterSnapper(
              this.config.snapping.snappingDistance,
              this.canvas,
              this.patternOffset,
              id,
            )
          : new NoSnapper(),
      };

      const boundingRect = selectedObject.getBoundingRect();
      this.startBOCenter = {
        left: boundingRect.left + boundingRect.width / 2,
        top: boundingRect.top + boundingRect.height / 2,
      };
      const isBleedingElement = selectedObject.get("isBleedingElement");
      if (isBleedingElement) {
        const element = this.originalElements[id];
        if (!element) return;
        this.starterSnapshot.originalObject = {
          position: {
            left: element.left ?? 0,
            top: element.top ?? 0,
          },
          object: element,
        };
      } else {
        this.starterSnapshot.originalObject = null;
      }
    } else {
      this.starterSnapshot = undefined;
    }
  }

  onMoving() {
    if (!this.starterSnapshot) return;
    const {
      selectedObject,
      startPosition,
      bleedingPositions,
      selectElementId: lastSelectedElementId,
      originalObject,
      maxBounds,
      mousePosition: startMousePosition,
      snapper,
    } = this.starterSnapshot;
    if (!this.startBOCenter) {
      return;
    }
    if (selectedObject) {
      const mousePosition = this.mouseMovementManager.getMousePosition();
      const mouseOffset = {
        left: mousePosition.x - startMousePosition.x,
        top: mousePosition.y - startMousePosition.y,
      };
      const newBOCenter = {
        left: this.startBOCenter.left + mouseOffset.left,
        top: this.startBOCenter.top + mouseOffset.top,
      };
      let snapResult = snapper.snap(newBOCenter);

      if (snapResult) {
        const { position } = snapResult;
        selectedObject.set({
          left: position.left - (this.startBOCenter.left - startPosition.left),
          top: position.top - (this.startBOCenter.top - startPosition.top),
        });
        selectedObject.setCoords();
      }

      const { left, top } = selectedObject;
      let newPosition = { left, top };
      newPosition = maxBounds.getPosition(newPosition);
      selectedObject.set({ left: newPosition.left, top: newPosition.top });
      selectedObject.setCoords();
      let changeX = newPosition.left - startPosition.left;
      let changeY = newPosition.top - startPosition.top;

      if (originalObject) {
        originalObject.object.set({
          left: originalObject.position.left + changeX,
          top: originalObject.position.top + changeY,
        });
        originalObject.object.setCoords();
      }
      this.getBleeingElementsFor(lastSelectedElementId).forEach(
        (element, index) => {
          element.set({
            left: bleedingPositions[index].left + changeX,
            top: bleedingPositions[index].top + changeY,
          });
          element.setCoords();
        },
      );
      this.canvas?.renderAll();
      if (snapResult) {
        const object = snapResult.object;
        const objectBB = object.getBoundingRect();
        const selectedObjectBB = selectedObject.getBoundingRect();
        this.guideLines = [];
        if (snapResult.type === "center") {
          this.guideLines.push({
            start: {
              left: snapResult.position.left,
              top: objectBB.top,
            },
            end: {
              left: snapResult.position.left,
              top: objectBB.top + objectBB.height,
            },
          });
          this.guideLines.push({
            start: {
              left: objectBB.left,
              top: snapResult.position.top,
            },
            end: {
              left: objectBB.left + objectBB.width,
              top: snapResult.position.top,
            },
          });
        } else if (snapResult.type === "x") {
          const top = Math.min(objectBB.top, selectedObjectBB.top);
          const bottom = Math.max(
            objectBB.top + objectBB.height,
            selectedObjectBB.top + selectedObjectBB.height,
          );
          this.guideLines.push({
            start: {
              left: snapResult.position.left,
              top: top,
            },
            end: {
              left: snapResult.position.left,
              top: bottom,
            },
          });
        } else if (snapResult.type === "y") {
          const left = Math.min(objectBB.left, selectedObjectBB.left);
          const right = Math.max(
            objectBB.left + objectBB.width,
            selectedObjectBB.left + selectedObjectBB.width,
          );
          this.guideLines.push({
            start: {
              left: left,
              top: snapResult.position.top,
            },
            end: {
              left: right,
              top: snapResult.position.top,
            },
          });
        }
      } else {
        this.guideLines = [];
      }
    }
  }

  onBeforeRender() {
    this.canvas.clearContext(this.canvas.contextTop);
  }

  onAfterRender() {
    const ctx = this.canvas.contextTop;
    ctx.save();
    ctx.strokeStyle = this.config.snapping.guideLinesColor;
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    this.guideLines.forEach((line) => {
      GuideLineDrawUtil.drawLine(
        this.canvas.contextTop,
        line.start.left,
        line.start.top,
        line.end.left,
        line.end.top,
      );
    });
    ctx.restore();
  }

  onMouseDown(e: any) {
    if (e.target === this.starterSnapshot?.selectedObject) {
      this.onSelection();
    }
  }
}
