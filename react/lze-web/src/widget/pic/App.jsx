import PicContent from './content/picContent';
import PicTopBar from './topBar/picTopBar';
import PicSideBar from './sideBar/picSideBar';
import PicWin from './win/picWin'
import {ScrollTop} from '../../components/scrollTop'
import GoTopBtn from '../../components/goTopBtn'
import HeadBar from '../../components/headBar'
import GoBack from '../../components/goBack'
import { GetText,confirmWin } from "../../utils/common";
import PublicWidget from '../../components/public/publicWidget'
import { DragLeave,DragOver,Drop,useGlobal,Upload } from './global';
import '../../css/page/pic.css';
import '../../css/public/all.css';
import '../../css/public/page.css';
import { useEffect } from 'react';
import { useThemeStore } from '../../store/theme';
import { useEnvStore } from '../../store/common';
export default function App() {
  const theme=useThemeStore(state=>state.theme);
  const inner=useGlobal(state=>state.inner);
  const env=useEnvStore(state=>state.env);
  useEffect(() => {
    window.addEventListener('dragover', DragOver);
    window.addEventListener('dragleave', DragLeave);
    window.addEventListener('drop', Drop);
    window.addEventListener("paste", pastePic);
    return () => {
      window.removeEventListener('dragover', DragOver);
      window.removeEventListener('dragleave', DragLeave);
      window.removeEventListener('drop', Drop);
      window.removeEventListener("paste", pastePic);
    };
  }, []);
  return ( 
     <div id='app' mode={theme.mode} color={theme.color[env.type]}>
      <div className='wallpaper'></div>
      {inner.enable?<InnerApp/>:<NormalApp/>}
    </div>
  );
}
function NormalApp(){
  return(
    <>
      <ScrollTop>
        <HeadBar />
      <PicTopBar />
        <GoBack />
        <GoTopBtn />
      </ScrollTop>
        <PicWin/>
      <PicSideBar />
      <PicContent />
      <PublicWidget/>
    </>
  )
}
function InnerApp(){
  return(
    <>
      <ScrollTop>
        <GoTopBtn innerMode={true} />
      </ScrollTop>
        <PicWin/>
      <PicContent />
      <PublicWidget/>
    </>
  )
}
async function pastePic(e){
  if (!e) return;
    const item = e.clipboardData.items[0];
      if (item.type.startsWith("image/")&&await confirmWin.normal(GetText("are_you_sure"))) {
        const file = item.getAsFile(); //  这是一个 File 对象
        const uploadData = {
        totalSize: file.size,
        sendSize: 0,
      };
      Upload(file, uploadData);
      }
}