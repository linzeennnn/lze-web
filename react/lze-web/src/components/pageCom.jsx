// app公共函数
import { GetTheme } from "./getTheme";
export function PageCom(setGlobal,type){
if(sessionStorage.getItem('home')!="true"){
  window.location.href =  window.location.origin;
}
const lang=JSON.parse(sessionStorage.getItem('lang'))
setGlobal({langList:lang})
document.title=lang[type]
        sessionStorage.setItem('app', 'true');
 const theme=GetTheme(type)
 setGlobal({
    theme:theme
  })
}