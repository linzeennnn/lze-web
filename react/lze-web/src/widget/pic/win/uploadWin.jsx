import { Icon } from "../../../utils/icon";
import { useUploadStore } from '../../../store/upload'
export default function UploadWin() {
       const upload=useUploadStore((state)=>state.upload)
       const dragWin=useUploadStore((state)=>state.upload.drag)
       
    return(
        <>
        <div id="drag-win"
        style={dragWin?{display:"flex"}:{display:"none"}}
        >
            <div>{Icon("upload")}</div>
        </div>
       {upload.status&&<div id="uploading" className="bg-enable"></div>}
        </>
    )
}