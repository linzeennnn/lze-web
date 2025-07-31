import { useGlobal,list, GetText } from "../global";
export default function ShowPath(){
    const nowPath=useGlobal((state)=>state.nowPath)
    const parentPath=useGlobal((state)=>state.parentPath)
    return(
        <div id="show-path-box">
            {(nowPath==""&&parentPath=="")?null:(<span id="par-text" 
            title={GetText("back_parent_album")} onClick={()=>{list(parentPath)}}
            >{parentPath==""?GetText("main_album"):baseName(parentPath)}</span>)}
            <span id="cur-text">{nowPath==""?GetText("main_album"):baseName(nowPath)}</span>
        </div>
    )
}
function baseName(path) {
  if (!path) return '';
  path = path.replace(/\/+$/, '');
  const parts = path.split('/');
  return parts.pop() || '';
}
