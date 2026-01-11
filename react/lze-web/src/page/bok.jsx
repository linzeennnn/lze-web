import { createRoot } from 'react-dom/client'
import App from '../widget/bok/App'
import { InitData } from '../widget/bok/global'
InitData()
createRoot(document.getElementById('root')).render(
    <App/>
)