import {HeadBar, SideBar, TopBar ,Content,GoTopBtn,ScrollTop,GoBack} from '../widget/public'
import { createRoot } from 'react-dom/client'
import {DocList,GoUp,ShowPath,GlobalProvider} from '../widget/doc'
import '../css/page/doc.css'
import '../css/public/all.css'
import '../css/public/page.css'
createRoot(document.getElementById('root')).render(
    <GlobalProvider>
      <ScrollTop>
        <HeadBar/>
        <GoBack/>
        <TopBar>
          <GoUp/>
        <ShowPath/>
        </TopBar>
        <GoTopBtn/>
      </ScrollTop>
        <SideBar/>
        <Content>
        <DocList />
        </Content>
  </GlobalProvider>
)