import { AppState } from "@/components/GeneratingImagesMethods/GenerateImageFromElements/createTabHooks/AppState";
import { EditorElement } from "../types";
import * as fabric from "fabric";

const ICONS_STRING = {
  rotate: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAHYSURBVFhH7da7L2ZBHMbxt7XERifisonOFqKQdalcsv+QuAXREbuuoVCJbLEdcY3gTyAq61IRUaBwSWi24fu83jcZY845M294NZ7kk4yTc35nzJmZd1KfCUwBWtCDOSxhOdPuRSt0T06pxRDK0n+9TAWGcYLHBKcYQSWCsgoVOEK5LmTSgRvYL0pyiy54Zx3Zh4/xAwvGtVyp7lckJjsCvq5wkKG2656sHRQjNj4d0KcYQxPM/0rtZkxCQ+96dhOxievAf/yFz8T6hkW46nQiMnEd0H9eipBMwa7zANcqSyfpExzCXB0+WYFd5zecWYN9s01LVEPsG43aHcwaF3BuVpok5o1RZhCSCdg12vAq2ka1tWrdajRsuq59oQ4hqYfdgX7kLYWw94k/yGv2YXZAEz6v+dAOfPgncE3CAeQt3svwPRK0EblSg8HnZk7Rcc18uURuxXaqcQY9NK0LgXENfeyPkZnv0NnOfFi7oM6GSalC1Ekq9ufYzCxcBa4xigaYJxy1GzGOqAPJFryjybMHV6GsS/zLSDqS7cLrXGimBNtwFQyxgeCXm9GmcQ9X8Tj6FN14k2hF6MB5DtfLTFo5v6DJ+OYpwk/0YR46conautaOL/iMZ1KpJ4+IPb0lrre8AAAAAElFTkSuQmCC`,
};

let rotateImage = null;

if (typeof window !== "undefined") {
  rotateImage = new window.Image();
  rotateImage.src = ICONS_STRING.rotate;
  rotateImage.width = 20;
  rotateImage.height = 20;
}

const ICONS = {
  rotate: rotateImage,
};

export const changeObjectWidthWithFontSize: fabric.TransformActionHandler = (
  eventData,
  transform,
  x,
  y,
) => {
  const localPoint = fabric.controlsUtils.getLocalPoint(
    transform,
    transform.originX,
    transform.originY,
    x,
    y,
  );
  //  make sure the control changes width ONLY from it's side of target
  if (
    transform.originX === "center" ||
    (transform.originX === "right" && localPoint.x < 0) ||
    (transform.originX === "left" && localPoint.x > 0)
  ) {
    const { target } = transform,
      strokePadding =
        target.strokeWidth / (target.strokeUniform ? target.scaleX : 1),
      multiplier = 1,
      // multiplier = fabric.controlsUtils.isTransformCentered(transform) ? 2 : 1,
      oldWidth = target.width;
    let newWidth = Math.ceil(
      Math.abs((localPoint.x * multiplier) / target.scaleX) - strokePadding,
    );
    newWidth = Math.max(newWidth, 0);

    const scaledRatio = newWidth / oldWidth;
    const oldFontSize = target.get("fontSize");
    const newFontSize = oldFontSize * scaledRatio;
    // if (newFontSize < 1) return false;
    // Set the new font size based on the width ratio
    target.set("fontSize", newFontSize);
    target.set("width", newWidth);
    return oldWidth !== target.width;
  }
  return false;
};

export const changeObjectWidthWithFontSizeWrap =
  fabric.controlsUtils.wrapWithFireEvent(
    "resizing",
    fabric.controlsUtils.wrapWithFixedAnchor(changeObjectWidthWithFontSize),
  );

function renderIcon(icon: HTMLImageElement) {
  return function renderIcon(
    ctx: CanvasRenderingContext2D,
    left: number,
    top: number,
    styleOverride: never,
    fabricObject: fabric.Object,
  ) {
    const size = this.sizeX;
    ctx.save();
    ctx.translate(left, top);
    ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));

    const padding = 4;

    // draw cricle background first
    ctx.beginPath();
    ctx.arc(0, 0, size / 2, 0, 2 * Math.PI, false);
    ctx.fillStyle = "rgba(255,255,255,0.8)";
    ctx.fill();
    ctx.closePath();

    // draw border around the circle
    ctx.beginPath();
    ctx.arc(0, 0, size / 2, 0, 2 * Math.PI, false);
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#888";
    ctx.stroke();
    ctx.closePath();

    // draw image with padding
    ctx.drawImage(
      icon,
      -size / 2 + padding,
      -size / 2 + padding,
      size - padding * 2,
      size - padding * 2,
    );
    // ctx.drawImage(icon, -size / 2 , -size / 2, size, size);
    ctx.restore();
  };
}

export const BORDER_HIGHLIGHT_COLOR = "rgba(118, 20, 255,1)";
const CORNER_SIZE = 12;

export function generateFabricCanvasFromAppState(
  canvas: fabric.Canvas,
  appState: AppState,
) {
  canvas.clear();
  canvas.backgroundColor = appState.backgroundColor;
  appState.elements.forEach((element) => {
    const object = getObjectForElement(element);
    canvas.add(object);
    element.fabricObject = object;
    object.set("elementId", element.id);
  });
}

export function restrictMinimumScaling(
  object: fabric.Object,
  minScale: number,
) {
  object.minScaleLimit = minScale;
  object.lockScalingFlip = true;
}

const objectControls = (rotation: boolean, isText: boolean) => {
  if (isText) {
    return {
      ...(rotation
        ? {
            mtr: new fabric.Control({
              x: 0,
              y: 0.5,
              render: renderIcon(ICONS.rotate!),
              actionHandler: fabric.controlsUtils.rotationWithSnapping,
              sizeX: 20,
              sizeY: 20,
              offsetY: 32,
              withConnection: false,
              actionName: "rotate",
            }),
          }
        : {}),

      // ml: new fabric.Control({
      //   x: -0.5,
      //   y: 0,
      //   sizeX: 6,
      //   sizeY: 15,
      //   actionHandler: fabric.controlsUtils.changeWidth,
      //   getActionName: fabric.controlsUtils.scaleOrSkewActionName,
      // }),
      mr: new fabric.Control({
        x: +0.5,
        y: 0,
        sizeX: 6,
        sizeY: 15,
        actionHandler: fabric.controlsUtils.changeWidth,
        getActionName: fabric.controlsUtils.scaleOrSkewActionName,
      }),
      br: new fabric.Control({
        x: +0.5,
        y: +0.5,
        render: fabric.controlsUtils.renderCircleControl,
        actionHandler: changeObjectWidthWithFontSizeWrap,
        sizeX: CORNER_SIZE,
        sizeY: CORNER_SIZE,
      }),
    };
  }
  return {
    ...(rotation
      ? {
          mtr: new fabric.Control({
            x: 0,
            y: 0.5,
            render: renderIcon(ICONS.rotate!),
            actionHandler: fabric.controlsUtils.rotationWithSnapping,
            sizeX: 20,
            sizeY: 20,
            offsetY: 32,
            withConnection: false,
            actionName: "rotate",
          }),
        }
      : {}),
    tl: new fabric.Control({
      x: -0.5,
      y: -0.5,
      render: fabric.controlsUtils.renderCircleControl,
      actionHandler: fabric.controlsUtils.scalingEqually,
      sizeX: CORNER_SIZE,
      sizeY: CORNER_SIZE,
    }),
    tr: new fabric.Control({
      x: +0.5,
      y: -0.5,
      render: fabric.controlsUtils.renderCircleControl,
      actionHandler: fabric.controlsUtils.scalingEqually,
      sizeX: CORNER_SIZE,
      sizeY: CORNER_SIZE,
    }),
    br: new fabric.Control({
      x: +0.5,
      y: +0.5,
      render: fabric.controlsUtils.renderCircleControl,
      actionHandler: fabric.controlsUtils.scalingEqually,
      sizeX: CORNER_SIZE,
      sizeY: CORNER_SIZE,
    }),
    bl: new fabric.Control({
      x: -0.5,
      y: +0.5,
      render: fabric.controlsUtils.renderCircleControl,
      actionHandler: fabric.controlsUtils.scalingEqually,
      sizeX: CORNER_SIZE,
      sizeY: CORNER_SIZE,
    }),

    ml: new fabric.Control({
      x: -0.5,
      y: 0,
      sizeX: 6,
      sizeY: 15,
      actionHandler: fabric.controlsUtils.scalingXOrSkewingY,
      getActionName: fabric.controlsUtils.scaleOrSkewActionName,
    }),
    mr: new fabric.Control({
      x: +0.5,
      y: 0,
      sizeX: 6,
      sizeY: 15,
      actionHandler: fabric.controlsUtils.scalingXOrSkewingY,
      getActionName: fabric.controlsUtils.scaleOrSkewActionName,
    }),

    mb: new fabric.Control({
      x: 0,
      y: 0.5,
      sizeX: 15,
      sizeY: 6,
      cursorStyleHandler: fabric.controlsUtils.scaleSkewCursorStyleHandler,
      actionHandler: fabric.controlsUtils.scalingYOrSkewingX,
      getActionName: fabric.controlsUtils.scaleOrSkewActionName,
    }),

    mt: new fabric.Control({
      x: 0,
      y: -0.5,
      sizeX: 15,
      sizeY: 6,
      cursorStyleHandler: fabric.controlsUtils.scaleSkewCursorStyleHandler,
      actionHandler: fabric.controlsUtils.scalingYOrSkewingX,
      getActionName: fabric.controlsUtils.scaleOrSkewActionName,
    }),
  };
};

export const assignControls = (r: fabric.Object, rotation: boolean = true) => {
  r.controls = objectControls(rotation, r instanceof fabric.Textbox);
  r.borderScaleFactor = 3;
  r.borderColor = BORDER_HIGHLIGHT_COLOR;
  r.cornerStrokeColor = "#888";
  r.cornerColor = "white";
  r.transparentCorners = false;
};

export function getObjectForElement(element: EditorElement): fabric.Object {
  // if (!isControledAssigned) {
  //   isControledAssigned = true;
  //   fabric.Object.prototype.controls = objectControls();
  // }
  if (element.type === "rect") {
    const r = new fabric.Rect({
      top: element.position.top,
      left: element.position.left,
      width: element.size.width,
      height: element.size.height,
      angle: element.rotation,
      fill: element.color,
      opacity: element.opacity,
      flipX: element.flipX,
      flipY: element.flipY,
    });
    assignControls(r);
    return r;
  } else if (element.type === "circle") {
    const c = new fabric.Circle({
      top: element.position.top,
      left: element.position.left,
      radius: element.size.width / 2,
      angle: element.rotation,
      fill: element.color,
      opacity: element.opacity,
      flipX: element.flipX,
      flipY: element.flipY,
      borderScaleFactor: 3,
      borderColor: BORDER_HIGHLIGHT_COLOR,
      transparentCorners: false,
    });
    assignControls(c);
    return c;
  } else if (element.type === "text") {
    const t = new fabric.Textbox(element.properties.text, {
      top: element.position.top,
      left: element.position.left,
      width: element.size.width,
      height: element.size.height,
      angle: element.rotation,
      fill: element.color,
      opacity: element.opacity,
      flipX: element.flipX,
      flipY: element.flipY,
      borderScaleFactor: 3,
      fontFamily: element.properties.fontFamily,
      fontWeight: element.properties.fontWeight,
      textAlign: element.properties.textAlign,
      fontSize: element.properties.fontSize,
      borderColor: BORDER_HIGHLIGHT_COLOR,
      transparentCorners: false,
    });
    assignControls(t);
    return t;
  } else if (element.type === "image") {
    if (element.imgElement === null) {
      const r = new fabric.Rect({
        top: element.position.top,
        left: element.position.left,
        width: element.size.width,
        height: element.size.height,
        angle: element.rotation,
        fill: element.color,
        opacity: element.opacity,
        flipX: element.flipX,
        flipY: element.flipY,
      });
      assignControls(r);
      return r;
    }
    const fabricImage = new fabric.Image(element.imgElement, {
      top: element.position.top,
      left: element.position.left,
      opacity: element.opacity,
      flipX: element.flipX,
      flipY: element.flipY,
      borderScaleFactor: 3,
      borderColor: BORDER_HIGHLIGHT_COLOR,
      transparentCorners: false,
      //  angle : element.rotation,
    });
    assignControls(fabricImage);
    fabricImage.scaleToHeight(element.size.height);
    const scaleY = fabricImage.scaleY;
    fabricImage.scaleToWidth(element.size.width);
    fabricImage.scaleY = scaleY;
    fabricImage.angle = element.rotation;
    return fabricImage;
  } else if (element.type === "ai-motif") {
    const imgElement = element.properties.imgElement;
    const fabricImage = new fabric.Image(imgElement, {
      top: element.position.top,
      left: element.position.left,
      opacity: element.opacity,
      flipX: element.flipX,
      flipY: element.flipY,
      borderScaleFactor: 3,
      borderColor: BORDER_HIGHLIGHT_COLOR,
      transparentCorners: false,
      //  angle : element.rotation,
    });
    assignControls(fabricImage, false);
    fabricImage.scaleToHeight(element.size.height);
    const scaleY = fabricImage.scaleY;
    fabricImage.scaleToWidth(element.size.width);
    fabricImage.scaleY = scaleY;
    fabricImage.angle = element.rotation;
    return fabricImage;
  } else {
    throw new Error("Unknown element type");
  }
}

export function renderControlsOnHover(object: fabric.Object) {
  object.on("mouseover", function () {
    if (object?.canvas?._activeObject !== object) {
      this._renderControls(this.canvas.contextTop, {
        hasControls: false,
      });
    }
  });
  object.on("mousedown", function () {
    this.canvas.clearContext(this.canvas.contextTop);
  });
  object.on("mouseout", function () {
    this.canvas.clearContext(this.canvas.contextTop);
  });
}

export function renderHeightAndWithRestriction(
  object: fabric.Object,
  maxWidth: number,
  maxHeight: number,
) {
  function isError() {
    const width = object.width * object.scaleX;
    const height = object.height * object.scaleY;
    return Math.abs(width) > maxWidth || Math.abs(height) > maxHeight;
  }

  object.on("scaling", function () {
    this.canvas.clearContext(this.canvas.contextTop);
    // const originalFunction = object.strokeBorders;
    // object.strokeBorders = function strokeBorders(ctx: CanvasRenderingContext2D, size: fabric.Point): void {
    //   ctx.lineWidth = 4;
    //   ctx.strokeRect(-size.x / 2, -size.y / 2, size.x, size.y);
    // }
    if (isError()) {
      this._renderControls(this.canvas.contextTop, {
        hasControls: false,
        borderColor: "red",
      });
    }
    // object.strokeBorders = originalFunction;
  });
}

export function lockMovement(object: fabric.Object) {
  object.lockMovementX = true;
  object.lockMovementY = true;
}
