import { useGlobal, list } from "../global";
import { AddMouseMenu, GetText, notify } from "../../../utils/common";
import { useEffect } from "react";
import { Icon } from "../../../utils/icon";

export default function HomePic() {
  const nowPath = useGlobal((state) => state.nowPath);
  const backHome = () => {
    nowPath === ""
      ? notify.normal(GetText("main_album"))
      : list("");
  };

  useEffect(() => {
    AddMouseMenu({
      home: {
        name: GetText("back_main_album"),
        fun: backHome,
        disable:(nowPath == "")
      }
    });
  }, [nowPath]);

  return (
    <button
      id="home-pic"
      className="btn"
      title={GetText("back_main_album")}
      onClick={backHome}
    >{Icon("grid")}</button>
  );
}
