import MonContent from './content/monContent';
import MonTopBar from './topBar/monTopBar';
import MonSideBar from './sideBar/monSideBar';
import MonWin from './win/monWin'
import {ScrollTop} from '../../components/scrollTop'
import GoTopBtn from '../../components/goTopBtn'
import HeadBar from '../../components/headBar'
import GoBack from '../../components/goBack'
import PublicWidget from '../../components/public/publicWidget'
import '../../css/page/mon.css';
import '../../css/public/all.css';
import '../../css/public/page.css';
import { useGlobal } from './global';


export default function App() {
  const theme=useGlobal(state=>state.theme)
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
      <PublicWidget/>
      <div className='wallpaper'></div>
    </div>
  );
}
