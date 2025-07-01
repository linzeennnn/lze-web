import Widget from '../widget/home/widget'
import '../css/page/home.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'


createRoot(document.getElementById('root')).render(
    <StrictMode>
     <Widget /> 
  </StrictMode>,
)
