import { useGlobal } from "../global";
import { useRef, useEffect, useState } from "react";
export default function MediaWin() {
  const setGlobal = useGlobal.setState;
  const mediaWin = useGlobal((state) => state.mediaWin);
  const pageNum= useGlobal((state) => state.pageNum);
  let picList 
  if(mediaWin.img){
    picList= useGlobal((state) => state.imgList)[pageNum-1];
  }else{
    picList= useGlobal((state) => state.vidList)[pageNum-1];
  }
  let count=0
  const [scale, setScale] = useState(1)
  const mediaBoxRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
const zoom=(action)=>{
  let tmpScale;
    switch(action){
        case "in":
            tmpScale=scale+0.3
            break;
        case "out":
          if((scale-0.3)<0){
            return
          }
            tmpScale=scale-0.3
            break;
}
setScale(Number(tmpScale.toFixed(2)))

}
const switchPic=(action)=>{
      setPosition({ x: 0, y: 0 });
      setScale(1)
  let count=mediaWin.index
  const len=picList.length
  switch(action){
    case "min":
      count--;
     count= count<0?len-1:count
      break;
    case "add":
      count++
     count= count>len-1?0:count
      break;
}
      setGlobal({mediaWin:{...mediaWin,index:count}})
}
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!dragging) return;
      const dx = e.clientX - startPos.x;
      const dy = e.clientY - startPos.y;
      setPosition((prev) => ({
        x: prev.x + dx,
        y: prev.y + dy,
      }));
      setStartPos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseUp = () => {
      setDragging(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging, startPos]);

  const handleMouseDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
    setStartPos({ x: e.clientX, y: e.clientY });
  };

  // 每次 mediaWin.status 为 true 时重置位置
  useEffect(() => {
    if (mediaWin.status) {
      setPosition({ x: 0, y: 0 });
      setScale(1)
    }
  }, [mediaWin.status]);

  if (!mediaWin.status) return null;

  return (
    <div
      className="bg-enable"
      onClick={() => setGlobal({ mediaWin: { status: false } })}
    >
      <button className="btn media-btn media-widget" id="close-media"></button>
      <button className="btn media-btn media-widget" 
      id="last-pic"  onClick={(e)=>{e.stopPropagation();switchPic("min")}}
      ></button>
      <button className="btn media-btn media-widget" 
      id="next-pic" onClick={(e)=>{e.stopPropagation();switchPic("add")}}
      ></button>
      <div
        id="media-box"
        ref={mediaBoxRef}
        onMouseDown={handleMouseDown}
        style={{
          cursor: dragging ? "grabbing" : "grab",
          transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
          transition: dragging ? "none" : "transform 0.15s ease-out",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {mediaWin.img ? (
          <img loading="lazy" src={mediaWin.url+picList[mediaWin.index]} />
        ) : (
          <video src={mediaWin.url+picList[mediaWin.index]} controls autoPlay />
        )}
      </div>
    <div id="zoom-bar" className="media-widget">
      <button className="btn" id="zoom-out" style={{marginRight:"20px"}}
      title="缩小" onClick={(e)=>{e.stopPropagation();zoom("out")}}
      ></button>
      <button className="btn" id="zoom-in" style={{marginLeft:"20px"}}
      title="放大" onClick={(e)=>{e.stopPropagation();zoom("in")}}
      ></button>
    </div>
    </div>
  );
}
