import { useEffect, useState } from "react"
import { WinBg } from "../../../components/winBg"
import {useGlobal,loadPage} from "../global"
import { GetText,notify,confirmWin } from '../../../utils/common';
import { Api, AsyncApi } from "../../../utils/request";
export default function LogoutWin(){
    const [userList,setUserList]=useState([])
    const showLogout=useGlobal(state=>state.showLogout)
  useEffect(() => {
  const fetchUsers = async () => {
    const list = await GetRemoveUserList();
    setUserList(list);
  };

  fetchUsers();
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
async function removeUser(name, setUserList) {
    if(!await confirmWin.normal(GetText("are_you_sure")))
        return
    Api.delete({
      api:'mon/userList',
      body:{ name },
      notice:true,
      success:(data)=>{
        setUserList(data);
      }
    })
}
// 获取删除用户
async function GetRemoveUserList(){
const data=await  AsyncApi.get({
    api:'mon/userList'
  })
  return data?data:[];
}
