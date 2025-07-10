import { useGlobal ,Upload,list} from "../global";
import { WinBg } from "../../public";
import {notify} from "../../public/notify";
export default function UploadWin() {
    const setGlobal=useGlobal.setState
    const upload=useGlobal((state) => state.upload); 
    const nowPath=useGlobal((state) => state.nowPath); 
    const fileChange=(e)=>{
        setGlobal({upload:{
            ...upload,
            status:true,
            win:false
        }})
        const fileArr=Array.from(e.target.files);
        const len=fileArr.length;
        let uploadData={
            totalSize:0,
            sendSize:0
        }
        fileArr.forEach((file,i)=>{
           uploadData.totalSize+=file.size
           
        })
        
        fileArr.forEach((file,i)=>{
            Upload(file,uploadData) 
        })
    }
    return(
        <>
    {upload.win?(<div id="upload-opt">
        <button id="close-upload" className="btn"
            title="关闭" onClick={()=>{
        setGlobal({upload:{
            ...upload,
            win:false
        }})}}
            ></button>
            <input id="upFile" style={{display:"none"}} 
            type="file" multiple onChange={fileChange}/>
            <label id="upload-file" className="btn upload-opt-btn"
            title="上传文件" htmlFor="upFile"
            ></label>
            <button id="upload-dir" className="btn upload-opt-btn"
            title="上传文件夹"
            ></button>
    </div>):null}
    <WinBg showBg={upload.win} />
    {upload.status?(<div id="uploading-back"></div>):null}
        </>
    )
}