import {  useContext, useState } from "react"
import Login from "./login"
import { useGlobal } from "./global"
import {WinBgContext} from '../public/winBg'
export default function Dock(){
   const{showBg,setBg}=useContext(WinBgContext)
   const [appType, setAppType] = useState("")
const open_dock=(type)=>{
    setAppType(type)
    setBg(true)
}
const close_dock=()=>{
    setBg(false)
    setAppType("")
}
   const dockList=[
    {id:"login",name:"登陆管理"},
    {id:"theme",name:"主题"},
    {id:"sys",name:"系统监视器"},
    {id:"lock",name:"锁屏"}
]
    return(
        <>{
       showBg? (<div className={`app-win ${ showBg?"float-win":""}`}>
            <button className="btn" 
            id="close-win" 
            title="关闭"
            onClick={()=>close_dock()}></button>
            {
            
                appType=="login"?(<Login />):null
            }
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