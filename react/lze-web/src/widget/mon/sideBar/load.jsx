import { list } from "../global";
import { AddMouseMenu, GetText } from '../../../utils/common';
import { useEffect } from "react";
import { Icon } from "../../../utils/icon";

export default function Load() {

  const load = () => {
    list();
  };

  useEffect(() => {
    AddMouseMenu({
      load: {
        name: GetText("refresh"),
        fun: load,
      }
    });
  }, []);

  return (
    <button
      className="btn side-btn"
      title={GetText("refresh")}
      onClick={load}
    >{Icon("load")}</button>
  );
}
