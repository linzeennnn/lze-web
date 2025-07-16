import { useEffect } from "react";
import { Content } from "../../public";
import { useGlobal,list } from "../global";
import Note from "./note";
export default function NotContent(){
    const notList=useGlobal((state)=>state.notList)
    useEffect(() => {
        list()
    }, []);
    return(
        <Content>
            {notList?notList.map((name,index)=>(
                <Note name={name} key={index+name}></Note>
            )):null}
        </Content>
    )
}