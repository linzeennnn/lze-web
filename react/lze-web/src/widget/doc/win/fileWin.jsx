import { useState, useEffect, useRef } from "react"
import { GetText, useGlobal } from "../global"

export default function FileWin(){
    const [fullScreen,setFullScreen]=useState(false)
    const fileWin=useGlobal(state=>state.fileWin)
    const iframeRef = useRef(null)

    // ESC退出全屏
    useEffect(() => {
        function handleKeyDown(e) {
            if (e.key === "Escape" && fullScreen) {
                setFullScreen(false)
            }
        }
        document.addEventListener("keydown", handleKeyDown)
        return () => document.removeEventListener("keydown", handleKeyDown)
    }, [fullScreen])


    return(
        fileWin.status?(<div id="file-win">
            {fullScreen?null:<button  className="btn close-file-win" title={GetText("close")}
            onClick={()=>{
                useGlobal.setState({fileWin:{status: false,url:"",view:false}})
            }}
            ></button>}{
                fileWin.view?
            (<div className="file-view-box">
            <iframe
                ref={iframeRef}
                src={fileWin.url}
                className={"file-view "+(fullScreen?"full-screen":"")}
            ></iframe>

                {fullScreen?
                <button className="btn ext-full-screen-btn"
                    title={GetText("zoom_out")}
                    onClick={()=>{setFullScreen(false)}}
                ></button>
                :
                (<div className="file-win-btn-bar">
                    <button
                        className="btn file-win-btn refresh-btn"
                        title={GetText("refresh")}
                        onClick={()=>{
                            if (iframeRef.current) {
                                iframeRef.current.src = iframeRef.current.src
                            }
                        }}
                    ></button>

                    <button
                        className="btn file-win-btn full-screen-btn"
                        title={GetText("zoom_in")}
                        onClick={()=>{setFullScreen(true)}}
                    ></button>
                </div>)
                }

            </div>)
            :<span>{GetText("not_support_type")}</span>
            }
        </div>):null
    )
}