import { useState } from "react";
import { notify } from "../../../../utils/common";
import { encodeUserMes,useGlobal } from "../../global";
import {GetText} from "../../../../utils/common"
import SendBtn from "./sendBtn";
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
        const global=useGlobal.getState()
  let token=global.token
const userMes=await encodeUserMes(JSON.stringify({oldPas,newPas}))
  para.setLoading(true)
    fetch(window.location.origin+'/server/login/modPas',
        {
        method:'POST',
        headers:{
            'Content-Type':'application/json',
            'authorization':"Bearer " +token
        },
        body:JSON.stringify({
           userMes:userMes
        })
    }
    )
    .then(res=>{
        if(!res.ok){
            if(res.status===401){
                notify.err(GetText("acc_or_pas_err"))
            }
            else{
                notify.err(res.status+GetText("error"))
            }
            para.setLoading(false)
            throw new Error(res.status);
        }})
    .then(data=>{
        notify.normal(GetText("op_com"))
        para.afterSend()
    })

}