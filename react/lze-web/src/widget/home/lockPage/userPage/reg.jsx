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
async function register(name, password, para) {
  try {
    const global = useGlobal.getState();
    const token = global.token;
    const userMes = await encodeUserMes(JSON.stringify({ name, password }));

    para.setLoading(true);

    const res = await fetch(window.location.origin + '/server/login/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'authorization': "Bearer " + token
      },
      body: JSON.stringify({ userMes })
    });

    const text = await res.text();

    if (!res.ok) {
      if (res.status === 401) {
        notify(GetText(text));
      } else {
        notify(res.status + GetText("error"));
      }
      para.setLoading(false);
      return;
    }

    notify(GetText("op_com"));
    para.afterSend();

  } catch (err) {
    console.error(err);
    notify("Network error");
    para.setLoading(false);
  }
}
