import { useGlobal, list } from "../global";
import { AddMouseMenu, GetText } from '../../../utils/common';
import { useEffect } from "react";

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
      id="load"
      title={GetText("refresh")}
      onClick={refresh}
    ></button>
  );
}
