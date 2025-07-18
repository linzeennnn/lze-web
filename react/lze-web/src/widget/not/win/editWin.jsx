import { useGlobal,Save_note } from "../global";
import { notify } from "../../public/notify";
import {WinBg} from'../../public'
import { useEffect, useState } from "react";
export default function EditWin(){
    const edit=useGlobal((state)=>state.edit)
    const [title,setTitle]=useState(edit.title)
    const [text,setText]=useState(edit.text)
    const setGlobal=useGlobal.setState
    useEffect(() => {
    setTitle(edit.title || "");
    setText(edit.text || "");
}, [edit.title, edit.text]);
const key_save=(e)=>{
    const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
    const isCtrlOrCmd = isMac ? e.metaKey : e.ctrlKey;
    if (isCtrlOrCmd && e.key.toLowerCase() === "s") {
        e.preventDefault(); 
        Save_note(title,text)
    }
    }
const enter_save=(e)=>{
    if(e.key==="Enter"){
        Save_note(title,text)
    }
}
return(
    <WinBg showBg={edit.mode?true:false}>
        <div id="edit-back"
                onKeyDown={key_save}
                >
        <button className="btn" id="close-edit" title="关闭"
        onClick={()=>setGlobal({edit:{mode:false}})}
        ></button>
        <button className="btn save" id="save-edit" title="保存"
         onClick={()=>{
            Save_note(title,text)
            }}></button>
         <input value={title} 
         onChange={(e)=>setTitle(e.target.value)} 
                onKeyDown={enter_save}
            id="edit-title" type="text" placeholder="标题"/>
             <textarea value={text}
            id="edit-text"
            placeholder="输入内容...."
            onChange={(e)=>setText(e.target.value)}
            />
            </div>
    </WinBg>
)
}