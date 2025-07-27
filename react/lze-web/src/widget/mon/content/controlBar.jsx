import { useState } from "react"
import ActionBar from "./actionBar"
export default function ControlBar({keyName,Mes}) {
    const [showAction,setShowAction]=useState(false)
    return (
Mes?(<div className="control-bar main-item">
    <span className="control-name">{Mes.name}</span>
    {showAction?(<div className="action-list">
    {Object.entries(Mes.action).map(([actionKey,actionMes])=>{
        return <ActionBar key={keyName+actionKey}
        keyName={{control:keyName,action:actionKey}} Mes={actionMes} />
    })}
    </div>):null}
    <button className="btn show-action" title="显示配置项"
    onClick={()=>{
        showAction?setShowAction(false):setShowAction(true)
    }}
    ></button>
</div>):null
    )
}