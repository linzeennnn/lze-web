import TraContent from "./content/traContent";
import TraTopBar from "./topBar/traTopBar";
import TraSideBar from "./sideBar/traSideBar";
import TraWin from "./win/traWin";
import {ScrollTop,GoTopBtn,HeadBar,GoBack} from '../public'
import '../../css/page/tra.css';
import '../../css/public/all.css';
import '../../css/public/page.css';
export default function App() {
  return ( 
     <>
      <ScrollTop>
        <HeadBar />
        <GoBack />
        <GoTopBtn />
      <TraTopBar></TraTopBar>
      <TraSideBar></TraSideBar>
      <TraContent></TraContent>
      <TraWin/>
      </ScrollTop>
    </>
  );
}
