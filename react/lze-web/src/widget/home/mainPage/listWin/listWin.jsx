import { useEffect, useState } from "react"
import { WinBg } from "../../../../components/winBg"
import {  GetIcon, useGlobal } from "../../global"
import {GetText} from "../../../../utils/common"
import { Api } from "../../../../utils/request"
import { GetPageSession, SetPageSession } from "../../../../utils/pageSession"
import { Page } from "../../../../utils/page"
import { useThemeStore } from "../../../../store/theme"
export default function Listwin(){
   const listWin = useGlobal(state => state.listWin)

  useEffect(() => {
    if (!listWin) return

    switch (listWin.type) {
      case "doc":
        ListDoc(listWin.name)
        break
      case "pic":
        ListPic(listWin.name)
        break
      case "not":
        ListNot(listWin.name)
        break
      case "bok":
      return <ListBok name={listWin.name} />;
        break
    }
  }, [listWin])

  return null
}
function ListDoc(name) {
const pageSession=GetPageSession()
pageSession.doc.list.path=name
SetPageSession(pageSession)
console.log(111);

// Page("doc")
}

function ListPic(name){
  const pageSession=GetPageSession()
  pageSession.pic.list.path=name.name
  SetPageSession(pageSession)
  Page("pic")
}
function ListNot(path){
const pageSession=GetPageSession()
pageSession.not.list.path=path
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