import BokContent from './content/bokContent';
import BokTopBar from './topBar/bokTopBar';
import BokSideBar from './sideBar/bokSideBar';
import BokWin from './win/bokWin'
import {ScrollTop,GoTopBtn,HeadBar,GoBack} from '../public'
import '../../css/page/bok.css';
import '../../css/public/all.css';
import '../../css/public/page.css';


export default function App() {
  return ( 
     <>
      <ScrollTop>
        <HeadBar />
      <BokTopBar />
        <GoBack />
        <GoTopBtn />
      </ScrollTop>
        <BokWin/>
      <BokSideBar />
      <BokContent />
    </>
  );
}
