import { useGlobal } from "../global";
import { GetText } from '../../../utils/common';
import { WinBg } from "../../../components/winBg";
import { FillIcon, Icon } from "../../../utils/icon";
import { Upload,Drop,DragOver,DragLeave } from "../../../utils/upload";
import { getFileCache, setFileCache } from "../../../store/CacheList";
import { getUploadFileList,useUploadStore } from "../../../store/upload";
import { useEffect, useRef } from "react";
export default function UploadWin() {
    const fileRef = useRef(null);
    const dirRef = useRef(null);
    const setGlobal=useGlobal.setState
    const upload=useUploadStore((state)=>state.upload)
    const uploadWin=useGlobal((state) => state.uploadWin);
    const dragWin=useUploadStore((state)=>state.upload.drag)
    const  uploadChange=(e)=>{
        useGlobal.setState({uploadWin:false})
        Upload(e.target.files)
    }
  useEffect(() => {
        useUploadStore.getState().setUploadMsg({
        apiList:["doc/upfile","doc/updir"],
        success:()=>{
                const newFileItems=getUploadFileList()
                const cache=structuredClone(getFileCache())
                const tmpFileList=cache.fileList
                const newFileList=newFileItems.concat(tmpFileList[cache.current])
                tmpFileList[cache.current]=newFileList
                setFileCache({...cache,fileList:tmpFileList})
                if (fileRef.current) fileRef.current.value = null;
                if (dirRef.current) dirRef.current.value = null;
            }
    })
    window.addEventListener('dragover', DragOver);
    window.addEventListener('dragleave', DragLeave);
    window.addEventListener('drop', Drop);
    return () => {
      window.removeEventListener('dragover', DragOver);
      window.removeEventListener('dragleave', DragLeave);
      window.removeEventListener('drop', Drop);
    };
  }, []);
    return(
        <>
    {uploadWin?(<div id="upload-opt">
        <button id="close-upload" className="btn"
            title={GetText("close")} onClick={()=>{
        setGlobal({uploadWin:false})}}
            >{Icon("no")}</button>
            <input
            ref={fileRef}
            id="upFile" style={{display:"none"}} 
            type="file" multiple onChange={(e) => uploadChange(e)}/>
            <input
            ref={dirRef}
            type="file" name="folder" style={{display:"none"}}
            webkitdirectory="true" mozdirectory="true" directory="true" multiple
            onChange={(e) => uploadChange(e,)}   id="upDir" 
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