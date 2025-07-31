import { GetText, useGlobal ,loadPage} from "../global"
import { notify } from "../../../components/notify";
export default function DownloadBtn({fileMes}){
    const global=useGlobal.getState()
   
    return (
        <button className="down-btn btn" title={GetText("download")+":"+fileMes[0]}
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
        "Content-Type": "application/json" ,
        'authorization':'Bearer ' + token,
        'x-user': user
    },
    body: JSON.stringify({ folder_path: global.nowPath+"/"+fileName }) 
      })
      .then(response => {
        if (response.status === 401) {
          notify(GetText("no_per"))
          loadPage(false)
          throw new Error('err');
        }
        return response.text();  
      })
      .then(text => {
      window.location.href = global.docUrl+"down_zip?downToken="+text
      notify(GetText("down_one_minute"))
     loadPage(false)
    })
    }