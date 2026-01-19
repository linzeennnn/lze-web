import { useGlobal } from "../global";
import { AddMouseMenu, GetText } from "../../../utils/common";
import { useEffect } from "react";

export default function Add() {
  const editAdd = () => {
    useGlobal.setState({
      edit: {
        type: "add",
        mode: true
      }
    });
  };

  // 只在组件挂载时添加右键菜单
  useEffect(() => {
    AddMouseMenu({
      add: {
        name: GetText("add"),
        fun: editAdd
      }
    });
  }, []);

  return (
    <button
      className="btn side-btn"
      id="add-btn"
      title={GetText("add")}
      onClick={editAdd}
    ></button>
  );
}
