import { useEffect, useState } from "react"
import { WinBg } from "../../../components/winBg"
import { GetText, useGlobal,loadPage } from "../global"
import { notify } from "../../../components/notify";
export default function LogoutWin(){
    const [userList,setUserList]=useState([])
    const showLogout=useGlobal(state=>state.showLogout)
  useEffect(() => {
    async function fetchData() {
        const list = await getUserList();
        setUserList(list);
    }
    fetchData();
}, []);
    return(
        <WinBg showBg={showLogout}>
            <div id="user-list-box">
            <button id="close-logout" className="btn" title={GetText("close")}
            onClick={()=>{useGlobal.setState({showLogout:false})}}
            ></button>
                {userList.map(userName=>{
                    return(
                        <div className="user-item-box" key={userName+"-user-box"}>
                            <button className="del-uaer-btn btn" title={GetText("delete")}
                            onClick={()=>{
                                removeUser(userName,setUserList)
                            }}
                            ></button>
                            <span className="user-showname">{userName}</span>
                        </div>
                    )
                })}
            </div>
        </WinBg>
    )
}
function removeUser(name, setUserList) {
    if(!confirm(GetText("are_you_sure")))
        return
  loadPage(true); // 显示 loading
  const global = useGlobal.getState();
  const url = global.monUrl + 'userList';
  const token = global.token;

  fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    },
    body: JSON.stringify({ name })
  })
  .then(res => {
    if (res.status === 401||res.status === 405) {
       notify(GetText("no_per"))
      loadPage(false);
      return null; // 不继续处理
    }
    if (!res.ok) {
    notify(GetText("error")+":"+res.status)
      loadPage(false);
      return null;
    }
    return res.json(); // 200 返回 JSON
  })
  .then(data => {
    if (data) {
        notify(GetText("op_com"))
      setUserList(data); // 更新用户列表
    }
  })
  .catch(err => {
    console.error( err);
  })
  .finally(() => {
    loadPage(false); 
  });
}

async function getUserList(){
    loadPage(true)
    const global=useGlobal.getState()
    const url=global.monUrl+'userList'
    const token = global.token; 
      try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
         "Authorization": "Bearer " + token
      }
    });
    // 200 正常返回 JSON
    if (res.ok) {
      loadPage(false)
      return await res.json();
    }

    // 统一处理其他错误
    return [];

  } catch (err) {
    console.error(err);
      loadPage(false)
    return [];
  }
}