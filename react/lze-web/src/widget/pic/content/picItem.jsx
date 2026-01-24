import React, { useState, useEffect } from "react";
import { useGlobal } from "../global";

export default function PicItem({ url,name, type ,index}) {
  const [loading, setLoading] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const select = useGlobal((state) => state.select);
  const setGlobal = useGlobal((state) => state.setGlobal);
  const listSession = useGlobal((state) => state.listSession);
  const inner=useGlobal((state) => state.inner);
  useEffect(() => {
    setLoading(true);
    setLoaded(false);
  }, [url]);
  useEffect(()=>{
    if(listSession.path==name){
      openMedia(url,type,index)
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
    onClick={()=>{openMedia(url,type,index)}}
    >
    <div className={"mask "+(select.status?"mask-enable ":"")+
      ((select.list.includes(name)&&select.status)?"mask-selected":"")}
    onClick={(e)=>{picClick(e,name)}}
    ></div>
      {loading && <div className="media-loading loading"></div>}
      {type === "img" ? (
        <img src={url+name} loading="lazy" onLoad={()=>{setLoaded(true)}} />
      ) : (<>
      <div className="play-icon btn"></div>
        <video src={url+name} onLoadedData={()=>{setLoaded(true)}} />
          </>
      )}
    </div>
  );
}
function openMedia(url,type,index){
const setGlobal=useGlobal.setState
setGlobal({mediaWin:{
    url:url,
    img:type=="img"?true:false,
    status:true,
    index:index
}})
}
