import { useGlobal, list, Selected, fileBuffer } from "../global";
import { AddMouseMenu, confirmWin, GetText } from "../../../utils/common";
import { Api } from "../../../utils/request";
import { useEffect } from "react";
import { Icon } from "../../../utils/icon";
import { getFileCache, getNowPath, setFileCache } from "../../../store/CacheList";

export default function Del() {

  const del = async () => {
    if (!await confirmWin.normal(GetText("are_you_sure"))) return;
    const dellist = fileBuffer.getSelectedFileList()
    const nowPath = getNowPath();
    Api.delete({
      api: "doc/del",
      notice: true,
      body: { dellist,nowPath },
      success: () => {
        const cache=structuredClone(getFileCache())
        const tmpFileList=cache.fileList
        const filePage=cache.fileList[cache.current]
        const set=new Set(fileBuffer.getSelected())
        const newFilePage=filePage.filter((_, index) => !set.has(index));
        tmpFileList[cache.current]=newFilePage
        setFileCache({...cache,fileList:tmpFileList})
        fileBuffer.clean()
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
