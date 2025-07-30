import { useState } from "react"

export default function Textbar(){
    const [text,settext]=useState("")
    const[showInput,setShowInput]=useState(false)
    return(
        <>
       {showInput?(<div id="text-bar">
            <button className="btn" id="text-close" title="关闭"
        onClick={()=>{setShowInput(false)}}
            ></button>
            <textarea id="text-input" value={text} placeholder="输入内容..."
            onChange={(e)=>{
                settext(e.target.value)
            }}
            ></textarea>
            <button className="btn" id="text-save" title="保存"></button>
        </div>):
        ( <div id="text-show" title="输入"
        onClick={()=>{setShowInput(true)}}
        >
            {text}
        </div>)
        }
        </>
    )
}