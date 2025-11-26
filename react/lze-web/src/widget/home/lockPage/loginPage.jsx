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
async function login(name,password,setSwitch,setLoading){
  setLoading(true)
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
           userMes:await encodeUserMes(userMesStr, await GetKey())
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
// ///////////////////////////获取密钥////////////////////////////////
async function GetKey() {
    try {
        // 构建 URL
        const url = window.location.origin + '/server/login/login';
        // 发送请求
        const response = await fetch(url, {
            method: 'GET', // 或 'POST' 根据实际接口
            headers: {
                'Content-Type': 'text/plain'
            }
        });

        // 获取响应文本
        const text = await response.text();

        // Base64 解码
        const decoded = atob(text);

        return decoded;
    } catch (error) {
        console.error('Error fetching key:', error);
        return null;
    }
}

////////////////////////////////////////加密用户名密码/////////////////////////////////////////
async function encodeUserMes(str, password) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));

  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveKey"]
  );

  const aesKey = await crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt"]
  );

  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    aesKey,
    new TextEncoder().encode(str)
  );

  // 拼接成一个 Base64 字符串: salt + iv + ciphertext
  const combined = new Uint8Array(salt.length + iv.length + encrypted.byteLength);
  combined.set(salt, 0);
  combined.set(iv, salt.length);
  combined.set(new Uint8Array(encrypted), salt.length + iv.length);

  return btoa(String.fromCharCode(...combined));
}
