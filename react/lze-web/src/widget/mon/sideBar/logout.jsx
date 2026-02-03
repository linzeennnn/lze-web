import { useGlobal } from "../global";
import { AddMouseMenu, GetText } from '../../../utils/common';
import { useEffect } from "react";
import { Icon } from "../../../utils/icon";

export default function Logout() {

  const logout = () => {
    useGlobal.setState({ showLogout: true });
  };

  // 只在组件挂载时注册右键菜单
  useEffect(() => {
    AddMouseMenu({
      logout: {
        name: GetText("logout"),
        fun: logout,
      }
    });
  }, []);

  return (
    <button
      className="btn side-btn"
      title={GetText("logout")}
      onClick={logout}
    >{Icon("delUser")}</button>
  );
}
