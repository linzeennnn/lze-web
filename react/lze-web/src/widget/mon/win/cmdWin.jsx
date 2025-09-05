import { useEffect, useState } from "react"
import { WinBg } from "../../../components/winBg"
import { GetText, useGlobal,loadPage } from "../global"
import { notify } from "../../../components/notify";
export default function CmdWin(){
    const showCmd=useGlobal(state=>state.showCmd)
    const [output,setOutput]=useState("输出")
    const [inputCmd,setInputCmd]=useState("")
    const [cusTitle,setCusTitle]=useState("")
    const [cusCmd,setCusCmd]=useState("")
     const [cmdList, setCmdList] = useState([])
    useEffect(()=>{
        setCmdList(JSON.parse(localStorage.getItem("cmdList")) || [])
        
    },[])
   const saveCmd = (title, cmd) => {
    if(cusTitle==""||cusCmd==""){
        notify(GetText("none"))
        return
    }
    setCusTitle("")
    setCusCmd("")
    const newList = [...cmdList, { title, cmd }]
    setCmdList(newList)
    localStorage.setItem("cmdList", JSON.stringify(newList))
    notify(GetText("op_com") )
}
   const delCmd = (index) => {
    if(!confirm(GetText("are_you_sure")))
        return
  const newList = [...cmdList.slice(0, index), ...cmdList.slice(index + 1)]
  setCmdList(newList)
  localStorage.setItem("cmdList", JSON.stringify(newList))
}
    const cusKeyDown=(e)=>{
            if(e.key==="Enter"){
            saveCmd(cusTitle,cusCmd)
        }
    }
    return(
        <WinBg showBg={showCmd}>
            <div id="cmd-box">
                <button className="btn" id="close-cmd"
                title={GetText("close")}
                onClick={()=>{
                    useGlobal.setState({showCmd:false})
                }}
                ></button>
            <div id="cus-cmd-box">
                {cmdList.map((cmd_item,index)=>(
                        <div className="cmd-item" key={index+cmd_item.cmd} title={GetText("run")}
                        onClick={()=>{
                            setInputCmd(cmd_item.cmd)
                            sendCmd(cmd_item.cmd,setOutput)
                        }}
                        >
                            <button className="del-cmd btn" title={GetText("delete")}
                            onClick={(e)=>{
                                e.stopPropagation()
                                delCmd(index)
                            }}
                            ></button>
                            <span className="cmd-title">{cmd_item.title}</span>
                            <span className="cmd-cmd">{cmd_item.cmd}</span>
                        </div>
                ))}
            </div>
            <div id="send-box" className="cmd-widget">
            <input id="input-cmd" value={inputCmd} placeholder={GetText("cmd")} 
            onKeyDown={(e)=>{
                if(e.key==="Enter"){
                    sendCmd(inputCmd,setOutput)
                }
            }}
            onChange={(e)=>setInputCmd(e.target.value)}
            />
            <pre id="output-text">{output}</pre>
            <button className="btn" id="send-cmd" title={GetText("run")}
            onClick={()=>{
                sendCmd(inputCmd,setOutput)
            }}
            ></button>
            </div>
            <div id="cus-cmd-input-bar"  className="cmd-widget">
                <input placeholder={GetText("cus_name")}  className="cmd-input" onKeyDown={cusKeyDown}
                value={cusTitle} onChange={(e)=>setCusTitle(e.target.value)}/>
                <input placeholder={GetText("cmd")}  className="cmd-input"  onKeyDown={cusKeyDown}
                value={cusCmd} onChange={(e)=>setCusCmd(e.target.value)}/>
                <button className="btn" id="add-cmd" title={GetText("add")}
                onClick={()=>{
                    saveCmd(cusTitle,cusCmd)
                }}
                ></button>
            </div>
            </div>
        </WinBg>
    )
}
function sendCmd(cmd,setOutput){
    if(!confirm(GetText("are_you_sure")))
        return
        loadPage(true)
        const globale=useGlobal.getState()
        const token=globale.token
        const url=globale.monUrl+"cmd"
        fetch(url,{
            method:"POST",
            headers:{
                'Content-Type':'application/json',
                'authorization':"Bearer " +token,
            },
            body:JSON.stringify({
                cmd
            })
        }
        ).then(res=>{
            if(!res.ok){
                if(res.status==401){
                    notify(GetText("no_per"))
                }else{
                    notify(GetText("error")+":"+res.status)
                }
                loadPage(false)
                return
            }
            setOutput(res.text())
                loadPage(false)
        })
}