import { list, useGlobal } from "../global";
import { AddMouseMenu, GetText } from '../../../utils/common';
import { useEffect } from "react";
import { Icon } from "../../../utils/icon";

export default function GoHome() {
  const nowPath = useGlobal((state) => state.nowPath);


  const goHome = () => {
    if (nowPath == "") return;
    list("");
  };

  useEffect(() => {
    AddMouseMenu({
      goHome: {
        name: GetText("back_main_dir"),
        fun: goHome,
        disable:(nowPath=="")
      }
    });
  }, [nowPath]);

  return (
    <button
      className="btn top-bar-widget"
      onClick={goHome}
      title={GetText("back_main_dir")}
    >{Icon("home")}</button>
  );
}
