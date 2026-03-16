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
import { useGlobal} from './global';
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
    window.addEventListener("paste", pastePic);
    return () => {
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
async function pastePic(e) {
  if (!e) return;
}
