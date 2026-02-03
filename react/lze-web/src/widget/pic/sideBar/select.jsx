import { AddMouseMenu, GetText } from "../../../utils/common";
import { Icon } from "../../../utils/icon";
import { useGlobal } from "../global";
import { useEffect } from "react";

export default function Select() {
  const setGlobal = useGlobal(state => state.setGlobal);
  const select = useGlobal(state => state.select);

  const toggleSelect = () => {
    setGlobal({ select: { ...select, status: !select.status } });
  };

  useEffect(() => {
    AddMouseMenu({
      select: {
        name: GetText("select")+(select.status?("("+GetText("cancel"))+")":""),
        fun: toggleSelect,
      }
    });
  }, [select.status]);   // 依赖 select，保证状态是最新的

  return (
    <button
      className={"btn side-btn " + (select.status ? "select-btn-active" : "")}
      title={GetText("select")}
      onClick={toggleSelect}
    >{Icon("select")}</button>
  );
}
