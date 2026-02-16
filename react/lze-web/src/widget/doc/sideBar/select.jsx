import { useEffect } from "react";
import { Icon } from "../../../utils/icon";
import { fileBuffer, Selected, useGlobal } from "../global";
import { AddMouseMenu, GetText } from "../../../utils/common";

export default function Select(){
    const status = useGlobal(state=>state.fileBuffer.selected.status)
    const select=()=>{
      
        status?fileBuffer.clean():fileBuffer.open()
    }
      useEffect(() => {
        AddMouseMenu({
          select: {
            name: `${GetText("select")}`,
            fun: select
          },
        });
      });
    return(
        <button className="btn side-btn"
        onClick={select}
        >{Icon("select")}</button>
    )
}