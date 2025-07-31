import { GetText, useGlobal } from "../global"

export default function FileWin(){
    const fileWin=useGlobal(state=>state.fileWin)
    return(
        fileWin.status?(<div id="file-win">
            <button id="close-file-win" className="btn" title={GetText("close")}
            onClick={()=>{
                useGlobal.setState({fileWin:{status: false,url:"",view:false}})
            }}
            ></button>{
                fileWin.view?
            <iframe id="file-view" src={fileWin.url} ></iframe>:
            <span>{GetText("not_support_type")}</span>
            }
        </div>):null
    )
}