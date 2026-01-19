import { useGlobal } from "../global";
import { AddMouseMenu, GetText } from '../../../utils/common';
import { useEffect } from "react";

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
      id="logout-btn"
      title={GetText("logout")}
      onClick={logout}
    ></button>
  );
}
