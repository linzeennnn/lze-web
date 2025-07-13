import { WinBg } from "../../public"
export default function MediaaWin() {
    return(
        <>
        <WinBg showBg={true}>
            <button className="btn media-btn" id="close-media"></button>
            <button className="btn media-btn" id="last-pic"></button>
            <button className="btn media-btn" id="next-pic"></button>
            <div id="media-box">
                <img src="http://127.0.0.1:8080/file/Pictures//2025-07-08_09-24.png"/>
            </div>
        </WinBg>
        </>
    )
}