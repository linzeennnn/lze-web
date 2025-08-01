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
export function SetThemeColor(mode,color){
  const html=document.documentElement
  html.setAttribute("mode",mode)
  html.setAttribute("color",color)
  const themeColor  = getComputedStyle(html).backgroundColor
  let meta = document.querySelector('meta[name="theme-color"]');
  if (!meta) {
    meta = document.createElement('meta');
    meta.name = 'theme-color';
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', themeColor);
}