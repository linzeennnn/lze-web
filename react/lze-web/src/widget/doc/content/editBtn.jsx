export default function EditBtn({name,editing,newName,rename}){
    const [editMode, setEditMode] = editing;
    return(
        <>
        {editMode?
        ( <button className="save-name file-edit-btn btn" title="保存"
             onClick={(e) => {
                e.stopPropagation();
                setEditMode(false)
                rename(name,newName)
                }} 
                >
             </button>):
        (<button className="edit-name file-edit-btn btn" title="重命名" 
            onClick={(e) => {e.stopPropagation();setEditMode(true)}}>
            </button>)}
        </>
    )
}