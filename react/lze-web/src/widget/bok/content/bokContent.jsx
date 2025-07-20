import Content from '../../public/content'
// import {notify} from '../../public/notify'
import {useGlobal,list} from '../global'
import { useEffect } from 'react';
import BokItem from './bokItem';
// import FileItem from './fileItem';
export default function DocContent(){
    const bokList=useGlobal((state)=>state.bokList)
  useEffect(() => {
    list("");
  }, []);
    return(
        <Content>
            {
                bokList.map((bokMes,index)=>{
                   return <BokItem key={index+bokMes.name} bokMes={bokMes} />
                })
            }
        </Content>
    )
}
