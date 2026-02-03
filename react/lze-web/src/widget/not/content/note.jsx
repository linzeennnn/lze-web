import { useState,useEffect, useRef } from "react";
import { copy,GetText } from "../../../utils/common";
import Del from "./del";
import hljs from 'highlight.js/lib/common';
import 'highlight.js/styles/atom-one-dark.min.css';
import {  list, loadPage, useGlobal } from "../global";
import { Api } from "../../../utils/request";
import { Icon } from "../../../utils/icon";
export default function Note({name}){
    const listSession=useGlobal((state)=>state.listSession)
    const [text, setText] = useState('');
    const [loaded, setLoaded] = useState(false)
    const [show, setShow] = useState(false)
    const setGlobal=useGlobal.setState
    const[isCopy,setIsCopy]=useState(false)
    const[title,setTitle]=useState(name)
    const codeRef = useRef(null);
    const inner=useGlobal((state)=>state.inner)
   useEffect(() => {
  if (show && codeRef.current) {
    const result = hljs.highlightAuto(text);
    codeRef.current.innerHTML = result.value;
    codeRef.current.className = 'hljs';
  }
}, [text, show,loaded]);
    useEffect(()=>{
        if(inner.enable){
            openText()
        }
    },[inner.enable])
    useEffect(() => {
        if(name==listSession.path){
        useGlobal.setState({listSession:{path:""}})
            openText()
        }
    },[listSession.path])
const openText=()=>{
                setShow(true)
                if(!loaded){
                    get_note(name,setLoaded,setText)
                }
            }
    return(
        <div className="note">{
            inner.enable?
            null:
            <Del name={name}/>}
            <span className="title title-show">{title}</span>
       {show? 
       <>
       <button className="btn note-btn edit-mode-btn" title={GetText("edit")}
       onClick={()=>{
        setShow(false)
        setLoaded(false)
        setGlobal({edit:{
        mode:true,
        title:title,
        text:text,
        type:"edit"
       }})}}
       >{Icon("edit")}</button>
       <button className="btn note-btn copy" title={GetText("copy")}
            onClick={()=>{
                copy(text)
                setTimeout(() => {
                    setIsCopy(false)
                }, 2000);
                setIsCopy(true)
            }}
            >{Icon(isCopy?"yes":"copy")}</button> 
       <div className="text-box">
            {loaded?
            <pre><code ref={codeRef}></code></pre>:
            <div className="loading note-loading"></div>}
        
        </div>
        </>
        :null}
           {show? <button className="btn note-btn"
           title={GetText("close")}  onClick={()=>{
            setShow(false)
           }}>{Icon("up")}
           </button>:<button className="btn note-btn"
            title={GetText("expand")}onClick={openText}
            >{Icon("down")}</button>}
        </div>
    )
}

function get_note(name,setLoaded,setText){
    const inner=useGlobal.getState().inner
    Api.post({
        api:'not/getText',
        body:{name,source:inner.source,path:inner.path},
        success:(data)=>{
          setText(data)
          setLoaded(true)
        }
    })
}