import { useGlobal, list, Selected } from "../global";
import { AddMouseMenu, confirmWin, GetText } from "../../../utils/common";
import { Api } from "../../../utils/request";
import { useEffect } from "react";
import { Icon } from "../../../utils/icon";
import { getNowPath } from "../../../store/CacheList";

export default function Del() {

  const del = async () => {
    if (!await confirmWin.normal(GetText("are_you_sure"))) return;

    const global = useGlobal.getState();
    const dellist = global.selected.selected;
    const nowPath = getNowPath();
    Selected.close();

    Api.delete({
      api: "doc/del",
      notice: true,
      body: { dellist,nowPath },
      success: () => {
        list(nowPath);
      }
    });
  };

  // 右键菜单
  useEffect(() => {
    AddMouseMenu({
      del: {
        name: `${GetText("delete")}(Delete)`,
        fun: del,
      }
    });
  }, []);

  // 键盘快捷键
  useEffect(() => {
    const onKeyDown = (e) => {
      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      const isCmd = e.metaKey;

      // macOS: Cmd + Delete
      if (isMac && isCmd && e.key === "Delete") {
        e.preventDefault();
        del();
      }

      // Windows/Linux: Delete
      if (!isMac && e.key === "Delete") {
        e.preventDefault();
        del();
      }

    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <button
      className="btn side-btn"
      title={`${GetText("delete")} (Delete / Cmd + Delete)`}
      onClick={del}
    >{Icon("bin")}</button>
  );
}
