import DocContent from './content/docContent';
import DocTopBar from './topBar/docTopBar';
import DocSideBar from './sideBar/docSideBar';
import DocWin from './win/docWin'
import {ScrollTop} from '../../components/scrollTop'
import GoTopBtn from '../../components/goTopBtn'
import HeadBar from '../../components/headBar'
import GoBack from '../../components/goBack'
import PublicWidget from "../../components/public/publicWidget";
import{DragOver,DragLeave,Drop, InitData,useGlobal} from './global'
import '../../css/page/doc.css';
import '../../css/public/all.css';
import '../../css/public/page.css';
import { useEffect } from 'react';
export default function App() {
    const theme=useGlobal(state=>state.theme)
  useEffect(() => {
    InitData()
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
     <div id='app' color={theme.color["doc"]} mode={theme.mode}>
      <ScrollTop>
        <HeadBar />
      <DocTopBar />
        <GoBack />
        <GoTopBtn />
      </ScrollTop>
        <DocWin/>
      <DocSideBar />
      <DocContent />
      <PublicWidget/>
      <div className='wallpaper'></div>
    </div>
  );
}
