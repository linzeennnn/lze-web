import { useGlobal ,UploadPermit, list, DragOver, DragLeave, Drop} from "../global";
import { GetText } from '../../../utils/common';
import { WinBg } from "../../../components/winBg";
import { FillIcon, Icon } from "../../../utils/icon";
import { Upload } from "../../../utils/upload";
import { getFileCache, getNowPath, setFileCache } from "../../../store/CacheList";
import { closeUpload, getUploadFileList, openUpload, useUploadStore } from "../../../store/upload";
import { useEffect } from "react";
export default function UploadWin() {
  useEffect(() => {
    window.addEventListener('dragover', DragOver);
    window.addEventListener('dragleave', DragLeave);
    window.addEventListener('drop', Drop);
    return () => {
      window.removeEventListener('dragover', DragOver);
      window.removeEventListener('dragleave', DragLeave);
      window.removeEventListener('drop', Drop);
    };
  }, []);
    const setGlobal=useGlobal.setState
    const upload=useUploadStore((state)=>state.upload)
    const uploadWin=useGlobal((state) => state.uploadWin);
    const dragWin=useGlobal((state) => state.dragWin);
    const  uploadChange=(e,type)=>{
        useGlobal.setState({uploadWin:false})
        openUpload()
        Upload({
            files:e.target.files,
            apiUrl:"doc/"+type,
            success:()=>{
                const newFileItems=getUploadFileList()
                const cache=structuredClone(getFileCache())
                const tmpFileList=cache.fileList
                const newFileList=newFileItems.concat(tmpFileList[cache.current])
                tmpFileList[cache.current]=newFileList
                setFileCache({...cache,fileList:tmpFileList})
                e.target.value = null;
            }
        })
    }
    return(
        <>
    {uploadWin?(<div id="upload-opt">
        <button id="close-upload" className="btn"
            title={GetText("close")} onClick={()=>{
        setGlobal({uploadWin:false})}}
            >{Icon("no")}</button>
            <input id="upFile" style={{display:"none"}} 
            type="file" multiple onChange={(e) => uploadChange(e, "upfile")}/>
            <input type="file" name="folder" style={{display:"none"}}
            webkitdirectory="true" mozdirectory="true" directory="true" multiple
            onChange={(e) => uploadChange(e, "updir")}   id="upDir" 
            />
            <label id="upload-file" className="btn upload-opt-btn"
            title={GetText("upload_file")} htmlFor="upFile"
            >{FillIcon("file")}</label>
            <label id="upload-dir" className="btn upload-opt-btn"
            title={GetText("upload_folder")}  htmlFor="upDir"
            >{FillIcon("doc")}</label>
    </div>):null}
    <WinBg showBg={uploadWin} />
    {upload.status?(<div id="uploading-back"></div>):null}
        <div id="drag-win"
        style={dragWin?{display:"flex"}:{display:"none"}}
        >
            <div>{Icon("upload")}</div>
        </div>
        </>
    )
}