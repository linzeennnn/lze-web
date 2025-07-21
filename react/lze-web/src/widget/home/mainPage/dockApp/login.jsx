import { useState } from "react";
import {useGlobal} from "../../global";

export default function Login() {
  const [win1, setWin1] = useState(true);
  const userName = useGlobal(state => state.userName);
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
      login(userData.userName, userData.password);
    }
  };

  return (
    <>
      {win1 ? (
        <div id="login-win1">
          <button
            id="switch-user"
            className="btn"
            title="切换用户"
            onClick={() => setWin1(false)}
          >
            <div id="switch-user-icon"></div>
            <span>{userName}</span>
          </button>
          <button
            id="logout"
            className="btn"
            title="退出登录"
            onClick={() => logout()}
          ></button>
        </div>
      ) : (
        <div id="login-win2" onKeyDown={handleKeyDown}>
          <input
            className="login-input"
            type="text"
            name="userName"
            placeholder="用户名"
            value={userData.userName}
            onChange={userDataChange}
          />
          <input
            className="login-input"
            type="password"
            name="password"
            value={userData.password}
            onChange={userDataChange}
            placeholder="密码"
          />
          <button
            id="login-send"
            className="btn"
            title="登录"
            onClick={() => login(userData.userName, userData.password)}
          ></button>
        </div>
      )}
    </>
  );
}
function login(name,password){
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
                notify("账号或密码错误")
            }
            else{
                notify(res.status+"错误")
            }
            throw new Error(`请求失败，状态码：${res.status}`);
        }
        
        return res.json()})
    .then(data=>{
        window.localStorage.setItem('userName',name);
        window.localStorage.setItem('token',data.token);
                window.location.reload();

    })

}
function logout(){
    if (confirm("确定退出登录吗？")) {
    localStorage.clear();
    window.location.reload();
    }
}