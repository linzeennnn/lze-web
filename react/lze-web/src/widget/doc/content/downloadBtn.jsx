import { useGlobal ,loadPage} from "../global"
import { GetText } from '../../../utils/common';
import { notify } from "../../../utils/common";
import { confirmWin } from "../../../utils/common";
import { Api } from "../../../utils/request";
import { getUrl } from "../../../store/request";
import { Icon } from "../../../utils/icon";
export default function DownloadBtn({fileMes}){
    const global=useGlobal.getState()
   
    return (
        <button className="down-btn btn" title={GetText("download")+":"+fileMes[0]}
        onClick={((e)=>{
            e.stopPropagation();
            if(fileMes[1]==="file"||fileMes[1]==="file_link"){
              DownLoadFile(global.nowPath+"/"+fileMes[0],true)
            }
            else{
              DownLoadFile(global.nowPath+"/"+fileMes[0],false)
            }
        })}
        >{Icon("download")}</button>
    )
}
// 下载文件
async function DownLoadFile(path,isFile){
  if (!await confirmWin.normal(GetText("are_you_sure"))){
    return
  }
  const global = useGlobal.getState();
  let apiType =(isFile?"download_file":"download_folder")
  const apiUrl="doc/"+apiType
    Api.post({
      api: apiUrl,
      notice:true,
      body: {path},
      success:(data)=>{
        DownLoad(getUrl() + apiUrl+"/"+data);
      }
    })
}
// 下载操作
function DownLoad(url){
  console.log(url);
  
const a = document.createElement("a");
  a.href = url;
  a.download = "";  // 让浏览器根据 url 自动决定文件名
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}