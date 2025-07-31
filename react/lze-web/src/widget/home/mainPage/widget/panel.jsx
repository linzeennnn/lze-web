import React from "react";
import { notify } from "../../../../components/notify";
import { GetText, useGlobal } from "../../global";

export default function Panel({showItem,type}){
    return(
        <div className="widget-panel">
            {
                showItem.map((item,index)=>{
                    return (
                    <React.Fragment key={item+index}>
                        {type=="tra"&&<li>{GetText("recent_delete")}</li>}
                        {type=="bok"&&<li>{GetText("recent_visit")}</li>}
                    <div className={"widget-panel-item "+type+"-panel"} title={GetText("view")}
                    onClick={(e)=>{
                        e.stopPropagation();
                        
                        openListWin(type,item)}}>
                       {type=="pic"? get_pic(item):(<span className={"panel-text "+(item==""?"panel-text-null":"")}>
                            {item==""?GetText("empty"):item}
                            </span>)}
                    </div>
                    </React.Fragment>
                    )
                })
            }
        </div>
    )
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
        notify(GetText("recent_delete")+":"+name)
        return
    }
    if(type=="mon"){
        const user=useGlobal.getState().userName
        notify(GetText("current_user")+":"+user)
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