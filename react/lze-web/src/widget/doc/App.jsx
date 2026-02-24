import DocContent from './content/docContent';
import DocTopBar from './topBar/docTopBar';
import DocSideBar from './sideBar/docSideBar';
import DocWin from './win/docWin'
import {ScrollTop} from '../../components/scrollTop'
import GoTopBtn from '../../components/goTopBtn'
import HeadBar from '../../components/headBar'
import GoBack from '../../components/goBack'
import PublicWidget from "../../components/public/publicWidget";
import '../../css/page/doc.css';
import '../../css/public/all.css';
import '../../css/public/page.css';
import { useThemeStore } from '../../store/theme';
export default function App() {
    const theme=useThemeStore(state=>state.theme)
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
