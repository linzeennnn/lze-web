import { useState } from "react";
import { notify } from "../../../../components/notify";
import { GetText, GetWidgetData, useGlobal } from "../../global";
export default function ModPasPage(){
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if(!loading)
      login(userData.userName, userData.password,setSwitch,setLoading);
    }
  };

    return(
    <div className="user-opt-page-win"  onKeyDown={handleKeyDown}>
        <input
            className="user-page-input"
            type="password"
            name="password"
            value={userData.password}
            onChange={userDataChange}
            placeholder={GetText("password")}
            />
            {loading?
            (<div className="loading user-page-loading"></div>):
            ( <button
            className="btn user-page-send"
            title={GetText("login")}
            onClick={() => login(userData.userName, userData.password,setSwitch,setLoading)}
            ></button>)}
    </div>
    )
}