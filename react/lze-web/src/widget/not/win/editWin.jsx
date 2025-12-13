import { useGlobal,Save_note } from "../global";
import {WinBg} from'../../../components/winBg'
import { useEffect, useState } from "react";
import { GetText } from "../../../utils/common";
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
        save_edit()
    }
    }
const enter_save=(e)=>{
    if(e.key==="Enter"){
        save_edit()
    }
}

const save_edit=()=>{
    if(!confirm(GetText("are_you_sure")))
        return
        Save_note(title,text)
}
return(
    <WinBg showBg={edit.mode?true:false}>
        <div id="edit-back"
                onKeyDown={key_save}
                >
        <button className="btn" id="close-edit" title={GetText("close")}
        onClick={()=>setGlobal({edit:{mode:false}})}
        ></button>
        <button className="btn save" id="save-edit" title={GetText("save")}
         onClick={()=>{
        save_edit()
            }}></button>
         <input value={title} 
         onChange={(e)=>setTitle(e.target.value)} 
                onKeyDown={enter_save}
            id="edit-title" type="text" placeholder={GetText("title")}/>
             <textarea value={text}
            id="edit-text"
            placeholder={GetText("input_content")}
            onChange={(e)=>setText(e.target.value)}
            />
            </div>
    </WinBg>
)
}