import { useGlobal } from "../../global"
import {GetText} from "../../../../utils/common"
import { GetLangList } from "../../../../utils/common"
import { useState } from "react"
import { useLangStore,setLang } from "../../../../store/lang"
export default function Lang(){
    const lang=useLangStore((state)=>state.lang)
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
                          setLang(await GetLangList())
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