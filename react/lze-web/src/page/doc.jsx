import {HeadBar, SideBar, TopBar ,Content,GoTopBtn,ScrollTop} from '../widget/public'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import DocList from '../widget/doc/docList'

createRoot(document.getElementById('root')).render(
    <StrictMode>
      <ScrollTop>
        <HeadBar/>
        <TopBar/>
        <GoTopBtn></GoTopBtn>
      </ScrollTop>
        <SideBar/>
        <Content>
        <DocList/>
        </Content>
  </StrictMode>
)