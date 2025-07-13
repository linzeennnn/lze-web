import { useGlobal,list } from "../global";
export default function ShowPath(){
    const nowPath=useGlobal((state)=>state.nowPath)
    const parentPath=useGlobal((state)=>state.parentPath)
    return(
        <div id="show-path-box">
            {(nowPath==""&&parentPath=="")?null:(<span id="par-text" 
            title="返回父相册" onClick={()=>{list(parentPath)}}
            >{parentPath==""?"主相册":baseName(parentPath)}</span>)}
            <span id="cur-text">{nowPath==""?"主相册":baseName(nowPath)}</span>
        </div>
    )
}
function baseName(path) {
  if (!path) return '';
  path = path.replace(/\/+$/, '');
  const parts = path.split('/');
  return parts.pop() || '';
}
