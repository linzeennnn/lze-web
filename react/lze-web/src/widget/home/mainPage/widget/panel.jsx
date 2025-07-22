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
function get_pic(name){
const imageExts = ["jpg", "jpeg", "png", "gif", "webp", "bmp", "svg", "ico", "apng", "avif"];
const videoExts = ["mp4", "webm", "ogg", "ogv", "mov", "m4v", "avi", "3gp", "mkv"];
const ext = name.split(".").pop().toLowerCase();
const url=window.location.origin+"/file/Pictures/"+name;
if(imageExts.includes(ext)){
    return <img src={url} alt={name} />
}
if(videoExts.includes(ext)){
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
    useGlobal.setState({
        listWin:{
            type:type,
            name:name,
            status:true
        }
    })
}