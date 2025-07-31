// app公共函数
import { GetTheme } from "./getTheme";
export function PageCom(setGlobal,type){
if(sessionStorage.getItem('home')!="true"){
  window.location.href =  window.location.origin;
}

setGlobal({langList:
 JSON.parse(sessionStorage.getItem('lang'))
})
        sessionStorage.setItem('app', 'true');
 const theme=GetTheme(type)
 setGlobal({
    theme:theme
  })
}