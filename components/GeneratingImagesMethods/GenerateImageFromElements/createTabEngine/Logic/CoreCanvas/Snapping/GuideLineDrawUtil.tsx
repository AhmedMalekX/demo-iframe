import * as fabric from "fabric";

export class GuideLineDrawUtil {
  static drawCenterLinesOfObject(
    ctx: CanvasRenderingContext2D,
    object: fabric.Object,
  ) {
    const bb = object.getBoundingRect();
    const oCenter = {
      left: bb.left + bb.width / 2,
      top: bb.top + bb.height / 2,
    };
    GuideLineDrawUtil.drawLine(
      ctx,
      oCenter.left,
      oCenter.top - 10,
      oCenter.left,
      oCenter.top + 10,
    );
    GuideLineDrawUtil.drawLine(
      ctx,
      oCenter.left - 10,
      oCenter.top,
      oCenter.left + 10,
      oCenter.top,
    );
  }

  static drawLine(
    ctx: CanvasRenderingContext2D,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
  ) {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.restore();
  }
}
