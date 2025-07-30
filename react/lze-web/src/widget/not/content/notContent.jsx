import  Content  from "../../../components/content";
import { useGlobal } from "../global";
import Note from "./note";
export default function NotContent(){
    const notList=useGlobal((state)=>state.notList)
    return(
        <Content>
            {notList?notList.map((name,index)=>(
                <Note name={name} key={index+name}></Note>
            )):null}
        </Content>
    )
}