import React, { useState, useEffect } from "react";
import { openMediaWin, useGlobal } from "../global";

export default function PicItem({ url,name, type ,index}) {
  const [loading, setLoading] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const select = useGlobal((state) => state.select);
  const setGlobal = useGlobal((state) => state.setGlobal);
  const listSession = useGlobal((state) => state.listSession);
  const inner=useGlobal((state) => state.inner);
  const editWin = useGlobal((state) => state.editWin);
  useEffect(() => {
    setLoading(true);
    setLoaded(false);
  }, [url]);
  useEffect(()=>{
    if(listSession.name==name){
      openMediaWin(url,listSession.media,index)
      setGlobal({listSession:{path:""}})
    }
  },[])
  useEffect(() => {
    let timer;
    if (loaded) {
      timer = setTimeout(() => {
        setLoading(false);
      }, 100);
    }
    return () => clearTimeout(timer);
  }, [loaded]);
  useEffect(() => {
  if(editWin.newSaveImg === name){  // name 对应当前 PicItem
    useGlobal.setState({editWin:{...editWin,newSaveImg:""}})
  }
}, [name]);
  const picClick=(e,name)=>{
    e.stopPropagation();
    const setGlobal=useGlobal.setState;
    let tmp = [...select.list];
      if (tmp.includes(name)) {
        tmp.splice(tmp.indexOf(name), 1);
      } else {
        tmp.push(name);
      }
      setGlobal({ select: { ...select, list: tmp } }); // 更新 selected
  }
  return (
    <div className={"pic-item main-item "+
      (inner.enable?"inner-pic-item":"")}
     title={name} key={url} 
    onClick={()=>{openMediaWin(url,type,index)}}
    >
    <div className={"mask "+(select.status?"mask-enable ":"")+
      ((select.list.includes(name)&&select.status)?"mask-selected":"")}
    onClick={(e)=>{picClick(e,name)}}
    ></div>
      {loading && <div className="media-loading loading"></div>}
      {type === "img" ? (
        <img src={url+imgUrl(name)} loading="lazy" onLoad={()=>{setLoaded(true)}} />
      ) : (<>
      <div className="play-icon btn"></div>
        <video src={url+name} onLoadedData={()=>{setLoaded(true)}} />
          </>
      )}
    </div>
  );
}
// 判断是不是新编辑保存的图片
function imgUrl(fileName){
  const editWin = useGlobal.getState().editWin;
  if(editWin.newSaveImg == fileName){
    // 仅返回带时间戳的 URL，不修改全局状态
    return fileName+"?t="+new Date().getTime()
  } else {
    return fileName
  }
}
