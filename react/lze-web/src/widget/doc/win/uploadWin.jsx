import { useGlobal ,Upload} from "../global";
import { WinBg } from "../../public";
import {notify} from "../../public/notify";
export default function UploadWin() {
    const setGlobal=useGlobal.setState
    const upload=useGlobal((state) => state.upload); 
    const fileChange=(e)=>{
        setGlobal({upload:{
            ...upload,
            status:true
        }})
        const fileArr=Array.from(e.target.files);
        fileArr.forEach((file,i)=>{
            Upload(file)
            
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