import React, { useState } from "react"

export default function Sys(){
    const barList=[
        {id:"cpu",name:"CPU使用率",data:"",percent:""},
        {id:"mem",name:"内存使用率",data:"",percent:""},
        {id:"disk",name:"磁盘使用率",data:"",percent:""},
    ]
    const [recData,setRecData]=useState(
        {
            cpu:{data:"",percent:"0%"},
            mem:{data:"",percent:"0%"},
            disk:{data:"",percent:"0%"},
            net:{up:"0.00MB",down:"0.00MB"}
        }

    )
    return(
        <div id="sys-app">
        {
            barList.map((item)=>{
                return  (
                    <React.Fragment key={item.id}>
                <div  className="sys-box" title={item.name}>
                <div id={item.id+"-bar"} className="sys-bar">
                    <div id={item.id+"-icon"} className="sys-icon"></div>
                    <div id={item.id+"-progress-bar"} className="sys-progress-bar">
                    <div className="sys-progress"
                    style={{width:recData[item.id].percent}}
                    ></div>
                    </div>
                    <span id={item.id+"-percent"} className="sys-percent">
                        {recData[item.id].percent}
                    </span>
                </div>
                <span className="sys-data">
                {recData[item.id].data}
                </span>
                </div>
                </React.Fragment>
                )
            })
        }
                <div id="net-box" className="sys-box" title="网络使用率">
                    <span id="net-icon" className="sys-icon"></span>
                    <div id="net-up" className="sys-icon"></div>    
                    <span id="net-up-data" className="sys-data">
                        {recData.net.up}
                    </span>
                    <div id="net-down" className="sys-icon"></div>
                    <span id="net-down-data" className="sys-data">
                        {recData.net.down}
                    </span>
                </div>
        </div>
    )
}