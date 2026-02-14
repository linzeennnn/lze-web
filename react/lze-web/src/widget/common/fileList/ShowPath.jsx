import '../../../css/common/fileList.css'
import { useFileCacheStore } from '../../../store/CacheList';
import { LocalList } from '../../../utils/CacheList';
export default function ShowPath() {
  const nameList=useFileCacheStore(state=>state.fileCache).name??[]
  return (
    <div id="show-path">
      <span>
        {
          nameList.map((name,index)=>(
            <span
            className='file-item-show-path'
            key={index+name}
            onClick={() => {LocalList(index)}}
            >
              {(name?"/":"")+name}
              </span>
          ))
        }
      </span>
    </div>
  );
}
