import {
  HeadBar,
  SideBar,
  TopBar,
  Content,
  GoTopBtn,
  ScrollTop,
  GoBack,
  WinBg
} from '../public';

import {
  DocList,
  GoUp,
  TopBarBox,
  NewDirBtn
} from '.';

import '../../css/page/doc.css';
import '../../css/public/all.css';
import '../../css/public/page.css';

import useGlobal from './global'; // 注意这里是 zustand store

export default function App() {
  const showBg = useGlobal((state) => state.showBg);
  return (  <>
      <ScrollTop>
        <HeadBar />
        <GoBack />
        <TopBar>
          <GoUp />
          <TopBarBox />
          <NewDirBtn />
        </TopBar>
        <GoTopBtn />
      </ScrollTop>
      <SideBar />
      <Content>
        <DocList />
      </Content>
      <WinBg showBg={showBg} />
    </>
  );
}
