// app公共函数
import { InitRequest } from "../store/request";
import { CheckLang } from "../utils/common";
import { GetTheme } from "./getTheme";
import { DisableZoom } from "./pub";
export function PageCom(setGlobal,type){
  InitRequest
  DisableZoom()
  CheckLang()
        sessionStorage.setItem('app', 'true');
 const theme=GetTheme(type)
 setGlobal({
    theme:theme
  })
}