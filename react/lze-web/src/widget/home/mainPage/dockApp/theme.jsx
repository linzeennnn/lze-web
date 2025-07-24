import { useGlobal } from "../../global";
import { Get_system_theme } from "../../../public/getTheme";
export default function Theme() {
  const theme = useGlobal((state) => state.theme);
  const modeOpt = {
    system: "跟随系统",
    dark: "深色模式",
    light: "浅色模式",
  };

  const color = ["default", "green", "blue", "orange", "yellow", "pink", "red"];

  const handleSwitchMode = () => {
    const order = ["system", "dark", "light"];
    const currentIndex = order.indexOf(theme.userSelect);
    const nextIndex = (currentIndex + 1) % order.length;
    set_theme("userSelect", order[nextIndex]);
  };

  return (
    <div id="theme-app">
      <div id="mode-bar">
        <div id="show-mode">
          <span>{modeOpt[theme.userSelect]}</span>
        </div>
        <button
          className="btn"
          id="switch-mode"
          title="切换模式"
          onClick={handleSwitchMode}
        >
        </button>
      </div>

      <div id="color-bar">
        {color.map((colorName, index) => {
          return (
            <div
              className={
                "color-btn " +
                (theme.color === colorName ? "color-btn-enable" : "")
              }
              key={index + colorName}
              mode={theme.mode}
              color={colorName}
              onClick={() => set_theme("color", colorName)}
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
  useGlobal.setState({ theme: updatedTheme });
  localStorage.setItem("theme", JSON.stringify(updatedTheme));
}

