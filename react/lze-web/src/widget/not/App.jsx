import NotContent from './content/notContent';
import NotTopBar from './topBar/notTopBar';
import NotSideBar from './sideBar/notSideBar';
import NotWin from './win/notWin'
import {ScrollTop,GoTopBtn,HeadBar,GoBack} from '../public'
import{DragOver,DragLeave,Drop, InitData, useGlobal} from './global'
import Tooltip from '../public/tooltip'
import '../../css/page/not.css';
import '../../css/public/all.css';
import '../../css/public/page.css';
import { useEffect } from 'react';


export default function App() {
  const theme=useGlobal(state=>state.theme)
    useEffect(() => {
        InitData()
    }, []);
  useEffect(() => {
    window.addEventListener('dragover', DragOver);
    window.addEventListener('dragleave', DragLeave);
    window.addEventListener('drop', Drop);
    return () => {
      window.removeEventListener('dragover', DragOver);
      window.removeEventListener('dragleave', DragLeave);
      window.removeEventListener('drop', Drop);
    };
  }, []);
  return ( 
     <div id='app' mode={theme.mode} color={theme.color["not"]}>
     <div className='wallpaper'></div>
      <ScrollTop>
        <HeadBar />
      <NotTopBar />
        <GoBack />
        <GoTopBtn />
      </ScrollTop>
        <NotWin/>
      <NotSideBar />
      <NotContent />
      <Tooltip/>
    </div>
  );
}
