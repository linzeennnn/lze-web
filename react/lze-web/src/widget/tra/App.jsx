import TraContent from "./content/traContent";
import TraTopBar from "./topBar/traTopBar";
import TraSideBar from "./sideBar/traSideBar";
import TraWin from "./win/traWin";
import {ScrollTop} from '../../components/scrollTop'
import GoTopBtn from '../../components/goTopBtn'
import HeadBar from '../../components/headBar'
import GoBack from '../../components/goBack'
import Tooltip from '../../components/tooltip'
import '../../css/page/tra.css';
import '../../css/public/all.css';
import '../../css/public/page.css';
import { useEffect } from "react";
import { Initdata, useGlobal } from "./global";
export default function App() {
  const theme=useGlobal(state=>state.theme)
  useEffect(()=>{
    Initdata()
  },[])
  return ( 
     <div id="app" mode={theme.mode} color={theme.color["tra"]}>
      <div className="wallpaper"></div>
      <ScrollTop>
        <HeadBar />
        <GoBack />
        <GoTopBtn />
      <TraTopBar></TraTopBar>
      <TraSideBar></TraSideBar>
      <TraContent></TraContent>
      <TraWin/>
      </ScrollTop>
    <Tooltip/>
    </div>
  );
}
