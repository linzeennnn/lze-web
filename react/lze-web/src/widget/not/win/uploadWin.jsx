import { Icon } from "../../../utils/icon";
import { useGlobal} from "../global";
export default function UploadWin() {
    const dragWin=useGlobal((state) => state.dragWin); 
        const upload=useGlobal((state) => state.upload); 
    return(
        <>
        <div id="drag-win"
        style={dragWin?{display:"flex"}:{display:"none"}}
        >{Icon("upload")}
            <div></div>
        </div>
       {upload.status&&<div id="uploading" className="bg-enable">
        <div className="loading" id="not-upload"></div>
        <span id="upload-percent">{upload.percent}</span>
        </div>}
        </>
    )
}