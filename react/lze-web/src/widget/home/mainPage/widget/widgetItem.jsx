import {GetText} from "../../../../utils/common"
import {Page} from "../../../../utils/page.js"
import {useState } from "react";
import Panel from './panel'
import {FillIcon, Icon} from "../../../../utils/icon";
export default function WidgetItem({ theme, item,  widgetData }){
    const [showPanel, setShowPanel] = useState(false)
    return(
        <>
        <div key={item} id={item+"widget"} 
                        className="widget-item"
                        title={GetText("enter")+":"+GetText(item)} 
                        mode={theme.mode}
                        color={theme.color[item]}
                        onClick={
                            ()=>Page(item)
                            }>
                              <div className={"widget-icon "+(showPanel?"widget-hide":"")} >
                                <div  id={item+"-icon"}>{
                                  FillIcon(item,"base_color")
                                  }</div>
                                </div>  
                              <Panel showItem={widgetData[item]} type={item} show={!showPanel}/>
                              <div className={"show-panel btn "+(showPanel?"show-panel-enable":"") }
                              title={GetText("show")}
                              onClick={(e)=>{
                                e.stopPropagation();
                                setShowPanel(!showPanel)}}
                              >{Icon("option")}</div>
                              
                            <span className="widget-title"
                            mode={theme.mode}
                            color={theme.color["home"]}>{GetText(item)}</span>
                        </div>
        </>
    )
}
