import { InitData, useGlobal } from "./global";
import MainPage from "./mainPage/mainPage";
import LockPage from "./lockPage/lockPage";
import { useEffect } from "react";
import Tooltip from "../public/tooltip";
import '../../css/page/home.css'
import '../../css/public/all.css'
export default function App() {
    const theme=useGlobal(state=>state.theme)
    useEffect(()=>{
        InitData()
    },[])
    
    return (
        <div id="app" color={theme.color["home"]} mode={theme.mode}>
        <LockPage />
        <MainPage />
        <div className="wallpaper"></div>
        <Tooltip/>
        </div>
    )
}
