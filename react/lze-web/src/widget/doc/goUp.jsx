import { useRef } from "react"
import DocList from "./docList"
export default function goUp(){
    const docListRef=useRef()
    const reloadList=(path)=>{
        docListRef.current.readLoad_dir(path)
    }
return(
    <>
    <button id="go-up"
     className="btn"
    // onClick={}
    ></button>
    </>
)
}