import { useState,useEffect, useRef } from "react";
import { copy,GetText } from "../../../utils/common";
import Del from "./del";
import hljs from 'highlight.js/lib/common';
import 'highlight.js/styles/atom-one-dark.min.css';
import {  list, loadPage, useGlobal } from "../global";
import { Api } from "../../../utils/request";
export default function Note({name}){
    const [text, setText] = useState('');
    const [loaded, setLoaded] = useState(false)
    const [show, setShow] = useState(false)
    const setGlobal=useGlobal.setState
    const[isCopy,setIsCopy]=useState(false)
    const[title,setTitle]=useState(name)
    const codeRef = useRef(null);
   useEffect(() => {
  if (show && codeRef.current) {
    const result = hljs.highlightAuto(text);
    codeRef.current.innerHTML = result.value;
    codeRef.current.className = 'hljs';
  }
}, [text, show,loaded]);
    return(
        <div className="note">
            <Del name={name}/>
            <span className="title title-show">{title}</span>
       {show? 
       <>
       <button className="btn note-btn edit edit-mode-btn" title={GetText("edit")}
       onClick={()=>{
        setShow(false)
        setLoaded(false)
        setGlobal({edit:{
        mode:true,
        title:title,
        text:text,
        type:"edit"
       }})}}
       ></button>
       <button className={"btn note-btn copy "+(isCopy?"copy-ok":"")} title={GetText("copy")}
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
           title={GetText("close")}  onClick={()=>{
            setShow(false)
           }}>
           </button>:<button className="btn note-btn open-note"
            title={GetText("expand")}onClick={()=>{
                setShow(true)
                if(!loaded){
                    get_note(name,setLoaded,setText)
                }
            }}
            ></button>}
        </div>
    )
}

function get_note(name,setLoaded,setText){
    Api.post({
        api:'not/getText',
        body:{name},
        success:(data)=>{
          setText(data)
          setLoaded(true)
        }
    })
}