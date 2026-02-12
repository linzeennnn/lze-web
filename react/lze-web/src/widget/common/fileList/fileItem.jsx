import '../../../css/common/fileList.css'
import { FillIcon } from '../../../utils/icon'
export default function FileItem({name,type,Fun,mask,NameText}){
    return(
        <div className='file-item-box'>
        {mask}
        <div className="file-item-frame" title={name}>
        <div className='file-item' onClick={()=>{Fun(name)}}>{
                FillIcon((type))
                }
        </div>
        <div className='file-name-box'>
        {NameText}
        <span className="file-name">{name}</span>
        </div>
        </div>
        </div>
    )
}