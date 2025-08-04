export function Get_system_theme(){
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}
export function GetTheme(type){
    let theme=localStorage.getItem("theme")
          if(theme){
            theme =JSON.parse(theme)
            if(theme.userSelect=="system"){
              theme.mode=Get_system_theme()
            }
            else{
              theme.mode=theme.userSelect
            }
          }
          else{
            theme={
              mode:Get_system_theme(),
              color:{
                home:"default",
                doc:"green",
                pic:"blue",
                tra:"orange",
                mon:"yellow",
                not:"pink",
                bok:"red"
              },
              userSelect:"system"
            }
          }
          SetThemeColor(theme.mode,theme.color[type])
          return theme
}
export function SetThemeColor(mode, color) {
  const html = document.documentElement;
  html.setAttribute("mode", mode);
  html.setAttribute("color", color);

  // 获取计算后的背景色
  const themeColor = getComputedStyle(html).backgroundColor;

  // 提取 RGB，去掉 alpha
  const rgbaMatch = themeColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/);
  let finalColor = themeColor;

  if (rgbaMatch) {
    const [ , r, g, b ] = rgbaMatch;
    // 转换成 HEX 颜色，确保 theme-color 兼容性
    finalColor = `#${[r, g, b].map(x => parseInt(x).toString(16).padStart(2, "0")).join("")}`;
  }

  // 查找或创建 meta
  let meta = document.querySelector('meta[name="theme-color"]');
  if (!meta) {
    meta = document.createElement("meta");
    meta.name = "theme-color";
    document.head.appendChild(meta);
  }

  meta.setAttribute("content", finalColor);
  // 再延时执行一次是因为chrome webapp 如何上一页与跳转页颜色相同的话颜色不会生效(原因未知)
 setTimeout(() => {
  meta.setAttribute("content", finalColor);
 }, 100);
}
