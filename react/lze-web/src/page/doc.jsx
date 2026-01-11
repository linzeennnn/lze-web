import { createRoot } from 'react-dom/client'
import App from '../widget/doc/App'
import { InitData } from '../widget/doc/global'
InitData()
createRoot(document.getElementById('root')).render(
    <App/>
)