import { useState } from "react";
import { notify } from "../../../../utils/common";
import { GetWidgetData, useGlobal,encodeUserMes } from "../../global";
import {GetText} from "../../../../utils/common"
import SendBtn from "./sendBtn";
export default function LoginPage({para}){
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

    return(
        <div className="user-opt-page-win"  onKeyDown={(e) => para.keyDown(e, () => login(userData.userName, userData.password, para))}>
            <input
            className="user-page-input"
            type="text"
            name="userName"
            placeholder={GetText("username")}
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
         ( <SendBtn loading={para.loading} send={() => login(userData.userName, userData.password,para)}/>)}
        </div>
    )
}
async function login(name,password,para){
  para.setLoading(true)
 let userMesStr=JSON.stringify({
    name,password
  })
    fetch(window.location.origin+'/server/login/login',
        {
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify({
           userMes:await encodeUserMes(userMesStr)
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
        }
        
        return res.json()})
    .then(data=>{
        window.localStorage.setItem('userName',name);
        window.localStorage.setItem('token',data.token);
        useGlobal.setState({
          userName:name,
          token:data.token
        })
        GetWidgetData()
        notify.normal(GetText("login")+":"+name)
        para.afterSend()
    })

}