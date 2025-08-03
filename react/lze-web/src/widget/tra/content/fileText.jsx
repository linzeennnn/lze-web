import {GetText, list,useGlobal} from '../global'
export default function FileText({fileMes}){
    const nowPath = useGlobal((state) => state.nowPath);
    return(
        <>
        <span
            className={(fileMes[1] === "dir" || fileMes[1] === "dir_link" ? "dir-text" : "file-text") + " file-list-text"}
            title={GetText("view") + fileMes[0]}
            onClick={(e) => {
                e.stopPropagation();

                if (fileMes[1] === "dir" || fileMes[1] === "dir_link") {
                const dir_path = nowPath + "/" + fileMes[0];
                list(dir_path);
                }

                if (fileMes[1] === "file" || fileMes[1] === "file_link") {
                const file_path =  nowPath + "/" + fileMes[0];
                window.location.href = window.location.origin + "/file/trash" + file_path;
                }
            }}
            >
            {fileMes[0]}
            </span>
            <span className='ori-path' title={GetText("ori_path")+":"+fileMes[2]==""?"/":fileMes[2]}
            >{fileMes[2]==""?"/":fileMes[2]}</span>
        </>
    )
}