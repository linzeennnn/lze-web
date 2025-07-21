import Widget from './widget'
import Dock from './dock'
import {useGlobal} from '../global'
import { WinBg } from '../../public/winBg'
import '../../../css/page/home.css'
import '../../../css/public/all.css'
import { useEffect, useState } from 'react'

export default function MainPage() {
    const showBg = useGlobal(state => state.showBg)
    useEffect(()=>{
        setTimeout(() => {
        setMainLoad(true)
        }, 10);
    },[])
   return (
    <>
      <WinBg showBg={showBg} />
      <Widget />
      <Dock  />
    </>
  )
}

