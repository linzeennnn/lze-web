import MonContent from './content/monContent';
import MonTopBar from './topBar/monTopBar';
import MonSideBar from './sideBar/monSideBar';
import MonWin from './win/monWin'
import {ScrollTop,GoTopBtn,HeadBar,GoBack} from '../public'
import '../../css/page/mon.css';
import '../../css/public/all.css';
import '../../css/public/page.css';


export default function App() {
  return ( 
     <>
      <ScrollTop>
        <HeadBar />
      <MonTopBar />
        <GoBack />
        <GoTopBtn />
      </ScrollTop>
        <MonWin/>
      <MonSideBar />
      <MonContent />
    </>
  );
}
