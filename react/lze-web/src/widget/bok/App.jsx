import BokContent from './content/bokContent';
import BokTopBar from './topBar/bokTopBar';
import BokSideBar from './sideBar/bokSideBar';
import BokWin from './win/bokWin'
import {ScrollTop} from '../../components/scrollTop'
import GoTopBtn from '../../components/goTopBtn'
import HeadBar from '../../components/headBar'
import GoBack from '../../components/goBack'
import PublicWidget from '../../components/public/publicWidget';
import '../../css/page/bok.css';
import '../../css/public/all.css';
import '../../css/public/page.css';
import { useThemeStore } from '../../store/theme';

export default function App() {
  const theme=useThemeStore(state=>state.theme)
  return ( 
     <div id='app' mode={theme.mode} color={theme.color["bok"]}>
      <div className='wallpaper'></div>
      <ScrollTop>
        <HeadBar />
      <BokTopBar />
        <GoBack />
        <GoTopBtn />
      </ScrollTop>
        <BokWin/>
      <BokSideBar />
      <BokContent />
      <PublicWidget/>
    </div>
  );
}
