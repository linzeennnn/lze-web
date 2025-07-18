import { use, useEffect, useRef, useState } from "react";
import { TopBar } from "../../public";
import { Save_note,useGlobal } from "../global";
export default function NotTopBar(){
    const edit=useGlobal((state)=>state.edit)
    const[textInput,setTextInput]=useState(false)
    const[text,setText]=useState('')
    const[title,setTitle]=useState('')
     const textareaRef = useRef(null); 
    useEffect(() => {
    if (textInput && textareaRef.current) {
        const el = textareaRef.current;
        el.focus(); // 聚焦
        // 将光标移动到文本末尾
        el.selectionStart = el.selectionEnd = el.value.length;
    }
}, [textInput]);
    return(
        <TopBar>
            <div id="add-title-box">
                <input placeholder="标题" 
                value={title}
                onChange={(e)=>{
                    setTitle(e.target.value)
                }}
                id="add-title-input"/>
                <button id="add-save" 
                title="保存"
                className="btn save"
                onClick={()=>{
                    setText("")
                    setTitle("")
                    useGlobal.setState({edit:{
                        ...edit,
                        type:"add"
                    }})
                    Save_note(title,text)
                }}
                ></button>
            </div>
            <div id="text-box"></div>
            <div id="add-text-box" 
            onClick={()=>{
                setTextInput(true)
            }}
            className={text==''?"default-text":""}
            >
                {
                    textInput?
                (<>
                <div id="text-add-back"
            onClick={(e)=>{
                e.stopPropagation(); 
                setTextInput(false)
            }}
                ></div>
                <textarea id="add-text-input" value={text}
                placeholder="输入内容"
                ref={textareaRef}
                onClick={(e)=>{
                    e.stopPropagation();
                }}
                onChange={(e)=>{
                    setText(e.target.value)}}
                />
                    </>
                ):
                (text==''?<span>输入内容</span>:
                <span>{text}</span>)
                }
            </div>
        </TopBar>
    )
}