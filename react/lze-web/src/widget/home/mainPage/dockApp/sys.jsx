import React, { useEffect, useState } from "react"
import {GetText} from "../../../../utils/common"
import { Api } from "../../../../utils/request"
import { Icon } from "../../../../utils/icon"
export default function Sys(){
    const [loaded,setLoaded]=useState(false)
    const barList=[
        {id:"cpu",name:GetText("cpu_usage")},
        {id:"mem",name:GetText("mem_usage")},
        {id:"disk",name:GetText("disk_usage")},
    ]
    const [recData,setRecData]=useState(
        {
            cpu:{data:"",percent:"0%"},
            mem:{data:"",percent:"0%"},
            disk:{data:"",percent:"0%"},
            net:{up:"0.00MB",down:"0.00MB"}
        }

    )
    useEffect(()=>{
        const intervalId=setInterval(() => {
            Api.get({
                api:'system/system',
                loading:false,
                success:(data)=>{
                    setRecData({
                        cpu:{data:"",percent:data.cpuPercent},
                        mem:{data:data.memData,percent:data.memPercent},
                        disk:{data:data.diskData,percent:data.diskPercent},
                        net:{up:data.netUp,down:data.netDown}
                    })
                    if(!loaded){
                        setLoaded(true)
                    }
                }
            })

        }, 3000);
        return()=>{
            clearInterval(intervalId)
        }
        },[])
    return(
        <div id="sys-app">
           {!loaded?( <div id="sys-loadPage">
                <div className="loading"></div>
            </div>):null}
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
                <div id="net-box" className="sys-box" title={GetText("net_usage")}>
                    <span id="net-icon" className="sys-icon"></span>
                    <div className="sys-icon">{Icon("toUp")}</div>    
                    <span id="net-up-data" className="sys-data">
                        {recData.net.up}
                    </span>
                    <div  className="sys-icon">{Icon("toDown")}</div>
                    <span id="net-down-data" className="sys-data">
                        {recData.net.down}
                    </span>
                </div>
        </div>
    )
}