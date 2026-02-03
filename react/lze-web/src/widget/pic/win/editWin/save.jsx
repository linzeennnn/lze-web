import { confirmWin, GetExt, GetText } from "../../../../utils/common"
import { Icon } from "../../../../utils/icon";
import { closeEditWin, Upload, useGlobal } from "../../global";
import EditWin from "./editWin";

export default function Save({editData}){

  const editWin = useGlobal((state) => state.editWin);
  const ext = GetExt(editData.fileName); // png / jpg / webp
  const { mime, quality} = getCanvasExportOptions(ext);
const saveImage = async () => {
  const fabricCanvas = editData.canvasRef.current;

// 保证尺寸
const w = fabricCanvas.getWidth();
const h = fabricCanvas.getHeight();

if (w === 0 || h === 0) {
  console.error("Fabric Canvas width/height is 0");
  return;
}

// 生成 base64
const dataUrl = fabricCanvas.toDataURL({
  format: mime.split("/")[1], // 'png' / 'jpeg' / 'webp'
  quality: quality || undefined,
});

// 转 Blob
const blob = await (await fetch(dataUrl)).blob();

const file = new File([blob], editData.fileName, { type: mime });
const uploadData = { totalSize: file.size, sendSize: 0 };
useGlobal.setState({
  editWin:{...editWin,
    newSaveImg:editData.fileName
  }
})
Upload(file, uploadData, true);
closeEditWin();

};

return(<button className="btn"
  onClick={async ()=>{
    if (!(await confirmWin.normal(GetText("are_you_sure"))))
      return
    saveImage()
  }}
  title={GetText("save")}>{Icon("save")}</button>)
}
function getCanvasExportOptions(ext) {
  ext = ext.toLowerCase();

  switch (ext) {
    case "jpg":
    case "jpeg":
      return {
        mime: "image/jpeg",
        quality: 0.9
      };

    case "webp":
      return {
        mime: "image/webp",
        quality: 0.9
      };

    case "png":
    default:
      return {
        mime: "image/png",
        quality: undefined
      };
  }
}
