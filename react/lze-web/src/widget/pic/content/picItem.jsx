import React, { useState, useEffect } from "react";
import { useGlobal } from "../global";

export default function PicItem({ url,name, type ,index}) {
  const [loading, setLoading] = useState(true);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoading(true);
    setLoaded(false);
  }, [url]);

  useEffect(() => {
    let timer;
    if (loaded) {
      timer = setTimeout(() => {
        setLoading(false);
      }, 100);
    }
    return () => clearTimeout(timer);
  }, [loaded]);

  return (
    <div className="pic-item main-item" title={name} key={url} 
    onClick={()=>{openMedia(url,type,index)}}
    >
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
