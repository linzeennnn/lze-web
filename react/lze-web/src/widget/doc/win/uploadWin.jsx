import { useGlobal ,UploadPermit, list} from "../global";
import { GetText } from '../../../utils/common';
import { WinBg } from "../../../components/winBg";
import { FillIcon, Icon } from "../../../utils/icon";
import { Upload } from "../../../utils/upload";
import { getNowPath } from "../../../store/CacheList";
import { closeUpload, openUpload } from "../../../store/upload";
export default function UploadWin() {
    const setGlobal=useGlobal.setState
    const upload=useGlobal((state) => state.upload); 
    const dragWin=useGlobal((state) => state.dragWin);
    const  uploadChange=async(e,type)=>{
        setGlobal({upload:{
            ...upload,
            status:true,
            win:false
        }})
        const permitted = await UploadPermit(type);
        if (!permitted) {
        return;
        }
        openUpload()
        Upload({
            files:e.target.files,
            apiUrl:"doc/upload_file",
            success:()=>{
                    list(getNowPath())
            }
        })
         e.target.value = null;
    }
    return(
        <>
    {upload.win?(<div id="upload-opt">
        <button id="close-upload" className="btn"
            title={GetText("close")} onClick={()=>{
        setGlobal({upload:{
            ...upload,
            win:false
        }})}}
            >{Icon("no")}</button>
            <input id="upFile" style={{display:"none"}} 
            type="file" multiple onChange={(e) => uploadChange(e, "file")}/>
            <input type="file" name="folder" style={{display:"none"}}
            webkitdirectory="true" mozdirectory="true" directory="true" multiple
            onChange={(e) => uploadChange(e, "dir")}   id="upDir" 
            />
            <label id="upload-file" className="btn upload-opt-btn"
            title={GetText("upload_file")} htmlFor="upFile"
            >{FillIcon("file")}</label>
            <label id="upload-dir" className="btn upload-opt-btn"
            title={GetText("upload_folder")}  htmlFor="upDir"
            >{FillIcon("doc")}</label>
    </div>):null}
    <WinBg showBg={upload.win} />
    {upload.status?(<div id="uploading-back"></div>):null}
        <div id="drag-win"
        style={dragWin?{display:"flex"}:{display:"none"}}
        >
            <div>{Icon("upload")}</div>
        </div>
        </>
    )
}