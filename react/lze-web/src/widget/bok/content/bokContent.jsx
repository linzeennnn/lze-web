import Content from '../../../components/content'
import {useGlobal,list} from '../global'
import BokItem from './bokItem';
export default function DocContent(){
    const bokList=useGlobal((state)=>state.bokList)
    return(
        <Content>
            {
                bokList.map((name,index)=>{
                   return <BokItem key={index+name} name={name} />
                })
            }
        </Content>
    )
}
