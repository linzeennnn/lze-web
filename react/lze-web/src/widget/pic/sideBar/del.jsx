import { getFileCache, getFileList, getFileListCurrent, getNowPath, setFileCache } from "../../../store/CacheList";
import { confirmWin, GetText, AddMouseMenu, notify, DeepClone } from "../../../utils/common";
import { Icon } from "../../../utils/icon";
import { Api } from "../../../utils/request";
import { list, SortList, useGlobal } from "../global";
import { useEffect } from "react";

export default function Del() {
  const delPic = async () => {
    const confirm = await confirmWin.normal(GetText("are_you_sure"));
    if (!confirm) return;

    const global = useGlobal.getState();
    const nowPath = getNowPath()
    const select = global.select;
    const setGlobal = global.setGlobal;

    if (!select.list || select.list.length === 0) {
      notify.err(GetText("no_select_file"));
      return;
    }
    Api.delete({
      api: "pic/del",
      notice: true,
      body: { delArr: select.list, nowPath },
      success: () => {
        setGlobal({ select: { status: false, list: [] } });
        const cache=DeepClone(getFileCache())
        const tmpFileList=cache.fileList
        const filePage=cache.fileList[cache.current]
        const set=new Set(nameToIndex(select.list))
        const newFilePage=filePage.filter((_, index) => !set.has(index));
        tmpFileList[cache.current]=newFilePage
        setFileCache({...cache,fileList:tmpFileList})
        SortList()
      }
    });
  };

  // 挂载时添加右键菜单和快捷键
  useEffect(() => {
    // 添加右键菜单
    AddMouseMenu({
      del: {
        name: GetText("delete")+"(Delete)",
        fun: delPic,
      }
    });

    // 添加快捷键
    const keyHandler = (e) => {
      // Mac: metaKey (Cmd) + Delete, 其他: Delete
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      if ((isMac && e.metaKey && e.key === "Delete") || (!isMac && e.key === "Delete")) {
        e.preventDefault();
        delPic();
      }
    };
    window.addEventListener("keydown", keyHandler);

    // 卸载时清理
    return () => window.removeEventListener("keydown", keyHandler);
  }, []);

  return (
    <button
      className="btn side-btn"
      title={GetText("delete")}
      onClick={delPic}
    >{Icon("bin")}</button>
  );
}
function nameToIndex(nameList){
  const fileList=getFileList()
  
  const indexList = nameList.map(name => {
  return fileList.findIndex(item => item[0] === name);
});
return indexList
}