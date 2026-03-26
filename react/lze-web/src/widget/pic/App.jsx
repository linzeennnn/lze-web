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
import { Upload } from '../../utils/upload';
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
  const clipboardData = e.clipboardData || window.clipboardData;
  if (!clipboardData) return;

  const items = clipboardData.items;
  let targetFile = null;

  for (let i = 0; i < items.length; i++) {
    if (items[i].kind === 'file') {
      const file = items[i].getAsFile();
      if (file && file.type.indexOf('image') !== -1) {
        targetFile = file; // 先把文件存到变量里
        break; 
      }
    }
  }

  if (!targetFile) return;
  const confirm = await confirmWin.normal(GetText("are_you_sure"));
  if (!confirm) {
    console.log("用户取消上传");
    return;
  }
  Upload([targetFile]);
}