import { GetText } from "../../../../utils/common";
// import BokFileItem from "./BokFileItem";
import { addBok, useGlobal } from "../../global";
import FloatWin from '../../../common/floatWin'
import { AddCacheList } from "../../../../utils/CacheList";
import { use, useEffect } from "react";
import { Api } from "../../../../utils/request";
import { baseName } from "../../../../utils/path";
import { getNowPath, useFileCacheStore } from "../../../../store/CacheList";
import FileItem from "../../../common/fileList/fileItem";
import GoUp from '../../../common/fileList/goUp';
import ShowPath from "../../../common/fileList/ShowPath";
export default function FileWin(){
  const cache=useFileCacheStore(state=>state.fileCache)
  const fileList = cache.fileList?.[cache.current] ?? [];
    const fileWin=useGlobal(state=>state.fileWin)
    useEffect(()=>{
        if(fileWin)
            list("")
    },[fileWin])
    return (
        <FloatWin
        show={fileWin}
        title={GetText('addFile')}
        setShow={()=>{useGlobal.setState({fileWin: false})}}
        >
            <div className="file-win">
              <div id="path-bar">
                <GoUp/>
                <ShowPath/>
              </div>
                {/* <BokFileItem/> */}
                {fileList.map((fileMes,index) => (
                        <FileItem
                          key={index+fileMes[0]}
                          name={fileMes[0]} type={fileMes[1]}
                          Fun={(fileMes[1]=="dir"||fileMes[1]=="dir_link")?
                            list:addFile} 
                          TextFun={()=>{}}
                          mask={null}
                          fileBtn={null}
                        />
                      ))}
            </div>
        </FloatWin>
    )
}
function list(name) {
  const path=name?getNowPath()+"/"+name:""
Api.post({
  api:"doc/list",
  body:{file: path},
  success:(data)=>{
      if(data.type=="dir"){
      AddCacheList({
        nowPath:data.currentFolder,
        fileList:data.filelist,
        name:baseName(data.currentFolder)
      })
    }
  }
})
}
function addFile(name){
  const data=useGlobal.getState()
  useGlobal.setState({
    ...data,
    fileWin: false})
    
  const link="doc://"+getNowPath()+"/"+name
  addBok(name,link)
}