import { useState } from "react"
import { GetText } from "../../../utils/common";
import {useGlobal,list} from '../global'
import { Icon } from "../../../utils/icon";
import { getNowPath } from "../../../store/CacheList";
export default function DirList(){
    const[showList,setShowList]=useState(false)
    const dirList=useGlobal((state)=>state.dirList)
    const openList=()=>{
        showList?setShowList(false):setShowList(true)
    }
    return(
        <>
        <div id="dir-list" className="btn" 
        title={GetText("view_album")} onClick={()=>openList()}
        >{Icon("option")}
            <div id="dir-list-box"
            style={{ display: showList ? "flex" : "none" }}
            >
                {   
                    dirList.map((dir,index)=>{
                        return(
                            <div id="dir-item" key={dir+index}
                            title={GetText("view")+dir} onClick={()=>{list(getNowPath()+"/"+dir)}}
                            >{dir}</div>
                        )
                    })
                }
                </div>
        </div>
        {showList?<div id="close-list-win" 
        onClick={()=>openList()}
        ></div>:null}
        </>
    )
}