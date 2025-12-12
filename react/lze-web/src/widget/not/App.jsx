import NotContent from './content/notContent';
import NotTopBar from './topBar/notTopBar';
import NotSideBar from './sideBar/notSideBar';
import NotWin from './win/notWin'
import {ScrollTop} from '../../components/scrollTop'
import GoTopBtn from '../../components/goTopBtn'
import HeadBar from '../../components/headBar'
import GoBack from '../../components/goBack'
import Tooltip from '../../components/public/tooltip'
import{DragOver,DragLeave,Drop, InitData, useGlobal} from './global'
import '../../css/page/not.css';
import '../../css/public/all.css';
import '../../css/public/page.css';
import Notify from '../../components/public/notify';
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
      <Notify/>
    </div>
  );
}
