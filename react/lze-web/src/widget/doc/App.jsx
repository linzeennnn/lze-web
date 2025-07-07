import DocContent from './content/docContent';
import DocTopBar from './topBar/docTopBar';
import DocSideBar from './sideBar/docSideBar';
import {ScrollTop,GoTopBtn,HeadBar,GoBack,WinBg} from '../public'
import {useGlobal}from './global'; // 注意这里是 zustand store
import '../../css/page/doc.css';
import '../../css/public/all.css';
import '../../css/public/page.css';


export default function App() {
  const showBg = useGlobal((state) => state.showBg);
  const loading = useGlobal((state) => state.loading);
  return ( 
     <>
      <div className="loading" id="list-loading" style={loading ? { display: "block" } : { display: "none" }}></div>
      <ScrollTop>
        <HeadBar />
        <GoBack />
        <GoTopBtn />
      </ScrollTop>
      <DocSideBar />
      <DocTopBar />
      <DocContent />
      <WinBg showBg={showBg} />
    </>
  );
}
