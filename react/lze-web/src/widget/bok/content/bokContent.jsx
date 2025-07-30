import Content from '../../../components/content'
// import {notify} from '../../../components/notify'
import {useGlobal,list} from '../global'
import { useEffect } from 'react';
import BokItem from './bokItem';
// import FileItem from './fileItem';
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
