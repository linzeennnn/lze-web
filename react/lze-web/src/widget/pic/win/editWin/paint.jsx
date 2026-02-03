import { useRef, useState } from "react";
import { PencilBrush,FabricImage } from "fabric";
import { GetText } from "../../../../utils/common";
import { Icon } from "../../../../utils/icon";

export default function Paint({ editData }) {
  const pathsRef = useRef([]);
  const brushRef = useRef(null);
  const [paintEdit, setPaintEdit] = useState(false);
  // UI 状态
  const [color, setColor] = useState("#ff3b3b");
  const [width, setWidth] = useState(5);

const startPaint = () => {
  const canvas = editData.canvasRef.current;
  const img = editData.imageRef.current;
  if (!canvas || !img) return;

  editData.setEditMode(true);
  setPaintEdit(true);
  canvas.isDrawingMode = true;

  if (!brushRef.current) {
    brushRef.current = new PencilBrush(canvas);
  }
  brushRef.current.color = color;
  brushRef.current.width = width;
  canvas.freeDrawingBrush = brushRef.current;

  pathsRef.current = [];

  const onPathCreated = (e) => {
    pathsRef.current.push(e.path);
  };

  canvas.on("path:created", onPathCreated);

  // 确认：合并涂鸦
  editData.setRunYes(() => {
    canvas.off("path:created", onPathCreated);
    canvas.isDrawingMode = false;

    if (pathsRef.current.length > 0) {
      // 临时 canvas 渲染
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      const ctx = tempCanvas.getContext("2d");

      // 先画原图
      const imgEl = img.getElement();
      ctx.drawImage(
        imgEl,
        0,
        0,
        img.getScaledWidth(),
        img.getScaledHeight(),
      );

      // 再画所有路径
      pathsRef.current.forEach(p => {
        p.render(ctx);
      });

      // 生成合并后的图片
      const mergedDataUrl = tempCanvas.toDataURL();
      FabricImage.fromURL(mergedDataUrl, { crossOrigin: "anonymous" }).then(
        (mergedImg) => {
          canvas.clear();
          canvas.setDimensions({ width: mergedImg.width, height: mergedImg.height });

          mergedImg.set({
            originX: "center",
            originY: "center",
            left: mergedImg.width / 2,
            top: mergedImg.height / 2,
            selectable: false,
            evented: false,
          });

          canvas.add(mergedImg);
          canvas.requestRenderAll();
          editData.imageRef.current = mergedImg;
        }
      );
    }

    pathsRef.current = [];
    editData.setEditMode(false);
    setPaintEdit(false);
  });

  // 取消：撤销涂鸦
  editData.setRunNo(() => {
    pathsRef.current.forEach(p => canvas.remove(p));
    canvas.requestRenderAll();

    canvas.off("path:created", onPathCreated);
    canvas.isDrawingMode = false;
    editData.setEditMode(false);
    setPaintEdit(false);

    pathsRef.current = [];
  });
};


  /* 实时更新画笔颜色 */
  const changeColor = (c) => {
    setColor(c);
    if (brushRef.current) {
      brushRef.current.color = c;
    }
  };

  /* 实时更新画笔粗细 */
  const changeWidth = (w) => {
    setWidth(w);
    if (brushRef.current) {
      brushRef.current.width = w;
    }
  };

  return (
    <>
    {editData.editMode && paintEdit && (
      <div className="paint-tools">
        <input
        title={GetText("color")}
          className="btn color-input"
          type="color"
          value={color}
          onChange={e => changeColor(e.target.value)}
        />
        <input
          className="range"
          type="range"
          min="1"
          max="50"
          value={width}
          onChange={e => changeWidth(+e.target.value)}
        />
      </div>
    )}
    {!editData.editMode && !paintEdit && (
      <button className="btn" title={GetText("paint")} onClick={startPaint} >{Icon("pen")}</button>
    )}
  </>
  );
}
