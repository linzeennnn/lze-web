import { FabricImage } from "fabric";
import { GetText } from "../../../../utils/common";
import { Icon } from "../../../../utils/icon";

export default function Flip({ editData }) {
  const flipX = () => {
    const { canvasRef, imageRef } = editData;
    flipAndMerge(canvasRef.current, imageRef.current, "x");
  };

  const flipY = () => {
    const { canvasRef, imageRef } = editData;
    flipAndMerge(canvasRef.current, imageRef.current, "y");
  };
  const flipAndMerge = (canvas, img, type = "x") => {
  if (!canvas || !img) return;

  const imgEl = img.getElement();
  const w = img.getScaledWidth();
  const h = img.getScaledHeight();

  // 临时 canvas
  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = w;
  tempCanvas.height = h;
  const ctx = tempCanvas.getContext("2d");

  ctx.save();

  // 设置翻转
  if (type === "x") {
    ctx.translate(w, 0);
    ctx.scale(-1, 1);
  } else {
    ctx.translate(0, h);
    ctx.scale(1, -1);
  }

  // 绘制图片
  ctx.drawImage(imgEl, 0, 0, w, h);
  ctx.restore();

  const dataUrl = tempCanvas.toDataURL();
  FabricImage.fromURL(dataUrl, { crossOrigin: "anonymous" }).then((flippedImg) => {
    canvas.clear();

    // 设置 canvas 尺寸与图片一致
    canvas.setDimensions({
      width: flippedImg.width,
      height: flippedImg.height,
    });

    flippedImg.set({
      originX: "center",
      originY: "center",
      left: flippedImg.width / 2,
      top: flippedImg.height / 2,
      selectable: false,
      evented: false,
    });

    canvas.add(flippedImg);
    canvas.requestRenderAll();

    // 替换 editData.imageRef
    editData.imageRef.current = flippedImg;
  });

  }
  return (
    <>
      <button className="btn" 
      title={GetText("flip")}
      onClick={flipX}>{Icon("leftRight")}</button>
      <button className="btn"
      title={GetText("flip")}
      onClick={flipY}>{Icon("upDown")}</button>
    </>
  );
}