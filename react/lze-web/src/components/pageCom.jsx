// app公共函数
import { InitRequest } from "../store/request";
import { CheckLang } from "../utils/common";
import { InitPageSession } from "../utils/pageSession";
import { GetTheme } from "./getTheme";
import { DisableZoom } from "./pub";
export function PageCom(setGlobal,type){
  InitRequest()
  InitPageSession()
  DisableZoom()
  CheckLang()
        sessionStorage.setItem('app', 'true');
        sessionStorage.setItem('lze-web', 'true');
 const theme=GetTheme(type)
 setGlobal({
    theme:theme
  })
}