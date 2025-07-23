import {useGlobal} from "../../global"
export default function Theme(){
    const theme=useGlobal(state=>state.theme)
    const modeOpt=
        {system:"跟随系统",
        dark:"深色模式",
        ilight:"浅色模式"}
    
    const color=["default","green","blue","orange","yellow","pink","red"]
    return(
        <div id="theme-app">
            <div id="mode-bar">
                <div id="show-mode">
                    <span>{modeOpt[theme.userSelect]}</span>
                </div>
                <button className="btn" id="switch-mode"></button>
            </div>
        </div>
    )
}