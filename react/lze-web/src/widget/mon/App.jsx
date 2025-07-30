import MonContent from './content/monContent';
import MonTopBar from './topBar/monTopBar';
import MonSideBar from './sideBar/monSideBar';
import MonWin from './win/monWin'
import {ScrollTop} from '../../components/scrollTop'
import GoTopBtn from '../../components/goTopBtn'
import HeadBar from '../../components/headBar'
import GoBack from '../../components/goBack'
import Tooltip from '../../components/tooltip'
import '../../css/page/mon.css';
import '../../css/public/all.css';
import '../../css/public/page.css';
import { InitData, useGlobal } from './global';
import { useEffect } from 'react';


export default function App() {
  const theme=useGlobal(state=>state.theme)
    useEffect(()=>{
        InitData()
    },[])
  return ( 
     <div id="app" mode={theme.mode} color={theme.color["mon"]}>
      <ScrollTop>
        <HeadBar />
      <MonTopBar />
        <GoBack />
        <GoTopBtn />
      </ScrollTop>
        <MonWin/>
      <MonSideBar />
      <MonContent />
      <Tooltip/>
      <div className='wallpaper'></div>
    </div>
  );
}
