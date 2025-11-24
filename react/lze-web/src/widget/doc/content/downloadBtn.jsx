import { GetText, useGlobal ,loadPage} from "../global"
import { notify } from "../../../components/notify";
export default function DownloadBtn({fileMes}){
    const global=useGlobal.getState()
   
    return (
        <button className="down-btn btn" title={GetText("download")+":"+fileMes[0]}
        onClick={((e)=>{
            e.stopPropagation();
            if(fileMes[1]==="file"||fileMes[1]==="file_link"){
              DownLoadFile(global.nowPath+"/"+fileMes[0])
            }
            else{
                ZipDir(fileMes[0])
            }
        })}
        ></button>
    )
}
// 下载文件
function DownLoadFile(path){
  const global = useGlobal.getState();
  loadPage(true);
  const body = { path };

  fetch(global.docUrl + "download_file", {
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
        notify(GetText("no_per"));
      } else {
        notify(GetText("error") + ":" + res.status);
      }
      throw new Error("HTTP error " + res.status); // 抛出错误阻止继续执行
    }
  })
  .then(text => {
    DownLoad(global.docUrl + "download_file/"+text); // 这里才是实际文本
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
// 压缩目录
function ZipDir(fileName){
  if(confirm(GetText("are_you_sure"))){
  loadPage(true)
  const global = useGlobal.getState();
  const token =global.token
  const user = global.userName
        fetch(global.docUrl+"zip_folder",{
        method: "POST",
        headers: {
        "Content-Type": "application/json" ,
        'authorization':'Bearer ' + token,
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
      notify(GetText("down_one_minute"))
      DownLoad(global.docUrl+"down_zip?downToken="+text)
     loadPage(false)
    })}
    }