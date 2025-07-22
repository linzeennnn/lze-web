import { useEffect, useState } from "react";
import Login from "./dockApp/login";
import Sys from "./dockApp/sys";
import {useGlobal} from "../global";

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
    { id: "login", name: "登陆管理" },
    { id: "theme", name: "主题" },
    { id: "sys", name: "系统监视器" },
    { id: "lock", name: "锁屏" },
  ];

  return (
    <>
      {showBg && (
        <div className={`app-win float-win`}>
          <button
            className="btn"
            id="close-win"
            title="关闭"
            onClick={close_dock}
          ></button>
          {appType === "login" && <Login />}
          {appType === "sys" && <Sys />}
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
            <div id={item.id + "icon"}></div>
          </div>
        ))}
      </div>
    </>
  );
}
