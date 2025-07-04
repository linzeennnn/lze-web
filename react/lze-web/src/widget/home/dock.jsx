import {  useState } from "react"
import Login from "./login"
export default function Dock(){
    const [dockData,setDockData]=useState({
        showWin:false,
        appType:""
    })
const open_dock=(type)=>{
    setDockData({
        showWin:true,
        appType:type
    })
}
const close_dock=()=>{
    setDockData({
        showWin:false,
        appType:""
    })
}
   const dockList=[
    {id:"login",name:"登陆管理"},
    {id:"theme",name:"主题"},
    {id:"sys",name:"系统监视器"},
    {id:"lock",name:"锁屏"}
]
    return(
        <>{
       dockData.showWin? (<div id="app-win-back">
        <div id="app-win">
            <button className="btn" 
            id="close-win" 
            title="关闭"
            onClick={()=>close_dock()}></button>
            {
            
                dockData.appType=="login"?(<Login/>):null
            }
        </div>
        </div>):null}
        <div id="dock">
            {dockList.map((item)=>{
                return(
                <div id={item.id} 
                key={item.id} 
                title={item.name} 
                className="dock-app"
                onClick={()=>open_dock(item.id)}>
                    <div id={item.id + "icon"}></div>
                </div>)
    })}
</div>
</>)
}