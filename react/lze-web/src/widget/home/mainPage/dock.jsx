import { useEffect, useState } from "react";
import Lang from "./dockApp/lang";
import Sys from "./dockApp/sys";
import Theme from "./dockApp/theme";
import { useGlobal } from "../global";
import { GetText, AddMouseMenu } from "../../../utils/common";
import { useLangStore } from "../../../store/lang";
import {FillIcon, Icon} from "../../../utils/icon";

export default function Dock({ tmpLoad, setTmpLoad }) {
  const lang=useLangStore((state)=>state.lang)
  const showBg = useGlobal((state) => state.showBg);
  const setGlobal = useGlobal((state) => state.setGlobal);
  const locked = useGlobal((state) => state.locked);
  const [appType, setAppType] = useState("");

  // 打开对应窗口
  const open_dock = (type) => {
    setAppType(type);
    setGlobal({ showBg: true });
  };

  // 关闭窗口
  const close_dock = () => {
    setGlobal({ showBg: false });
    setAppType("");
  };

  // 各个功能的点击逻辑
  const openLang = () => open_dock("lang");
  const openTheme = () => open_dock("theme");
  const openSys = () => open_dock("sys");

  const lockAction = () => {
    setTmpLoad(false);
    setTimeout(() => {
      setGlobal({ locked: true });
      setTmpLoad(true);
    }, 500);
  };

  // 统一注册右键菜单
  useEffect(() => {
    AddMouseMenu({
      lang: {
        name: GetText("lang_setting"),
        fun: openLang,
      },
      theme: {
        name: GetText("theme"),
        fun: openTheme,
      },
      sys: {
        name: GetText("monitor"),
        fun: openSys,
      },
      lock: {
        name: GetText("login_manage"),
        fun: lockAction,
      }
    });
  }, [lang.type]);

  const dockList = [
    { id: "lang", name: GetText("lang_setting"), action: openLang },
    { id: "theme", name: GetText("theme"), action: openTheme },
    { id: "sys", name: GetText("monitor"), action: openSys },
    { id: "lockScreen", name: GetText("login_manage"), action: lockAction },
  ];

  return (
    <>
      {showBg && (
        <div className={`app-win float-win`}>
          <button
            className="btn"
            id="close-win"
            title={GetText("close")}
            onClick={close_dock}
          >{Icon("no")}</button>
          {appType === "lang" && <Lang />}
          {appType === "sys" && <Sys />}
          {appType === "theme" && <Theme />}
        </div>
      )}

      <div id="dock" className={!locked && tmpLoad ? "dock-load" : ""}>
        {dockList.map((item) => (
          <div
            id={item.id}
            key={item.id}
            title={item.name}
            className="dock-app"
            onClick={item.action}
          >
            <div id={item.id + "-icon"} className="dock-icon">
              {FillIcon(item.id)}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
