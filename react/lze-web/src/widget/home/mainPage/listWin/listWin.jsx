import { useEffect, useState } from "react"
import { WinBg } from "../../../../components/winBg"
import {  GetIcon, useGlobal } from "../../global"
import {GetText} from "../../../../utils/common"
import { Api } from "../../../../utils/request"
import { GetPageSession, SetPageSession } from "../../../../utils/pageSession"
import { Page } from "../../../../utils/page"
export default function Listwin(){
    const listWin=useGlobal(state=>state.listWin)
    const theme=useGlobal(state=>state.theme)
    return(
        <WinBg showBg={listWin.status}>
            <div id="close-back"
            onClick={()=>{
                useGlobal.setState({
                    listWin:{
                        type:"",
                        name:"",
                        status:false,
                        color:""
                    }
                })
            }}
            ></div>
            <div className="list-win" 
            color={theme.color[listWin.type]}
            mode={theme.mode}
            id={listWin.type+"-list"}>
            {creatList(listWin.type,listWin.name)}
            </div>
        </WinBg>
    )
}
function creatList(type, name) {
  switch(type) {
    case "doc":
      ListDoc(name)
      return null;
    case "pic":
      return <ListPic name={name} />;
    case "not":
    ListNot(name)
      return null;
    case "bok":
      return <ListBok name={name} />;
    default:
      return null;
  }
}
function ListDoc(name) {
const pageSession=GetPageSession()
pageSession.doc.list.path=name
SetPageSession(pageSession)
Page("doc")
}

function ListPic({name}){
  const url =window.location.origin+"/file/Pictures/"+name.name;
  if(name.media=="vid")
    return <video src={url} controls="controls" className="list-media"/>
  if(name.media="img")
    return(<img src={url} alt={name.name} className="list-media"/>)
}
function ListNot(name){
const pageSession=GetPageSession()
pageSession.not.list.name=name
SetPageSession(pageSession)
Page("not")
}
function ListBok({name}){
  const [loaded,setLoaded]=useState(false)
  const [text,setText]=useState("")
  useEffect(() => {
    GetData("bok/get_url",
      {name},
      setText,
      setLoaded ,
      false
    )
  }, []);
return(
  loaded?
  ( window.location.href=text ):
  <div className="loading"></div>
)
}
function GetData(url,data,setData,setLoaded,json){
  Api.post({
    api:url,
    body:data,
    success:(data)=>{
      setData(data)
      setLoaded(true)
    }
  })
}