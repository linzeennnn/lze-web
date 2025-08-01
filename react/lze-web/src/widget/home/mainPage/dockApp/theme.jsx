import { GetText, useGlobal } from "../../global";
import { Get_system_theme, SetThemeColor } from "../../../../components/getTheme";
import { useState } from "react";
export default function Theme() {
  const theme = useGlobal((state) => state.theme);
  const [nowPage,setNowPage]=useState("home")
  const modeOpt = {
    system: GetText("system"),
    dark: GetText("dark_mode"),
    light: GetText("light_mode"),
  };
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
        <button id="show-mode"
        className="btn theme-btn"
          onClick={handleSwitchMode}
        >
          <span>{modeOpt[theme.userSelect]}</span>
        <div
          className="switch-icon"
          id="switch-mode"
          title="切换模式"
        >
        </div>
        </button>
      </div>
      <div id="page-bar">
        <button id="show-page"
        className="btn theme-btn"
        onClick={handleSwitcPage}
        >
          <span>{GetText(nowPage)}</span>
        <div id="switch-page" className="switch-icon" title={GetText("switch")} ></div>
        </button>
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
  SetThemeColor(updatedTheme.mode,updatedTheme.color["home"])
  document.body.setAttribute("mode",updatedTheme.mode)
  document.body.setAttribute("color",updatedTheme.color["home"])
  useGlobal.setState({ theme: updatedTheme });
  localStorage.setItem("theme", JSON.stringify(updatedTheme));
}

