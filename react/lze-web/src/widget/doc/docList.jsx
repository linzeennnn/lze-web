import * as docFun  from './docFun'
import { useEffect } from 'react';
import { useGlobal } from'./global'
function DocList(){
      const { value: globalData } = useGlobal();
      const open_file=(path)=>{
        window.location.href=window.location.origin+"/file/Documents"+path
      }
    useEffect(()=>{
        docFun.list("/")
    },[])
    return(
        <>{
            globalData.fileList.map((item,index)=>{
                
            let type;
            if (item.type=="dir"||item.type=="dir_link"){
                type="dir-text"
            }
            if (item.type=="file"||item.type=="file_link"){
                type="file-text"
            } 
           return( 
        <div key={"doclist"+index} className='doc-list'>
            <span className={type +` file-list-text`}
            title={item.name}
            onClick={()=>{
                if (item.type=="dir"||item.type=="dir_link"){
                let dir_path;
                dir_path=(globalData.nowPath=="/"?
                    globalData.nowPath+item.name:
                    globalData.nowPath+"/"+item.name)
                docFun.list(dir_path)}
            
            if (item.type=="file"||item.type=="file_link"){
                let file_path;
                file_path=(globalData.nowPath=="/"?
                    globalData.nowPath+item.name:
                    globalData.nowPath+"/"+item.name)
                open_file(file_path)
            } 
            }
            }
            
            >{item.name}</span>
        </div>
        )})}
        </>
    )
}
export default DocList