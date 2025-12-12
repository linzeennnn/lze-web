import React from "react";
import { notify } from "../../../../utils/common";
import { useGlobal } from "../../global";
import {GetText} from "../../../../utils/common"
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
function splitStr(){
    const index = str.indexOf('/');
    return [str.slice(0, index), str.slice(index + 1)];
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
        const user=useGlobal.getState().userName
        notify.normal(GetText("current_user")+":"+user)
        return
    }
    if((type!="pic"&&name!="")||
        (type=="pic"&&name.name!="")){
    useGlobal.setState({
        listWin:{
            type:type,
            name:name,
            status:true
        }
    })
}
}