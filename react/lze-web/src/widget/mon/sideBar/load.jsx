import { list } from "../global";
import { AddMouseMenu, GetText } from '../../../utils/common';
import { useEffect } from "react";

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
      id="load"
      title={GetText("refresh")}
      onClick={load}
    ></button>
  );
}
