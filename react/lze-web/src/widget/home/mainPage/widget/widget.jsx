import { useEffect, useState } from "react";
import { useGlobal } from "../../global";
import Panel from "./panel";
export default function Widget({tmpLoad}) {
    const locked = useGlobal(state => state.locked);
    const widgetData = useGlobal((state)=>state.widgetData);
    const theme=useGlobal(state=>state.theme)
    const widget = [
        { id: 'doc', name: '文件管理' },
        { id: 'pic', name: '图库' },
        { id: 'tra', name: '回收站' },
        { id: 'mon', name: '控制面板' },
        { id: 'not', name: '便签' },
        { id: 'bok', name: '书签'}
    ];

    const rows = [];
    useEffect(() => {
        getWidgetData()
}, [locked, tmpLoad]);

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
                        <div key={item.id} id={item.id+"widget"} 
                        className="widget-item"
                        title={'进入'+item.name} 
                        mode={theme.mode}
                        color={theme.color[item.id]}
                        onClick={
                            ()=>to_next(item.id)
                            }>
                              <div className="widget-icon" >
                                <div  id={item.id+"-icon"}></div>
                                </div>  
                              <Panel showItem={widgetData[item.id]} type={item.id} color={item.color}/>
                            <span className="widget-title"
                            mode={theme.mode}
                            color={theme.color[item.id]}>{item.name}</span>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}
function to_next(type){
window.location.href=type+'.html';
}
function getWidgetData(){
    const user=useGlobal.getState().userName;
    fetch(window.location.origin+'/server/home/widget',{
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify({user})
    })
    .then(res=>res.json())
    .then(data=>{
        useGlobal.setState({widgetData:data})
    })
}
