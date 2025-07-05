import {HeadBar, SideBar, TopBar ,Content,GoTopBtn,ScrollTop,GoBack,WinBg} from '../widget/public'
import { createRoot } from 'react-dom/client'
import {DocList,GoUp,TopBarBox,GlobalProvider,NewDirBtn} from '../widget/doc'
import '../css/page/doc.css'
import '../css/public/all.css'
import '../css/public/page.css'
createRoot(document.getElementById('root')).render(
    <GlobalProvider>
      <WinBg>
      <ScrollTop>
        <HeadBar/>
        <GoBack/>
        <TopBar>
          <GoUp/>
        <TopBarBox/>
        <NewDirBtn/>
        </TopBar>
        <GoTopBtn/>
      </ScrollTop>
        <SideBar/>
        <Content>
        <DocList />
        </Content>
      </WinBg>
  </GlobalProvider>
)