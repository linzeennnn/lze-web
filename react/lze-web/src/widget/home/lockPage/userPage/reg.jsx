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
  para.setLoading(true);
console.log(name,password);

}