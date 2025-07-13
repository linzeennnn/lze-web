import DocContent from './content/docContent';
import DocTopBar from './topBar/docTopBar';
import DocSideBar from './sideBar/docSideBar';
import DocWin from './win/docWin'
import {ScrollTop,GoTopBtn,HeadBar,GoBack} from '../public'
import{DragOver,DragLeave,Drop} from './global'
import '../../css/page/doc.css';
import '../../css/public/all.css';
import '../../css/public/page.css';
import { useEffect } from 'react';


export default function App() {
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
     <>
      <ScrollTop>
        <HeadBar />
      <DocTopBar />
        <GoBack />
        <GoTopBtn />
      </ScrollTop>
        <DocWin/>
      <DocSideBar />
      <DocContent />
    </>
  );
}
