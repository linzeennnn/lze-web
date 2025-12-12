import { useGlobal ,loadPage} from "../global"
import { GetText } from '../../../utils/common';
import { notify } from "../../../utils/common";
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
        ></button>
    )
}
// 下载文件
function DownLoadFile(path,isFile){
  if (!confirm(GetText("are_you_sure"))){
    return
  }
  const global = useGlobal.getState();
  loadPage(true);
  const body = { path };
  let api =(isFile?"download_file":"download_folder")
  fetch(global.docUrl + api, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "authorization": "Bearer " + global.token,
    },
    body: JSON.stringify(body)
  })
  .then(res => {
    if(res.ok){
      return res.text(); // 返回 Promise
    } else {
      if(res.status == 401){
        notify.err(GetText("no_per"));
      } else {
        notify.normal(GetText("error") + ":" + res.status);
      }
      throw new Error("HTTP error " + res.status); // 抛出错误阻止继续执行
    }
  })
  .then(text => {
    DownLoad(global.docUrl + api+"/"+text); 
  })
  .catch(err => {
    console.error("Fetch failed:", err);
  })
  .finally(() => {
    loadPage(false);
  });
}
// 下载操作
function DownLoad(url){
const a = document.createElement("a");
  a.href = url;
  a.download = "";  // 让浏览器根据 url 自动决定文件名
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}