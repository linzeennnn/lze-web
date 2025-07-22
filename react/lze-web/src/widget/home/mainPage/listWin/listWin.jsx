import { WinBg } from "../../../public"
import { useGlobal } from "../../global"
export default function Listwin(){
    const listWin=useGlobal(state=>state.listWin)
    return(
        <WinBg showBg={listWin.status}>
            <div id="close-back"
            onClick={()=>{
                useGlobal.setState({
                    listWin:{
                        type:"",
                        name:"",
                        status:false,
                    }
                })
            }}
            ></div>
            {creatList(listWin.type,listWin.name)}
        </WinBg>
    )
}
function creatList(type,name){
    switch(type){
        case "doc":
            return listDoc(name)
            break;
        case "pic":
            return listPic(name)
            break;
        case "not":
            return listNot(name)
            break;
        case "bok":
           return listBok(name)
            break;
    }

}
function listDoc(name){
    return(
        <div id="doc-list"></div>
    )
}
function listPic(name){

}
function listNot(name){

}
function listBok(name){

}