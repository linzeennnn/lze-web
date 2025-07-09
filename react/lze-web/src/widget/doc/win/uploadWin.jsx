import { useGlobal } from "../global";
import { WinBg } from "../../public";
import {notify} from "../../public/notify";
export default function UploadWin() {
    const setGlobal=useGlobal.setState
    const upload=useGlobal((state) => state.upload); 
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
            <button id="upload-file" className="btn upload-opt-btn"
            title="上传文件" onClick={()=>{upload_ile()}}
            ></button>
            <button id="upload-dir" className="btn upload-opt-btn"
            title="上传文件夹"
            ></button>
    </div>):null}
    <WinBg showBg={upload.win} />
    {upload.status?(<div id="uploading-back"></div>):null}
        </>
    )
}
function upload_ile(){
    var files = fileInput.files; 
    if (files.length === 0) {
        notify("请先选择文件");
        return;
    }
    const setGlobal=useGlobal.setState
    const upload = useGlobal.getState().upload;
    setGlobal({upload:{
            ...upload,
            status:true,
            win:false
        }})
    var chunkSize = getChunkSize(files[0].size);
    var totalFiles = files.length;
    var totalChunks = Array(totalFiles).fill(0); 
    var currentChunks = Array(totalFiles).fill(0); 
    
}
// 获取块大小
function getChunkSize(fileSize) {
    const mb=1024*1024
    if (fileSize <= 1024 * mb) {
        return 10 * mb;
    } else if (fileSize <= 5120 * mb) {
        return 50 * mb;
    } else {
        return 100 * mb;
    }
}