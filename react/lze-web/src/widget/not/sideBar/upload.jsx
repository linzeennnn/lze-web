import { useGlobal,Upload, GetText } from "../global";
export default function UploadBtn(){
    const setGlobal = useGlobal.setState;
    const upload = useGlobal((state)=> state.upload);
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
             e.target.value = null;
        }
    return(
        <>
        <input id="upFile" style={{display:"none"}} 
            type="file" multiple onChange={(e) => uploadChange(e)}/>
            <label className="btn side-btn" id="upload-btn" title={GetText("upload")}
            htmlFor="upFile"
            ></label>
        </>
    )
}