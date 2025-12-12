// app公共函数
import { CheckLang } from "../utils/common";
import { GetTheme } from "./getTheme";
import { DisableZoom } from "./pub";
export function PageCom(setGlobal,type){
  DisableZoom()
  CheckLang()
        sessionStorage.setItem('app', 'true');
 const theme=GetTheme(type)
 setGlobal({
    theme:theme
  })
}