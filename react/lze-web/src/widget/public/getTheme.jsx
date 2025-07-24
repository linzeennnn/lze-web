export function Get_system_theme(){
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}
export function GetTheme(color){
    let theme=localStorage.getItem("theme")
          if(theme){
            theme =JSON.parse(theme)
            if(theme.userSelect=="system"){
              theme.mode=Get_system_theme()
            }
            else{
              theme.mode=theme.userSelect
            }
            if(color!="default")
                theme.color=color
          }
          else{
            theme={
              mode:Get_system_theme(),
              color:color,
              userSelect:"system"
            }
          }
          return theme
}