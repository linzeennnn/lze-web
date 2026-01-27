import { showNotify } from "../store/notify";
import { getLang, setLang } from "../store/lang";
import { useConfirmStore } from "../store/confirm";
import { setLoading } from "../store/loading";
import { AsyncApi } from "./request";
import { setMenuOption, useMouseMenuStore } from "../store/mouseMenu";
import { GetPageSession } from "./pageSession";
import { setEnv } from "../store/common";
// /////////////////通知////////////////
export const notify = {
  normal: (text) => showNotify.normal(text),
  err: (text) => showNotify.err(text)
};
////////////////////确认框///////////
export const confirmWin = {
  normal: (text) => {
    return new Promise((resolve) => {
      useConfirmStore.getState().normal(text, resolve);
    });
  },

  err: (text) => {
    return new Promise((resolve) => {
      useConfirmStore.getState().err(text, resolve);
    });
  }
};
////////////////复制//////////////////
export function copy(text) {
  navigator.clipboard.writeText(text)
    .then(() => {
          notify.normal(GetText("copy")+" "+GetText("success"));
    })
    .catch(err => {
      console.error(err);
    });
}
///////////////加载页面/////////////
export function loadingPage(show){
  setLoading(show)
}
//////////////获取文本//////////////////
export function GetText(key) {
  const currentLang = getLang();
  return currentLang.list?.[key] ?? key;
}

///////////////////判空逻辑独立成函数 ///////////////////
export async function CheckLang() {
  let remote=(sessionStorage.getItem('lze-web')!='true');
  let currentLang = GetLocalLangType();
  // 缺语言包 → 拉取
  if (!currentLang.list || Object.keys(currentLang.list).length === 0||remote) {
    const tmpLang = await GetLangList(currentLang);
    setLang(tmpLang);
  }else{
  setLang(currentLang);
  }
  
}
///////////////////  拉取语言包 ///////////////////
export async function GetLangList(lang) {
if(!lang){
  lang = GetLocalLangType();
}
const data= await AsyncApi.post({
    api: "lang",
    body: { lang: lang.type }
})
  if(data){
      lang.list = (data && typeof data === "object") ? data : {};
      localStorage.setItem("langList", JSON.stringify(lang.list));
  }else{
      lang.list = {};
  }
  return lang
}

/////////////////// 保留语言类型逻辑 ///////////////////
export function GetLocalLangType() {
  const langList = ['en', 'zh'];
  let sysLang = (navigator.language || navigator.userLanguage).split('-')[0];
  if (!langList.includes(sysLang)) sysLang = 'en';

  // 用户选择
  let lang = localStorage.getItem('lang');
  let type = (!lang || lang === 'system') ? sysLang : lang;

  let list = JSON.parse(localStorage.getItem('langList') || '{}');

  return { userSelect: lang || 'system', type, list };
}
/////////////////////设置右键菜单的选项/////////////////////
export function AddMouseMenu(options) {
  const setMenuOpt = useMouseMenuStore.getState().setMenuOpt;
  Object.entries(options).forEach(([key, value]) => {
    // 调用 store 的 setMenuOpt 方法，支持增量合并
    setMenuOpt(key, value);
  });
}
/////////////////获取环境变量的类型////////
export function InitEnv(type){
  let source=GetPageSession()[type].inner.source
    setEnv({
      type:(source==""?type:source),
      root:""
    })
}
///////////////获取css变量/////////
export function GetCssVar(name) {
  if (!name) return "";

  // 允许传 name 或 --name
  const varName = name.startsWith("--") ? name : `--${name}`;

  return getComputedStyle(document.documentElement)
    .getPropertyValue(varName)
    .trim();
}
