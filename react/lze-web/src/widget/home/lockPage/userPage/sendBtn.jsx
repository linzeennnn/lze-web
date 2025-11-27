import { GetText} from "../../global";
export default function SendBtn({loading,send}){
    return(
        <>
        {loading?
            (<div className="loading user-page-loading"></div>):
            ( <button
            className="btn user-page-send"
            title={GetText("start")}
            onClick={() => send()}
            ></button>)}
            </>
    )
}