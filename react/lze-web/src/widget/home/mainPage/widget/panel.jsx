import React from "react";
import { notify } from "../../../../utils/common";
import { useGlobal } from "../../global";
import {GetText} from "../../../../utils/common"
import { getUsername } from "../../../../store/request";
import { GetPageSession,SetPageSession } from "../../../../utils/pageSession";
import { Page } from "../../../../utils/page";
export default function Panel({showItem,type,show}){
    return(
        <div className={"widget-panel "+(show?"widget-hide":"")} key={type+"panel"}>
            {
                showItem.map((item,index)=>{
                    return (
                    <React.Fragment key={item+index}>
                        {type=="tra"&&<li>{GetText("recent_delete")}</li>}
                        {type=="bok"&&<li>{GetText("recent_visit")}</li>}
                    <div className={"widget-panel-item "+type+"-panel"} title={GetText("view")}
                    onClick={(e)=>{
                        e.stopPropagation();
                        openListWin(type,item)}}>{
                            getPanelText(item,type)
                        }
                    </div>
                    </React.Fragment>
                    )
                })
            }
        </div>
    )
}
// mon分字符串
function getPanelText(item,type) {
    switch (type) {
        case "pic":
            return get_pic(item)
        case "mon":
            return get_mon(item)
        default:
            return(<span className={"panel-text "+(item==""?"panel-text-null":"")}>
                            {item==""?GetText("empty"):item}
                            </span>)
    }
}
function get_mon(str){
    const arr=str.split("/");
    switch (arr[0]) {
        case "per_num":
            return GetText(arr[0])+":"+arr[1]
        default:
            return GetText(arr[0])+":"+((arr[1]=="never"||arr[1]=="none")?
                GetText(arr[1]):arr[1]+GetText(arr[2])
            )
    }
}
function get_pic(picMes){
const url=window.location.origin+"/file/Pictures/"+picMes.name;
if(picMes.media=="img"){
    return <img src={url} alt={picMes.name} />
}
if(picMes.media=="vid"){
    return <video src={url} controls="controls" />
}
return (<span className="panel-text panel-text-null">{GetText("empty")}</span>)
}
function openListWin(type,name){
    if(type=="tra"){
        notify.normal(GetText("recent_delete")+":"+name)
        return
    }
    if(type=="mon"){
        const user=getUsername()
        notify.normal(GetText("current_user")+":"+user)
        return
    }
    entryApp(type,name)
}
function entryApp(type,name){
const pageSession=GetPageSession()

pageSession[type].list.path=name
SetPageSession(pageSession)
Page(type)

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