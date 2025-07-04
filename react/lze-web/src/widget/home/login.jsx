import { useGlobal } from "./global"

export default function Login(){
    const {data,setData}=useGlobal()
    return(
        <div className="win-box">
            <div id="login-win1">
                <button id="switch-user" className="btn"></button>
                <button id="logout" className="btn"></button>
            </div>
            <div id="login-win2">
                <input className="login-input" type="text" placeholder="用户名"></input>
                <input className="login-input" type="password" placeholder="密码"></input>
                <button id="login-send" className="btn"></button>
            </div>
        </div>
    )
}