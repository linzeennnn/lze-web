import { FabricImage } from "fabric";
import { GetText } from "../../../../utils/common";

export default function Rotate({ editData }) {
  const startRotate = () => {
    const canvas = editData.canvasRef.current;
    const img = editData.imageRef.current;
    if (!canvas || !img) return;

    rotateAndMerge(canvas, img, 90);
  };

  const rotateAndMerge = (canvas, img, delta = 90) => {
    // 新角度
    const nextAngle = ((img.angle || 0) + delta) % 360;

    const imgEl = img.getElement();
    const w = img.getScaledWidth();
    const h = img.getScaledHeight();

    // 根据旋转角度计算旋转后的尺寸
    const rad = (nextAngle * Math.PI) / 180;
    const cos = Math.abs(Math.cos(rad));
    const sin = Math.abs(Math.sin(rad));
    const newWidth = Math.ceil(w * cos + h * sin);
    const newHeight = Math.ceil(w * sin + h * cos);

    // 临时 canvas
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = newWidth;
    tempCanvas.height = newHeight;
    const ctx = tempCanvas.getContext("2d");

    // 将旋转中心移动到临时 canvas 中心
    ctx.translate(newWidth / 2, newHeight / 2);
    ctx.rotate(rad);
    ctx.drawImage(imgEl, -w / 2, -h / 2, w, h);

    // 生成 Fabric Image
    const dataUrl = tempCanvas.toDataURL();
    FabricImage.fromURL(dataUrl, { crossOrigin: "anonymous" }).then((rotatedImg) => {
      canvas.clear();

      // canvas 尺寸随旋转后的图片变化
      canvas.setDimensions({
        width: rotatedImg.width,
        height: rotatedImg.height,
      });

      rotatedImg.set({
        originX: "center",
        originY: "center",
        left: rotatedImg.width / 2,
        top: rotatedImg.height / 2,
        selectable: false,
        evented: false,
      });

      canvas.add(rotatedImg);
      canvas.requestRenderAll();

      // 替换 editData.imageRef
      editData.imageRef.current = rotatedImg;
    });
  };

  return <button className="btn" id="rotate-btn"
  title={GetText("rotate")}
  onClick={startRotate} />;
}
