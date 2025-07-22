import React, { useEffect, useState } from "react"

export default function Sys(){
    const [loaded,setLoaded]=useState(false)
    const barList=[
        {id:"cpu",name:"CPU使用率"},
        {id:"mem",name:"内存使用率"},
        {id:"disk",name:"磁盘使用率"},
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
            fetch(window.location.origin+'/server/system/system',{
                method:"GET",
                headers:{
                    "Content-Type":"application/json"
                }
            })
            .then(rss=>rss.json())
            .then(data=>{
                setRecData({
                    cpu:{data:"",percent:data.cpuPercent},
                    mem:{data:data.memData,percent:data.memPercent},
                    disk:{data:data.diskData,percent:data.diskPercent},
                    net:{up:data.netUp,down:data.netDown}
                })
                if(!loaded){
                    setLoaded(true)
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