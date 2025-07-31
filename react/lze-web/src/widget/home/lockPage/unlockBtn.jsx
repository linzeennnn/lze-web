import { GetText, useGlobal } from "../global";

export default function UnlockBtn({setTmpLoad}){
    return(
        <button id="unlock-btn" className="btn lock-btn"
         onClick={()=>{
                        setTmpLoad(false)
                        setTimeout(() => {
                                useGlobal.setState({locked:false})
                            setTmpLoad(true)
                            
                        }, 500);
                            }}
        >
            <div></div>
            <span>{GetText("start")}</span>
        </button>
    )
}