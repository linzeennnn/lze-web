import PicContent from './content/picContent';
import PicTopBar from './topBar/picTopBar';
import PicSideBar from './sideBar/picSideBar';
import PicWin from './win/picWin'
import {ScrollTop,GoTopBtn,HeadBar,GoBack} from '../public'
import { DragLeave,DragOver,Drop,useGlobal,Initdata } from './global';
import Tooltip from '../public/tooltip'
import '../../css/page/pic.css';
import '../../css/public/all.css';
import '../../css/public/page.css';
import { useEffect } from 'react';
export default function App() {
  const theme=useGlobal(state=>state.theme);
  useEffect(() => {
    Initdata();
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
     <div id='app' mode={theme.mode} color={theme.color["pic"]}>
      <div className='wallpaper'></div>
      <ScrollTop>
        <HeadBar />
      <PicTopBar />
        <GoBack />
        <GoTopBtn />
      </ScrollTop>
        <PicWin/>
      <PicSideBar />
      <PicContent />
      <Tooltip/>
    </div>
  );
}
