import { useGlobal, list } from "../global";
import { AddMouseMenu, GetText, confirmWin } from '../../../utils/common';
import { Api } from "../../../utils/request";
import { useEffect } from "react";
import { Icon } from "../../../utils/icon";

export default function Del() {

  const nowPath = useGlobal((state) => state.nowPath);

  const clean = async () => {
    if (!await confirmWin.normal(GetText("are_you_sure"))) return;

    Api.delete({
      api: "tra/del",
      notice: true,
      end: () => {
        list(nowPath);
      }
    });
  };

  // 按你之前的模式：只在组件挂载时注册右键菜单
  useEffect(() => {
    AddMouseMenu({
      clear: {
        name: GetText("clear_tra"),
        fun: clean,
      }
    });
  }, []);

  return (
    <button
      className="btn side-btn"
      onClick={clean}
      title={GetText("clear_tra")}
    >{Icon("bin")}</button>
  );
}
