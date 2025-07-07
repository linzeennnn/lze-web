export default function DownloadBtn({fileMes}){
    return (
        <button className="down-btn btn" title={"下载:"+fileMes.name}></button>
    )
}