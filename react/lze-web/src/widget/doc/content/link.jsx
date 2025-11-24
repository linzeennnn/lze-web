import { notify } from "../../../components/notify"
import { GetText, useGlobal,loadPage } from "../global"

export default function Link({name}){
    return <button className="btn link-btn" 
    title={GetText("get_link")}
    onClick={(e)=>{
      e.stopPropagation();
      getLink(name)}}></button>
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
        copy(encodeURI(window.location.origin+"/"+text))
      })
      .catch(err => {
        console.error("Fetch failed:", err);
      })
      .finally(() => {
        loadPage(false);
      });
    }
  function copy(text) {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";  
    textarea.style.opacity = "0";      
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    try {
      document.execCommand("copy");
      notify(GetText("copy")+" "+GetText("success"));
    } catch (err) {
      notify(GetText("error"), err);
    }
  
    document.body.removeChild(textarea);
  }