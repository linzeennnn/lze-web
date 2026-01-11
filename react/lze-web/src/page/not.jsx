import { createRoot } from 'react-dom/client'
import App from '../widget/not/App'
import { InitData } from '../widget/not/global'
InitData()
createRoot(document.getElementById('root')).render(
    <App/>
)