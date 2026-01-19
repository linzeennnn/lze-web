import { useGlobal } from "../global";
import { AddMouseMenu, GetText, notify } from "../../../utils/common";
import { useEffect } from "react";

export default function Copy({ setPaste, setCopyList }) {
  const copy = () => {
    const selected = useGlobal.getState().selected;
    setCopyList([...selected]);
    setPaste({ status: true, type: "copy" });
    notify.normal(GetText("copied"));
  };

  // 右键菜单
  useEffect(() => {
    AddMouseMenu({
      copy: {
        name: `${GetText("copy")} (C)`,
        fun: copy,
      },
    });
  }, []);

  // 键盘快捷键：Ctrl/Cmd + C
  useEffect(() => {
    const onKeyDown = (e) => {
      const isMod = e.ctrlKey || e.metaKey; // 跨平台
      if (isMod && e.key.toLowerCase() === "c") {
        e.preventDefault(); // 防止浏览器默认复制
        copy();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <button
      id="copy"
      className="btn side-btn"
      title={`${GetText("copy")} (Ctrl/Cmd + C)`}
      onClick={copy}
    />
  );
}
