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
          document.body.setAttribute("mode",theme.mode)
          document.body.setAttribute("color",theme.color[type])
          return theme
}