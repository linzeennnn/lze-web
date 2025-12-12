import { useNotifyStore } from "../../store/notify"
export default function Notify(){
  const { msg, type, show }=useNotifyStore()
  return (
    <div className={"notify-"+type+" notify "+(show?"notify-show":"")}>
      <span className="notify-text">{msg}</span>
    </div>
  )
}
export const notify=()=>{}