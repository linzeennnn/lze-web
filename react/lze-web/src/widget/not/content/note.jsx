import { useState,useEffect } from "react";
import { notify } from "../../public/notify";
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.min.css';
import { list, loadPage, useGlobal } from "../global";
export default function Note({name}){
    const oldTitle=remove_ext(name)
    const [text, setText] = useState('');
    const [loaded, setLoaded] = useState(false)
    const [show, setShow] = useState(false)
    const[isCopy,setIsCopy]=useState(false)
    const[editMode, setEditMode] = useState(false)
    const[title,setTitle]=useState(remove_ext(name))

    useEffect(()=>{
        document.querySelectorAll("pre").forEach(block => {
             hljs.highlightElement(block)
        });
    });

    const key_save=(e)=>{
    const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
    const isCtrlOrCmd = isMac ? e.metaKey : e.ctrlKey;

    if (isCtrlOrCmd && e.key.toLowerCase() === "s") {
        e.preventDefault(); 
        setEditMode(false)
        save_note(oldTitle,title,text)
    }
    }
    
    const get_note=()=>{
        fetch(`${window.location.origin}/file/Note/${name}`,{ cache: "no-store" })
        .then((res) => res.text())
    .then((data) => {
        setLoaded(true)    
        setText(data)
    })
    }
    return(
        <div className="note">
            {editMode?(
                <input value={title} onChange={(e)=>setTitle(e.target.value)} 
                onKeyDown={key_save}
            className="title-input title" type="text" placeholder="标题"/>):
            (<span className="title title-show">{title}</span>)}
       {show? 
       <>
       {editMode?(<button className="btn note-btn save edit-mode-btn" title="保存"
       onClick={()=>{
        setEditMode(false)
        save_note(oldTitle,title,text)
       }}
       ></button>):
       (<button className="btn note-btn edit edit-mode-btn" title="编辑"
       onClick={()=>{setEditMode(true)}}
       ></button>)}
       <button className={"btn note-btn copy "+(isCopy?"copy-ok":"")} title="复制内容"
            onClick={()=>{
                copy(text)
                setTimeout(() => {
                    setIsCopy(false)
                }, 2000);
                setIsCopy(true)
            }}
            ></button> 
       <div className="text-box">
            {loaded?
            (editMode?
            <input value={text}
            onChange={(e)=>setText(e.target.value)}
            onKeyDown={key_save}
            />:
            <pre><code className="text">{text}</code></pre>):
            <div className="loading note-loading"></div>}
        
        </div>
        </>
        :null}
           {show? <button className="btn note-btn close-note"
           title="关闭便签"  onClick={()=>{
            setShow(false)
           }}>
           </button>:<button className="btn note-btn open-note"
            title="打开便签"onClick={()=>{
                setShow(true)
                if(!loaded){
                    get_note()
                }
            }}
            ></button>}
        </div>
    )
}
function save_note(oldTitle,newTitle,newContent){
    if(!confirm("确定保存吗"))
        return
    loadPage(true)
    const user=useGlobal.getState().userName
    const token=useGlobal.getState().token
    const url=useGlobal.getState().notUrl+"edit"
    const send_data={user,token,oldTitle,newTitle,newContent}
    fetch(url,{
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(send_data)
    }).then((res) => {
        if(!res.ok){
            if(res.status===401){
                notify("无编辑权限")
            }
            else{
                notify("保存失败"+res.status+"错误")
            }
            loadPage(false)
            return
        }
        notify("保存成功")
        list()
    })
}
function copy(text) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";  
  textarea.style.opacity = "0";      
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();

  try {
    document.execCommand("copy");
    notify("复制成功！");
  } catch (err) {
    notify("复制失败:", err);
  }

  document.body.removeChild(textarea);
}
function remove_ext(filename){
      const index = filename.lastIndexOf('.');
  if (index === -1) return filename; 
  return filename.substring(0, index);
}