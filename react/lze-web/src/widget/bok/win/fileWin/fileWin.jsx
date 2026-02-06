import { GetText } from "../../../../utils/common";
import { Icon } from "../../../../utils/icon";
import { useGlobal } from "../../global";

export default function FileWin(){
    const fileWin=useGlobal(state=>state.fileWin)
    return (
        <div className={fileWin?"bg-enable":'bg-disable'}>
            <div id="file-win">
                <button className="btn" title={GetText("close")}
                onClick={()=>{
                    useGlobal.setState({fileWin: false})
                }}
                >{Icon("no")}</button>
                <div id="file-box"></div>
            </div>
        </div>
    )
}