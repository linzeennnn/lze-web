import { useGlobal } from "../../global";
import { Get_system_theme } from "../../../public/getTheme";
import { useState } from "react";
export default function Theme() {
  const theme = useGlobal((state) => state.theme);
  const [nowPage,setNowPage]=useState("home")
  const modeOpt = {
    system: "跟随系统",
    dark: "深色模式",
    light: "浅色模式",
  };
  const page={
    home:"主页",
    doc:"文件管理",
    pic:"图库",
    tra:"回收站",
    mon:"控制面板",
    not:"便签",
    bok:"书签"
  }
  const color = ["default", "green", "blue", "orange", "yellow", "pink", "red"];

  const handleSwitchMode = () => {
    const order = ["system", "dark", "light"];
    const currentIndex = order.indexOf(theme.userSelect);
    const nextIndex = (currentIndex + 1) % order.length;
    set_theme("userSelect", order[nextIndex]);
  };

  const handleSwitcPage = () => {
    const order = ["home", "doc", "pic","tra","mon","not","bok"];
    const currentIndex = order.indexOf(nowPage);
    const nextIndex = (currentIndex + 1) % order.length;
    setNowPage(order[nextIndex]);
    
  };
  return (
    <div id="theme-app">
      <div id="mode-bar">
        <div id="show-mode">
          <span>{modeOpt[theme.userSelect]}</span>
        </div>
        <button
          className="btn switch"
          id="switch-mode"
          title="切换模式"
          onClick={handleSwitchMode}
        >
        </button>
      </div>
      <div id="page-bar">
        <div id="show-page">
          <span>{page[nowPage]}</span>
        </div>
        <button id="switch-page" className="btn switch" title="切换页面" 
        onClick={handleSwitcPage}></button>
      </div>
      <div id="color-bar">
        {color.map((colorName, index) => {
          return (
            <div
              className={
                "color-btn " +
                (theme.color[nowPage] === colorName ? "color-btn-enable" : "")
              }
              key={index + colorName}
              mode={theme.mode}
              color={colorName}
              onClick={() => set_theme("color", {
                ...theme.color,
                [nowPage]: colorName,
              })}
            >
              <div></div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
function set_theme(type, value) {
  const theme = useGlobal.getState().theme;
  const updatedTheme = { ...theme, [type]: value };
  if (type === "userSelect") {
    if (value === "system") {
      updatedTheme.mode = Get_system_theme();
    } else {
      updatedTheme.mode = value; 
    }
  }
  document.body.setAttribute("mode",updatedTheme.mode)
  document.body.setAttribute("color",updatedTheme.color["home"])
  useGlobal.setState({ theme: updatedTheme });
  localStorage.setItem("theme", JSON.stringify(updatedTheme));
}

