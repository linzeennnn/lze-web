import { Canvas, FabricImage, Rect } from "fabric";
import { useEffect, useRef, useState } from "react";
import { closeEditWin, useGlobal } from "../../global";
import Crop from "./crop";
import Paint from "./paint";
import Rotate from "./rotate";
import Flip from "./flip";
import { GetText } from "../../../../utils/common";
import Save from "./save";
import { Icon } from "../../../../utils/icon";
export default function EditWin() {
  const editWin = useGlobal((state) => state.editWin);
  const pageNum= useGlobal((state) => state.pageNum);
  const picList=useGlobal((state) => state.imgList)[pageNum-1];
  const [editMode, setEditMode] = useState(false);
  const runNo= useRef(null); 
  const runYes= useRef(null);

  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const cropRectRef = useRef(null);
  const editData={
    editMode,
    setEditMode,
    setRunNo: fn => (runNo.current = fn),
    setRunYes: fn => (runYes.current = fn),
    canvasRef,
    imageRef,
    fileName: picList?picList[editWin.index]:"",
  }
  /* 初始化 canvas + 图片 */
  useEffect(() => {
    if (editWin.status){
    (async () => {
      const img = await FabricImage.fromURL(editWin.url+picList[editWin.index], {
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
    }
    };
  }, [editWin.url,editWin.status]);
  if (!editWin.status) return null;

  return (
    <div className="bg-enable" id="edit-back">
      <button className="btn media-btn media-widget close-media" 
      onClick={()=>{closeEditWin()}}
      >{Icon("no")}</button>
      <canvas id="edit-win" />

      <div className="tool-bar">
        <Paint editData={editData}/>

        {editMode ? (
          <>
            <button className="btn" title={GetText("confirm")} onClick={() => runYes.current?.()} >
              {Icon("yes")}
            </button>
            <button className="btn" title={GetText("cancel")} onClick={() => runNo.current?.()} >
              {Icon("no")}
            </button>

          </>
        ):
        (<>
        <Crop editData={editData}/>
        <Rotate editData={editData}/>
        <Flip editData={editData}/>
        <Save editData={editData}/>
        </>
        )
        }
      </div>
    </div>
  );
}
