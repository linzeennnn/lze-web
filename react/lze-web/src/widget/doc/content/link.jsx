import { notify } from "../../../components/public/notify"
import { GetText, useGlobal, loadPage } from "../global"

export default function Link({ name }) {
  return (
    <button
      className="btn link-btn"
      title={GetText("get_link")}
      onClick={(e) => {
        e.stopPropagation();
        copyLink(name);
      }}
    ></button>
  );
}

// 获取直链并返回 URL
async function getLink(name) {
  const global = useGlobal.getState();
  const path = global.nowPath + "/" + name;
  const url = global.docUrl + "link";
  const body = { path };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "authorization": "Bearer " + global.token,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      if (res.status === 401) {
        notify(GetText("no_per"));
      } else {
        notify(GetText("error") + ":" + res.status);
      }
      throw new Error("HTTP error " + res.status);
    }

    const text = await res.text();
    return encodeURI(window.location.origin + "/" + text);
  } catch (err) {
    console.error("Fetch failed:", err);
    return null;
  } finally {
    loadPage(false);
  }
}

// 接收 URL 并复制
async function copyLink(name) {
  const url = await getLink(name);
  if (url) {
    copy(url);
  }
}

async function copy(text) {
  if (navigator.clipboard && window.isSecureContext) {
    // 使用 Clipboard API
    try {
      await navigator.clipboard.writeText(text);
      notify(GetText("copy") + " " + GetText("success"));
    } catch (err) {
      notify(GetText("error"), err);
      console.error("Clipboard API failed:", err);
    }
  } else {
    // 回退到 execCommand（不一定在 Safari 生效）
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    try {
      document.execCommand("copy");
      notify(GetText("copy") + " " + GetText("success"));
    } catch (err) {
      notify(GetText("error"), err);
      console.error("execCommand fallback failed:", err);
    }
    document.body.removeChild(textarea);
  }
}

