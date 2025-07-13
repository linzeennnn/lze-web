import { useGlobal,Upload } from "../global";
export default function UploadBtn() {
    const setGlobal = useGlobal.setState
    const pageNum = useGlobal((state) => state.pageNum);
    const imgPage = useGlobal((state) => state.imgPage);
    const upload=useGlobal((state) => state.upload); 
    const dragWin=useGlobal((state) => state.dragWin); 
    const nowPath=useGlobal((state) => state.nowPath); 
    const uploadChange=(e)=>{
        setGlobal({upload:{
            ...upload,
            status:true
        }})
        const fileArr=Array.from(e.target.files);
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
  
    return (
        <>
             <input id="upFile" style={{display:"none"}} 
            type="file" multiple onChange={(e) => uploadChange(e)}/>
            <label className="btn side-btn" id="upload" title="上传图片视频" 
            htmlFor="upFile"
            ></label>
            </>
    )
}