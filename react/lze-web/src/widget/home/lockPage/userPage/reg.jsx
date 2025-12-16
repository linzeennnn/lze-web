import { useState } from "react";
import { notify } from "../../../../utils/common";
import { GetWidgetData, useGlobal,encodeUserMes } from "../../global";
import {GetText} from "../../../../utils/common"
import SendBtn from "./sendBtn";
import { Api } from "../../../../utils/request";
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
async function register(name, password, para) {

    const global = useGlobal.getState();
    const token = global.token;
    const userMes = await encodeUserMes(JSON.stringify({ name, password }));

    para.setLoading(true);
    Api.post({
      api:"login/register",
      body:{userMes},
      notice:true,
      success:()=>{para.afterSend();},
      fail:()=>{para.setLoading(false);}
    })

}
