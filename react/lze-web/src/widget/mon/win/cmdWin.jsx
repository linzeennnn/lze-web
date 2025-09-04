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
    const newList = [...cmdList, { title, cmd }]
    setCmdList(newList)
    localStorage.setItem("cmdList", JSON.stringify(newList))
}
   const delCmd = (index) => {
    const newList = [...cmdList, { title, cmd }]
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
                        <div className="cmd-item" key={index+cmd_item.cmd}>
                            <button className="del-cmd btn"></button>
                            <span className="cmd-title">{cmd_item.title}</span>
                        </div>
                ))}
            </div>
            <div id="send-box" className="cmd-widget">
            <input id="input-cmd" className="cmd-input" value={inputCmd}
            onKeyDown={(e)=>{
                if(e.key==="Enter"){
                    sendCmd(inputCmd,setOutput)
                }
            }}
            onChange={(e)=>setInputCmd(e.target.value)}
            />
            <pre id="output-text">{output}</pre>
            <button className="btn" id="send-cmd"
            onClick={()=>{
                sendCmd(inputCmd,setOutput)
            }}
            ></button>
            </div>
            <div id="cus-cmd-input-bar"  className="cmd-widget">
                <input placeholder="自定义名称"  className="cmd-input" onKeyDown={cusKeyDown}
                value={cusTitle} onChange={(e)=>setCusTitle(e.target.value)}/>
                <input placeholder="命令"  className="cmd-input"  onKeyDown={cusKeyDown}
                value={cusCmd} onChange={(e)=>setCusCmd(e.target.value)}/>
                <button className="btn" id="add-cmd"
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