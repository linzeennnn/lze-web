import { useEffect, useState } from "react";
import { GetText, useGlobal } from "../../global";
import Panel from "./panel";
export default function Widget({tmpLoad}) {
    const locked = useGlobal(state => state.locked);
    const widgetData = useGlobal((state)=>state.widgetData);
    const theme=useGlobal(state=>state.theme)
    const widget = ['doc', 'pic',  'tra', 'mon', 'not','bok'];

    const rows = [];
    for (let i = 0; i < widget.length; i += 2) {
        rows.push(widget.slice(i, i + 2));
    }
    return (
        <div id='widget'
        className={(!locked&&tmpLoad)?"widget-load":""}
        >
            {rows.map((row, index) => (
                <div key={`line${index}`} className="widget-line">
                    {row.map((item) => (
                        <div key={item} id={item+"widget"} 
                        className="widget-item"
                        title={GetText("enter")+":"+GetText(item)} 
                        mode={theme.mode}
                        color={theme.color[item]}
                        onClick={
                            ()=>to_next(item)
                            }>
                              <div className="widget-icon" >
                                <div  id={item+"-icon"}></div>
                                </div>  
                              <Panel showItem={widgetData[item]} type={item}/>
                            <span className="widget-title"
                            mode={theme.mode}
                            color={theme.color["home"]}>{GetText(item)}</span>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}
function to_next(type){
window.location.href=type;
}
