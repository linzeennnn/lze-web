import { useState } from "react";
import { useGlobal,list,loadPage, GetText } from "../global";
import { notify } from "../../../components/notify";
export default function TimeBar() {
    const unitList = {
        never: GetText("never"),
        h:GetText("hour"),
        d: GetText("day"),
        m: GetText("month"),
        y: GetText("year")
    };
    const userconfig=useGlobal((state)=>state.userList)
    const nowuser=useGlobal((state)=>state.nowuser)
    // 所有单位键的数组
    const unitKeys = Object.keys(unitList);
    const [unit, setUnit] = useState("h");
    const [showEdit, setShowEdit] = useState(false)
        const [editTime,setEditTime]=useState("")
    // 切换单位函数
    const switchUnit = () => {
        const currentIndex = unitKeys.indexOf(unit);
        const nextIndex = (currentIndex + 1) % unitKeys.length;
        setUnit(unitKeys[nextIndex]);
    };
    const timeChange=(e)=>{
        const {value}=e.target
        setEditTime(value)
    }
    const keyDown=(e)=>{
        if(e.key==='Enter'){
            saveTime(editTime,unit)
        }
    }
    const saveTime=(num,unit)=>{
        let timeStr
        if(unit=="never"){
            timeStr="never"
        }else{
            if(!(num>=0)){
                notify(GetText("not_correct"))
                return
            }

            timeStr=num+unit
        }
        setShowEdit(false)
        setEditTime("")
        updata_time(nowuser,timeStr)
    }
    return (
      userconfig? ( <div id="time-box">
            <button id="time-btn" className="btn" title={GetText("mod_log_time")}
            onClick={()=>setShowEdit(showEdit?false:true)}
            ></button>

            {showEdit?(  <>
                <div id="time-input-box" className="time-text">
                <input id="time-input" placeholder={GetText("num")}
                 value={editTime} onChange={timeChange}
                 onKeyDown={keyDown}
                />
                <button className="btn mini-btn" id="save-time" title={GetText("save")}
                onClick={()=>{saveTime(editTime,unit)}}
                ></button>
            </div>

            <div id="unit-box">
                <div id="unit-text">
                <span>{unitList[unit]}</span>
                <button
                  className="btn mini-btn"
                    id="switch-unit"
                    title={GetText("switch")}
                    onClick={switchUnit}
                >
                </button>
                </div>
            </div>
            </>):
           ( <span className="time-text" id="display-time" title={GetText("allow_login_time")}>{
            getTime(userconfig[nowuser].tokentime)+
            unitList[getUnit(userconfig[nowuser].tokentime)]
           }</span>)}
        </div>):null
    );
}
function updata_time(name,time){
    loadPage(true)
    const globale=useGlobal.getState()
    const token=globale.token
    const user=globale.userName
    const url=globale.monUrl+"date"
    fetch(url,{
        method:"POST",
        headers:{
            'Content-Type':'application/json',
            'authorization':"Bearer " +token,
            'x-user':user,
        },
    
        body:JSON.stringify({
            name:name,
            time:time
        })
    }
    ).then(res=>{
        if(!res.ok){
            if(res.status==401){
                notify(GetText("no_per"))
            }else{
                notify(GetText("error")+":"+res.status)
            }
            loadPage(false)
            return
        }
        notify(GetText("op_com"))
        list()
    })
    
}
function getTime(str) {
  if(str=="never"||str==""||!str){
      return ""
  }
  return parseInt(str.slice(0, -1));
}
function getUnit(str) {
  if(str=="never"||str==""||!str){
      return "never"
  }
  return str.slice(-1);
}

