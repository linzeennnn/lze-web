import { FabricImage, Rect } from "fabric";
import { useRef, useState } from "react";
import { GetCssVar } from "../../../../utils/common";
export default function Crop({editData}){
    
      const [cropMode, setCropMode] = useState(false);
    
      const cropRectRef = useRef(null);
    
    
      /* 开始裁剪 */
      const startCrop = () => {
        editData.setEditMode(true);
        editData.setRunNo(cancelCrop);
        editData.setRunYes(applyCrop);
        const canvas = editData.canvasRef.current;
        const img = editData.imageRef.current;
        if (!canvas || !img || cropMode) return;
    
        setCropMode(true);
    
        const rect = new Rect({
          width: img.getScaledWidth() * 0.6,
          height: img.getScaledHeight() * 0.6,
          left: img.left,
          top: img.top,
          originX: "center",
          originY: "center",
          fill: GetCssVar("bg_color"),
          stroke: GetCssVar("base_color"),
          strokeWidth: 2,
          hasRotatingPoint: false,
          lockRotation: true,
    
          cornerColor: GetCssVar("base_color"),
          transparentCorners: false,
        });
    
        cropRectRef.current = rect;
        canvas.add(rect);
        canvas.setActiveObject(rect);
        canvas.requestRenderAll();
      };
    
      /* 确认裁剪 */
const applyCrop = () => {
  const canvas = editData.canvasRef.current;
  const img = editData.imageRef.current;
  const rect = cropRectRef.current;
  if (!canvas || !img || !rect) return;

  const imgEl = img.getElement();
  const scaleX = img.scaleX || 1;
  const scaleY = img.scaleY || 1;

  // 获取裁剪框在 canvas 上的边界
  const rectBound = rect.getBoundingRect(true); // true 表示考虑缩放和旋转
  const imgBound = img.getBoundingRect(true);

  // 相对于图片左上角的坐标
  const cropLeft = (rectBound.left - imgBound.left) / scaleX;
  const cropTop = (rectBound.top - imgBound.top) / scaleY;
  const cropWidth = rectBound.width / scaleX;
  const cropHeight = rectBound.height / scaleY;

  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = cropWidth;
  tempCanvas.height = cropHeight;
  const ctx = tempCanvas.getContext("2d");

  ctx.drawImage(
    imgEl,
    cropLeft,
    cropTop,
    cropWidth,
    cropHeight,
    0,
    0,
    cropWidth,
    cropHeight
  );

  const croppedDataUrl = tempCanvas.toDataURL();
  FabricImage.fromURL(croppedDataUrl, { crossOrigin: "anonymous" }).then(
    (croppedImg) => {
      canvas.clear();
      canvas.setDimensions({ width: cropWidth, height: cropHeight });

      croppedImg.set({
        originX: "center",
        originY: "center",
        left: cropWidth / 2,
        top: cropHeight / 2,
        selectable: false,
        evented: false,
      });

      canvas.add(croppedImg);
      canvas.requestRenderAll();
      editData.imageRef.current = croppedImg;
    }
  );

  canvas.remove(rect);
  cropRectRef.current = null;
  setCropMode(false);
  editData.setEditMode(false);
};

    
    
    
      /* 取消裁剪 */
      const cancelCrop = () => {
        const canvas = editData.canvasRef.current;
        const rect = cropRectRef.current;
        if (!canvas || !rect) return;
    
        canvas.remove(rect);
        cropRectRef.current = null;
        setCropMode(false);
        editData.setEditMode(false);
        canvas.requestRenderAll();
      };
    
      return (
            <button className="btn" id="crop-btn" onClick={startCrop} />
      );
}