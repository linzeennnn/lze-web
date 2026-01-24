import  Content  from "../../../components/content";
import { useGlobal } from "../global";
import Note from "./note";
export default function NotContent(){
    const inner=useGlobal((state)=>state.inner)
    const notList=useGlobal((state)=>state.notList)
    return(
        <Content innerMode={inner.enable}>
            {notList?notList.map((name,index)=>(
                <Note name={name} key={index+name}></Note>
            )):null}
        </Content>
    )
}