import  LoginPage  from "./userPage/login";
import  ModPasPage  from "./userPage/modPas";
import  Reg  from "./userPage/reg";
import {GetText} from "../../../utils/common"
import { useState } from "react";
import { Icon } from "../../../utils/icon";
export default function UserPage({setSwitch}) {
  const [loading, setLoading] = useState(false)
  const [showPage, setShowPage] = useState("login");
    const handleKeyDown = (e,fun) => {
    if (e.key === 'Enter') {
      if(!loading)
      fun()
    }
  };
    const para={
    keyDown:handleKeyDown,
    setLoading:setLoading,
    loading:loading,
    afterSend:() => afterSend(setLoading,setSwitch)
  }
  const pages = {
    login: <LoginPage para={para} />,
    modPas: <ModPasPage para={para} />,
    reg: <Reg  para={para} />,
  };



  return (
    <>
        <div className="user-page-win">
          <button className="btn user-page-back" title={GetText("back")}
          onClick={()=>{setSwitch(false)}}
          >{Icon("toLeft")}</button>
          <div id="user-page-btn-bar">
          <button disabled={showPage==="login"} className="btn user-page-btn" title={GetText("login")}
           id="login-btn" onClick={()=>{setShowPage("login")}}>{Icon("user")}</button>
          <button disabled={showPage==="modPas"} className="btn user-page-btn" title={GetText("modPas")}
           id="modPas-btn" onClick={()=>{setShowPage("modPas")}}>{Icon("lock")}</button>
          <button disabled={showPage==="reg"} className="btn user-page-btn" title={GetText("reg")}
           id="reg-btn" onClick={()=>{setShowPage("reg")}}>{Icon("newUser")}</button>
          </div>
          {pages[showPage]}
        </div>
    </>
  );
}
function afterSend(setLoading,setSwitch){
        setLoading(false)
        setSwitch(false)  
}