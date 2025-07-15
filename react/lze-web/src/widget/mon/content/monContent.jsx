import { useEffect } from 'react'
import {Content} from '../../public'
import { useGlobal,list } from '../global'
import ControlBar from './controlBar'
export default function MonContent(){
    useEffect(()=>{
        list()
    },[])
    const controlList=useGlobal((state)=>state.controlList)
    return(
        <Content>
            {controlList?
                Object.entries(controlList).map(([key,Mes])=>{
                    return (<ControlBar
                    keyName={key} Mes={Mes} key={key}
                    />)
                }):null
            }
        </Content>
    )
}