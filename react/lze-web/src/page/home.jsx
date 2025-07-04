import {Widget,Dock} from '../widget/home'
import '../css/page/home.css'
import '../css/public/all.css'
import { createRoot } from 'react-dom/client'
import { GlobalProvider } from '../widget/home/global'

createRoot(document.getElementById('root')).render(
    <GlobalProvider>
     <Widget /> 
     <Dock/>
  </GlobalProvider>
)
