import { useGlobal,ZipDir } from "../global"

export default function DownloadBtn({fileMes}){
    const global=useGlobal.getState()
   
    return (
        <button className="down-btn btn" title={"下载:"+fileMes.name}
        onClick={((e)=>{
            e.stopPropagation();
            if(fileMes.type==="file"||fileMes.type==="file_link"){
                window.location.href = 
                global.docUrl+"download_file?file_path="+global.nowPath+"/"+fileMes.name+
                "&token="+global.token+"&user="+global.userName
            }
            else{
                ZipDir(fileMes.name)
            }
        })}
        ></button>
    )
}