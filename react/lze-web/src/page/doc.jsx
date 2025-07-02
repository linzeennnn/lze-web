import {HeadBar, SideBar, TopBar ,Content,GoTopBtn,ScrollTop} from '../widget/public'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'


createRoot(document.getElementById('root')).render(
    <StrictMode>
      <ScrollTop>
        <HeadBar/>
        <TopBar/>
        <GoTopBtn/>
      </ScrollTop>
        <SideBar/>
        <Content/>
  </StrictMode>
)