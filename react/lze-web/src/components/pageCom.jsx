// app公共函数
import { GetTheme } from "./getTheme";
export function PageCom(setGlobal,type){
const lang=JSON.parse(localStorage.getItem('langList'))
setGlobal({langList:lang})
document.title=lang[type]
        sessionStorage.setItem('app', 'true');
 const theme=GetTheme(type)
 setGlobal({
    theme:theme
  })
}