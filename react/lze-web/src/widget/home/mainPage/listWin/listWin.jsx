import { useEffect } from "react"
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
function creatList(type, name) {
  switch(type) {
    case "doc":
      return <ListDoc name={name} />;
    case "pic":
      return <ListPic name={name} />;
    case "not":
      return <ListNot name={name} />;
    case "bok":
      return <ListBok name={name} />;
    default:
      return null;
  }
}
function ListDoc({ name }) {
  useEffect(() => {
  }, []);
  return <div id="doc-list"></div>;
}

function ListPic(name){

}
function ListNot(name){

}
function ListBok(name){

}