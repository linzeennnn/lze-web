import { Selected, useGlobal } from "../global";
import { AddMouseMenu, GetText, notify } from "../../../utils/common";
import { useEffect } from "react";
import { Icon } from "../../../utils/icon";

export default function CopyMove({ setPaste, setCopyList,setSource }) {
  const copy = (type) => {
    Selected.hide()
    const selected = useGlobal.getState().selected;
    setCopyList(selected.selected);
    setPaste({ status: true, type: type });
    setSource(useGlobal.getState().nowPath);
    notify.normal(GetText("copied"));
  };
  // 右键菜单
  useEffect(() => {
    AddMouseMenu({
      copy: {
        name: `${GetText("copy")} (C)`,
        fun: () => copy("copy")

      },
      cut: {
            name: GetText("cut")+"(X)",
            fun: () => copy("move")
 
          }
    });
  }, []);

  // 键盘快捷键：Ctrl/Cmd + C
  useEffect(() => {
    const onKeyDown = (e) => {
      const isMod = e.ctrlKey || e.metaKey; // 跨平台
      if (isMod && e.key.toLowerCase() === "c") {
        e.preventDefault(); // 防止浏览器默认复制
        copy("copy");
      }else if(isMod && e.key.toLowerCase() === "x"){
        e.preventDefault(); 
       copy("move");;
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);
  return (
    <>
    <button
      className="btn side-btn"
      title={`${GetText("copy")} (Ctrl/Cmd + C)`}
      onClick={()=>{copy("copy")}}
    >{Icon("copy")}</button>
    <button className="btn side-btn"
        title={GetText("cut")} onClick={()=>{copy("move")}}>{Icon("cut")}
        </button>
        </>
  );
}
