export default function Upload(){
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
    return(
        <>
        <input id="upFile" style={{display:"none"}} 
            type="file" multiple onChange={(e) => uploadChange(e)}/>
            <label className="btn side-btn" id="upload-btn" title="上传文本" 
            htmlFor="upFile"
            ></label>
        </>
    )
}