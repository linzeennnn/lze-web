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
  // 1. 优先使用现代 API (仅限 HTTPS)
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text)
      .then(() => {
        notify.normal(GetText("copy") + " " + GetText("success"));
      })
      .catch(err => {
        console.error("Modern copy failed:", err);
        fallbackCopy(text); // 如果现代 API 出错，尝试备选方案
      });
  } else {
    // 2. HTTP 环境下的备选方案
    fallbackCopy(text);
  }
}
// 备选方案：使用不可见的 textarea
function fallbackCopy(text) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position = "fixed";
  textArea.style.left = "-9999px";
  textArea.style.top = "0";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    const successful = document.execCommand('copy');
    if (successful) {
      notify.normal(GetText("copy") + " " + GetText("success"));
    } else {
      console.error("Fallback copy failed");
    }
  } catch (err) {
    console.error("Fallback copy error:", err);
  }

  document.body.removeChild(textArea);
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
// /////////获取后缀名///////
export function GetExt(filename) { 
  const parts = filename.split('.');
  return parts.length > 1 ? parts.pop().toLowerCase() : '';
}
/////////////深拷贝(为了兼容旧浏览器)////////
export function DeepClone(obj, weakMap = new WeakMap()) {
  if (obj === null || typeof obj !== 'object') return obj;

  if (weakMap.has(obj)) return weakMap.get(obj);

  if (obj instanceof Date) return new Date(obj);
  if (obj instanceof RegExp) return new RegExp(obj);

  const result = Array.isArray(obj)
    ? []
    : Object.create(Object.getPrototypeOf(obj));

  weakMap.set(obj, result);

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      result[key] = DeepClone(obj[key], weakMap);
    }
  }

  return result;
}