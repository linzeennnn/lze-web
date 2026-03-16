import { useGlobal, list, SortList } from "../global";
import { AddMouseMenu, GetText } from "../../../utils/common";
import { useEffect, useState } from "react";
import { getNowPath, useFileCacheStore } from "../../../store/CacheList";
import { dirName } from "../../../utils/path";
import { LocalList } from "../../../utils/CacheList";

export default function ShowPath() {
  const [nowPath, setNowPath]=useState("")
  const [parentPath, setParentPath]=useState("")
  const current=useFileCacheStore((state)=>state.fileCache.current)
  const backParent = () => {
    if(current==0){
      return
    }
    LocalList(current-1)
    SortList()
  };

  useEffect(() => {
    setNowPath(getNowPath())
    
    setParentPath(dirName(getNowPath()))
    AddMouseMenu({
      back: {
        name: GetText("back_parent_album"),
        fun: backParent,
        disable: (current==0)
      }
    });
  }, [current]);

  return (
    <div id="show-path-box">
      {(nowPath == "" && parentPath == "") ? null : (
        <span
          id="par-text"
          title={GetText("back_parent_album")}
          onClick={backParent}
        >
          {(parentPath == ""||parentPath=='/') ? 
          GetText("main_album") : baseName(parentPath)
          }
        </span>
      )}

      <span id="cur-text">
        {nowPath == "" ? GetText("main_album") : baseName(nowPath)}
      </span>
    </div>
  );
}

function baseName(path) {
  if (!path) return "";
  path = path.replace(/\/+$/, "");
  const parts = path.split("/");
  return parts.pop() || "";
}
