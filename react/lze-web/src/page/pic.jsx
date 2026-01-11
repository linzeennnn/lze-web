import { createRoot } from 'react-dom/client'
import App from '../widget/pic/App'
import { InitData } from '../widget/pic/global'
InitData()
createRoot(document.getElementById('root')).render(
    <App/>
)