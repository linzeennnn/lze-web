import { useGlobal, list } from "../global";
import { AddMouseMenu, GetText } from "../../../utils/common";
import { useEffect } from "react";
import { Icon } from "../../../utils/icon";

export default function Load() {

  const nowPath = useGlobal((state) => state.nowPath);

  const refresh = () => {
    list(nowPath);
  };

  useEffect(() => {
    AddMouseMenu({
      load: {
        name: GetText("refresh"),
        fun: refresh,
      }
    });
  }, [nowPath]);

  return (
    <button
      className="btn side-btn"
      title={GetText("refresh")}
      onClick={refresh}
    >{Icon("load")}</button>
  );
}
