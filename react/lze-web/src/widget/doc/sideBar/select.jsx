import { useEffect } from "react";
import { Icon } from "../../../utils/icon";
import { Selected, useGlobal } from "../global";
import { AddMouseMenu, GetText } from "../../../utils/common";

export default function Select(){
    const select=()=>{
        status?Selected.close():Selected.open()
    }
      useEffect(() => {
        AddMouseMenu({
          select: {
            name: `${GetText("select")}`,
            fun: select
          },
        });
      });
    const status = useGlobal(state=>state.selected.status)
    return(
        <button className="btn side-btn"
        onClick={select}
        >{Icon("select")}</button>
    )
}