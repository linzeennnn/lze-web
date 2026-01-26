// app公共函数
import { InitRequest } from "../store/request";
import { CheckLang } from "./common";
import { InitPageSession } from "../utils/pageSession";
import {InitTheme } from "./theme";
import DisableZoom  from "./private/disableZoom";
export function PageInit(type){
  InitRequest()
  InitPageSession()
  DisableZoom()
  CheckLang()
        sessionStorage.setItem('app', 'true');
        sessionStorage.setItem('lze-web', 'true');
InitTheme(type)
}