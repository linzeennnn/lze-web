import {useGlobal} from './global'
export default function NewDirBtn() {
    const{ value, setValue}=useGlobal()
    return (
        <>
        {!value.creating?(<button id="new-dir-btn" 
        className="btn new-dir-btn" title="创建新文件夹"
        onClick={()=>setValue({...value,creating:true})}
        >
        </button>):
        (<button id="new-dir-cancel" className="btn new-dir-btn" 
        title="取消"
        onClick={()=>setValue({...value,creating:false})}
        ></button>)}
        </>
    )
}