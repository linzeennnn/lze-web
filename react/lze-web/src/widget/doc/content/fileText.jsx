import {GetText, list,useGlobal} from '../global'
export default function FileText({fileMes,editMode,nameEdit,rename}){
    const[nameInput,setNameInput]=nameEdit
    const nowPath = useGlobal((state) => state.nowPath);
      const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
          rename(fileMes[0], nameInput);
        }
      };
    
    return(
        <>
        {editMode?
        (<input value={nameInput} className="file-list-text file-list-input" 
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => setNameInput(e.target.value)}
            onKeyDown={handleKeyDown} 
            />):
        (<span
            className={(fileMes[1] === "dir" || fileMes[1] === "dir_link" ? "dir-text" : "file-text") + " file-list-text"}
            title={GetText("view") + fileMes[0]}
            onClick={(e) => {
                e.stopPropagation();
                list(nowPath + "/" + fileMes[0]);
            }}
            >
            {fileMes[0]}
            </span>)
        }
        </>
    )
}