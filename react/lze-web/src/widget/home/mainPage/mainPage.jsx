import Widget from './widget/widget'
import Dock from './dock'
import {useGlobal} from '../global'
import { WinBg } from '../../../components/winBg'
import { useEffect, useState } from 'react'
import Listwin from './listWin/listWin'
export default function MainPage() {
    const showBg = useGlobal(state => state.showBg)
  const[tmpLoad,setTmpLoad]=useState(true)
   return (
    <>
      <WinBg showBg={showBg} />
      <Widget tmpLoad={tmpLoad}/>
      <Dock  tmpLoad={tmpLoad} setTmpLoad={setTmpLoad}/>
    </>
  )
}
