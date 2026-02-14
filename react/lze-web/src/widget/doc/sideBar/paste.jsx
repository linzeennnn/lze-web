import { useGlobal, list } from "../global";
import { AddMouseMenu, notify, GetText } from "../../../utils/common";
import { Api } from "../../../utils/request";
import { useEffect } from "react";
import { Icon } from "../../../utils/icon";
import { getNowPath } from "../../../store/CacheList";

export default function Paste({ paste, copyList,source }) {
  const [pastestatus, setPastestatus] = paste;
  const onPaste = () => {
    if (!pastestatus.status) return;
    setPastestatus({ status: false });
    paste_file(pastestatus.type, copyList,source);
  };

  // 右键菜单
  useEffect(() => {
    AddMouseMenu({
      paste: {
        name: `${GetText("paste")} (V)`,
        fun: onPaste,
        disable: !pastestatus.status,
      },
    });
  }, [pastestatus.status]);

  // 键盘快捷键：Ctrl/Cmd + V
  useEffect(() => {
    const onKeyDown = (e) => {
      if (!pastestatus.status) return;

      const isMod = e.ctrlKey || e.metaKey;
      if (isMod && e.key.toLowerCase() === "v") {
        e.preventDefault(); // 阻止浏览器默认粘贴
        onPaste();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [pastestatus.status, copyList]);

  return pastestatus.status ? (
    <button
      id="paste"
      title={`${GetText("paste")} (Ctrl/Cmd + V)`}
      className="btn side-btn"
      onClick={onPaste}
    >{Icon("paste")}</button>
  ) : null;
}

function paste_file(type, copylist,source) {
  const global = useGlobal.getState();

  if (copylist.length === 0) {
    notify.err(GetText("no_select_file"));
    return;
  }

  const nowpath = getNowPath();
  Api.post({
    api: "doc/" + type,
    notice: true,
    body: { copylist, nowpath,source },
    success: () => {
      list(nowpath);
    },
  });
}
