import {Content} from '../../public'
import { useGlobal} from '../global'
import ControlBar from './controlBar'
export default function MonContent(){
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