import { GetText } from "../../../utils/common";
import { Icon } from "../../../utils/icon";
import { useGlobal } from "../global";

export default function AddFile() {
  return(
    <button className='btn side-btn'
    onClick={() => {useGlobal.setState({fileWin:true})}}
    title={GetText("addFile")}>{
        Icon("addFile")
    }</button>
  )
}