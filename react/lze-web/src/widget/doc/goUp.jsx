import { useGlobal} from "./global"
import {list} from './docFun'
export default function goUp(){
    const {value:globalData}=useGlobal()
     const isRoot = globalData.nowPath === "/"
return(
    <>
    <button id="go-up"
     className={(isRoot?"go-up-disable":"" )+ " btn"}
     disabled={isRoot}
     title={isRoot ? "" : "返回上一级"} 
    onClick={()=>{
        list(globalData.parentPath)
    }}
    ></button>
    </>
)
}