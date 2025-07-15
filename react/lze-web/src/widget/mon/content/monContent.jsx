import { useEffect } from 'react'
import {Content} from '../../public'
import { useGlobal,list } from '../global'
import ControlBar from './controlBar'
export default function MonContent(){
    useEffect(()=>{
        list()
    },[])
    const config=useGlobal((state)=>state.config)
    return(
        <Content>
            {config?
                Object.entries(config.control).map(([key,Mes])=>{
                    return (<ControlBar
                    keyName={key} Mes={Mes} key={key}
                    />)
                }):null
            }
        </Content>
    )
}