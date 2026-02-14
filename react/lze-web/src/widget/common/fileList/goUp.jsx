import { AddMouseMenu, GetText } from "../../../utils/common";
import { Icon } from "../../../utils/icon";
import '../../../css/common/fileList.css'
import { LocalList } from "../../../utils/CacheList";
import { useFileCacheStore } from "../../../store/CacheList";
import { useEffect } from "react";
export default function GoUp(){
  const current=useFileCacheStore(state=>state.fileCache).current
  const goUp=()=>{LocalList(current-1)}
   useEffect(() => {
    AddMouseMenu({
      goUp: {
        disable:current==0,
        name: GetText("back"),
        fun: goUp,
      }
    });
  }, [current]);
    return (
        <button
          id="go-up"
          className={(current==0 ? 'go-up-disable' : '') + ' btn'}
          disabled={current==0}
          title={GetText("back")}
          onClick={goUp}
        >{Icon("goUp")}</button>
      );
    }