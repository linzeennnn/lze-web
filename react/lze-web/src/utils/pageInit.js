// app公共函数
import { InitRequest } from "../store/request";
import { CheckLang, InitEnv } from "./common";
import { InitPageSession } from "../utils/pageSession";
import {InitTheme } from "./theme";
import DisableZoom  from "./private/disableZoom";
import { getEnv } from "../store/common";
export function PageInit(type){
  InitRequest()
  InitPageSession()
  InitEnv(type)
  DisableZoom()
  CheckLang()
        sessionStorage.setItem('app', 'true');
        sessionStorage.setItem('lze-web', 'true');
InitTheme(getEnv().type)
}