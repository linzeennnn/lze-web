import { useEffect, useState } from "react";
import { useGlobal } from "../global";
export default function Widget() {
    const locked = useGlobal(state => state.locked);
    const widget = [
        { id: 'doc', name: '文件管理' },
        { id: 'pic', name: '图库' },
        { id: 'tra', name: '回收站' },
        { id: 'mon', name: '控制面板' },
        { id: 'not', name: '便签' },
        { id: 'bok', name: '书签' }
    ];

    const rows = [];
    for (let i = 0; i < widget.length; i += 2) {
        rows.push(widget.slice(i, i + 2));
    }
    return (
        <div id='widget'
        className={locked?"":"widget-load"}
        >
            {rows.map((row, index) => (
                <div key={`line${index}`} className="widget-line">
                    {row.map((item) => (
                        <div key={item.id} id={item.id} 
                        className="widget-item"
                        title={'进入'+item.name} 
                        onClick={
                            ()=>to_next(item.id)
                            }>
                            <span className="widget-title">{item.name}</span>
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
