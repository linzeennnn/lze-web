import { useGlobal } from "../global"

export default function Link({name}){
    return <button className="btn link-btn" onClick={()=>{getLink(name)}}></button>
}
// 获取直链
function getLink(name){
   const global=useGlobal.getState()
    let path=global.nowPath+"/"+name    
    let url=global.docUrl+"link"
    const body={path}
    fetch(url, {
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
        DownLoad(global.docUrl + api+"/"+text); 
      })
      .catch(err => {
        console.error("Fetch failed:", err);
      })
      .finally(() => {
        loadPage(false);
      });
    }