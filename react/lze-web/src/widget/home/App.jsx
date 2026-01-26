import {  useGlobal } from "./global";
import MainPage from "./mainPage/mainPage";
import LockPage from "./lockPage/lockPage";
import PublicWidget from "../../components/public/publicWidget";
import '../../css/page/home.css'
import '../../css/public/all.css'
import { useThemeStore } from "../../store/theme";
export default function App() {
    const theme=useThemeStore(state=>state.theme)
    return (
        <div id="app" color={theme.color["home"]} mode={theme.mode}>
        <LockPage />
        <MainPage />
        <div className="wallpaper"></div>
        <PublicWidget/>
        </div>
    )
}
