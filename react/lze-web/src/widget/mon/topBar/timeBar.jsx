import { useState } from "react";
import { useGlobal,list,loadPage } from "../global";
import { notify } from "../../../components/notify";
export default function TimeBar() {
    const unitList = {
        never: "不过期",
        h: "小时",
        d: "天",
        m: "月",
        y: "年"
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
                notify("输入时间无效")
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
            <button id="time-btn" className="btn" title="修改登录时限"
            onClick={()=>setShowEdit(showEdit?false:true)}
            ></button>

            {showEdit?(  <>
                <div id="time-input-box" className="time-text">
                <input id="time-input" placeholder="数字"
                 value={editTime} onChange={timeChange}
                 onKeyDown={keyDown}
                />
                <button className="btn mini-btn" id="save-time" title="保存"
                onClick={()=>{saveTime(editTime,unit)}}
                ></button>
            </div>

            <div id="unit-box">
                <div id="unit-text">
                <span>{unitList[unit]}</span>
                <button
                  className="btn mini-btn"
                    id="switch-unit"
                    title="切换时间单位"
                    onClick={switchUnit}
                >
                </button>
                </div>
            </div>
            </>):
           ( <span className="time-text" id="display-time" title="允许登陆时长">{
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
            "Content-Type":"application/json",
        },
    
        body:JSON.stringify({
            token,user,
            name:name,
            time:time
        })
    }
    ).then(res=>{
        if(!res.ok){
            if(res.status==401){
                notify("无修改时间权限")
            }else{
                notify("修改失败"+res.status+"错误")
            }
            loadPage(false)
            return
        }
        notify("已更新时间")
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

