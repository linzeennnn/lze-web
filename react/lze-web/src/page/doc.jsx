import {HeadBar, SideBar, TopBar ,Content,GoTopBtn,ScrollTop} from '../widget/public'
import { createContext, StrictMode, useContext } from 'react'
import { createRoot } from 'react-dom/client'
import {DocList,GoUp} from '../widget/doc'
import {GlobalProvider} from '../widget/doc/docFun'
createRoot(document.getElementById('root')).render(
    <GlobalProvider>
      <ScrollTop>
        <HeadBar/>
        <TopBar>
          <GoUp/>
        </TopBar>
        <GoTopBtn></GoTopBtn>
      </ScrollTop>
        <SideBar/>
        <Content>
        <DocList ref={docListRef}/>
        </Content>
  </GlobalProvider>
)