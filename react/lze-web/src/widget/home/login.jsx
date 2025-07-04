import { useState } from "react";
import { useGlobal } from "./global";
import { login, logout } from './fun';

export default function Login() {
  const { data, setData } = useGlobal();
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
    <div className="win-box">
      <div id="login-win1">
        <button id="switch-user" className="btn" title="切换用户">
            <div id="switch-user-icon"></div>
            <span>{window.localStorage.getItem('userName')}</span>
        </button>
        <button id="logout" className="btn" title="退出登录" onClick={() => logout()}></button>
      </div>
      <div id="login-win2" onKeyDown={handleKeyDown}>
        <input className="login-input" type="text" name="userName"
          placeholder="用户名"
          value={userData.userName}
          onChange={userDataChange}
        />
        <input className="login-input" type="password"
          name="password"
          value={userData.password}
          onChange={userDataChange}
          placeholder="密码"
        />
        <button id="login-send" className="btn" title="登录"
          onClick={() => login(userData.userName, userData.password)}
        ></button>
      </div>
    </div>
  );
}
