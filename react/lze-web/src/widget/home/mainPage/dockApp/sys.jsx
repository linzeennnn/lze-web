import { useState } from "react"

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
        <>
        {
            barList.map((item)=>{
                return 
                (<div key={item.id} id={item.id+"-bar"} className="sys-bar">
                    <div id={item.id+"-icon"} className="sys-icon"></div>
                    <div id={item.id+"-bar"} className="sys-bar">
                    

                    </div>
                </div>)
            })
        }
        </>
    )
}