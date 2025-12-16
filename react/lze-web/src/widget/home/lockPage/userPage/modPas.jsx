import { useState } from "react";
import { notify } from "../../../../utils/common";
import { encodeUserMes,useGlobal } from "../../global";
import {GetText} from "../../../../utils/common"
import SendBtn from "./sendBtn";
import { Api } from "../../../../utils/request";
import { setToken } from "../../../../store/request";
export default function ModPasPage({para}){
  const [userData, setUserData] = useState({
    oldPassword: '',
    newPassword: ''
  });
  const userDataChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value
    }));
  };
    return(
    <div className="user-opt-page-win"  onKeyDown={(e) => para.keyDown(e, () => modePas(userData.oldPassword, userData.newPassword, para))}>
        <input
            className="user-page-input"
            type="password"
            name="oldPassword"
            value={userData.oldPassword}
            onChange={userDataChange}
            placeholder={GetText("old")+" "+GetText("password")}
            />
        <input
            className="user-page-input"
            type="password"
            name="newPassword"
            value={userData.newPassword}
            onChange={userDataChange}
            placeholder={GetText("new")+" "+GetText("password")}
            />    
          <SendBtn loading={para.loading} send={() => modePas(userData.oldPassword, userData.newPassword, para)}/>
    </div>
    )
}
async function modePas(oldPas,newPas, para){
const userMes=await encodeUserMes(JSON.stringify({oldPas,newPas}))
  para.setLoading(true)
  Api.post({
    api:"login/modPas",
    body:{userMes},
    notice:true,
    success:(data)=>{
      setToken(data.token)
      localStorage.setItem("token",data.token)
      para.afterSend()},
    fail:()=>{ para.setLoading(false)}
  })
}