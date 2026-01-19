import { createRoot } from 'react-dom/client'
import App from '../widget/home/App'
import { InitData } from '../widget/home/global'
InitData()
createRoot(document.getElementById('root')).render(
    <App/>
)