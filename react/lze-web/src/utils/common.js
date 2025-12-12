import { notify } from "../store/notify";
import { getLang, setLang } from "../store/lang";

////////////////通知//////////////////
export function copy(text) {
  navigator.clipboard.writeText(text)
    .then(() => {
      // GetText 是异步的，需要 await 或 then
      GetText("copy").then(copyText => {
        GetText("success").then(successText => {
          notify.normal(`${copyText} ${successText}`);
        });
      });
    })
    .catch(err => {
      console.error(err);
    });
}

//////////////获取文本//////////////////
export async function GetText(str) {
  let currentLang = getLang();

  // 判断对象是否为空
  if (!currentLang.list || Object.keys(currentLang.list).length === 0) {
    const tmpLang = await GetLangList();
    setLang(tmpLang);
    currentLang = tmpLang; // 使用最新获取的值
  }

  return currentLang.list[str] ?? str;
}

function GetLangType() {
  const langList = ['en', 'zh'];
  let sysLang = (navigator.language || navigator.userLanguage).split('-')[0];
  if (!langList.includes(sysLang)) sysLang = 'en';

  // 获取用户选择
  let lang = localStorage.getItem('lang');
  let type = (!lang || lang === 'system') ? sysLang : lang;

  // 尝试从本地存储获取 langList，保证是对象
  let list = JSON.parse(localStorage.getItem('langList') || '{}');

  return { userSelect: lang || 'system', type, list };
}

export async function GetLangList() {
  const lang = GetLangType();

  // 判断对象是否为空
  if (!lang.list || Object.keys(lang.list).length === 0) {
    try {
      const response = await fetch(window.location.origin + "/server/lang", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lang: lang.type })
      });

      const data = await response.json();
      // 确保 list 是对象
      lang.list = (data && typeof data === 'object') ? data : {};
      localStorage.setItem('langList', JSON.stringify(lang.list));
    } catch (err) {
      console.error("获取语言列表失败：", err);
      lang.list = {};
    }
  }

  return lang;
}