
import { GetText } from '../../../utils/common';
import { Icon } from '../../../utils/icon';

export default function EditBtn({name,editing,newName,rename}){
    const [editMode, setEditMode] = editing;
    return(
        <>
        {editMode?
        ( <button className="file-edit-btn btn" title={GetText("save")}
             onClick={(e) => {
                e.stopPropagation();
                setEditMode(false)
                rename(name,newName)
                }} 
                >{Icon("save")}
             </button>):
        (<button className="edit-name file-edit-btn btn" title={GetText("rename")}
            onClick={(e) => {e.stopPropagation();setEditMode(true)}}>
            {Icon("edit")}</button>)}
        </>
    )
}