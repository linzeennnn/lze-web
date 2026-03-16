import { useGlobal, list } from "../global";
import { AddMouseMenu, GetText } from "../../../utils/common";
import { useEffect } from "react";
import { Icon } from "../../../utils/icon";
import { getNowPath, useFileCacheStore } from "../../../store/CacheList";

export default function Load() {
const current=useFileCacheStore((state)=>state.current)
  

  const refresh = () => {
    list(getNowPath());
  };

  useEffect(() => {
    AddMouseMenu({
      load: {
        name: GetText("refresh"),
        fun: refresh,
      }
    });
  }, [current]);

  return (
    <button
      className="btn side-btn"
      title={GetText("refresh")}
      onClick={refresh}
    >{Icon("load")}</button>
  );
}
