import { GetText, useGlobal } from "../../global"
import { GetLangList } from "../../../../components/getLang"
import { useState } from "react"
export default function Lang(){
    const lang=useGlobal(state=>state.lang)
    const [showList,setShowList]=useState(false)
    const list={
        system:GetText("system"),
        zh:"简体中文",
        en:"English"
    }
    return(
        <>{showList?
            (<div id="lang-list"
            onClick={()=>{}}>{
                Object.entries(list).map(([key, value])=>(
                    <div key={key} className={"lang-list-item "+(key===lang.userSelect?'lang-select':'')}
                    onClick={async ()=>{
                        localStorage.setItem("lang",key)
                        setShowList(false)
                          useGlobal.setState({
                            lang:await GetLangList()
                          })
                    }}
                    >
                        <span>{value}</span>
                    </div>
                ))}</div>):
        (<div id="show-lang"
            title={GetText("switch")}
            onClick={()=>{setShowList(true)}}>
            <span>{list[lang.userSelect]}</span>
            <div></div>
        </div>)
        }
        </>
    )
}