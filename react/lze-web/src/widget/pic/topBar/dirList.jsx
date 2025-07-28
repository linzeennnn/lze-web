import { useState } from "react"
import {useGlobal,list} from '../global'
export default function DirList(){
    const[showList,setShowList]=useState(false)
    const dirList=useGlobal((state)=>state.dirList)
    const nowPath=useGlobal((state)=>state.nowPath)
    const openList=()=>{
        showList?setShowList(false):setShowList(true)
    }
    return(
        <>
        <div id="dir-list" className="btn" 
        title="查看其他相册" onClick={()=>openList()}
        >
            <div id="dir-list-box"
            style={{ display: showList ? "flex" : "none" }}
            >
                {   
                    dirList.map((dir,index)=>{
                        return(
                            <div id="dir-item" key={dir+index}
                            title={"查看"+dir} onClick={()=>{list(nowPath+"/"+dir)}}
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