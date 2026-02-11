import '../../../css/common/fileList.css'
import { FillIcon } from '../../../utils/icon'
export default function FileItem({name,type,Fun}){
    return(
        <div className='file-item' onClick={()=>{Fun(name)}}>{
                FillIcon((type))
                }
        </div>
    )
}