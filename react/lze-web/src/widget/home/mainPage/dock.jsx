import { useEffect, useState } from "react";
import Login from "./dockApp/login";
import {useGlobal} from "../global";

export default function Dock({load,setLoad}) {
  const showBg = useGlobal(state => state.showBg);
  const setGlobal = useGlobal(state => state.setGlobal);
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
        </div>
      )}
      <div id="dock" className={load?"dock-load":""}>
        {dockList.map((item) => (
          <div
            id={item.id}
            key={item.id}
            title={item.name}
            className="dock-app"
            onClick={() => {
              if(item.id=="lock"){
                setLoad(false)
                setTimeout(() => {
                setGlobal({ locked: true })
                }, 1000);
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
