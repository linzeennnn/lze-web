import { Canvas, FabricImage, Rect } from "fabric";
import { useEffect, useRef, useState } from "react";
import { useGlobal } from "../global";
import { GetCssVar } from "../../../utils/common";

export default function EditWin() {
  const editWin = useGlobal((state) => state.editWin);
  if (!editWin.status) return null;

  const [editMode, setEditMode] = useState(false);

  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const cropRectRef = useRef(null);

  /* 初始化 canvas + 图片 */
  useEffect(() => {
    (async () => {
      const img = await FabricImage.fromURL(editWin.url, {
        crossOrigin: "anonymous",
      });

      const imgWidth = img.width;
      const imgHeight = img.height;

      const maxWidth = window.innerWidth * 0.8;
      const maxHeight = window.innerHeight * 0.8;

      // 宽度优先，高度兜底
      let scale = maxWidth / imgWidth;
      if (imgHeight * scale > maxHeight) {
        scale = maxHeight / imgHeight;
      }

      const displayWidth = imgWidth * scale;
      const displayHeight = imgHeight * scale;

      const canvas = new Canvas("edit-win", {
        width: displayWidth,
        height: displayHeight,
      });

      canvasRef.current = canvas;

      img.set({
        originX: "center",
        originY: "center",
        left: canvas.width / 2,
        top: canvas.height / 2,
        scaleX: scale,
        scaleY: scale,
        selectable: false,
        evented: false,
      });

      imageRef.current = img;
      canvas.add(img);
      canvas.requestRenderAll();
    })();

    return () => {
      canvasRef.current?.dispose();
      canvasRef.current = null;
      imageRef.current = null;
      cropRectRef.current = null;
    };
  }, [editWin.url]);

  /* 开始裁剪 */
  const startCrop = () => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img || editMode) return;

    setEditMode(true);

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
  const canvas = canvasRef.current;
  const img = imageRef.current;
  const rect = cropRectRef.current;
  if (!canvas || !img || !rect) return;

  const scaleX = img.scaleX || 1;
  const scaleY = img.scaleY || 1;

  const imgWidth = img.width;
  const imgHeight = img.height;

  // 计算裁剪框在图片内部坐标
  const imgLeftTopX = img.left - (imgWidth * scaleX) / 2;
  const imgLeftTopY = img.top - (imgHeight * scaleY) / 2;

  let cropLeft = (rect.left - imgLeftTopX) / scaleX;
  let cropTop = (rect.top - imgLeftTopY) / scaleY;
  let cropWidth = (rect.width * rect.scaleX) / scaleX;
  let cropHeight = (rect.height * rect.scaleY) / scaleY;

  // 边界限制
  if (cropLeft < 0) {
    cropWidth += cropLeft; // 缩小宽度
    cropLeft = 0;
  }
  if (cropTop < 0) {
    cropHeight += cropTop; // 缩小高度
    cropTop = 0;
  }
  if (cropLeft + cropWidth > imgWidth) {
    cropWidth = imgWidth - cropLeft;
  }
  if (cropTop + cropHeight > imgHeight) {
    cropHeight = imgHeight - cropTop;
  }

  // 临时 canvas 渲染裁剪后的图片
  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = cropWidth;
  tempCanvas.height = cropHeight;
  const ctx = tempCanvas.getContext("2d");

  const imageElement = img.getElement();
  ctx.drawImage(
    imageElement,
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
      imageRef.current = croppedImg;
    }
  );

  canvas.remove(rect);
  cropRectRef.current = null;
  setEditMode(false);
};



  /* 取消裁剪 */
  const cancelCrop = () => {
    const canvas = canvasRef.current;
    const rect = cropRectRef.current;
    if (!canvas || !rect) return;

    canvas.remove(rect);
    cropRectRef.current = null;
    setEditMode(false);
    canvas.requestRenderAll();
  };

  return (
    <div className="bg-enable">
      <canvas id="edit-win" />

      <div className="tool-bar">
        <button className="btn" id="undo-btn" />
        <button className="btn" id="crop-btn" onClick={startCrop} />
        <button className="btn" id="paint-btn" />
        <button className="btn" id="rotate-btn" />
        <button className="btn" id="save-btn" />

        {editMode && (
          <>
            <button className="btn" id="yes-btn" onClick={applyCrop} />
            <button className="btn" id="no-btn" onClick={cancelCrop} />
          </>
        )}
      </div>
    </div>
  );
}
