import '../../../css/common/fileList.css'
import { FillIcon } from '../../../utils/icon'
export default function FilrItem({name,type}){
    return(
        <div className='file-item'>
            <div className='file-item-icon'>{
                FillIcon((type=="dir"||type=="dir_link")?
                "folder":"file")
                }</div>
            <span>{name}</span>
        </div>
    )
}