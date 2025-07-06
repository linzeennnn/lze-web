import { Widget, Dock } from '.'
import useGlobal from './global'
import { WinBg } from '../public/winBg'
import '../../css/page/home.css'
import '../../css/public/all.css'

export default function App() {
    const showBg = useGlobal(state => state.showBg)
   return (
    <>
      <WinBg showBg={showBg} />
      <Widget />
      <Dock />
    </>
  )
}

