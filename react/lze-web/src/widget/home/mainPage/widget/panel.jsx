import React from "react";
import { notify } from "../../../public/notify";
import { useGlobal } from "../../global";

export default function Panel({showItem,type}){
    return(
        <div className="widget-panel">
            {
                showItem.map((item,index)=>{
                    return (
                    <React.Fragment key={item+index}>
                        {type=="tra"&&<li>最近删除</li>}
                        {type=="bok"&&<li>最近访问</li>}
                    <div className={"widget-panel-item "+type+"-panel"} title="查看"
                    onClick={(e)=>{
                        e.stopPropagation();
                        openListWin(type,item)}}>
                       {type=="pic"? get_pic(item):(<span className={"panel-text "+(item==""?"panel-text-null":"")}>
                            {item==""?"无":item}
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
return (<span className="panel-text panel-text-null">空</span>)
}
function openListWin(type,name){
    if(type=="tra"){
        notify("最近删除文件:"+name)
        return
    }
    if(type=="mon"){
        const user=useGlobal.getState().userName
        notify("当前用户:"+user)
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