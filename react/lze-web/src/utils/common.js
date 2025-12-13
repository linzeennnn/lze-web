import { showNotify } from "../store/notify";
import { getLang, setLang } from "../store/lang";
import { useConfirmStore } from "../store/confirm";
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

//////////////获取文本//////////////////
export function GetText(key) {
  const currentLang = getLang();
  return currentLang.list?.[key] ?? key;
}

///////////////////判空逻辑独立成函数 ///////////////////
export async function CheckLang(remote=false) {
  let currentLang = getLang();

  // 缺语言包 → 拉取
  if (!currentLang.list || Object.keys(currentLang.list).length === 0||remote) {
    const tmpLang = await GetLangList();
    setLang(tmpLang);
  }
}

///////////////////  拉取语言包 ///////////////////
export async function GetLangList() {
  const lang = GetLangType();

    try {
      const response = await fetch(window.location.origin + "/server/lang", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lang: lang.type })
      });

      const data = await response.json();
      lang.list = (data && typeof data === "object") ? data : {};

      localStorage.setItem("langList", JSON.stringify(lang.list));
    } catch (err) {
      console.error(err);
      lang.list = {};
    }

  return lang;
}

/////////////////// 保留语言类型逻辑 ///////////////////
function GetLangType() {
  const langList = ['en', 'zh'];
  let sysLang = (navigator.language || navigator.userLanguage).split('-')[0];
  if (!langList.includes(sysLang)) sysLang = 'en';

  // 用户选择
  let lang = localStorage.getItem('lang');
  let type = (!lang || lang === 'system') ? sysLang : lang;

  let list = JSON.parse(localStorage.getItem('langList') || '{}');

  return { userSelect: lang || 'system', type, list };
}