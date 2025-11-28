import { useState } from "react";
import { notify } from "../../../../components/notify";
import { GetText, GetWidgetData, useGlobal,encodeUserMes } from "../../global";
import SendBtn from "./sendBtn";
export default function RegPage({para}) {
  const [userData, setUserData] = useState({
    userName: '',
    password: ''
  });
  const userDataChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="user-opt-page-win"  onKeyDown={(e) => 
    para.keyDown(e, () => register(userData.userName, userData.password, para))}>
                <input
                className="user-page-input"
                type="text"
                name="userName"
                placeholder={GetText("new")+" "+GetText("username")}
                value={userData.userName}
                onChange={userDataChange}
              />
              <input
                className="user-page-input"
                type="password"
                name="password"
                value={userData.password}
                onChange={userDataChange}
                placeholder={GetText("password")}
              />
              {para.loading?
              (<div className="loading user-page-loading"></div>):
             ( <SendBtn loading={para.loading} 
             send={() => register(userData.userName, userData.password,para)}/>)}
            </div>
  );
}
async function register(name,password,para){
        const global=useGlobal.getState()
  let token=global.token
const userMes=await encodeUserMes(JSON.stringify({name,password}))
  para.setLoading(true)
    fetch(window.location.origin+'/server/login/register',
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
                notify(GetText("acc_or_pas_err"))
            }
            else{
                notify(res.status+GetText("error"))
            }
            para.setLoading(false)
            throw new Error(res.status);
        }})
    .then(data=>{
        notify(GetText("op_com"))
        para.afterSend()
    })

}