import { createRoot } from 'react-dom/client'
import App from '../widget/mon/App'
import { InitData } from '../widget/mon/global'
InitData();
createRoot(document.getElementById('root')).render(
    <App/>
)