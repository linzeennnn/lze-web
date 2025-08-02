import { useState } from "react";
import { notify } from "../../../components/notify";
import { GetText, GetWidgetData, useGlobal } from "../global";
export default function LoginPage({setSwitch}) {
  const [loading, setLoading] = useState(false)
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

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if(!loading)
      login(userData.userName, userData.password,setSwitch,setLoading);
    }
  };

  return (
    <>
      
        <div id="login-win" onKeyDown={handleKeyDown}>
          <button className="btn" id="login-back" title={GetText("back")}
          onClick={()=>{setSwitch(false)}}
          ></button>
          <input
            className="login-input"
            type="text"
            name="userName"
            placeholder={GetText("username")}
            value={userData.userName}
            onChange={userDataChange}
          />
          <input
            className="login-input"
            type="password"
            name="password"
            value={userData.password}
            onChange={userDataChange}
            placeholder={GetText("password")}
          />
          {loading?
          (<div className="loading" id="login-loading"></div>):
         ( <button
            id="login-send"
            className="btn"
            title={GetText("login")}
            onClick={() => login(userData.userName, userData.password,setSwitch,setLoading)}
          ></button>)}
        </div>
    </>
  );
}
function login(name,password,setSwitch,setLoading){
  setLoading(true)
    fetch(window.location.origin+'/server/login/login',
        {
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify({
           name,password
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
            setLoading(false)
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
        notify(GetText("login")+":"+name)
        setLoading(false)
        setSwitch(false)

    })

}