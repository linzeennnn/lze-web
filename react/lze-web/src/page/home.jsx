import {Widget,Dock} from '../widget/home'
import '../css/page/home.css'
import '../css/public/all.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'


createRoot(document.getElementById('root')).render(
    <StrictMode>
     <Widget /> 
     <Dock/>
  </StrictMode>,
)
