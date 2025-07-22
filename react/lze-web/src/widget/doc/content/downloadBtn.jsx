import { useGlobal } from "../global"

export default function DownloadBtn({fileMes}){
    const global=useGlobal.getState()
   
    return (
        <button className="down-btn btn" title={"下载:"+fileMes[0]}
        onClick={((e)=>{
            e.stopPropagation();
            if(fileMes[1]==="file"||fileMes[1]==="file_link"){
                window.location.href = 
                global.docUrl+"download_file?file_path="+global.nowPath+"/"+fileMes[0]+
                "&token="+global.token+"&user="+global.userName
            }
            else{
                ZipDir(fileMes[0])
            }
        })}
        ></button>
    )
}

// 压缩目录
function ZipDir(fileName){
  loadPage(true)
  const global = useGlobal.getState();
  const token =global.token
  const user = global.userName
        fetch(global.docUrl+"zip_folder",{
        method: "POST",
        headers: {
        "Content-Type": "application/json" 
    },
    body: JSON.stringify({ folder_path: global.nowPath+fileName ,token,user}) 
      })
      .then(response => {
        if (response.status === 401) {
          notify("无下载文件夹权限")
          pageloading(0)
          throw new Error('未授权访问');
        }
        return response.text();  
      })
      .then(text => {
      window.location.href = global.docUrl+"down_zip?downToken="+text
      notify("开始下载,请在10秒内下载")
     loadPage(false)
    })
    }