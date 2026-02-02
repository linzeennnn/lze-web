import {GetText} from "../../../../utils/common"
import { Icon } from "../../../../utils/icon"
export default function SendBtn({loading,send}){
    return(
        <>
        {loading?
            (<div className="loading user-page-loading"></div>):
            ( <button
            className="btn user-page-send"
            title={GetText("start")}
            onClick={() => send()}
            >{Icon("toRight")}</button>)}
            </>
    )
}