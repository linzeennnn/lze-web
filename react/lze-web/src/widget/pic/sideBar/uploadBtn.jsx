import { list, useGlobal } from "../global";
import { DeepClone, GetText } from "../../../utils/common";
import { Icon } from "../../../utils/icon";
import { useEffect, useRef } from "react";
import { getUploadFileList, useUploadStore } from "../../../store/upload";
import { DragLeave, DragOver, Drop, Upload } from "../../../utils/upload";
import { getFileCache, getNowPath, setFileCache } from "../../../store/CacheList";
export default function UploadBtn() {
    const fileRef = useRef(null);
       const  uploadChange=(e)=>{
           useGlobal.setState({uploadWin:false})
           Upload(e.target.files)
       }
     useEffect(() => {
           useUploadStore.getState().setUploadMsg({
           apiList:["pic/upload",""],
           success:()=>{
            const newFileItems=getUploadFileList()
            const cache=DeepClone(getFileCache())
            const tmpFileList=cache.fileList
            const newFileList=newFileItems.concat(tmpFileList[cache.current])
            tmpFileList[cache.current]=newFileList
            setFileCache({...cache,fileList:tmpFileList})
            if (fileRef.current) fileRef.current.value = null;
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
  
    return (
        <>
             <input id="upFile" style={{display:"none"}} 
            type="file" multiple onChange={(e) => uploadChange(e)}/>
            <label className="btn side-btn" title={GetText("upload_media")}
            htmlFor="upFile"
            >{Icon("upload")}</label>
            </>
    )
}