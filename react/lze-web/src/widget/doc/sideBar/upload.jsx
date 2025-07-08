import { useState } from "react"
import { useGlobal } from "../global"

export default function Upload(){
    const [uploading, setUploading] = useState(false)
    const [uploadWin,setUploadWin]=useState(false)
    const setGlobal = useGlobal((state) => state.setGlobal);
    return (
        <>
    <button id="upload" className="btn side-btn"
    title="上传" onClick={()=>{
        setGlobal({showBg:true})
        setUploadWin(true)}}
    ></button>
    {uploadWin?<div id="upload-opt">
   <div id="loading-win"> <div id="upload-box">
        <div id="progress"></div>
    </div>
    <span id="upload-mes">
        当前上传文件:xxxx  上传进度:
    </span></div>
    {/* <button id="close-upload" className="btn"
    title="关闭" onClick={()=>{setUploadWin(false)}}
    ></button>
    <button id="upload-file" className="btn upload-opt-btn"
    title="上传文件"
    ></button>
    <button id="upload-dir" className="btn upload-opt-btn"
    title="上传文件夹"
    ></button> */}
    </div>:null}
    </>
)
}
function upload_ile(){
    
}