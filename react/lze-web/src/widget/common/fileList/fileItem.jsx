import '../../../css/common/fileList.css'
import { FillIcon } from '../../../utils/icon'
export default function FileItem({
    name,type,Fun,TextFun,
    mask,NameText,fileBtn}){
    return(
        <div className='file-item-box'>
        {mask}
        <div className="file-item-frame" title={name}>
            {fileBtn}
        <div className='file-item' onClick={()=>{Fun(name)}}>{
                FillIcon((type))
                }
        </div>
        <div className='file-name-box'>
        {NameText}
        <span className="file-name" onClick={()=>{TextFun(name)}}>{name}</span>
        </div>
        </div>
        </div>
    )
}