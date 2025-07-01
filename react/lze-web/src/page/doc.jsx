import {HeadBar, SideBar, TopBar ,BottomBar,Content} from '../widget/public'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'


createRoot(document.getElementById('root')).render(
    <StrictMode>
        <HeadBar/>
        <SideBar/>
        <TopBar/>
        <BottomBar/>
        <Content/>
  </StrictMode>
)