import { useState, useEffect, useRef } from "react"
import { SetFileWin, useGlobal } from "../global"
import FloatWin from "../../common/floatWin"

import { GetText } from '../../../utils/common'
import { Icon } from "../../../utils/icon"

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

    // iframe 样式注入
    useEffect(() => {
        if (!fileWin.url) return

        function applyStyle() {
            const iframe = iframeRef.current
            if (!iframe) return
            const doc = iframe.contentDocument || iframe.contentWindow.document
            if (!doc) return

            const style = doc.createElement("style")
            style.textContent = `
                body {
                    display:flex;
                    justify-content: center;
                    align-items: center;
                    width: 100%;
                    height: 100%;
                }
                body img {
                    margin: 0;
                    max-height: 100%;
                    max-width: 100%;
                }
            `
            doc.head.appendChild(style)
        }

        const iframe = iframeRef.current
        if (iframe) iframe.onload = applyStyle
    }, [fileWin.url])

    const switchInnerApp=()=>{
        [fileWin.data.innerApp[0],fileWin.data.innerApp[1]] =
        [fileWin.data.innerApp[1],fileWin.data.innerApp[0]]

        useGlobal.setState({fileWin:{...fileWin}})
        SetFileWin(fileWin.data,fileWin.path)
    }

    if (!fileWin.status) return null

    return (
        <FloatWin
            show={fileWin.status}
            setShow={(v)=>{
                if(!v){
                    useGlobal.setState({
                        fileWin:{status:false,url:"",view:false}
                    })
                }
            }}
        >
            {
                fileWin.view ? (
                    <div className="file-view-box">
                        <iframe
                            key={fileWin.url}
                            ref={iframeRef}
                            src={fileWin.url}
                            className={"file-view "+(fullScreen?"full-screen":"")}
                        ></iframe>

                        {fullScreen ?
                            <button
                                className="btn ext-full-screen-btn"
                                title={GetText("zoom_out")}
                                onClick={()=>{setFullScreen(false)}}
                            >
                                {Icon("minimize")}
                            </button>
                        :
                            <div className="file-win-btn-bar">
                                {(fileWin.data.innerApp.length>1)?
                                <>
                                    {
                                        fileWin.currentType=="not"?
                                        <button className="btn file-win-btn" title={GetText("view")} onClick={switchInnerApp}>
                                            {Icon("eye")}
                                        </button>:
                                        <button className="btn file-win-btn" title={GetText("edit")} onClick={switchInnerApp}>
                                            {Icon("edit")}
                                        </button>
                                    }
                                </>:null}

                                <button
                                    className="btn file-win-btn"
                                    title={GetText("refresh")}
                                    disabled={fileWin.currentType!="doc"}
                                    onClick={()=>{
                                        if (iframeRef.current) {
                                            iframeRef.current.src = iframeRef.current.src
                                        }
                                    }}
                                >
                                    {Icon("load")}
                                </button>

                                <button
                                    className="btn file-win-btn"
                                    title={GetText("zoom_in")}
                                    onClick={()=>{setFullScreen(true)}}
                                >
                                    {Icon("maximize")}
                                </button>
                            </div>
                        }
                    </div>
                )
                :
                <div className="file-view-box">
                <span>{GetText("not_support_type")}</span>
                </div>
            }
        </FloatWin>
    )
}
