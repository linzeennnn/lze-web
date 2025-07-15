import { useState } from "react";
import { useGlobal } from "../global";

export default function TimeBar() {
    const unitList = {
        never: "不过期",
        h: "小时",
        d: "天",
        m: "月",
        y: "年"
    };
    const userconfig=useGlobal((state)=>state.userList)
    // 所有单位键的数组
    const unitKeys = Object.keys(unitList);
    const [unit, setUnit] = useState("h");
    const [showEdit, setShowEdit] = useState(false)
    // 切换单位函数
    const switchUnit = () => {
        const currentIndex = unitKeys.indexOf(unit);
        const nextIndex = (currentIndex + 1) % unitKeys.length;
        setUnit(unitKeys[nextIndex]);
    };

    return (
        <div id="time-box">
            <button id="time-btn" className="btn" title="修改登录时限"
            onClick={()=>setShowEdit(showEdit?false:true)}
            ></button>

            {showEdit?(  <>
                <div id="time-input-box" className="time-text">
                <input id="time-input" />
                <button className="btn mini-btn" id="save-time" title="保存"></button>
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
           ( <span className="time-text" id="display-time" title="允许登陆时长">111y</span>)}
        </div>
    );
}
