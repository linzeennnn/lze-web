import { useState } from "react"
import { WinBg } from "../../../components/winBg"
import { GetText, useGlobal,loadPage } from "../global"
import { notify } from "../../../components/notify";
export default function CmdWin(){
    const showCmd=useGlobal(state=>state.showCmd)
    const [output,setOutput]=useState("")
    const [inputCmd,setInputCmd]=useState("")
    return(
        <WinBg showBg={showCmd}>
            <div id="cmd-box">
            <button className="btn" id="close-cmd"
            title={GetText("close")}
            onClick={()=>{
                useGlobal.setState({showCmd:false})
            }}
            ></button>
            <input id="input-cmd" value={inputCmd}
            onChange={(e)=>setInputCmd(e.target.value)}
            />
            <button className="btn" id="send-cmd"
            onClick={()=>{
                sendCmd(inputCmd,setOutput)
            }}
            ></button>
            <pre id="output-text">{output}</pre>
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