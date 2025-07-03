import * as docFun  from './docFun'
import { useEffect, useState } from 'react';
function DocList(){
    const [data,setData]=useState(null)
    const readLoad_dir=(dirname)=>{
        docFun.list(dirname)
        .then(res=>{
            setData(res)
        })
    }
    useEffect(()=>{
        readLoad_dir("/")
    },[])
    return(
        <>{
            data?data.filelist.map((item,index)=>{
                console.log(JSON.stringify(data));
                
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
            onClick={()=>{readLoad_dir(data.currentFolder+"/"+item.name)}}
            >{item.name}</span>
        </div>
        )})
        :null}
        </>
    )
}
export default DocList