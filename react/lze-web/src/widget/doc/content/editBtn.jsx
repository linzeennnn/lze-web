
import { GetText } from '../../../utils/common';

export default function EditBtn({name,editing,newName,rename}){
    const [editMode, setEditMode] = editing;
    return(
        <>
        {editMode?
        ( <button className="save-name file-edit-btn btn" title={GetText("save")}
             onClick={(e) => {
                e.stopPropagation();
                setEditMode(false)
                rename(name,newName)
                }} 
                >
             </button>):
        (<button className="edit-name file-edit-btn btn" title={GetText("rename")}
            onClick={(e) => {e.stopPropagation();setEditMode(true)}}>
            </button>)}
        </>
    )
}