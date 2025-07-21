import { useEffect, useRef } from "react"
import { useGlobal } from "../global"

export default function LockPage(){
    const headRef=useRef(null)
    const lockPageRef=useRef(null)
     useEffect(() => {
    const headBar = headRef.current;
    const lockPage = lockPageRef.current;
    if (headBar&& lockPage) {
        setTimeout(() => {
      headBar.classList.add('head-bar-load');
      lockPage.classList.add('lock-page-load');
            
        }, 100);
    }
  }, []);
    return(
        <div id="lock-page"
        ref={lockPageRef}
        >
            <div id="head-bar"
            ref={headRef}
            >
                <div id="head-name"></div>
            </div>
            <button className="btn" id="unlock-btn" title="开始"
            onClick={()=>{
                headRef.current.classList.remove('head-bar-load');
                lockPageRef.current.classList.remove('lock-page-load');
                setTimeout(() => {
                        useGlobal.setState({locked:false})
                    
                }, 1000);
                    }}
            ></button>
        </div>
    )
}