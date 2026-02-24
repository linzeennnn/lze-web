import { useState, useEffect } from "react"
import { Icon } from "../../../utils/icon"
import FileItem from "../../common/fileList/fileItem"
import { fileBuffer, list, useGlobal} from "../global"
import DownloadBtn from "./downloadBtn"
import Link from "./link"
import { Api } from "../../../utils/request";
import { GetText } from "../../../utils/common"
import { getFileCache, getNowPath, setFileCache } from "../../../store/CacheList"
export default function fileItme({index,fileMes,selected,docClick}){
    const include=selected.selected.includes(index)
    const edit=useGlobal(state=>state.edit)
    return(
            <FileItem name={fileMes[0]} type={fileMes[1]}
             Fun={ClickFun} TextFun={TextClick}
             mask={selected.status?
             <FileItemMask 
              include={include}
              index={index} 
              selected={selected}/>:null}
             fileBtn={<FileBtn fileMes={fileMes}/>}
            NameText={
            (edit.name==fileMes[0]
                &&edit.status)
            ?<NameText name={fileMes[0]} index={index}/>:null}
             /> 
    )
}
function FileItemMask({index,selected,include}){
    return(
        <div className={'file-item-mask '
            +(selected.status&&include?'file-item-mask-selected':'')} 
    onClick={()=>{fileBuffer.add(index);
    }}></div>
    )
}
function FileBtn({fileMes}){
    return( <>
    {(fileMes[1]!="dir"&&fileMes[1]!="dir_link"&&<Link name={fileMes[0]}/>)}
    <DownloadBtn fileMes={fileMes}/>
    </>)
}
function NameText({ name,index }) {
  const [text, setText] = useState(name);

  const save = () => {
    fileBuffer.add(index)
    rename(name, text);
  };

  useEffect(() => {
    const handler = (e) => {
      // ctrlKey = Windows/Linux
      // metaKey = macOS 的 command
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault(); // 阻止浏览器默认保存网页
        save();
      }
    };

    window.addEventListener("keydown", handler);
    return () => {
      window.removeEventListener("keydown", handler);
    };
  }, [text, name]);

  return (
    <>
      <div className="bg-enable" onClick={() => { TextClick(); }} />
      <div className="file-item-input-box">
        <input
          className="file-name-input"
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") save();
          }}
        />
        <button
          className="btn save-file-name"
          onClick={save}
          title={GetText("save")}
        >
          {Icon("save")}
        </button>
      </div>
    </>
  );
}
function ClickFun(name){
        list(getNowPath() + "/" + name)
}
function TextClick(name=""){
    if(useGlobal.getState().edit.status){
    useGlobal.setState({edit:{status:false,name:name}})
    }
    else{
    useGlobal.setState({edit:{status:true,name:name}})
}
}
function rename(oldname,newname){
  const nowPath=getNowPath()
    TextClick()
    if(oldname==newname){
        return
    }
    const oldpath=nowPath+"/"+oldname
    const newpath=nowPath+"/"+newname
Api.patch({
    api:"doc/rename",
    body:{oldpath,newpath},
    notice:true,
    success:(data)=>{
      const cache=structuredClone(getFileCache())
      const tmpFileList=cache.fileList
      const newFileList=cache.fileList[cache.current]
      newFileList[fileBuffer.getSelected()[0]]=data.fileItem
      tmpFileList[cache.current]=newFileList
      setFileCache({...cache,fileList:tmpFileList})
      fileBuffer.clean()
      
    }
})
}