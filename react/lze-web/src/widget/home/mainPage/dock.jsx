import { useEffect, useState } from "react";
import Lang from "./dockApp/lang";
import Sys from "./dockApp/sys";
import Theme from "./dockApp/theme";
import {GetText, useGlobal} from "../global";

export default function Dock({tmpLoad,setTmpLoad}) {
  const showBg = useGlobal(state => state.showBg);
  const setGlobal = useGlobal(state => state.setGlobal);
  const locked =useGlobal(state => state.locked);
  const [appType, setAppType] = useState("");
  const open_dock = (type) => {
    setAppType(type);
    setGlobal({ showBg: true });
  };
  const close_dock = () => {
    setGlobal({ showBg: false });
    setAppType("");
  };

  const dockList = [
    { id: "lang", name: GetText("lang_setting") },
    { id: "theme", name: GetText("theme") },
    { id: "sys", name: GetText("monitor") },
    { id: "lock", name: GetText("login_manage") },
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
          ></button>
          {appType === "lang" && <Lang/> }
          {appType === "sys" && <Sys />}
          {appType === "theme" && <Theme />}
        </div>
      )}
      <div id="dock" className={(!locked&&tmpLoad)?"dock-load":""}>
        {dockList.map((item) => (
          <div
            id={item.id}
            key={item.id}
            title={item.name}
            className="dock-app"
            onClick={() => {
              if(item.id=="lock"){
                  setTmpLoad(false)
                setTimeout(() => {
                setGlobal({ locked: true })
                setTmpLoad(true)
                }, 500);
              }
              else
                open_dock(item.id)
            }}
          >
            <div id={item.id + "-icon"} className="dock-icon"></div>
          </div>
        ))}
      </div>
    </>
  );
}
