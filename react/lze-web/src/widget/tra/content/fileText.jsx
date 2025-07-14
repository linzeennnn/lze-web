import {list,useGlobal} from '../global'
export default function FileText({fileMes}){
    const nowPath = useGlobal((state) => state.nowPath);
    return(
        <>
        <span
            className={(fileMes.type === "dir" || fileMes.type === "dir_link" ? "dir-text" : "file-text") + " file-list-text"}
            title={"查看" + fileMes.name}
            onClick={(e) => {
                e.stopPropagation();

                if (fileMes.type === "dir" || fileMes.type === "dir_link") {
                const dir_path = nowPath + "/" + fileMes.name;
                list(dir_path);
                }

                if (fileMes.type === "file" || fileMes.type === "file_link") {
                const file_path =  nowPath + "/" + fileMes.name;
                window.location.href = window.location.origin + "/file/trash" + file_path;
                }
            }}
            >
            {fileMes.name}
            </span>
            <span className='ori-path' title={"原路径:"+fileMes.delData}
            >{fileMes.delData}</span>
        </>
    )
}