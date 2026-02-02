import {  useGlobal } from "../global"
import { AddMouseMenu, GetText } from '../../../utils/common';
import { useEffect } from "react";
import { Icon } from "../../../utils/icon";
export default function Move({setPaste,setCopyList}){
    const cut=()=>{
            const selected=useGlobal.getState().selected
            setCopyList([...selected])
            setPaste({status:true,type:"move"})
    }
     useEffect(() => {
        AddMouseMenu({
          cut: {
            name: GetText("cut")+"(X)",
            fun: cut,  
          }
        });
      }, []);
    return(
        <button className="btn side-btn"
        title={GetText("cut")} onClick={cut}>{Icon("cut")}
        </button>
    )
}