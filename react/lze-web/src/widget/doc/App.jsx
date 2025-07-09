import DocContent from './content/docContent';
import DocTopBar from './topBar/docTopBar';
import DocSideBar from './sideBar/docSideBar';
import DocWin from './win/docWin'
import {ScrollTop,GoTopBtn,HeadBar,GoBack} from '../public'
import '../../css/page/doc.css';
import '../../css/public/all.css';
import '../../css/public/page.css';


export default function App() {
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
