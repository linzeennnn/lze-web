import { useState,useEffect, useRef } from "react";
import { notify } from "../../public/notify";
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.min.css';
import { list, loadPage, useGlobal } from "../global";
export default function Note({name}){
    const [text, setText] = useState('');
    const [loaded, setLoaded] = useState(false)
    const [show, setShow] = useState(false)
    const setGlobal=useGlobal.setState
    const[isCopy,setIsCopy]=useState(false)
    const[title,setTitle]=useState(remove_ext(name))
    const codeRef = useRef(null);
   useEffect(() => {
  if (show && codeRef.current) {
    const result = hljs.highlightAuto(text);
    codeRef.current.innerHTML = result.value;
    codeRef.current.className = 'hljs';
  }
}, [text, show]);

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
            <span className="title title-show">{title}</span>
       {show? 
       <>
       <button className="btn note-btn edit edit-mode-btn" title="编辑"
       onClick={()=>{
        setShow(false)
        setLoaded(false)
        setGlobal({edit:{
        mode:true,
        title:title,
        text:text
       }})}}
       ></button>
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
            <pre><code ref={codeRef}></code></pre>:
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