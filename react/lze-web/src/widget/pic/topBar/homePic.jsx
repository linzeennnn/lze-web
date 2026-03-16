import { useGlobal, list, SortList } from "../global";
import { AddMouseMenu, GetText, notify } from "../../../utils/common";
import { useEffect } from "react";
import { Icon } from "../../../utils/icon";
import { getNowPath, useFileCacheStore } from "../../../store/CacheList";
import { LocalList } from "../../../utils/CacheList";

export default function HomePic() {
  const nowPath = useFileCacheStore((state) => state.fileCache.nowPath)
    const current=useFileCacheStore((state) => state.fileCache.current)
  const backHome = () => {
    if(current==0)
      return
    LocalList(0)
    SortList()
  };

  useEffect(() => {
    AddMouseMenu({
      home: {
        name: GetText("back_main_album"),
        fun: backHome,
        disable:(current==0)
      }
    });
  }, [current]);

  return (
    <button
      id="home-pic"
      className="btn"
      title={GetText("back_main_album")}
      onClick={backHome}
    >{Icon("grid")}</button>
  );
}
