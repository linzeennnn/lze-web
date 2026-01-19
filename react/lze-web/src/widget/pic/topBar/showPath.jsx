import { useGlobal, list } from "../global";
import { AddMouseMenu, GetText } from "../../../utils/common";
import { useEffect } from "react";

export default function ShowPath() {

  const nowPath = useGlobal((state) => state.nowPath);
  const parentPath = useGlobal((state) => state.parentPath);

  const backParent = () => {
    
    list(useGlobal.getState().parentPath);
  };

  useEffect(() => {
    AddMouseMenu({
      back: {
        name: GetText("back_parent_album"),
        fun: backParent,
        disable: (nowPath == "")
      }
    });
  }, [nowPath]);

  return (
    <div id="show-path-box">
      {(nowPath == "" && parentPath == "") ? null : (
        <span
          id="par-text"
          title={GetText("back_parent_album")}
          onClick={backParent}
        >
          {parentPath == "" ? GetText("main_album") : baseName(parentPath)}
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
