import { createRoot } from 'react-dom/client'
import App from '../widget/tra/App'
import { InitData } from '../widget/tra/global'
InitData() 
createRoot(document.getElementById('root')).render(
    <App/>
)